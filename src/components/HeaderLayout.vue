<template lang="pug">
  .header-layout.flex.justify-between.items-start.text-base.tracking-normal.md_text-2xl.font-serif.px-17.py-12.md_px-20.md_py-16
    slot(name="title")
    slot(name="button")
</template>

<script>
export default {
  name: 'HeaderLayout'
}
</script>

<style>
</style>
