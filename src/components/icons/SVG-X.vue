<template lang="pug">
svg.block
  line(x1="5%", y1="5%", x2="95%", y2="95%", stroke="currentColor", stroke-width="1", stroke-linecap="butt")
  line(x1="5%", y1="95%", x2="95%", y2="5%", stroke="currentColor", stroke-width="1", stroke-linecap="butt")
</template>

<script>
export default {
  name: 'SVG-X'
}
</script>
