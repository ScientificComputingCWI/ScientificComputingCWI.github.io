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
import { data as seminars } from '/data/seminars.data'
import formatDate from '/.vitepress/theme/utils/formatDate';
import getSorted from '/.vitepress/theme/utils/getSorted';
const sortedNews = getSorted( news );
const sortedPublications = getSorted( publications );
const sortedSeminars = getSorted( seminars );
</script>

The Scientific Computing group at CWI develops efficient mathematical methods to simulate and predict real-world phenomena with inherent uncertainties. Our two main research themes are **scientific machine learning** and **uncertainty quantification**, and the topics within these themes are neural ODEs, closure models for turbulence, reduced-order models, discretization techniques, stochastic parameterizations, generative models, data assimilation.

Our official CWI page with general information can be found [here](https://www.cwi.nl/en/groups/scientific-computing/). On the current page, you can find more detailed information such as the software that we develop in the group and other useful information such as the material used in the [semester programmes](https://github.com/ScientificComputingCWI) that we organize, in particular the [SciML](https://github.com/ScientificComputingCWI/SemesterProgramme-SciML) and [UQ](https://github.com/ScientificComputingCWI/SemesterProgramme-UQ) semester programmes. Note the upcoming semester programme 2025 on [Synergies in numerical linear algebra and machine learning](https://www.cwi.nl/en/education/semester-programmes/cwi-research-semester-programs/synergies-in-numerical-linear-algebra-and-machine-learning/)!

Please check our [GitHub page](https://github.com/ScientificComputingCWI) with group repositories and our [software page](/software/).

## Members

Current members:
Benjamin Sanderse (group leader),
Wouter Edeling (staff),
Daan Crommelin (staff),
Syver Agdestein (PhD candidate),
Toby van Gastelen (PhD candidate),
Rik Hoekstra (PhD candidate),
Pardeep Kumar (PhD candidate),
Marius Kurz (postdoc),
Nikolaj Mücke (postdoc),
Henrik Rosenberger (PhD candidate),
Robin Klein (PhD candidate),
Barry Koren (advisor).
**News**: Dimitris Loukrezis will join our group as a tenure track researcher, starting March 1st, 2025. Welcome Dimitris!

<!-- ![SC group at ECCOMAS 2024](group_picture.jpg) -->

## Group seminar

To receive news and Zoom links for our group seminar, you can contact Wouter Edeling at `wouter.edeling@cwi.nl`. For more information, see our [seminar page](https://www.cwi.nl/en/groups/scientific-computing/uq-seminar/seminar-ml-uq-sc/).

<!-- <ul> -->
<!--     <li v-for="post of sortedSeminars"> -->
<!--         <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/> -->
<!--         <span>{{ formatDate( post.frontmatter.date ) }}</span> -->
<!--     </li> -->
<!-- </ul> -->

## News

<ul>
    <li v-for="post of sortedNews">
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/>
        <span>{{ formatDate( post.frontmatter.date ) }}</span>
    </li>
</ul>

## Publications

Full list of publications can be found at
[CWI's institutional repository](https://ir.cwi.nl/#facet=affiliation_label_partOf:Scientific%20Computing).

<ul>
    <li v-for="post of sortedPublications">
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong><br/>
        <span>{{ formatDate( post.frontmatter.date ) }}</span>
    </li>
</ul>

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
