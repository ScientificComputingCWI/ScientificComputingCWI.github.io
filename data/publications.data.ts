import { createContentLoader } from 'vitepress'

/** Pages under /publications/ that are indexes rather than individual publications. */
const NOT_A_PUBLICATION = new Set([
  '/publications/',
  '/publications',
  '/publications/index'
])

export default createContentLoader('/publications/*.md', {
  transform(items) {
    return items.filter(({ url }) => !NOT_A_PUBLICATION.has(url))
  }
})
