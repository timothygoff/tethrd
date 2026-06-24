import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../app/api/stripe/checkout/route'
import { auth } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'
import { createDbMock, makePostRequest, TETHRD_FIXTURE } from './helpers'

vi.mock('@clerk/nextjs/server')
vi.mock('@/lib/supabase')
vi.mock('@/lib/stripe')

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_joiner' } as any)
  vi.mocked(getStripe).mockReturnValue({
    checkout: {
      sessions: {
        create: vi.fn().mockResolvedValue({ url: 'https://checkout.stripe.com/pay/test_session' }),
      },
    },
  } as any)
})

describe('POST /api/stripe/checkout', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)
    const res = await POST(makePostRequest({ tethrd_id: 'tethrd_abc' }) as any)
    expect(res.status).toBe(401)
  })

  it('returns 404 when tethrd does not exist', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: null, error: { code: 'PGRST116' } }]) as any
    )
    const res = await POST(makePostRequest({ tethrd_id: 'tethrd_abc' }) as any)
    expect(res.status).toBe(404)
  })

  it('returns 400 when tethrd is no longer pending', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: { ...TETHRD_FIXTURE, status: 'active' }, error: null }]) as any
    )
    const res = await POST(makePostRequest({ tethrd_id: 'tethrd_abc' }) as any)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Cannot join')
  })

  it('returns 400 when the creator tries to pay into their own tethrd', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_creator' } as any)
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: TETHRD_FIXTURE, error: null }]) as any
    )
    const res = await POST(makePostRequest({ tethrd_id: 'tethrd_abc' }) as any)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Cannot join your own tethrd')
  })

  it('returns 200 with a Stripe checkout URL on success', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: TETHRD_FIXTURE, error: null }]) as any
    )
    const res = await POST(makePostRequest({ tethrd_id: 'tethrd_abc' }) as any)
    expect(res.status).toBe(200)
    expect((await res.json()).url).toBe('https://checkout.stripe.com/pay/test_session')
  })
})
