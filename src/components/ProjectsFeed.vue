<template lang="pug">
  .projects-feed
    //- add z-index (lower index = higher z) to prevent sliceblurimageset__bg overlaps from negative top
    project(v-for="(doc, i) in docs", :doc="doc", :prjNo="i", :key="doc.id", :style="{zIndex: docs.length - i}")
</template>

<script>
import Project from '@/views/Project'
export default {
  name: 'ProjectsFeed',
  props: ['docs'],
  components: { Project }
}
</script>

<style>
</style>
