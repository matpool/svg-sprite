import Vue from 'vue'
import { message } from 'ant-design-vue'

const components = [message]

components.forEach(comp => {
  Vue.use(comp)
})
