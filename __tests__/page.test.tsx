import { expect, test, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../app/page'

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response)
})

test('renders the tethrd brand name', () => {
  render(<Home />)
  expect(screen.getByText('tethrd')).toBeDefined()
})

test('renders waitlist forms', () => {
  render(<Home />)
  const inputs = screen.getAllByPlaceholderText('your@email.com')
  expect(inputs.length).toBeGreaterThanOrEqual(2)
  expect(screen.getAllByText('Get Early Access').length).toBeGreaterThanOrEqual(2)
})

test('shows confirmation on both forms after submit', async () => {
  render(<Home />)
  const [firstInput] = screen.getAllByPlaceholderText('your@email.com')
  fireEvent.change(firstInput, { target: { value: 'test@example.com' } })
  fireEvent.submit(firstInput.closest('form')!)
  await waitFor(() =>
    expect(screen.getAllByText("You're on the list. We'll be in touch.").length).toBeGreaterThan(0)
  )
})
