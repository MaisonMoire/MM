<template lang="pug">
  section.slice-body
    component(v-for="(slice, i) in slices", v-if="has(slice)", :is="'slice--' + slice.slice_type", :slice="slice", :index="i", v-on="$listeners", :isLanding="!prjNo && !i", :key="`prj${prjNo}slice${i}`")
</template>

<script>
import SliceBlurImageset from '@/slices/SliceBlurImageset'
import SliceImageFull from '@/slices/SliceImageFull'
import SliceImageDiptych from '@/slices/SliceImageDiptych'
export default {
  name: 'SliceBody',
  props: {
    slices: { type: Array, default: () => ([]) },
    prjNo: { type: Number, default: -1 }
  },
  methods: {
    has (slice) {
      return this.$options.components['slice--' + slice.slice_type]
    }
  },
  components: {
    'slice--blur_imageset': SliceBlurImageset,
    'slice--image_full': SliceImageFull,
    'slice--image_diptych': SliceImageDiptych
  }
}
</script>

<style>
</style>
