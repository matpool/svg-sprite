import Vue from 'vue'
import {
  Icon,
  Modal,
  ConfigProvider,
  Dropdown,
  Menu,
  Button,
  Input,
  Divider
} from 'ant-design-vue'

const components = [
  Icon,
  Modal,
  ConfigProvider,
  Dropdown,
  Menu,
  Button,
  Input,
  Divider
]

components.forEach(comp => {
  Vue.use(comp)
})
