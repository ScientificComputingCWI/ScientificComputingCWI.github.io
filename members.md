---
title: Members
---

# Members

<script setup>
import { computed } from 'vue'
import { data as members } from '/data/members.data'

const groups = computed(() => {
  const out = []
  for (const m of members.current) {
    const last = out[out.length - 1]
    if (last && last.role === m.role) last.people.push(m)
    else out.push({ role: m.role, people: [m] })
  }
  return out
})

const plural = (role) =>
  ({
    'Group leader': 'Group leader',
    Staff: 'Staff',
    'PhD candidate': 'PhD candidates',
    Postdoc: 'Postdocs',
    'Visiting postdoc': 'Visiting postdocs',
    'Visiting professor': 'Visiting professors',
    Advisor: 'Advisors'
  })[role] || role

// First + last initial ("Syver Døving Agdestein" -> "SA", not "SD").
const initials = (name) => {
  const words = name.split(/\s+/).filter((w) => /^[A-ZÀ-Þ]/.test(w))
  if (!words.length) return '?'
  if (words.length === 1) return words[0][0]
  return words[0][0] + words[words.length - 1][0]
}
</script>

The Scientific Computing group at CWI works on **scientific machine learning** and
**uncertainty quantification** — neural ODEs, closure models for turbulence,
reduced-order models, discretization techniques, stochastic parameterizations,
generative models and data assimilation.

<section v-for="group of groups" :key="group.role" class="mem-group">
  <h2>{{ plural(group.role) }}</h2>
  <ul class="mem-grid">
    <li v-for="m of group.people" :key="m.name" class="mem-card">
      <div class="mem-avatar" :aria-hidden="true">
        <img v-if="m.photo" :src="m.photo" :alt="m.name" />
        <span v-else>{{ initials(m.name) }}</span>
      </div>
      <div class="mem-body">
        <p class="mem-name">
          <a v-if="m.website" :href="m.website">{{ m.name }}</a>
          <span v-else>{{ m.name }}</span>
        </p>
        <p class="mem-role">{{ m.role }}</p>
        <p class="mem-links">
          <a v-if="m.email" :href="'mailto:' + m.email">Email</a>
          <a v-if="m.orcid" :href="'https://orcid.org/' + m.orcid">ORCID</a>
          <a v-if="m.github" :href="'https://github.com/' + m.github">GitHub</a>
          <a :href="'/publications/?member=' + encodeURIComponent(m.name)">Publications</a>
        </p>
      </div>
    </li>
  </ul>
</section>

![The Scientific Computing group at ECCOMAS 2024](/group_picture.jpg)

## Group seminar

To receive news and Zoom links for our group seminar, contact Wouter Edeling at
`wouter.edeling@cwi.nl`. For more information, see the
[seminar page](https://www.cwi.nl/en/groups/scientific-computing/uq-seminar/seminar-ml-uq-sc/).

## Former members

<ul class="mem-alumni">
  <li v-for="a of members.alumni" :key="a.name">
    {{ a.name }}<span v-if="a.now" class="mem-now"> — {{ a.now }}</span>
  </li>
</ul>

<style scoped>
.mem-group h2 {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 2.25rem;
  padding-top: 1.25rem;
  font-size: 1.25rem;
}

.mem-grid {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
}

.mem-card {
  display: flex;
  gap: 0.9rem;
  align-items: center;
  padding: 0.9rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.2s;
}

.mem-card:hover {
  border-color: var(--vp-c-brand-1);
}

.mem-avatar {
  flex: 0 0 3rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.mem-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mem-body {
  min-width: 0;
}

.mem-name {
  margin: 0;
  font-weight: 600;
  line-height: 1.3;
}

.mem-name a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.mem-name a:hover {
  color: var(--vp-c-brand-1);
}

.mem-role {
  margin: 0.1rem 0 0.35rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-3);
}

.mem-links {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  font-size: 0.8rem;
}

.mem-alumni {
  list-style: none;
  padding: 0;
  columns: 2;
  column-gap: 2rem;
  font-size: 0.95rem;
}

.mem-alumni li {
  break-inside: avoid;
  margin-bottom: 0.3rem;
}

.mem-now {
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .mem-alumni {
    columns: 1;
  }
}
</style>
