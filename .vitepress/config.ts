import footnote from 'markdown-it-footnote'
import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Scientific Computing CWI",
  description: "Group web page",
  markdown: {
    math: true,
    config: (md) => {
      md.use(footnote)
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      "light": "/logo.png",
      "dark": "/logo.png"
    },
    editLink: {
      pattern: 'https://github.com/ScientificComputingCWI/ScientificComputingCWI.github.io/tree/main/:path',
    },
    lastUpdated: {
      // text: 'Updated at',
      formatOptions: {
        dateStyle: 'long',
        // timeStyle: 'short',
        hour12: false, // Use 24-hour clock
      },
    },

    nav: [
      { text: "Home", link: "/" },
      { text: "News", link: "/news/", activeMatch: "/news/.*" },
      { text: "Publications", link: "/publications/", activeMatch: "/publications/.*" },
      { text: "Seminars", link: "/seminars/", activeMatch: "/seminars/.*" },
      { text: "Software", link: "/software" },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/ScientificComputingCWI" },
      {
        icon: { svg: '<img src="researchgate.svg" width="20" height="20"/>' },
        link: "https://www.researchgate.net/lab/Scientific-Computing-Group-Benjamin-Sanderse",
      },
      {
        icon: { svg: '<img src="CWI_logo_grey.svg" width="20" height="20"/>' },
        link: "https://www.cwi.nl/en/research/scientific-computing/",
      },
    ],
  },

  vite: {
    // resolve: {
    //   alias: {
    //     '@': path.resolve(__dirname, '../components')
    //   }
    // },
    optimizeDeps: {
      exclude: [ 
        '@nolebase/vitepress-plugin-enhanced-readabilities/client',
        'vitepress',
        '@nolebase/ui',
      ], 
    }, 
    ssr: { 
      noExternal: [ 
        // If there are other packages that need to be processed by Vite, you can add them here.
        '@nolebase/vitepress-plugin-enhanced-readabilities',
        '@nolebase/ui',
      ], 
    },
  },

})
