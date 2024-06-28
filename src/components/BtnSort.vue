<template lang="pug">
  button.focus_outline-none.flex.items-center(@click="sort(sortby)")
    slot
    span.block.transform.opacity-0.ml-8(:class="{'opacity-100': isActive, '-scale-y-100': isDesc}", style="font-size:0.85em") ↑
</template>

<script>
export default {
  name: 'ButtonSort',
  props: ['sortby'],
  computed: {
    isActive () {
      return this.$route.query?.sort?.split('-')[0] === this.sortby
    },
    isDesc () {
      return this.$route.query?.sort?.split('-')[1] === 'desc'
    }
  },
  methods: {
    sort (key) {
      const qry = this.$route.query
      const sort =
        // no sort or diff key > add key (ascending)
        !qry.sort || qry.sort.split('-')[0] !== key ? key // new key
        // same key > switch to descending
          : !qry.sort.split('-')[1] ? key + '-desc'
          // remove key (default)
            : undefined

      return this.$router.replace({ query: { sort } })
    }
  }
}
</script>

<style>
</style>
