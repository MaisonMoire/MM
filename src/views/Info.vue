<template lang="pug">
  aside#info.top-0.left-0.h-screen.overflow-y-scroll.w-full
    //- page body
    .min-h-screen.bg-white.text-black.lg_px-20.lg_pt-15.font-mono.text-base.lg_text-2xl.flex.flex-col(ref="body")
      //- header (sticky on mobile)
      header.sticky.lg_static.top-0.left-0.w-full.pb-20.lg_pb-0.opacity-0(:class="{'opacity-100 transition duration-300 delay-700': visible}")
        //- (mobile header)
        .absolute.overlay.lg_hidden(style="background:linear-gradient(to bottom, white 75%, rgba(255,255,255,0))")
        header-layout.relative.z-10.lg_hidden.uppercase
          button.focus_outline-none(slot="title", @click="close(); $emit('index')") Index
          div(slot="button")
            button.focus_outline-none(v-show="atTop", @click="close") Close
            router-link(v-show="!atTop", to="/login") Log in
        //- (desktop header)
        .hidden.lg_block
          router-link.uppercase.font-serif.tracking-normal.leading-none(to="/login") Log in
      .flex-1.px-17.lg_px-0.lb_pb-17(v-if="main")
        //- main
        section.mt-70.lg_my-90
          prismic-rich-text(:field="main.data.info")
        section.mt-100.lg_my-90.flex.flex-wrap
          //- addresses...
          prismic-rich-text.w-full.lg_w-1x2.xl_w-1x3.lg_pr-20.xl_pr-64(v-for="(item, i) in main.data.addresses", :field="item.address", :key="`addr${i}`", :class="{'mt-lh lg_mt-0': i}")
        //- clients / credits
        footer.my-100.lg_mt-90
          prismic-rich-text(:field="main.data.clients_selected")
      //- credits
      .mt-auto.pb-17.px-17.lg_px-0.lg_pt-90.leading-tight
        button(v-show="!credits", @click="credits = true") Site Credits
        span(v-show="credits")
          | Design: #[a(href="http://spencerfenton.co.uk") Spencer Fenton]<br>Build: #[a(href="http://everettwilliams.info") Everett Williams]

    //- empty area, triggers auto close
    //- ios: ht should be taller than window
    observer#info-end.mt-3(:threshold="0.35", @visible="autoClose = true", @hidden="autoClose = false", :style="{height: '120vh'}")
</template>

<script>
import { mapGetters } from 'vuex'
import Observer from '@/components/Observer'
import throttle from 'lodash/throttle'
import HeaderLayout from '@/components/HeaderLayout'
export default {
  name: 'Info',
  props: ['visible'],
  data () {
    return {
      credits: false,
      autoClose: false,
      autoCloseScroll: null,
      afterScroll: null,
      y: 0
    }
  },
  computed: {
    ...mapGetters(['main']),
    atTop () {
      return this.y <= 0
    }
  },
  methods: {
    // ...mapMutations({ setTitle: 'SET_TITLE' }),
    close () {
      this.$router.push({ hash: '' })
      this.credits = false
    },
    // closeNotes () {
    //   if (this.$route.hash) this.bus.$emit('closeNotes')
    // },
    onScroll: throttle(function () {
      // this.closeNotes()
      // show title
      // if (!this.titleActive) this.$store.commit('TITLE_ACTIVE')
      // (auto) close info
      clearTimeout(this.afterScroll)
      this.y = this.$el.scrollTop
      const bodyHt = this.$refs.body.offsetHeight
      if (!bodyHt) return
      const hitBottom = this.y >= bodyHt - 2
      if (hitBottom) {
        // close
        this.close()
        this.$el.removeEventListener('scroll', this.onScroll)
      } else if (this.autoClose) {
        // auto-close after scroll
        this.afterScroll = setTimeout(() => this.scrollClose(400), 101)
      } else {
        // hide title after scroll
        // this.afterScroll = setTimeout(() => this.$store.commit('TITLE_INACTIVE'), 500)
      }
    }, 50),
    scrollClose (speed = 800) {
      if (this.autoCloseScroll) return
      this.autoCloseScroll = this.$scrollTo('#info-end', {
        container: '#info',
        duration: speed,
        cancelable: true,
        onDone: () => { this.autoCloseScroll = null }
      })
    },
    onVisible () {
      this.$el.scroll(0, 0)
      this.$el.addEventListener('scroll', this.onScroll)
    },
    onHidden () {
      this.$el.removeEventListener('scroll', this.onScroll)
    }
  },
  watch: {
    visible (vis) {
      return vis ? this.onVisible() : this.onHidden()
    }
  },
  mounted () {
    return this.visible && this.onVisible()
  },
  components: { Observer, HeaderLayout }
}
</script>

<style>
/*@import '../style/_settings';*/

/* "Read More" tooltips */
/*.tooltip-hashlinks a[href*='#']{
  position: relative;
  &:hover span{ opacity:1; }
  & span{
    pointer-events: none;
    opacity: 0;
    transition: opacity 100ms;
    background:rgba(255,255,255,0.9);
    font-size: 1.45rem;
    padding:0.6em 0.7em 0.5em;
    position: absolute;
    top:0; left:0;
    border-radius: 0.125em;
    box-shadow:var(--shadow);
    white-space: nowrap;
    &:before{
      content: 'Read More';
    }
  }
}*/
</style>
