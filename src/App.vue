<template lang="pug">
  #app
    router-view
</template>

<script>
import '@/style/main.css'
export default {
  name: 'App',
  created () {
    this.$store.dispatch('getDocs')
  },
  mounted () {
    window.scroll(0, 0)
  }
}
</script>

<style>
html,body{
  /*causes flashes in Safari on scroll loop */
  /*scroll-snap-type: y proximity;*/
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* fix transforms bouncing */
  -webkit-backface-visibility: hidden;
}

*{
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
</style>
