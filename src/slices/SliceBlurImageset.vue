<template lang="pug">
  .slice-blur-imageset.relative
    //- sticky background layer
    //- * image should already be present on entry
    //- * but scroll off at the bottom
    .absolute.w-full.left-0(style="height:calc(100% + 100vh); top:-100vh;")
      .sticky.w-full.left-0.top-0.h-screen.overflow-hidden
        //- blurred image
        //- * invisible if logo is visible (for proper z layering)
        .absolute.-top-px.left-0.w-full.h-110vh.transition-opacity.duration-300(:class="{'opacity-0': logoOpacity && isLanding}")
          resp-img(:bg="true", :lazy="false", :image="bgImage", :blur="200", :key="bgImage.url")

    //- content
    .relative.z-30
      //- items
      //- * mobile: "modules" have mt-140, mb-70 for slice end margin
      //- * if landing slice, negate first modules's top margin... (so first image's top edge scrolls in right away)
      .lg_flex.flex-wrap.px-17.md_px-70.lg_px-35.py-px(:class="{'-mt-140': isLanding}")
        //- items...
        template(v-for="(item, i) in slice.items")

          //- 2-up guttered
          template(v-if="item.width === 'half'")
            figure.w-full.lg_w-1x2.lg_px-35.mb-70.lg_my-140(:data-type="item.width", :class="{'mt-140': prevItem(i).width !== 'half', 'mb-140': nextItem(i).width !== 'half'}", :data-menu-image="item.image.url")
              resp-img.w-full(:image="item.image")
          //- 3-up guttered
          template(v-else-if="item.width === 'third'")
            figure.w-full.lg_w-1x3.lg_px-35.flex.items-center.mb-70.lg_my-140(:data-type="item.width", :class="{'mt-140': prevItem(i).width !== 'third', 'mb-140': nextItem(i).width !== 'third'}", :data-menu-image="item.image.url")
              resp-img.w-full(:image="item.image")

          //- diptych (left)
          template(v-else-if="item.width === 'diptych-left'")
            figure.w-full.lg_w-1x2.lg_py-35.lg_min-h-screen.flex.items-center.justify-end.lg_pl-35.mt-140.mb-70.lg_my-140(:data-type="item.width", :data-menu-image="item.image.url")
              resp-img.w-full(:image="item.image")
          //- diptych (right)
          template(v-else-if="item.width === 'diptych-right'")
            figure.w-full.lg_w-1x2.lg_py-35.lg_min-h-screen.flex.items-center.justify-start.lg_pr-35.mb-140.lg_my-140(:data-type="item.width", :data-menu-image="item.image.url")
              resp-img.w-full(:image="item.image")

          //- full (no margins)
          //- * width is padded, with negative margin to cancel wrapper padding-x
          //- * negative margin-bottom if next item is "no margins"
          template(v-else-if="item.width === 'full (no margins)'")
            figure.w-full.-my-px.mb-140(:data-type="item.width", :class="{'mt-140': i > 0}", :data-menu-image="item.image.url")
              .w-full_34.-ml-17.md_w-full_140.md_-ml-70.lg_w-full_70.lg_-ml-35
                resp-img.w-full(:image="item.image")

          //- diptych-left (no margins)
          //- * half-width frame
          //- * inner-cell width is padded, with negative margin to cancel wrapper padding-l
          template(v-else-if="item.width === 'diptych-left (no margins)'")
            figure.w-full.lg_w-1x2.-my-px(:data-type="item.width", :class="{'mt-140': i > 0}", :data-menu-image="item.image.url")
              //- inner-cell
              .w-full_34.-ml-17.md_w-full_140.md_-ml-70.lg_w-full_35.lg_-ml-35.lg_h-screen.relative
                resp-img.lg_hidden(:image="item.image")
                resp-img.hidden.lg_block(:bg="true", :image="item.image")
          //- diptych-right (no margins)
          //- * half-width frame
          //- * inner-cell width is padded to cancel wrapper padding-r
          template(v-else-if="item.width === 'diptych-right (no margins)'")
            figure.w-full.lg_w-1x2.-my-px(:data-type="item.width", :class="{'lg_mt-140': i > 1, 'mb-140': nextItem(i).width.length}", :data-menu-image="item.image.url")
              //- inner-cell
              .w-full_34.-ml-17.md_w-full_140.md_-ml-70.lg_w-full_35.lg_ml-0.lg_h-screen.relative
                resp-img.lg_hidden(:image="item.image")
                resp-img.hidden.lg_block(:bg="true", :image="item.image")

          //- "full" (with margins) - default
          template(v-else)
            figure.w-full.lg_px-140.my-140(:data-type="item.width", :data-menu-image="item.image.url")
              resp-img(:image="item.image")
</template>

<script>
import { mapGetters } from 'vuex'
import RespImg from '@/components/RespImg'
export default {
  name: 'SliceBlurImageset',
  props: {
    slice: { type: Object, default: () => ({}) },
    isLanding: { type: Boolean, default: false }
  },
  data () {
    return {
      logoOpacity: 1
    }
  },
  computed: {
    ...mapGetters(['is']),
    bgImage () {
      const bgImage = this.slice?.primary?.bg_image
      return this.is('portrait') && bgImage?.portrait?.url ? bgImage.portrait : bgImage
    }
  },
  methods: {
    prevItem (i) {
      return this.slice.items[i - 1] ?? { width: '' }
    },
    nextItem (i) {
      return this.slice.items[i + 1] ?? { width: '' }
    }
  },
  created () {
    this.$root.$on('logoOpacity', val => {
      if (this.isLanding) {
        this.logoOpacity = val
      }
    })
  },
  components: { RespImg }
}
</script>

<style>
</style>
