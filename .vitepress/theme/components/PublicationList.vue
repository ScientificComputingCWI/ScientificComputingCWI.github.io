<!--
  Renders auto-fetched publications. Used by both the homepage (a short flat list)
  and the publications page (grouped under year headings), so the two always show
  the same level of detail.
-->

<template>
  <div>
    <template v-if="groupByYear">
      <section v-for="[year, items] of grouped" :key="year" class="pub-year">
        <h2 :id="'y' + year">{{ year }} <span class="pub-year-count">{{ items.length }}</span></h2>
        <ol class="pub-list">
          <li v-for="p of items" :key="p.id || p.title">
            <PublicationEntry :publication="p" :curated-url="curatedByDoi[p.doi]" />
          </li>
        </ol>
      </section>
    </template>

    <ol v-else class="pub-list">
      <li v-for="p of publications" :key="p.id || p.title">
        <PublicationEntry :publication="p" :curated-url="curatedByDoi[p.doi]" />
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PublicationEntry from './PublicationEntry.vue'

const props = withDefaults(
  defineProps<{
    publications: any[]
    curatedByDoi?: Record<string, string>
    groupByYear?: boolean
  }>(),
  { curatedByDoi: () => ({}), groupByYear: false }
)

const grouped = computed(() => {
  const groups = new Map<number | string, any[]>()
  for (const p of props.publications) {
    const y = p.year ?? 'Undated'
    if (!groups.has(y)) groups.set(y, [])
    groups.get(y)!.push(p)
  }
  return [...groups.entries()].sort((a, b) =>
    b[0] === 'Undated' ? -1 : a[0] === 'Undated' ? 1 : (b[0] as number) - (a[0] as number)
  )
})
</script>

<style scoped>
.pub-year h2 {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 2rem;
  padding-top: 1.25rem;
  font-size: 1.25rem;
  letter-spacing: -0.01em;
}

.pub-year-count {
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
  font-weight: 400;
  margin-left: 0.4rem;
}

.pub-list {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.pub-list li {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.pub-list li:last-child {
  border-bottom: none;
}
</style>
