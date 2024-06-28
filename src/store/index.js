import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const vue = new Vue()
const tagline = 'CONTEMPORARY POST PRODUCTION STUDIO'

export default new Vuex.Store({
  state: {
    docs: [],
    title: tagline,
    tagline,
    winH: window.innerHeight,
    winW: window.innerWidth
  },
  getters: {
    main (state) {
      return state.docs.find(doc => doc.type === 'main')
    },
    projects (state) {
      return state.docs.filter(doc => doc.type === 'project')
    },
    is: (state) => (key) => {
      return key === 'portrait' ? state.winH >= state.winW
        : key === 'md' ? state.winW >= 768
          : false
    },
    linebreak: () => title => {
      // add line break into titles for mobile (.whitespace-pre-line)
      // "CLIENT NAME Project Title" > "CLIENT NAME\nProject Title"
      return title.replace(/[A-Z0-9]+\s\w{1}[a-z]{1}/, m => m.replace(' ', '\n'))
    }
  },
  mutations: {
    setDocs (state, docs) {
      state.docs = docs
    },
    setTitle (state, title = null) {
      state.title = title || tagline
    },
    setWinH (state, val) {
      state.winH = val
    },
    setWinW (state, val) {
      state.winW = val
    }
  },
  actions: {
    getDocs ({ commit }) {
      vue.$prismic.client.query('', { pageSize: 100 })
        .then(resp => commit('setDocs', resp.results))
        .catch(e => console.error(e))
    }
  },
  modules: {
  }
})
