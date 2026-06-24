import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../app/api/stripe/webhook/route'
import { getSupabase } from '@/lib/supabase'
import { getStripe } from '@/lib/stripe'
import { getUserEmail, getUsername } from '@/lib/clerk'
import { sendEmail } from '@/lib/resend'
import { createDbMock, TETHRD_FIXTURE } from './helpers'

vi.mock('@/lib/supabase')
vi.mock('@/lib/stripe')
vi.mock('@/lib/clerk')
vi.mock('@/lib/resend')

const SESSION_EVENT = {
  id: 'evt_test_001',
  type: 'checkout.session.completed',
  data: {
    object: {
      metadata: { tethrd_id: 'tethrd_abc', joiner_user_id: 'user_joiner' },
      payment_intent: 'pi_test_123',
    },
  },
}

function makeWebhookRequest(body: string, sig = 'valid_sig') {
  return new Request('http://localhost', {
    method: 'POST',
    headers: { 'stripe-signature': sig },
    body,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(getStripe).mockReturnValue({
    webhooks: { constructEvent: vi.fn().mockReturnValue(SESSION_EVENT) },
  } as any)
  vi.mocked(getUserEmail).mockResolvedValue('creator@example.com')
  vi.mocked(getUsername).mockResolvedValue('creatoruser')
  vi.mocked(sendEmail).mockResolvedValue(undefined)
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
})

describe('POST /api/stripe/webhook', () => {
  it('returns 400 when the Stripe signature is invalid', async () => {
    vi.mocked(getStripe).mockReturnValue({
      webhooks: {
        constructEvent: vi.fn().mockImplementation(() => { throw new Error('Signature mismatch') }),
      },
    } as any)
    const res = await POST(makeWebhookRequest('{}') as any)
    expect(res.status).toBe(400)
  })

  it('returns 200 immediately for a duplicate event (idempotency)', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: { id: 1, status: 'completed' }, error: null }, // event already exists
      ]) as any
    )
    const res = await POST(makeWebhookRequest(JSON.stringify(SESSION_EVENT)) as any)
    expect(res.status).toBe(200)
    expect(vi.mocked(sendEmail)).not.toHaveBeenCalled()
  })

  it('returns 400 when session metadata is missing', async () => {
    const noMetaEvent = {
      ...SESSION_EVENT,
      data: { object: { metadata: {}, payment_intent: 'pi_test_123' } },
    }
    vi.mocked(getStripe).mockReturnValue({
      webhooks: { constructEvent: vi.fn().mockReturnValue(noMetaEvent) },
    } as any)
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: null, error: { code: 'PGRST116' } }, // event not found (proceed)
        { data: { id: 1 }, error: null },             // insert webhook_events record
      ]) as any
    )
    const res = await POST(makeWebhookRequest(JSON.stringify(noMetaEvent)) as any)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Missing metadata')
  })

  it('skips processing when tethrd is no longer pending', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: null, error: { code: 'PGRST116' } },                  // event not found
        { data: { id: 1 }, error: null },                              // insert record
        { data: { ...TETHRD_FIXTURE, status: 'active' }, error: null }, // tethrd already active
        { data: null, error: null },                                   // update to completed
      ]) as any
    )
    const res = await POST(makeWebhookRequest(JSON.stringify(SESSION_EVENT)) as any)
    expect(res.status).toBe(200)
    expect(vi.mocked(sendEmail)).not.toHaveBeenCalled()
  })

  it('activates tethrd and emails creator on checkout.session.completed', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([
        { data: null, error: { code: 'PGRST116' } },  // event not found
        { data: { id: 1 }, error: null },              // insert webhook_events record
        { data: { ...TETHRD_FIXTURE, status: 'pending', timer_hours: 24 }, error: null }, // fetch tethrd
        { data: null, error: null },                   // update tethrd to active
        { data: null, error: null },                   // update webhook_events to completed
      ]) as any
    )
    const res = await POST(makeWebhookRequest(JSON.stringify(SESSION_EVENT)) as any)
    expect(res.status).toBe(200)
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(1)
    expect(vi.mocked(sendEmail)).toHaveBeenCalledWith(
      'creator@example.com',
      'Someone joined your tethrd',
      expect.stringContaining('creatoruser')
    )
  })
})
