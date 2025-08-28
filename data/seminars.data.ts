import { createContentLoader } from 'vitepress'
export default createContentLoader('/seminars/*.md', {
  transform (items) {
    return items.filter(({ url }) =>
      url !== '/seminars/' && // most setups
      url !== '/seminars' &&  // just in case cleanUrls affects trailing slash
      url !== '/seminars/index' // extra safeguard
    )
  }
})
