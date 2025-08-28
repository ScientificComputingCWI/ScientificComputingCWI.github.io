import { createContentLoader } from 'vitepress'
export default createContentLoader('/publications/*.md', {
  transform (items) {
    return items.filter(({ url }) =>
      url !== '/publications/' && // most setups
      url !== '/publications' &&  // just in case cleanUrls affects trailing slash
      url !== '/publications/index' // extra safeguard
    )
  }
})
