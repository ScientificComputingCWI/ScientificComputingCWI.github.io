---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Scientific Computing"
  # text: "The Scientific Computing Group at CWI"
  tagline: "Centrum Wiskunde & Informatica"
  image:
    src: /logo.png
    alt: Group
  actions:
    - theme: brand
      text: News
      link: /news/
    - theme: alt
      text: Publications
      link: /publications/
    - theme: alt
      text: Members
      link: /members
    - theme: alt
      text: Software
      link: /software

# features:
#   - title: Research
#     details:
#         Numerical methods
#   - title: Software
#     details:
#         Solvers
---

<script setup>
import { data as news } from '/data/news.data'
import { data as publications } from '/data/publications.data'
import { data as members } from '/data/members.data'
import { data as generated } from '/data/generatedPublications.data'
import { computed } from 'vue'
import formatDate from '/.vitepress/theme/utils/formatDate';
import getSorted from '/.vitepress/theme/utils/getSorted';
const sortedNews = getSorted( news );
const sortedPublications = getSorted( publications );
const curatedByDoi = computed(() => {
  const map = {}
  for (const page of publications) {
    const doi = page.frontmatter?.doi
    if (doi) map[String(doi).toLowerCase().replace(/^https?:\/\/(dx\.)?doi\.org\//, '')] = page.url
  }
  return map
});
</script>

The Scientific Computing group at CWI develops efficient mathematical methods to simulate and predict real-world phenomena with inherent uncertainties. Our two main research themes are **scientific machine learning** and **uncertainty quantification**, and the topics within these themes are neural ODEs, closure models for turbulence, reduced-order models, discretization techniques, stochastic parameterizations, generative models, data assimilation.

Our official CWI page with general information can be found [here](https://www.cwi.nl/en/groups/scientific-computing/). On the current page, you can find more detailed information such as the software that we develop in the group and other useful information such as the material used in the [semester programmes](https://github.com/ScientificComputingCWI) that we organize, in particular the [SciML](https://github.com/ScientificComputingCWI/SemesterProgramme-SciML) and [UQ](https://github.com/ScientificComputingCWI/SemesterProgramme-UQ) semester programmes. Note the recent semester programme 2025 on [Synergies in numerical linear algebra and machine learning](https://www.cwi.nl/en/education/semester-programmes/cwi-research-semester-programs/synergies-in-numerical-linear-algebra-and-machine-learning/)!

Please check our [GitHub page](https://github.com/ScientificComputingCWI) with group repositories and our [software page](/software).

## Members

<p>
  The group currently has {{ members.current.length }} members. See the
  <a href="/members">members page</a> for everyone's role and links.
</p>

![SC group at ECCOMAS 2024](/group_picture.jpg)


## Group challenges
Our group is regularly involved in **group challenges**, in which we, as a group, tackle an outstanding societal challenge that is given to us by a research institute or industry. These are short-term projects, typically 3-6 months in duration, on which we work in a team of approximately 5 people on Friday afternoons. We add value through our extensive knowledge of scientific computing, uncertainty quantification and scientific machine learning, and our strong programming skills in modern languages such as Python and Julia. 
Over the last year, we worked with **Deltares** on predicting failure probabilities of Dutch dikes, and with **KNMI** on the fine-grained temperature prediction in Europe using Gaussian process regression.  

## News

<ul>
    <li v-for="post of sortedNews">
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/>
        <span>{{ formatDate( post.frontmatter.date ) }}</span>
    </li>
</ul>

## Recent publications

<PublicationList :publications="generated.publications.slice(0, 8)" :curated-by-doi="curatedByDoi" />

See [all recent publications](/publications/), or
[the full list](https://ir.cwi.nl/#facet=affiliation_label_partOf:Scientific%20Computing)
in CWI's institutional repository.

<style scoped>
ul {
    list-style-type: none;
    padding-left: 0;
    font-size: 1.125rem;
    line-height: 1.75;
}

li {
    display: flex;
    justify-content: space-between;
}

li span {
    font-family: var(--vp-font-family-mono);
    font-size: var(--vp-code-font-size);
}

</style>

