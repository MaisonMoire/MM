<template lang="pug">
  //- z-10 so it's always above SliceBlurImageSet sticky layer (which has top:-100vh...)
  figure.slice-image-full.relative.z-10(:data-menu-image="slice.primary.image.url")
    resp-img(:image="slice.primary.image")
</template>

<script>
import RespImg from '@/components/RespImg'
export default {
  name: 'SliceImageFull',
  props: {
    slice: { type: Object, default: () => ({}) }
  },
  components: { RespImg }
}
</script>

<style>
</style>
