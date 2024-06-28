<template lang="pug">
  //- header / intro
  //- TYPE LAYER is single absolute layer during intro (for blend-effect)
  //- then fixed so logo ping to window-bottom on iOS
  header(:class="{'fixed z-30 overlay flex flex-col': intro}", role="banner")
    //- (seo h1)
    h1.sr-only Maison Moiré

    //- TYPE LAYER (absolute layer during intro for blend-mode effect)
    .z-20.overlay.pointer-events-none(:style="{mixBlendMode: blend ? 'difference' : '', height: intro ? winH + 'px' : '0'}", :class="{'absolute': intro}")
      //- nav (.fixed after intro)
      nav.fixed.z-40.top-0.left-0.w-full.text-white(:class="{'absolute': intro}", role="navigation")
        header-layout
          //- title / index btn
          .relative.pointer-events-auto.group(slot="title")
            //- (can hover...)
            template(v-if="canHover")
              //- (mouse hover: index is revealed)
              .whitespace-pre-line.md_whitespace-normal.group-hover_opacity-0 {{ linebreak(title) }}
              button.flex.absolute.overlay.focus_outline-none.opacity-0.group-hover_opacity-100(@click="openIndex") INDEX
            //- (no hover: reveal "Index" on tap, hide after timeout)
            template(v-else)
              .whitespace-pre-line.md_whitespace-normal(:class="{'opacity-0': indexHint}") {{ linebreak(title) }}
              button.absolute.overlay.flex.focus_outline-none.opacity-0(:class="{'opacity-100': indexHint}", @click="hintIndex") INDEX

          //- info btn
          router-link.pointer-events-auto.uppercase.md_opacity-100(slot="button", to="#info", :class="{'opacity-0': title === tagline}") Info

      //- logo (.fixed after intro)
      .bottom-0.left-0.w-full.text-white(:class="{'absolute': intro, 'fixed z-10': !intro}")
        .p-17.md_px-20
          svg-logo.block.w-full.transition-opacity.duration-300(:style="{opacity: logoOpacity}")

    //- (intro scroll layer)
    #intro-scroll.flex-1.overflow-y-scroll.scrollbars-hidden(v-if="intro", ref="scrollbody", :class="{'scroll-snap-y-mandatory-off': scrollSnap}")
      //- observer to end intro (once hidden)
      observer.h-screen.bg-white.scroll-snap-start(:style="{height: winH + 'px'}", :threshold="0.001", @hidden="onIntroEnd")
      //- empty scroll space
      #intro-end.h-screen.scroll-snap-start
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Observer from '@/components/Observer'
import HeaderLayout from '@/components/HeaderLayout'
import svgLogo from '@/components/icons/SVG-Logo'
export default {
  name: 'AppHeader',
  props: ['intro', 'logoOpacity'],
  data () {
    return {
      blend: this.intro,
      timer: null,
      autoScroll: () => {},
      scrollSnap: false,
      indexHint: false,
      canHover: window.matchMedia('(hover:hover)').matches
    }
  },
  computed: {
    ...mapState(['winH', 'title', 'tagline']),
    ...mapGetters(['linebreak'])
  },
  methods: {
    onIntroEnd () {
      this.blend = false
      this.$emit('introEnd')
    },
    autoEndIntro (delay) {
      // cancel scroll and timer
      this.autoScroll()
      clearTimeout(this.timer)
      // queue auto-scroll
      this.timer = setTimeout(() => {
        // disable scroll snap because doesn't animate (glitch)
        // this.scrollSnap = false

        // after disable...
        this.$nextTick(() => {
          // scroll!
          this.autoScroll = this.$scrollTo('#intro-end', {
            container: '#intro-scroll',
            duration: 800,
            cancelable: true,
            onCancel: () => {
              // reset
              // this.scrollSnap = true
              // re-queue
              this.autoEndIntro(2000)
            }
          })
        })
      }, 2000)
    },
    openIndex () {
      this.$emit('menu')
    },
    hintIndex () {
      // if hint visible, open index
      if (this.indexHint) {
        this.indexHint = false
        return this.openIndex()
      }
      // ...else show hint
      this.indexHint = true
      console.log(this.indexHint)
      setTimeout(() => { this.indexHint = false }, 3000)
    }
  },
  mounted () {
    this.autoEndIntro(2000)
  },
  components: { Observer, svgLogo, HeaderLayout }
}
</script>

<style>
</style>
