<template lang="pug">
  .client.min-h-screen.bg-black.text-white.flex.flex-col.px-20.text-base.md_text-lg(v-if="doc")
    //- heading
    h1.absolute.top-0.left-0.w-full.sm_flex.justify-between.p-20
      span.sm_w-1x2.uppercase.md_normal-case {{ $prismic.asText(doc.data.title1) }}
      br.sm_hidden
      span.sm_w-1x2 {{ $prismic.asText(doc.data.title2) }}
    //- close btn
    button.absolute.top-0.right-0.p-20.focus_outline-none(@click="close")
      svg-x(style="height:1em;width:1em")
    //- assets table
    section.flex-1.flex.items-center.py-80
      //- (portrait list)
      ul.md_hidden.text-sm.w-full.text-gray-500
        template(v-for='n in 1')
          li.my-60(v-for="asset in doc.data.assets")
            prismic-link.border-t.border-b.border-white.block(:field="asset.primary.download_link", target="_blank")
              .pt-6.pb-12
                .uppercase.leading-none.mb-10 Title
                .text-white.text-base {{ asset.primary.title }}
              ul.pt-6.pb-15.border-t.border-current.flex.uppercase.justify-between.leading-none
                li.pr-10
                  .mb-12 Date
                  .text-white {{ asset.primary.date.replaceAll('-', '.') }}
                li.pr-10
                  .mb-12 Profile
                  .text-white {{ asset.primary.profile }}
                li.pr-10
                  .mb-12 Format
                  .text-white {{ asset.primary.format }}
                li
                  .mb-12 Download
                  .text-white ↴

      //- (landscape table)
      table.hidden.md_table.w-full
        colgroup
          col.w-1x3.lg_w-1x2
          col
          col
          col
          col(style="width:.1%;white-space:no-wrap")
        thead.text-gray-500
          tr.border-b
            td.py-12
              btn-sort(sortby='title') Title
            td
              btn-sort(sortby='date') Date
            td
              btn-sort(sortby='profile') Profile
            td.pr-12
              btn-sort(sortby='format') Format
            td
              .md_hidden &nbsp;
              .hidden.md_inline Download
        tbody
          tr.border-b.cursor-pointer(v-for="(asset, i) in assetsSorted", @click="onRowClick(i)", ref="row")
            td.py-12.pr-12 {{ asset.primary.title }}
            td.pr-12 {{ formatDate(asset.primary.date) }}
            //- asset.primary.date.replaceAll('-', '.') }}
            td.pr-12 {{ asset.primary.profile }}
            td.pr-12 {{ asset.primary.format }}
            td
              prismic-link(:field="asset.primary.download_link", target="_blank") ↴

</template>

<script>
import BtnSort from "@/components/BtnSort";
import svgX from "@/components/icons/SVG-X";
export default {
  name: "ClientDoc",
  data() {
    return {
      doc: null,
    };
  },
  computed: {
    assetsSorted() {
      // pull key from sort route query ("date-desc")
      const key = this.$route.query.sort?.split("-")[0];
      if (!key) return this.doc.data.assets;
      // sort by key asc/desc
      const assets = [...this.doc.data.assets];
      const isDesc = this.$route.query.sort.includes("desc");
      const val = (asset) => asset.primary[key];
      assets.sort((a, b) => (val(a) < val(b) ? -1 : val(a) > val(b) ? 1 : 0));
      if (isDesc) assets.reverse();
      return assets;
    },
  },
  methods: {
    close() {
      sessionStorage.removeItem("client-doc");
      this.$router.replace("/login");
    },
    onRowClick(i) {
      return this.$refs.row[i].querySelector("a")?.click();
    },
    formatDate(date) {
      if (date) {
        date = new Date(date); // .toLocaleString('en-GB')
        const num = (val) => ("0" + val.toString()).slice(-2);
        date = `${num(date.getDate())}.${num(date.getMonth() + 1)}.${num(
          date.getFullYear()
        )}`;
      }
      return date;
    },
  },
  created() {
    this.doc = JSON.parse(sessionStorage.getItem("client-doc"));
    if (!this.doc) return this.$router.replace("login");
  },
  async mounted() {
    document.body.style.overflow = "";
  },
  components: { BtnSort, svgX },
};
</script>

<style></style>
