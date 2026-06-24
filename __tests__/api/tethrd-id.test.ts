import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../app/api/tethrd/[id]/route'
import { auth } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'
import { getUserEmail, getUsername } from '@/lib/clerk'
import { sendEmail } from '@/lib/resend'
import { createDbMock, makePostRequest, TETHRD_FIXTURE, FUTURE_DATE } from './helpers'

vi.mock('@clerk/nextjs/server')
vi.mock('@/lib/supabase')
vi.mock('@/lib/stripe')
vi.mock('@/lib/clerk')
vi.mock('@/lib/resend')

const PARAMS = { params: Promise.resolve({ id: 'tethrd_abc' }) }

const ACTIVE_TETHRD = {
  ...TETHRD_FIXTURE,
  status: 'active' as const,
  joiner_id: 'user_joiner',
  expires_at: FUTURE_DATE,
  payment_intent_id: 'pi_test_123',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_joiner' } as any)
  vi.mocked(getStripe).mockReturnValue({
    paymentIntents: { capture: vi.fn().mockResolvedValue({}) },
  } as any)
  vi.mocked(getUserEmail).mockResolvedValue('user@example.com')
  vi.mocked(getUsername).mockResolvedValue('testuser')
  vi.mocked(sendEmail).mockResolvedValue(undefined)
})

// ---------------------------------------------------------------------------
// join action
// ---------------------------------------------------------------------------

describe('POST /api/tethrd/[id] — join', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)
    const res = await POST(makePostRequest({ action: 'join' }) as any, PARAMS)
    expect(res.status).toBe(401)
  })

  it('returns 404 when tethrd is not found', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: null, error: { code: 'PGRST116' } }]) as any
    )
    const res = await POST(makePostRequest({ action: 'join' }) as any, PARAMS)
    expect(res.status).toBe(404)
  })

  it('returns 400 when tethrd already has a joiner', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: { ...TETHRD_FIXTURE, joiner_id: 'user_other' }, error: null }]) as any
    )
    const res = await POST(makePostRequest({ action: 'join' }) as any, PARAMS)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Cannot join')
  })

  it('returns 400 when creator tries to join their own tethrd', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_creator' } as any)
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: TETHRD_FIXTURE, error: null }]) as any
    )
    const res = await POST(makePostRequest({ action: 'join' }) as any, PARAMS)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Cannot join your own tethrd')
  })

  it('returns 200 and updates the tethrd on a valid join', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: TETHRD_FIXTURE, error: null },  // fetch tethrd
        { data: null, error: null },             // update to active (ignored)
      ]) as any
    )
    const res = await POST(makePostRequest({ action: 'join' }) as any, PARAMS)
    expect(res.status).toBe(200)
    expect((await res.json()).ok).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// confirm action
// ---------------------------------------------------------------------------

describe('POST /api/tethrd/[id] — confirm', () => {
  it('returns 403 when user is not a participant', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user_stranger' } as any)
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: ACTIVE_TETHRD, error: null }]) as any
    )
    const res = await POST(makePostRequest({ action: 'confirm' }) as any, PARAMS)
    expect(res.status).toBe(403)
  })

  it('returns 400 when tethrd is not active', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: { ...ACTIVE_TETHRD, status: 'expired' }, error: null }]) as any
    )
    const res = await POST(makePostRequest({ action: 'confirm' }) as any, PARAMS)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Cannot confirm at this stage')
  })

  it('returns 200 and waits when only one party has confirmed', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: ACTIVE_TETHRD, error: null },   // fetch
        { data: null, error: null },             // set joiner_confirmed=true
        { data: null, error: null },             // atomic claim (conditions not met → null)
      ]) as any
    )
    const res = await POST(makePostRequest({ action: 'confirm' }) as any, PARAMS)
    expect(res.status).toBe(200)
    expect(vi.mocked(getStripe)().paymentIntents.capture).not.toHaveBeenCalled()
  })

  it('captures payment and sends emails when both parties confirm', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: ACTIVE_TETHRD, error: null },           // fetch
        { data: null, error: null },                    // set flag
        { data: [{ id: 'tethrd_abc' }], error: null }, // atomic claim succeeds
        { data: null, error: null },                    // update to confirmed
      ]) as any
    )
    const res = await POST(makePostRequest({ action: 'confirm' }) as any, PARAMS)
    expect(res.status).toBe(200)
    expect(vi.mocked(getStripe)().paymentIntents.capture).toHaveBeenCalledWith('pi_test_123')
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(2)
  })

  it('returns 500 when Stripe capture throws', async () => {
    vi.mocked(getStripe).mockReturnValue({
      paymentIntents: {
        capture: vi.fn().mockRejectedValue(new Error('Card declined')),
      },
    } as any)
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: ACTIVE_TETHRD, error: null },
        { data: null, error: null },
        { data: [{ id: 'tethrd_abc' }], error: null },
      ]) as any
    )
    const res = await POST(makePostRequest({ action: 'confirm' }) as any, PARAMS)
    expect(res.status).toBe(500)
  })
})

// ---------------------------------------------------------------------------
// unknown action
// ---------------------------------------------------------------------------

describe('POST /api/tethrd/[id] — unknown action', () => {
  it('returns 400 for an unrecognised action', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: ACTIVE_TETHRD, error: null }]) as any
    )
    const res = await POST(makePostRequest({ action: 'refund' }) as any, PARAMS)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Unknown action')
  })
})
