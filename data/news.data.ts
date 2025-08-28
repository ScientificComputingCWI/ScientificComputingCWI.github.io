import { createContentLoader } from 'vitepress'
export default createContentLoader('/news/*.md', {
  transform (items) {
    return items.filter(({ url }) =>
      url !== '/news/' && // most setups
      url !== '/news' &&  // just in case cleanUrls affects trailing slash
      url !== '/news/index' // extra safeguard
    )
  }
})
