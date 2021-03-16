<template>
  <div class="html-block" v-html="html"></div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import hljsDefineVue from 'highlightjs-vue'
import 'highlight.js/styles/atom-one-dark.css'

hljsDefineVue(hljs)

export default {
  data() {
    return { html: this.getHTML() }
  },
  methods: {
    getHTML() {
      return marked(DOC)
    }
  },
  mounted() {
    this.$nextTick(() => {
      hljs.highlightAll()
    })
  }
}
</script>

<style lang="less" scoped>
.html-block {
  width: 1000px;
  margin: auto;

  ::v-deep {
    pre {
      background: #0e1116;
      color: #eeeeee;
      padding: 20px;
      border-radius: 8px;

      code {
        padding: 0;
        background: transparent;
      }
    }

    code {
      background: #2e2a2e;
      color: #eee;
      padding: 2px 8px;
      border-radius: 4px;
    }

    img {
      max-width: 100%;
    }
  }
}
</style>
