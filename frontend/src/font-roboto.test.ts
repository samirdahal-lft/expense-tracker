import { describe, it, expect } from 'vitest'
import { resolve } from 'path'

// __dirname = frontend/src
const FRONTEND_ROOT = resolve(__dirname, '..')

describe('B-1: Tailwind config exports Roboto as first sans-serif font', () => {
  it('fontFamily.sans starts with Roboto', async () => {
    const config = await import(resolve(FRONTEND_ROOT, 'tailwind.config.ts'))
    const cfg = config.default ?? config
    const sans: string[] = cfg.theme?.extend?.fontFamily?.sans ?? []
    expect(sans[0]).toBe('Roboto')
  })
})
