<template lang="pug">
  //- z-10 so it's always above SliceBlurImageSet sticky layer (which has top:-100vh...)
  .slice-image-diptych.lg_flex.relative.z-10
    figure.w-full.lg_w-1x2.h-screen.relative(v-for="(item, i) in slice.items", v-if="i < 2", :data-menu-image="item.image.url")
      resp-img(:bg="true", :image="item.image")
</template>

<script>
import RespImg from '@/components/RespImg'
export default {
  name: 'SliceImageDiptych',
  props: {
    slice: { type: Object, default: () => ({}) }
  },
  components: { RespImg }
}
</script>

<style>
</style>
