<template>
  <div class="home">
    <div class="icons">
      <div class="header">
        <h2>
          图标列表
        </h2>

        <div class="actions">
          <a-input placeholder="输入图标名搜索..." v-model="keywords" />
          <a-dropdown>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="onAddIcon(0)">
                添加单色图标
              </a-menu-item>
              <a-menu-item key="1" @click="onAddIcon(1)">
                添加多色图标
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              <a-icon type="plus" /> 添加图标
            </a-button>
          </a-dropdown>
        </div>
      </div>
      <div class="list">
        <sprite
          v-for="icon in filtedIcons"
          :key="icon.name"
          :sprite="icon"
          @refresh="init"
        />
      </div>
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
import { message } from 'ant-design-vue'
import http from '@/utils/http'
import { copy } from '@/utils/common'
import Sprite from './components/sprite'

const iconScriptId = 'ICON_SCRIPT'

export default {
  components: { Sprite },
  data() {
    return {
      icons: [],
      currentType: 0,
      keywords: ''
    }
  },
  computed: {
    filtedIcons() {
      return this.icons.filter(i => i.name.indexOf(this.keywords) > -1)
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getIcons()
      this.appendIconScript()
    },
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
      this.$refs.fileInput.value = ''
      const res = await http.post('/sprites', formData)
      if (res.data === 'ok') {
        this.init()
        message.success('添加成功')
      } else {
        message.success('添加失败')
      }
    },
    onCopy(event, text) {
      copy(event, text)
    },
    appendIconScript() {
      const s = document.querySelector(`#${iconScriptId}`)
      if (s) {
        document.body.removeChild(s)
      }
      const ns = document.createElement('script')
      ns.id = iconScriptId
      ns.src = '/svg-sprite.js'
      document.body.appendChild(ns)
    }
  }
}
</script>
<style lang="less" scoped>
.icons {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
      margin: 0;
    }

    .ant-input {
      width: 300px;
    }
  }

  .list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
