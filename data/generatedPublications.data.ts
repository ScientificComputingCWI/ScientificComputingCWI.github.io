import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLoader } from 'vitepress'

export interface GeneratedPublication {
  id: string | null
  doi: string | null
  title: string
  authors: string[]
  members: string[]
  year: number | null
  date: string | null
  type: string | null
  isPreprint: boolean
  venue: string | null
  volume: string | null
  issue: string | null
  pages: string | null
  citedBy: number
  isOpenAccess: boolean
  links: { doi?: string; arxiv?: string; pdf?: string; openAccess?: string }
}

export interface GeneratedPublicationData {
  generatedAt: string | null
  /** Total number of publications fetched, before the recent-years window is applied. */
  count: number
  /** Oldest year shown on the site: a rolling window ending at the current year. */
  minYear: number
  /** Newest year present in the data (>= current year, since preprints can be dated ahead). */
  maxYear: number
  /** Everything fetched, oldest entries included — the page filters down to the window. */
  publications: GeneratedPublication[]
}

/**
 * How many years back the site shows. 2 means "this year and the two before it",
 * e.g. 2024–2026 during 2026. Change this one number to widen or narrow the window.
 */
export const YEARS_SHOWN = 2

declare const data: GeneratedPublicationData
export { data }

const here = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(here, 'publications.generated.json')

export default defineLoader({
  watch: ['./publications.generated.json'],
  async load(): Promise<GeneratedPublicationData> {
    // The window is resolved here, at build time, rather than in the page. Calling
    // new Date() inside the component would let the server-rendered HTML and the
    // browser disagree across a New Year boundary and break hydration. The weekly
    // publications workflow rebuilds the site, so the window rolls over on its own.
    const thisYear = new Date().getFullYear()
    const minYear = thisYear - YEARS_SHOWN

    if (!fs.existsSync(file)) {
      console.warn(
        '[publications] data/publications.generated.json not found — run `npm run publications` to create it.'
      )
      return { generatedAt: null, count: 0, minYear, maxYear: thisYear, publications: [] }
    }

    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    const publications: GeneratedPublication[] = parsed.publications ?? []
    const years = publications.map((p) => p.year).filter((y): y is number => typeof y === 'number')

    return {
      generatedAt: parsed.generatedAt ?? null,
      count: publications.length,
      minYear,
      maxYear: Math.max(thisYear, ...years),
      publications
    }
  }
})
