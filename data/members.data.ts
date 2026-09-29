import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLoader } from 'vitepress'

export interface Member {
  name: string
  role: string
  orcid: string | null
  openalex?: string[]
  email?: string
  github?: string
  website?: string
  photo?: string
}

export interface Alumnus {
  name: string
  now: string | null
}

export interface MemberData {
  current: Member[]
  alumni: Alumnus[]
}

declare const data: MemberData
export { data }

const here = path.dirname(fileURLToPath(import.meta.url))
const file = path.join(here, 'members.json')

/** Order the Members page groups by seniority rather than alphabetically. */
const ROLE_ORDER = ['Group leader', 'Staff', 'Postdoc', 'PhD candidate', 'Visiting postdoc', 'Visiting professor', 'Advisor']

export default defineLoader({
  watch: ['./members.json'],
  async load(): Promise<MemberData> {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    const current: Member[] = (parsed.current ?? []).map((m: Member) => ({ ...m }))
    current.sort((a, b) => {
      const ra = ROLE_ORDER.indexOf(a.role)
      const rb = ROLE_ORDER.indexOf(b.role)
      if (ra !== rb) return (ra < 0 ? 99 : ra) - (rb < 0 ? 99 : rb)
      return a.name.localeCompare(b.name)
    })
    return { current, alumni: parsed.alumni ?? [] }
  }
})
