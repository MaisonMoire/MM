<template lang="pug">
  .resp-img(:class="{'relative': !bg}", :style="{paddingBottom: !bg && `${dims.height / dims.width * 100}%`}", v-if="image")
    //- modern browsers load srcset instead of src
    //- lazysizes will load data-srcset when visible
    img.absolute.h-full.w-full.top-0.left-0(ref="img", :class="[fit, {'lazyload': lazy}]", :src="resizeImgix(image.url, [800], blur)", :srcset="!lazy ? thumb : '/loading.gif'", :data-srcset="thumb", data-sizes="auto", :alt="image.alt", @click="$emit('click')", data-expand="4000")
</template>

<script>
// import resize from '@/plugins/thumb'
export default {
  name: 'RespImg',
  props: {
    image: { type: Object, default: undefined },
    bg: { type: Boolean, default: false },
    fit: { type: String, default: 'object-cover object-center' },
    // ratio: { type: Number, default: 0 },
    blur: { type: Number, default: 0 },
    lazy: { type: Boolean, default: true }
  },
  data () {
    return {
      thumb: ''
    }
  },
  computed: {
    dims () {
      return this.image.dimensions || { height: this.image.height, width: this.image.width }
    }
  },
  methods: {
    resizeImgix,
    getSizeByFit () {
      /*
       * Resize image src based on asset's aspect-ratio (AR) against <img> element's dimensions
      */
      const nativeAR = this.dims && this.dims.width / this.dims.height // 2x3 = 0.66
      // frame details (fallback to window for hidden images, like in lightbox)
      const frameW = this.$refs.img?.offsetWidth || window.innerWidth
      const frameH = this.$refs.img?.offsetHeight || window.innerHeight
      const frameAR = frameW / frameH // W x H (4x3 > 1.5)
      // conditions for sizing by height...
      const isBgContain = this.bg && this.fit.includes('object-contain')
      const resizeByHeight = (isBgContain && nativeAR < frameAR) || (this.bg && nativeAR > frameAR)
      // size by height or width ?
      const size = resizeByHeight ? [null, frameH] : [frameW]
      return size
    }
  },
  mounted () {
    const size = this.getSizeByFit()
    // adjust for blur: boost height when bg b/c imgix has pixelation
    if (this.bg && size[1] && this.blur) {
      size[1] = size[1] * 1.5
    }
    // resize !
    this.thumb = resizeImgix(this.image.url, size, this.blur)
  }
}

// find image size
export function optimImgLength (length, isBlur) {
  const sizes = [320, 480, 640, 800, 1024, 1280, 1440, 1600, 1920, 2400, 3200, 4096, 5120]
  const dpx = window.devicePixelRatio || 1
  // optimize length ?
  length = dpx > 1 && !isBlur ? length * dpx * 0.75 // less density optically ok for hi dpi screens ?
    : length * dpx * 0.95 // less reduction for 1dpx screens or if blur (because pixelation)
  // find optimal
  return sizes.find(sz => length <= sz) || sizes[sizes.length - 1]
}

// Imgix resizer (Prismic)
export function resizeImgix (src, size = [], blur = 0) {
  if (!src || !size) return src // { return console.warn('No src provided:', src) }
  try {
    src = new URL(src)
  } catch (e) {
    console.error(e)
  }
  // original specs
  const w0 = src.searchParams.get('w')
  const h0 = src.searchParams.get('h')
  // new specs
  const w1 = size[0] && optimImgLength(size[0], blur > 0)
  const h1 = size[1] && optimImgLength(size[1], blur > 0)
  // set new width?
  if (w1) {
    src.searchParams.set('w', w1)
    // preserve aspect ratio ?
    if (h0 && w0) {
      // set height as ratio of original specs against new width
      src.searchParams.set('h', parseInt(w1 * h0 / w0))
    }
  }
  // set new height?
  if (h1) {
    src.searchParams.set('h', h1)
    // preserve aspect ratio ?
    if (w0 && h0) {
      // set width as ratio of original specs against new height
      src.searchParams.set('w', parseInt(h1 * w0 / h0))
    }
  }
  // debug
  // console.log([w0, h0], size, [w1, h1], [src.searchParams.get('w'), src.searchParams.get('h')])

  // color space: restore srgb since ?auto=compress removes it...
  src.searchParams.set('cs', 'srgb')

  // blur ?
  if (blur) src.searchParams.set('blur', blur)

  return src.href
}
</script>

<style>
/* lazysizes - fade in on loaded*/
:not(.no-lazyload-anim) {
  &.lazyload,
  &.lazyloading {
    opacity: 0;
  }
  &.lazyloaded {
    opacity: 1;
    transition: opacity 300ms;
  }
}
</style>

<!--
lazysizes loaded image, using "modern srcset" approach
* https://github.com/aFarkas/lazysizes#modern-transparent-srcset-pattern
-->
