# Publications

For all our publications, please visit
[CWI's repository](https://ir.cwi.nl/#facet=affiliation_label_partOf:Scientific%20Computing).

<!-- ## Latest publications -->

<script setup>
import { data as posts } from '/data/publications.data'
import formatDate from '/.vitepress/theme/utils/formatDate';
import getSorted from '/.vitepress/theme/utils/getSorted';
const sortedPosts = getSorted( posts );
</script>

<ul>
    <li v-for="post of sortedPosts">
        <!-- <div> -->
        <strong><a :href="post.url">{{ post.frontmatter.title }}</a></strong>
        <!-- <br/> -->
        <!-- {{ post.frontmatter.authors }} -->
        <!-- </div> -->
        <span>{{ formatDate(post.frontmatter.date) }}</span>
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
    min-width: 6em;
}
</style>
