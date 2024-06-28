<template lang="pug">
  //- overlay as <dialog>
  dialog.projects-menu-overlay.fixed.overlay.p-0.z-40.text-black.flex.flex-col.bg-transparent(open, @keydown.esc="$emit('close')")
    //- header
    header.absolute.w-full.z-10(:class="{'hidden': !visible}")
      header-layout
        //- title active
        h6.focus_outline-none.whitespace-pre-line.md_whitespace-normal(slot="title", tabindex="0") {{ linebreak(hoverTitle || title) }}
        //- close btn
        button.focus_outline-none.uppercase(slot="button", @click="$emit('close')") Close

    //- projects' images scroll
    nav.bg-white.flex-1.flex.flex-col.overflow-hidden.transition.transform.duration-300(role="navigation", :class="{'opacity-0 scale-110': !visible}")
      //- scroll body (x or y)
      ul.flex-1.h-full.text-center.w-full.py-90.md_pr-20.md_py-0.md_flex.items-center.overflow-scroll.scrollbars-hidden(ref="scrollbody", :style="{'scroll-snap-type': snap ? 'x mandatory' : 'none'}", @scroll="changeTitleOnScroll")
        //- item wrapper (long row)
        .md_whitespace-no-wrap.transition-transform.transform.duration-300(ref="itemswrapper", @mousemove="onMousemove", @mouseleave="pan = null")
          //- (extra x-scroll items)
          .hidden.md_inline-block.scroll-snap-start.md_w-20vw_-0375
          .hidden.md_inline-block.scroll-snap-start.md_w-20vw_-0375

          //- images...
          li.md_inline-block.scroll-snap-start.w-2x3.mb-24.mx-auto.md_m-0(v-for="(item, i) in images", :data-title="item.title", :class="isPrt(item) ? 'md_w-20vw_-0375' : 'md_w-40vw_-075'", :data-i="i")
            figure.block.pl-20.focus_outline-none(role="button", tabindex="0", @click="$emit('jump', {url: item.image.url, title: item.title})", @mouseenter="hoverTitle = item.title", @mouseleave="hoverTitle = null", :aria-label="`Scroll to ${item.title}`")
              //- height based on padding, md: height set from vw
              .relative.md_p-0.md_h-menu-item.rounded.overflow-hidden(:class="isPrt(item) ? 'pb-ar-4x5' : 'pb-ar-menu-item-lnd'")
                resp-img(:bg="true", :lazy="false", :image="item.image")

          //- (extra x-scroll items)
          .hidden.md_inline-block.scroll-snap-start.md_w-20vw_-0375
          .hidden.md_inline-block.scroll-snap-start.md_w-20vw_-0375

</template>

<script>
import { mapState, mapGetters } from 'vuex'
import HeaderLayout from '@/components/HeaderLayout'
import RespImg from '@/components/RespImg'
import throttle from 'lodash/throttle'
let prevFocus, imgs
export default {
  name: 'ProjectsMenuOverlay',
  props: {
    projects: { type: Array, default: () => ([]) },
    visible: { type: Boolean, default: false }
  },
  data () {
    return {
      hoverTitle: null,
      images: [],
      pan: null,
      canPan: false,
      anim: null,
      snap: false, // disable if using autoscroll...
      itemsEls: null
    }
  },
  computed: {
    ...mapState(['title', 'winH']),
    ...mapGetters(['linebreak', 'is'])
  },
  mounted () {
    this.setImages()
  },
  watch: {
    visible (vis) {
      return vis ? this.onVisible() : this.onHidden()
    },
    projects () {
      this.setImages()
    },
    pan (pan) {
      this.autoScrollLeft()
    }
  },
  methods: {
    setImages () {
      const images = []
      const add = (image, prj) => images.push({ image, title: this.$prismic.asText(prj.data.title) })
      // loop through each project
      this.projects.forEach(prj => {
        // collect images from slices
        prj.data.body.forEach(slice => {
          // primary images
          if (slice.primary.image?.url) {
            add(slice.primary.image, prj)
          }
          // items images...
          if (slice.items?.length) {
            slice.items.forEach(item => item.image?.url && add(item.image, prj))
          }
        })
      })
      this.images = images
    },
    changeTitleOnScroll: throttle(function () {
      if (!this.is('md')) {
        // collect els
        if (!this.itemsEls) {
          this.itemsEls = Array.from(this.$refs.itemswrapper.children)
        }
        // find active el
        const activeEl = this.itemsEls.find(el => {
          // bottom is past screen middle screen height...
          return el.getBoundingClientRect().bottom >= this.winH / 2
        })
        const title = activeEl && activeEl.getAttribute('data-title')
        if (title) {
          this.hoverTitle = title
        }
      }
    }, 100),
    onVisible () {
      // tab focus
      prevFocus = document.activeElement
      this.$nextTick(() => this.$el.querySelector('[tabindex]') && this.$el.querySelector('[tabindex]').focus())
      // scroll interactions
      this.scrollMenuToImage()
      setTimeout(() => { this.canPan = true }, 700) // after transition
    },
    onHidden () {
      this.canPan = false
      if (prevFocus) prevFocus.focus()
    },
    scrollMenuToImage () {
      this.$nextTick(() => {
        imgs = imgs ?? document.body.querySelectorAll('figure[data-menu-image]')
        let ii = -1
        const winH = window.innerHeight
        // find <img> in view
        for (var i = 0; i < imgs.length; i++) {
          // bottom edge is below window middle
          if (imgs[i].getBoundingClientRect().bottom >= winH * 0.5) {
            ii = i
            break
          }
        }
        // scroll menu to item
        if (ii > -1) {
          const item = this.$refs.itemswrapper.querySelector(`li[data-i="${ii}"]`)
          if (item) {
            const box = item.getBoundingClientRect()
            const scrollbody = this.$refs.scrollbody
            // account for any .scale-110 !!! by dividing by the scale factor
            // then subtract space to center image
            const newLeft = scrollbody.scrollLeft + box.left / 1.1 - (window.innerWidth - box.width) / 2
            const newTop = scrollbody.scrollTop + box.top / 1.1 - (window.innerHeight - box.height) / 2
            // scroll !
            scrollbody.scroll(newLeft, newTop)
          }
        }
      })
    },
    isPrt (item) {
      return item.image.dimensions.height > item.image.dimensions.width * 1.1
    },
    onMousemove (e) {
      // when hovering over right and left edge, pan the left/right scroll via translate-x
      if (this.is('md') && e.pageY > 100) {
        const pct = e.pageX / window.innerWidth
        this.pan = pct <= 0.2 && pct > 0.01 ? 'left'
          : pct >= 0.8 && pct < 0.99 ? 'right' : null
      } else {
        this.pan = null
      }
    },
    autoScrollLeft () {
      if (!this.pan || !this.canPan || !this.is('md')) {
        cancelAnimationFrame(this.anim)
        return
      }
      const incr = this.pan === 'left' ? -1 : 1
      this.anim = requestAnimationFrame(() => {
        const scrollbody = this.$refs.scrollbody
        const newLeft = scrollbody.scrollLeft + (incr * 8)
        scrollbody.scroll(newLeft, 0)
        this.autoScrollLeft()
      })
    }
  },
  components: { HeaderLayout, RespImg }
}
</script>

<style>
</style>
