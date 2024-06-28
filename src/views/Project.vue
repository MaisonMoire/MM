<template lang="pug">
  article.project.relative(:id="doc.uid")
    h2.sr-only {{ $prismic.asText(doc.data.title) }}
    //- content
    slice-body(:slices="doc.data.body", :prjNo="prjNo")
    //- (title observer (top))
    observer.absolute.left-0.w-px.h-px(v-if="prjNo", style="top:100vh", @visible="setTitle($prismic.asText(doc.data.title))")
    //- title observer (bottom)
    observer.absolute.bottom-0.left-0.w-px.h-px(@visible="setTitle($prismic.asText(doc.data.title))")

    //- !!! RANDOM ELEMENTS THAT ARE REQUIRED FOR SAFARI !!!!  DON'T DELETE !!!
    //- otherwise project 2 blur bg layer erroneously sits on top :(((( #fuck-safari
    //- literally no explanation... but i guess having another sticky layer keeps it correct?
    .absolute.w-full.h-full.top-0.left-0.pointer-events-none
      .sticky.h-screen.top-0.left-0.w-full
    //- !!! END RANDOM ELEMENTS !!!!
</template>

<script>
import { mapMutations } from 'vuex'
import SliceBody from '@/components/SliceBody'
import Observer from '@/components/Observer'
export default {
  name: 'Project',
  props: ['doc', 'prjNo'],
  methods: {
    ...mapMutations(['setTitle'])
  },
  components: { SliceBody, Observer }
}
</script>

<style>
</style>
