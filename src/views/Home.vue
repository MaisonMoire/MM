<template lang="pug">
  //- disable scroll locking below lg because flicker in ios when locking... or updating scroll position
  .home.relative.font-sans.text-base(:class="{'lg_overflow-hidden lg_h-screen': intro}")
    //- .fixed.top-0.right-0.text-white.z-50(style="font-size:50px") {{ logoOpacity }}
    //- blur layer
    blur-layer#app__blur.z-30(:blur="isInfo")

    //- header / intro
    app-header(:intro="intro", :logoOpacity="logoOpacity", @introEnd="intro = false", @menu="openProjectsModal")

    //- info overlay
    transition(name="info", @after-enter="lockScroll(true)", @after-leave="lockScroll(false)")
      info.fixed.z-40(v-show="isInfo", @index="openProjectsModal", :visible="isInfo")

    //- body
    main.relative.z-10.transition-transform.transform.duration-300.origin-center(:class="{'scale-110-off': projectsModal}")
      //- landing space
      .h-screen
        //- blur / logo opacity controller
        observer.h-25vh.lg_h-50vh(:threshold="pts", @ratio="onLandingRatio")

      //- projects feed
      projects-feed(:docs="projectsFeed")

    //- (index overlay)
    projects-menu-overlay(:visible="projectsModal", @close="closeProjectsModal({})", :projects="projectsFeed", @jump="closeProjectsModal", :class="{'pointer-events-none': !projectsModal}")

    //- landing bg (sticky b/c ios clips .fixed imgs with viewport height change on scroll...)
    .absolute.overlay
      .sticky.w-full.h-110vh.left-0.top-0.overflow-hidden
        //- landing image (crisp)
        resp-img.absolute.-top-px.left-0.w-full.h-110vh(v-if="loopImage", :bg="true", :image="loopImage", :lazy="false")

    //- looping bg (ios flickers if just using the sticky element)
    .fixed.overlay.z-5.overflow-hidden
      //- landing image (crisp)
      resp-img.absolute.-top-px.left-0.w-full.h-110vh(v-if="loopImage", :bg="true", :image="loopImage", :lazy="false")

    //- bottom loop area
    //- * excess height for ios safari (so it doesn't show inertia bounce the bottom toolbar)
    .relative.z-5.scroll-snap-start.h-100vh.lg_h-150vh(ref="loopEl")
      //- NEW: logo is full opacity at end
      observer.h-10.transform.-translate-y-full(:threshold="0.01", @visible="logoOpacity = 1")
      //- OLD: logo fades in as scroll ends (reverse of intro)
      //- .h-screen.relative
        //- logo opacity controller
        observer.absolute.bottom-0.left-0.w-10.z-10.pointer-events-none(:threshold="pts", @ratio="$event => onLandingRatio($event, true)", style="height:75vh")
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import AppHeader from '@/components/AppHeader'
import Info from '@/views/Info'
import BlurLayer from '@/components/BlurLayer'
import Observer from '@/components/Observer'
import ProjectsFeed from '@/components/ProjectsFeed'
import RespImg from '@/components/RespImg'
import ProjectsMenuOverlay from '@/components/ProjectsMenuOverlay'
import throttle from 'lodash/throttle'
let afterResize
export default {
  name: 'Home',
  data () {
    return {
      intro: this.$route.hash !== '#info',
      scrollHt: 0,
      loopElHt: 0,
      blend: true,
      logoOpacity: 1,
      imgblur: 0,
      pts: Array(51).fill(0, 0, 51).map((val, i) => i / 50),
      isLanding: true,
      projectsModal: false
    }
  },
  computed: {
    ...mapState(['winH', 'winW']),
    ...mapGetters(['main', 'projects', 'is']),
    projectsFeed () {
      return this.main?.data.body.map(slice => this.projects.find(prj => prj.id === slice.primary?.project?.id))
    },
    isInfo () {
      return this.$route.hash === '#info'
    },
    loopMobile () {
      return this.winW < 1024
    },
    loopTriggerPt () {
      return this.loopMobile ? this.scrollHt - this.winH
        : this.scrollHt - this.loopElHt
    },
    loopBasis () {
      return this.loopMobile ? this.scrollHt : this.loopTriggerPt
    },
    loopImage () {
      const slice0 = this.firstProject?.data.body[0]
      const imgKey = slice0 && Object.keys(slice0.primary).find(key => key.includes('image')) // "image" field
      const img = imgKey && slice0.primary[imgKey]
      return this.$store.getters.is('portrait') && img?.portrait?.url ? img.portrait : img
    },
    firstProject () {
      return this.projectsFeed && this.projectsFeed[0]
    }
  },

  methods: {
    ...mapMutations(['setTitle']),
    onLandingRatio (ratio) {
      if (this.intro) return
      requestAnimationFrame(() => {
        // update opacity
        // this.logoOpacity = ratio
        this.logoOpacity = ratio > 0 ? 1 : 0
        // isLanding (for updating title)
        this.isLanding = ratio > 0
      })
    },
    onScroll () {
      this.loopOnScroll()
    },
    loopOnScroll () {
      /*
       * Scroll Loop - (https://github.com/JosephSmith127/vue-loop)
       * - mobile: loop el is 100vh, with fixed bg to prevent flicker
       * - desktop: loop el is 150 to prevent inertia bounce
      */
      const y = window.pageYOffset
      const trigger = this.loopTriggerPt
      if (y < trigger) {
        return
      } else if (y > trigger) {
        // if y exceeds this calculation will jump it to the proper place
        window.scroll(0, y % this.loopBasis)
      } else if (y === trigger) {
        // if y reads exact, jump to 0 pos (-1 for Safari to try to prevent flicker)
        window.scroll(0, 0)
      }
      // on loop
      this.setTitle()
    },
    lockScroll (lock, y) {
      if (lock) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
        if (y) {
          window.scrollTo(0, y) // jump to saved pos
        }
      }
    },
    measure () {
      this.$nextTick(() => {
        const set = (val, old, commit) => val !== old && this.$store.commit(commit, val)
        this.scrollHt = document.body.scrollHeight
        this.loopElHt = this.$refs.loopEl?.offsetHeight
        set(window.innerHeight, this.winH, 'setWinH')
        set(window.innerWidth, this.winW, 'setWinW')
      })
    },
    onResize: throttle(function () {
      this.measure()
      clearTimeout(afterResize)
      afterResize = setTimeout(() => this.measure(), 200)
    }, 50),
    openProjectsModal () {
      this.projectsModal = true
      setTimeout(() => this.lockScroll(true), 300) // after animation
    },
    closeProjectsModal ({ url, title }) {
      // scroll to image based on url...
      let y
      const el = url && this.$el.querySelector(`figure[data-menu-image="${url}"]`)
      if (el) {
        // vertically center the image if less than winH
        const offset = el.offsetHeight < this.winH ? (this.winH - el.offsetHeight) / -2
          : 0
        const scrollTop = window.pageYOffset || this.$el.scrollTop // if locked, should be $el
        // calc scroll-to
        y = el.getBoundingClientRect().top + scrollTop + offset
      }
      // unlock and scroll to element !
      this.lockScroll(false, y)
      // set title
      this.setTitle(title)
      // reveal
      setTimeout(() => {
        this.projectsModal = false
      }, 150)
    },
    onLandingActive (active) {
      if (!active) {
        // update to first project's title
        return this.firstProject && this.setTitle(this.$prismic.asText(this.firstProject.data.title))
      }
      // reset to default title (landing)
      return this.setTitle()
    }
  },

  // lifecycle
  mounted () {
    this.measure()
    window.addEventListener('scroll', this.onScroll)
    window.addEventListener('resize', this.onResize)
  },
  watch: {
    intro () {
      this.measure()
    },
    isLanding (active) {
      this.onLandingActive(active)
    },
    logoOpacity (val) {
      // emit for slice blur imageset / landing logic
      this.$root.$emit('logoOpacity', val)
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('focus', this.measure)
    window.removeEventListener('resize', this.onResize)
  },

  components: { AppHeader, Info, Observer, BlurLayer, ProjectsFeed, RespImg, ProjectsMenuOverlay }
}
</script>

<style>

.info-enter-active{
  transition: transform 550ms 210ms cubic-bezier(0,0.55,0.45,1); /* https://easings.net/en#easeInOutCirc */
  /* slow end: cubic-bezier(.15,.51,.31,1)*/
}
.info-enter{
  transform: translateY(100%);
}
</style>
