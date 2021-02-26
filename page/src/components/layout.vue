<template>
  <div class="layout">
    <div class="header">
      <div class="left">
        <img src="@/assets/logo.svg" />

        <nav>
          <ul>
            <li><router-link to="/">图标列表</router-link></li>
            <li><router-link to="/help">帮助说明</router-link></li>
          </ul>
        </nav>
      </div>
      <div class="info">当前项目: {{ project.root }}</div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import http from '@/utils/http'

export default {
  data() {
    return {
      project: { root: '' }
    }
  },
  created() {
    this.getProjectInfo()
  },
  methods: {
    async getProjectInfo() {
      const res = await http.get('/project')
      this.project = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #090821;
  padding: 0 48px;
  height: 80px;
  color: #a6a5ad;

  .left {
    display: flex;
    align-items: center;

    img {
      height: 28px;
    }
  }

  nav {
    height: 100%;
    ul {
      display: flex;
      align-items: center;
      list-style: none;
      margin: 0;
      margin-left: 60px;
      height: 100%;

      li {
        margin-right: 32px;
        height: 100%;

        a {
          display: block;
          height: 100%;
          display: flex;
          align-items: center;
          color: #a6a5ad;
          font-size: 16px;

          &.router-link-exact-active {
            color: #ffffff;
          }
        }
      }
    }
  }
}

.content {
  padding: 48px;
}
</style>
