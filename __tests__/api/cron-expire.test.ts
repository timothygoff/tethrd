import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GET } from '../../app/api/cron/expire/route'
import { getSupabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'
import { getUserEmail, getUsername } from '@/lib/clerk'
import { sendEmail } from '@/lib/resend'
import { createDbMock, makeGetRequest, TETHRD_FIXTURE } from './helpers'

vi.mock('@/lib/supabase')
vi.mock('@/lib/stripe')
vi.mock('@/lib/clerk')
vi.mock('@/lib/resend')

const CRON_HEADER = { authorization: 'Bearer test_cron_secret' }

beforeEach(() => {
  vi.clearAllMocks()
  process.env.CRON_SECRET = 'test_cron_secret'
  vi.mocked(getStripe).mockReturnValue({
    paymentIntents: { cancel: vi.fn().mockResolvedValue({}) },
  } as any)
  vi.mocked(getUserEmail).mockResolvedValue('user@example.com')
  vi.mocked(getUsername).mockResolvedValue('testuser')
  vi.mocked(sendEmail).mockResolvedValue(undefined)
})

afterEach(() => {
  delete process.env.CRON_SECRET
})

describe('GET /api/cron/expire — auth', () => {
  it('returns 401 when the authorization header is missing', async () => {
    const res = await GET(makeGetRequest() as any)
    expect(res.status).toBe(401)
  })

  it('returns 401 when the authorization header has the wrong secret', async () => {
    const res = await GET(makeGetRequest({ authorization: 'Bearer wrong_secret' }) as any)
    expect(res.status).toBe(401)
  })

  it('returns 401 when CRON_SECRET env var is not set', async () => {
    delete process.env.CRON_SECRET
    const res = await GET(makeGetRequest(CRON_HEADER) as any)
    expect(res.status).toBe(401)
  })
})

describe('GET /api/cron/expire — processing', () => {
  it('returns 200 with 0/0 counts when no tethrds need action', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: [], error: null }, // toWarn query
        { data: [], error: null }, // toExpire query
      ]) as any
    )
    const res = await GET(makeGetRequest(CRON_HEADER) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.warned).toBe(0)
    expect(body.expired).toBe(0)
  })

  it('sends warning emails and marks warning_sent for expiring tethrds', async () => {
    const soonTethrd = {
      ...TETHRD_FIXTURE,
      status: 'active',
      joiner_id: 'user_joiner',
      warning_sent: false,
    }
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: [soonTethrd], error: null }, // toWarn
        { data: [], error: null },           // toExpire
        { data: null, error: null },         // update warning_sent=true
      ]) as any
    )
    const res = await GET(makeGetRequest(CRON_HEADER) as any)
    expect(res.status).toBe(200)
    expect((await res.json()).warned).toBe(1)
    expect(vi.mocked(sendEmail)).toHaveBeenCalledWith(
      'user@example.com',
      'Your tethrd expires in 15 minutes',
      expect.any(String)
    )
  })

  it('cancels payment intent and marks tethrd expired', async () => {
    const pastTethrd = {
      ...TETHRD_FIXTURE,
      status: 'active',
      joiner_id: 'user_joiner',
      payment_intent_id: 'pi_test_abc',
      deadline: new Date(Date.now() - 600_000).toISOString(),
    }
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: [], error: null },           // toWarn
        { data: [pastTethrd], error: null }, // toExpire
        { data: null, error: null },         // update status=expired
      ]) as any
    )
    const res = await GET(makeGetRequest(CRON_HEADER) as any)
    expect(res.status).toBe(200)
    expect((await res.json()).expired).toBe(1)
    expect(vi.mocked(getStripe)().paymentIntents.cancel).toHaveBeenCalledWith('pi_test_abc')
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(2) // creator + joiner
  })
})
