import { expect, test, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../app/page'

beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response)
})

test('renders the tethrd brand logo', () => {
  render(<Home />)
  expect(screen.getAllByAltText('tethrd').length).toBeGreaterThanOrEqual(1)
})

test('renders waitlist forms', () => {
  render(<Home />)
  const inputs = screen.getAllByPlaceholderText('you@email.com')
  expect(inputs.length).toBeGreaterThanOrEqual(2)
  expect(screen.getAllByText('Join the waitlist').length).toBeGreaterThanOrEqual(2)
})

test('shows confirmation after submit', async () => {
  render(<Home />)
  const [firstInput] = screen.getAllByPlaceholderText('you@email.com')
  fireEvent.change(firstInput, { target: { value: 'test@example.com' } })
  fireEvent.submit(firstInput.closest('form')!)
  await waitFor(() =>
    expect(
      screen.getAllByText("You're on the list — we'll email your invite soon.").length
    ).toBeGreaterThan(0)
  )
})
