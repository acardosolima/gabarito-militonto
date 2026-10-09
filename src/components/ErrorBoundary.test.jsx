import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from './ErrorBoundary.jsx'

function Bomb() {
  throw new Error('boom')
}

describe('ErrorBoundary', () => {
  let container
  let root

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
  })

  it('renders children when nothing throws', () => {
    act(() => {
      root.render(
        <ErrorBoundary>
          <p>ok</p>
        </ErrorBoundary>,
      )
    })
    expect(container.textContent).toContain('ok')
  })

  it('renders a fallback instead of crashing when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    act(() => {
      root.render(
        <ErrorBoundary>
          <Bomb />
        </ErrorBoundary>,
      )
    })
    expect(container.textContent).toContain('Algo deu errado')
    spy.mockRestore()
  })
})
