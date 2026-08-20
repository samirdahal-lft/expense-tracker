import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
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

describe('B-2: index.css imports Roboto from Google Fonts', () => {
  it('index.css contains a Google Fonts @import for Roboto', () => {
    const css = readFileSync(resolve(__dirname, 'index.css'), 'utf-8')
    expect(css).toMatch(/fonts\.googleapis\.com.*Roboto/i)
  })
})
