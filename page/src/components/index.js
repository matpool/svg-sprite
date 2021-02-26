import Vue from 'vue'
import {
  Icon,
  Modal,
  ConfigProvider,
  Dropdown,
  Menu,
  Button,
  Input
} from 'ant-design-vue'

const components = [Icon, Modal, ConfigProvider, Dropdown, Menu, Button, Input]

components.forEach(comp => {
  Vue.use(comp)
})
