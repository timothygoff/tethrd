import { expect, test } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Home from '../app/page'

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

test('shows confirmation on both forms after submit', () => {
  render(<Home />)
  const [firstInput] = screen.getAllByPlaceholderText('your@email.com')
  fireEvent.change(firstInput, { target: { value: 'test@example.com' } })
  fireEvent.submit(firstInput.closest('form')!)
  expect(screen.getAllByText("You're on the list. We'll be in touch.").length).toBe(2)
})
