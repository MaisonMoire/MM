/** Function to resize a Prismic/Imgix image **/

const sizes = [320, 480, 640, 800, 1024, 1280, 1440, 1600, 1920, 2400, 3200, 4096, 5120]

function optimImgSize (length) {
  const dpx = window.devicePixelRatio || 1
  length = parseInt(length * dpx * 0.8) // less density optically ok ?
  // find optimal
  const optimal = sizes.find(sz => length <= sz)
  // use optimal otherwise largest src
  return optimal || sizes[sizes.length - 1]
}

export default (src, size = [], blur = 0) => {
  if (!src) { return console.warn('No src provided') }
  if (!size) { return src }
  // new specs
  const w = size[0] && optimImgSize(size[0])
  const h = size[1] && optimImgSize(size[1])
  try {
    src = new URL(src)
  } catch (e) {
    console.error(e)
  }
  // original specs
  const w0 = src.searchParams.get('w')
  const h0 = src.searchParams.get('h')
  // edit/set params
  if (w) {
    src.searchParams.set('w', w)
    // preserve aspect ratio ?
    if (h0 && w0) {
      src.searchParams.set('h', parseInt(w * h0 / w0))
    }
  }
  if (h) {
    src.searchParams.set('h', h)
    // preserve aspect ratio ?
    if (w0 && h0) {
      src.searchParams.set('h', parseInt(h * w0 / h0))
    }
  }
  // blur ?
  if (blur) src.searchParams.set('blur', blur)
  //
  return src.href
}
