import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '../../app/api/tethrd/route'
import { auth } from '@clerk/nextjs/server'
import { getSupabase } from '@/lib/supabase'
import { createDbMock, makePostRequest, FUTURE_DATE } from './helpers'

vi.mock('@clerk/nextjs/server')
vi.mock('@/lib/supabase')

const VALID_BODY = {
  scenario: 'full_escrow',
  amount: 100,
  deadline: FUTURE_DATE,
  description: 'A valid test deal description',
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(auth).mockResolvedValue({ userId: 'user_creator' } as any)
})

describe('POST /api/tethrd — auth + validation', () => {
  it('returns 401 when not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any)
    const res = await POST(makePostRequest(VALID_BODY) as any)
    expect(res.status).toBe(401)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makePostRequest({ scenario: 'full_escrow' }) as any)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Missing fields')
  })

  it('returns 400 for invalid scenario', async () => {
    const res = await POST(makePostRequest({ ...VALID_BODY, scenario: 'scam' }) as any)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Invalid scenario')
  })

  it('returns 400 for amount of zero', async () => {
    const res = await POST(makePostRequest({ ...VALID_BODY, amount: 0 }) as any)
    expect(res.status).toBe(400)
  })

  it('returns 400 for negative amount', async () => {
    const res = await POST(makePostRequest({ ...VALID_BODY, amount: -50 }) as any)
    expect(res.status).toBe(400)
  })

  it('returns 400 for amount >= 1,000,000', async () => {
    const res = await POST(makePostRequest({ ...VALID_BODY, amount: 1_000_000 }) as any)
    expect(res.status).toBe(400)
  })

  it('returns 400 for a past deadline', async () => {
    const past = new Date(Date.now() - 10_000).toISOString()
    const res = await POST(makePostRequest({ ...VALID_BODY, deadline: past }) as any)
    expect(res.status).toBe(400)
    expect((await res.json()).error).toBe('Deadline must be a valid future date')
  })

  it('returns 400 for description shorter than 5 characters', async () => {
    const res = await POST(makePostRequest({ ...VALID_BODY, description: 'hi' }) as any)
    expect(res.status).toBe(400)
  })

  it('returns 400 for description longer than 500 characters', async () => {
    const res = await POST(makePostRequest({ ...VALID_BODY, description: 'x'.repeat(501) }) as any)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/tethrd — DB interaction', () => {
  it('returns 200 with the new tethrd id on success', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: { id: 'tethrd_new' }, error: null }]) as any
    )
    const res = await POST(makePostRequest(VALID_BODY) as any)
    expect(res.status).toBe(200)
    expect((await res.json()).id).toBe('tethrd_new')
  })

  it('returns 500 when the DB insert fails', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      createDbMock([{ data: null, error: { message: 'unique violation' } }]) as any
    )
    const res = await POST(makePostRequest(VALID_BODY) as any)
    expect(res.status).toBe(500)
  })
})
