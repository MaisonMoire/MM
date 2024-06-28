import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrismicVue from '@prismicio/vue'
import linkResolver from '@/plugins/prismic/link-resolver'
import VueScrollTo from 'vue-scrollto'
import 'lazysizes'

// Add this before the new Vue instance
Vue.use(PrismicVue, {
  endpoint: process.env.VUE_APP_PRISMIC_ENDPOINT,
  linkResolver
})

Vue.use(VueScrollTo)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
