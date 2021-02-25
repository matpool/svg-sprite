import ClipboardJS from 'clipboard'
import { message } from 'ant-design-vue'

export function copy(event, text) {
  const clipboard = new ClipboardJS(event.currentTarget, {
    text: () => text
  })
  clipboard.on('success', () => {
    message.success('复制成功')
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    message.error('复制失败')
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
