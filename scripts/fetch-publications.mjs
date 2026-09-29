#!/usr/bin/env node
/**
 * Fetch the group's publications from OpenAlex and write data/publications.generated.json.
 *
 *   node scripts/fetch-publications.mjs          # write the file
 *   node scripts/fetch-publications.mjs --dry    # print a summary, write nothing
 *   node scripts/fetch-publications.mjs --force  # write even if the result looks wrong
 *
 * The script refuses to overwrite an existing list when any OpenAlex request failed,
 * or when the new list is less than half the size of the old one — otherwise a network
 * hiccup during the weekly workflow would commit an empty file and blank the site.
 *
 * Inputs : data/members.json, data/publications.config.json
 * Output : data/publications.generated.json
 *
 * No dependencies — uses Node 18+ global fetch. OpenAlex needs no API key; passing a
 * `mailto` puts us in their faster "polite pool".
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA = path.join(ROOT, 'data')
const OUT = path.join(DATA, 'publications.generated.json')
const API = 'https://api.openalex.org'
const DRY = process.argv.includes('--dry')
const FORCE = process.argv.includes('--force')

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const members = readJson(path.join(DATA, 'members.json'))
const config = readJson(path.join(DATA, 'publications.config.json'))

const CWI = config.institution.openalexId
const MODE = config.affiliationMode ?? 'balanced'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ------------------------------------------------------------------ helpers */

/** OpenAlex ids come back as full URLs ("https://openalex.org/A123"); compare on the tail. */
const idIs = (value, id) => typeof value === 'string' && value.split('/').pop() === id

const stripDoi = (doi) =>
  typeof doi === 'string' ? doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').toLowerCase() : null

/** Normalised title, used to collapse a preprint and its published version into one entry. */
const titleKey = (t) =>
  (t || '')
    .toLowerCase()
    .replace(/[‐-―]/g, '-')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

async function api(url, attempt = 0) {
  const res = await fetch(url, { headers: { 'User-Agent': `scientificcomputingcwi (${config.mailto})` } })
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 5) throw new Error(`OpenAlex ${res.status} after ${attempt} retries: ${url}`)
    const wait = 2 ** attempt * 1000
    console.warn(`  ${res.status} from OpenAlex, retrying in ${wait / 1000}s…`)
    await sleep(wait)
    return api(url, attempt + 1)
  }
  if (!res.ok) throw new Error(`OpenAlex ${res.status}: ${url}`)
  return res.json()
}

/** Walk every page of a filtered /works query using cursor paging. */
async function fetchWorks(filter) {
  const out = []
  let cursor = '*'
  while (cursor) {
    const url =
      `${API}/works?filter=${filter}` +
      `&per-page=200&cursor=${encodeURIComponent(cursor)}` +
      `&mailto=${encodeURIComponent(config.mailto)}`
    const page = await api(url)
    out.push(...(page.results ?? []))
    cursor = page.meta?.next_cursor ?? null
    if (!page.results?.length) break
    await sleep(120)
  }
  return out
}

/* ----------------------------------------------------------- affiliation rule */

/**
 * Does `work` count as a group publication, given that `member` is an author?
 * `strict` members are always judged on their own authorship line.
 */
function affiliated(work, memberIds, strict) {
  if (MODE === 'any' && !strict) return true

  const authorships = work.authorships ?? []
  const ours = authorships.find((a) => memberIds.some((id) => idIs(a.author?.id, id)))
  const ownHasCwi = (ours?.institutions ?? []).some((i) => idIs(i.id, CWI))

  if (strict || MODE === 'strict') return ownHasCwi
  if (ownHasCwi) return true

  // balanced: CWI anywhere on the paper…
  if (authorships.some((a) => (a.institutions ?? []).some((i) => idIs(i.id, CWI)))) return true
  // …or a record with no institutional metadata at all (how arXiv preprints look).
  return authorships.length > 0 && authorships.every((a) => (a.institutions ?? []).length === 0)
}

/* ------------------------------------------------------------- normalisation */

const https = (url) => (typeof url === 'string' ? url.replace(/^http:\/\//i, 'https://') : url)

function bestLinks(work) {
  const links = {}
  const doi = stripDoi(work.doi)
  if (doi) links.doi = `https://doi.org/${doi}`

  const locations = [work.primary_location, work.best_oa_location, ...(work.locations ?? [])].filter(Boolean)
  for (const loc of locations) {
    const host = loc.source?.display_name ?? ''
    const url = loc.landing_page_url || loc.pdf_url
    if (!url) continue
    if (/arxiv/i.test(host) || /arxiv\.org/i.test(url)) links.arxiv ??= https(url)
  }
  const oa = work.best_oa_location
  if (oa?.pdf_url) links.pdf ??= https(oa.pdf_url)
  else if (oa?.landing_page_url) links.openAccess ??= https(oa.landing_page_url)
  return links
}

function venueOf(work) {
  const src = work.primary_location?.source
  if (!src) return null
  const name = src.display_name ?? null
  if (!name) return null
  // "arXiv (Cornell University)" reads better as just "arXiv"
  if (/^arxiv/i.test(name)) return 'arXiv'
  return name
}

/**
 * OpenAlex author id -> the name we want printed for that person.
 *
 * Two reasons this exists. OpenAlex names an authorship after its canonical author
 * record, so a record conflated with a namesake prints the wrong name — Rik Hoekstra's
 * shows up as "Rolf F. Hoekstra". And even when it is the right person, the canonical
 * form often differs from how the group refers to them ("Daan T. Crommelin",
 * "Wouter N. Edeling", "Dimitrios Loukrezis"), which would stop the site recognising
 * its own members and printing them in bold.
 *
 * Co-authors from outside the group keep whatever OpenAlex calls them.
 */
const memberNameById = new Map()
for (const person of members.current) {
  for (const id of person.openalex ?? []) memberNameById.set(id, person.name)
}

const authorName = (authorship) => {
  const id = authorship.author?.id?.split('/').pop()
  return (id && memberNameById.get(id)) || authorship.author?.display_name || null
}

function normalise(work, memberNames) {
  const bib = work.biblio ?? {}
  return {
    id: work.id?.split('/').pop() ?? null,
    doi: stripDoi(work.doi),
    title: (work.title ?? work.display_name ?? '').replace(/\s+/g, ' ').trim(),
    authors: (work.authorships ?? []).map(authorName).filter(Boolean),
    members: [...memberNames].sort(),
    year: work.publication_year ?? null,
    date: work.publication_date ?? null,
    type: work.type ?? null,
    isPreprint: work.type === 'preprint',
    venue: venueOf(work),
    volume: bib.volume ?? null,
    issue: bib.issue ?? null,
    pages: bib.first_page && bib.last_page ? `${bib.first_page}–${bib.last_page}` : bib.first_page ?? null,
    citedBy: work.cited_by_count ?? 0,
    isOpenAccess: work.open_access?.is_oa ?? false,
    links: bestLinks(work)
  }
}

/* --------------------------------------------------------------------- main */

async function main() {
  const people = members.current.filter((m) => (m.openalex ?? []).length)
  console.log(`Fetching publications for ${people.length} members (mode: ${MODE})\n`)

  /** work id -> { work, members:Set<string> } */
  const collected = new Map()
  const perMember = {}
  /** Anything that went wrong talking to OpenAlex. A non-empty list blocks the write. */
  const failures = []

  for (const person of people) {
    const ids = person.openalex
    const strict = person.strict === true
    const seen = new Set()

    for (const id of ids) {
      const filter = [
        `authorships.author.id:${id}`,
        `type:${config.types.join('|')}`,
        config.fromYear ? `from_publication_date:${config.fromYear}-01-01` : null
      ]
        .filter(Boolean)
        .join(',')

      let works
      try {
        works = await fetchWorks(filter)
      } catch (err) {
        console.error(`  ! ${person.name} (${id}): ${err.message}`)
        failures.push(`${person.name} (${id}): ${err.message}`)
        continue
      }

      for (const work of works) {
        if (!affiliated(work, ids, strict)) continue
        if (config.excludeOpenAlexIds.some((x) => idIs(work.id, x))) continue
        const doi = stripDoi(work.doi)
        if (doi && config.excludeDois.map(stripDoi).includes(doi)) continue
        seen.add(work.id)
        const entry = collected.get(work.id) ?? { work, members: new Set() }
        entry.members.add(person.name)
        collected.set(work.id, entry)
      }
    }

    perMember[person.name] = seen.size
    console.log(`  ${person.name.padEnd(26)} ${String(seen.size).padStart(4)}${strict ? '  (strict)' : ''}`)
  }

  // Collapse the preprint and the published version of the same paper into one entry.
  // Everything is keyed on the normalised title, because a work and its arXiv preprint
  // never share a DOI — keying on DOI would leave both in the list. Works with no
  // usable title fall back to their own id so they are never merged with anything.
  const groups = new Map()
  for (const { work, members: who } of collected.values()) {
    const key = titleKey(work.title) || `id:${work.id}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push({ work, members: who })
  }

  // Within a group the published version wins over a preprint; citations break ties.
  const score = (w) => (w.type === 'preprint' ? 0 : 1)
  const publications = [...groups.values()]
    .map((group) => {
      const sorted = [...group].sort(
        (a, b) => score(b.work) - score(a.work) || (b.work.cited_by_count ?? 0) - (a.work.cited_by_count ?? 0)
      )
      const winner = sorted[0]
      const who = new Set(group.flatMap((g) => [...g.members]))
      const entry = normalise(winner.work, who)
      // Carry links from the versions we dropped (the arXiv link usually lives on the preprint).
      for (const other of sorted.slice(1)) entry.links = { ...bestLinks(other.work), ...entry.links }
      return entry
    })
    .filter((p) => p.title)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || a.title.localeCompare(b.title))

  for (const manual of config.extra ?? []) publications.push(manual)

  const output = {
    generatedAt: new Date().toISOString().slice(0, 10),
    source: 'OpenAlex (https://openalex.org) — CC0',
    affiliationMode: MODE,
    fromYear: config.fromYear,
    count: publications.length,
    perMember,
    publications
  }

  console.log(`\n${publications.length} publications after de-duplication`)
  const years = publications.reduce((acc, p) => ((acc[p.year] = (acc[p.year] ?? 0) + 1), acc), {})
  console.log(
    Object.entries(years)
      .sort((a, b) => b[0] - a[0])
      .slice(0, 6)
      .map(([y, n]) => `  ${y}: ${n}`)
      .join('\n')
  )

  if (DRY) {
    console.log('\n--dry: nothing written')
    return
  }

  // Refuse to replace a good list with a broken one. Without this, a network
  // failure or an OpenAlex outage during the weekly workflow would quietly commit
  // an empty file and wipe the publication list off the live site.
  const previous = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : null
  const before = previous?.publications?.length ?? 0
  const refuse = []

  if (failures.length) {
    refuse.push(`${failures.length} OpenAlex request(s) failed:\n    ${failures.join('\n    ')}`)
  }
  if (!publications.length && before > 0) {
    refuse.push(`fetched 0 publications, but the existing file has ${before}`)
  }
  if (before > 0 && publications.length < before * 0.5) {
    refuse.push(`fetched ${publications.length}, less than half the existing ${before} — looks like a partial result`)
  }

  if (refuse.length && !FORCE) {
    console.error('\nRefusing to overwrite ' + path.relative(ROOT, OUT) + ':')
    for (const r of refuse) console.error('  - ' + r)
    console.error('\nThe existing file is unchanged. Re-run when the cause is fixed,')
    console.error('or pass --force if the drop is genuine (people left the group, say).')
    process.exit(1)
  }

  fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + '\n')
  console.log(`\nWrote ${path.relative(ROOT, OUT)}${before ? ` (was ${before} publications)` : ''}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
