<!-- One publication: title, authors with group members in bold, venue and links. -->

<template>
  <div>
    <p class="pub-title">
      <a v-if="primaryLink" :href="primaryLink">{{ publication.title }}</a>
      <span v-else>{{ publication.title }}</span>
      <span v-if="publication.isPreprint" class="pub-tag">preprint</span>
    </p>

    <p class="pub-authors">
      <template v-for="(a, i) of shownAuthors" :key="a + i">
        <span :class="{ 'pub-us': isMember(a) }">{{ a }}</span
        ><span v-if="i < shownAuthors.length - 1">, </span>
      </template>
      <span v-if="publication.authors.length > shownAuthors.length"> et al.</span>
    </p>

    <p class="pub-meta">
      <span v-if="publication.venue" class="pub-venue">{{ publication.venue }}</span>
      <span v-if="publication.volume"
        >{{ publication.volume }}<span v-if="publication.issue">({{ publication.issue }})</span></span
      >
      <span v-if="publication.pages">{{ publication.pages }}</span>
      <a v-if="curatedUrl" :href="curatedUrl" class="pub-link">Details</a>
      <a v-if="publication.links.arxiv && !publication.isPreprint" :href="publication.links.arxiv" class="pub-link">
        arXiv
      </a>
      <a v-if="publication.links.pdf" :href="publication.links.pdf" class="pub-link">PDF</a>
      <span v-if="publication.isOpenAccess" class="pub-oa" title="Open access">OA</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    publication: any
    curatedUrl?: string
    maxAuthors?: number
  }>(),
  { curatedUrl: undefined, maxAuthors: 12 }
)

const primaryLink = computed(() => props.publication.links?.doi || props.publication.links?.arxiv || null)

const shownAuthors = computed(() => {
  const authors: string[] = props.publication.authors ?? []
  return authors.length > props.maxAuthors ? authors.slice(0, props.maxAuthors) : authors
})

const isMember = (name: string) => (props.publication.members ?? []).includes(name)
</script>

<style scoped>
.pub-title {
  margin: 0 0 0.2rem;
  font-weight: 600;
  line-height: 1.45;
}

.pub-title a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.pub-title a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.pub-authors {
  margin: 0 0 0.2rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.pub-us {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.pub-meta {
  margin: 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: baseline;
}

.pub-venue {
  font-style: italic;
}

.pub-tag {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.05rem 0.4rem;
  border-radius: 5px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  vertical-align: middle;
}

.pub-oa {
  color: var(--vp-c-success-1, var(--vp-c-green-1));
  font-weight: 600;
  font-size: 0.75rem;
}

.pub-link {
  font-weight: 500;
}
</style>
