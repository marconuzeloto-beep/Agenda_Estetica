import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import '@testing-library/jest-dom/vitest'
import 'fake-indexeddb/auto'

// globals: false means Testing Library can't auto-detect a global afterEach
// to hook its automatic unmount/cleanup into, so it's wired up explicitly.
afterEach(() => {
  cleanup()
})

// jsdom does not implement matchMedia; framer-motion's useReducedMotion() calls it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}
