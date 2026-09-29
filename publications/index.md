# Publications

<script setup>
import { computed, onMounted, ref } from 'vue'
import { data as generated } from '/data/generatedPublications.data'
import { data as curated } from '/data/publications.data'

// Some publications have a hand-written page under /publications/ carrying an abstract,
// code and data links. Those pages declare a `doi:` in their frontmatter, which is how
// the matching auto-fetched entry finds them and grows a "Details" link.
const curatedByDoi = computed(() => {
  const map = {}
  for (const page of curated) {
    const doi = page.frontmatter?.doi
    if (doi) map[String(doi).toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '')] = page.url
  }
  return map
})

const query = ref('')
const member = ref('')
const showPreprints = ref(true)

// The rolling window: everything from generated.minYear onwards. That number is worked
// out at build time (see data/generatedPublications.data.ts), so it moves forward on its
// own each year — nothing here needs editing in January.
const recent = computed(() => generated.publications.filter((p) => (p.year ?? 0) >= generated.minYear))
const yearRange = computed(() => `${generated.minYear}–${generated.maxYear}`)

const members = computed(() => {
  const set = new Set()
  for (const p of recent.value) for (const m of p.members) set.add(m)
  return [...set].sort()
})

// Allow /publications/?member=Wouter%20Edeling — used by the Members page.
onMounted(() => {
  const wanted = new URLSearchParams(window.location.search).get('member')
  if (wanted && members.value.includes(wanted)) member.value = wanted
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return recent.value.filter((p) => {
    if (!showPreprints.value && p.isPreprint) return false
    if (member.value && !p.members.includes(member.value)) return false
    if (!q) return true
    return (
      p.title.toLowerCase().includes(q) ||
      (p.venue || '').toLowerCase().includes(q) ||
      p.authors.some((a) => a.toLowerCase().includes(q))
    )
  })
})
</script>

<p>
  Work by current group members from <strong>{{ yearRange }}</strong>, generated automatically
  from <a href="https://openalex.org">OpenAlex</a> and refreshed weekly. For everything before
  that, see
  <a href="https://ir.cwi.nl/#facet=affiliation_label_partOf:Scientific%20Computing">all publications</a>
  in CWI's institutional repository.
</p>

<div class="pub-controls">
  <input v-model="query" type="search" placeholder="Search title, author or journal…" aria-label="Search publications" />
  <select v-model="member" aria-label="Filter by group member">
    <option value="">All members</option>
    <option v-for="m of members" :key="m" :value="m">{{ m }}</option>
  </select>
  <label class="pub-toggle">
    <input type="checkbox" v-model="showPreprints" />
    Include preprints
  </label>
</div>

<p class="pub-count">
  {{ filtered.length }} {{ filtered.length === 1 ? 'publication' : 'publications' }}<template v-if="generated.generatedAt"> · last updated {{ generated.generatedAt }}</template>
</p>

<PublicationList :publications="filtered" :curated-by-doi="curatedByDoi" :group-by-year="true" />

<p v-if="!filtered.length" class="pub-empty">
  No publications match that filter.
</p>

<p class="pub-footer">
  This page shows {{ yearRange }} only.
  <a href="https://ir.cwi.nl/#facet=affiliation_label_partOf:Scientific%20Computing">
    All publications
  </a>
  are listed in CWI's institutional repository.
</p>

<style scoped>
.pub-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  margin: 1.5rem 0 0.5rem;
}

.pub-controls input[type='search'],
.pub-controls select {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 8px;
  padding: 0.45rem 0.7rem;
  font-size: 0.9rem;
}

.pub-controls input[type='search'] {
  flex: 1 1 18rem;
  min-width: 0;
}

.pub-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.pub-count {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
  margin: 0.25rem 0 0;
}

.pub-empty {
  color: var(--vp-c-text-3);
  padding: 2rem 0;
}

.pub-footer {
  margin-top: 2rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
  .pub-controls input[type='search'] {
    flex-basis: 100%;
  }
}
</style>
