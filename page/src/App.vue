<template>
  <a-config-provider :locale="zh_CN">
    <div id="app">
      <layout />
    </div>
  </a-config-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')
import Layout from '@/components/layout'

export default {
  components: { Layout },
  data() {
    return { zh_CN }
  }
}
</script>

<style lang="less"></style>
