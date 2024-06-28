<template lang="pug">
  .fixed.overlay.pointer-events-none(v-show="qty > 0", :style="style", :class="{'opacity-0': !blur}")
</template>

<script>
import { mapState } from 'vuex'
const maxBlur = 22
export default {
  name: 'BlurLayer',
  props: ['blur'],
  data () {
    return {
      qty: maxBlur,
      infoH: 0
      // winH: 0
    }
  },
  computed: {
    ...mapState(['winH']),
    style () {
      return {
        'backdrop-filter': `blur(${this.qty}px)`,
        '-webkit-backdrop-filter': `blur(${this.qty}px)`,
        // 'transition': this.intro ? 'opacity 500ms' : this.blur ? 'opacity 200ms' : ''
        transition: this.blur ? 'opacity 200ms' : ''
      }
    },
    trigger () {
      // info scroll Pt at which to start animating blur qty
      // should match minimum of: #info-end height + winH
      return this.infoH - (this.winH * 2.3)
    }
  },
  methods: {
    onInfoScroll (e) {
      /**
       * When Info is scrolling, hide the blur-layer el completely
       * via qty=0 if it's not visible (improves scroll smoothness)
      **/
      const y = e.target.scrollTop
      // no blur zone
      if (y < this.trigger) {
        if (!this.qty) return
        this.qty = 0
      // change blur
      } else {
        const pct = (y - this.trigger) / this.winH
        const val = maxBlur - (maxBlur * pct)
        if (val < 0) return
        requestAnimationFrame(() => {
          this.qty = val.toFixed(2)
        })
      }
    },
    bindInfoScroll (bind) {
      const el = document.querySelector('#info')
      // unbind
      if (!bind) {
        return el.removeEventListener('scroll', this.onInfoScroll)
      }
      // bind
      setTimeout(() => {
        this.infoH = el.scrollHeight
        // this.winH = window.innerHeight
        el.addEventListener('scroll', this.onInfoScroll)
      }, 700)
    }
  },
  watch: {
    blur (blur) {
      if (blur) this.qty = maxBlur
    },
    '$route' (to, from) {
      this.bindInfoScroll(to.hash.startsWith('#info'))
    }
  }
}
</script>

<style>
</style>
