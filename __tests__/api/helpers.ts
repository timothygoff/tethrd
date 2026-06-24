import type { Tethrd } from '../../lib/types'

export function makePostRequest(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://localhost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

export function makeGetRequest(headers: Record<string, string> = {}) {
  return new Request('http://localhost', { method: 'GET', headers })
}

// Builds a chainable Supabase mock where each response is consumed in order.
// Intermediate chain methods (from, select, update, eq, …) all return `chain`.
// Terminal methods (.single()) and direct awaits (via .then()) each pop one response.
export function createDbMock(responses: Array<{ data?: unknown; error?: unknown }> = []) {
  const queue = [...responses]
  const next = () => Promise.resolve(queue.shift() ?? { data: null, error: null })

  const chain: any = {
    from: () => chain,
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    delete: () => chain,
    upsert: () => chain,
    eq: () => chain,
    neq: () => chain,
    in: () => chain,
    lte: () => chain,
    gte: () => chain,
    gt: () => chain,
    lt: () => chain,
    not: () => chain,
    is: () => chain,
    single: () => next(),
    then(resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) {
      return next().then(resolve, reject)
    },
    catch(reject: (e: unknown) => unknown) {
      return next().catch(reject)
    },
  }

  return chain
}

export const FUTURE_DATE = new Date(Date.now() + 86_400_000).toISOString()

export const TETHRD_FIXTURE: Tethrd = {
  id: 'tethrd_abc',
  creator_id: 'user_creator',
  joiner_id: null,
  scenario: 'full_escrow',
  amount: 100,
  currency: 'USD',
  timer_hours: 24,
  deadline: FUTURE_DATE,
  description: 'A valid test deal description',
  status: 'pending',
  creator_confirmed: false,
  joiner_confirmed: false,
  expires_at: null,
  payment_intent_id: null,
  warning_sent: false,
  created_at: new Date().toISOString(),
}
