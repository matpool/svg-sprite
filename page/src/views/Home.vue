<template>
  <div class="home">
    <h2>单色图标</h2>
    <div class="icons">
      <div
        class="icon"
        v-for="(icon, index) in normal"
        :key="index"
        @click="onCopy($event, icon.name)"
      >
        <svg aria-hidden="true">
          <use :xlink:href="`#${icon.name}`"></use>
        </svg>
        <p>{{ icon.name }}</p>
      </div>
      <div class="icon add" @click="onAddIcon(0)">+</div>
    </div>

    <h2>多色图标</h2>
    <div class="icons">
      <div
        class="icon"
        v-for="(icon, index) in colorful"
        :key="index"
        @click="onCopy($event, icon.name)"
      >
        <svg aria-hidden="true">
          <use :xlink:href="`#${icon.name}`"></use>
        </svg>
        <p>{{ icon.name }}</p>
      </div>
      <div class="icon add" @click="onAddIcon(1)">+</div>
    </div>

    <input
      type="file"
      style="display: none"
      ref="fileInput"
      accept=".svg"
      multiple
      @change="onFileChange"
    />
  </div>
</template>

<script>
import http from '@/utils/http'
import { copy } from '@/utils/common'

export default {
  data() {
    return {
      icons: [],
      currentType: 0
    }
  },
  computed: {
    normal() {
      return this.icons.filter(i => !i.colorful)
    },
    colorful() {
      return this.icons.filter(i => i.colorful)
    }
  },
  created() {
    this.init()
  },
  methods: {
    async getIcons() {
      const res = await http.get('/sprites')
      this.icons = res.data
    },
    onAddIcon(type) {
      this.currentType = type
      this.$refs.fileInput.click()
    },
    async onFileChange() {
      const files = this.$refs.fileInput.files
      if (!files.length) {
        return
      }
      const formData = new FormData()
      ;[...files].forEach(f => formData.append('files', f))
      formData.append('type', this.currentType)

      const res = await http.post('/sprites', formData)
      if (res.data === 'ok') {
        this.init()
      }
    },
    init() {
      this.appendIconScript()
      this.getIcons()
    },
    appendIconScript() {
      const id = 'iconScript'
      const s = document.querySelector(`#${id}`)
      if (s) {
        document.body.removeChild(s)
      }

      const ns = document.createElement('script')
      ns.id = id
      ns.src = './svg-sprite.js'
      document.body.appendChild(ns)
    },
    onCopy(event, text) {
      copy(event, text)
    }
  }
}
</script>
<style lang="less" scoped>
.icons {
  display: flex;
  flex-wrap: wrap;
  font-size: 48px;
}
.icon {
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 16px;
  margin: 10px 0;
  box-sizing: border-box;
}
.icon:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
svg {
  width: 1em;
  height: 1em;
}
p {
  width: 100%;
  text-align: center;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 12px;
  margin-bottom: 0;
}
.add {
  border: 1px solid rgba(0, 0, 0, 0.65);
  font-size: 28px;
  width: 80px;
  height: 80px;
  border-radius: 4px;
  margin: 20px 0 0 20px;
}
</style>
