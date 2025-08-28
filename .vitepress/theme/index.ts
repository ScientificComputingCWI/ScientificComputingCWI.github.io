import { h } from 'vue'
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import Figure from './components/Figure.vue';

import { 
  NolebaseEnhancedReadabilitiesMenu, 
  NolebaseEnhancedReadabilitiesScreenMenu, 
} from '@nolebase/vitepress-plugin-enhanced-readabilities/client'

// import { enhanceAppWithTabs } from 'vitepress-plugin-tabs/client'

import '@nolebase/vitepress-plugin-enhanced-readabilities/client/style.css'

export default {
    extends: DefaultTheme,
    Layout() {
        return h(DefaultTheme.Layout, null, {
            'nav-bar-content-after': () => [
                h(NolebaseEnhancedReadabilitiesMenu), // Enhanced Readabilities menu
            ],
            // A enhanced readabilities menu for narrower screens (usually smaller than iPad Mini)
            'nav-screen-content-after': () => h(NolebaseEnhancedReadabilitiesScreenMenu),
        })
    },
    enhanceApp({ app, router, siteData }) {
        app.component( 'Figure', Figure );
    }
} satisfies Theme
