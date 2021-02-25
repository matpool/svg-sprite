const app = new Vue({
  el: '#app',
  data: {
    icons: [],
    currentType: 0,
  },
  computed: {
    normal() {
      return this.icons.filter((i) => !i.colorful)
    },
    colorful() {
      return this.icons.filter((i) => i.colorful)
    },
  },
  created() {
    this.init()
    console.log(antd.message)
  },
  methods: {
    async getIcons() {
      const res = await axios.get('/api/sprites')
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
      ;[...files].forEach((f) => formData.append('files', f))
      formData.append('type', this.currentType)

      const res = await axios.post('/api/sprites', formData)
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
      const clipboard = new ClipboardJS(event.currentTarget, {
        text: () => text,
      })
      clipboard.on('success', () => {
        antd.message.success('复制成功')
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.on('error', () => {
        antd.message.error('复制失败')
        clipboard.off('error')
        clipboard.off('success')
        clipboard.destroy()
      })
      clipboard.onClick(event)
    },
  },
})
