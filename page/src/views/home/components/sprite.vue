<template>
  <div class="icon">
    <svg class="svg-icon" aria-hidden="true">
      <use :xlink:href="`#${sprite.fullname}`"></use>
    </svg>
    <p>{{ sprite.name }}</p>

    <div class="actions">
      <div class="action" @click="edit"><a-icon type="edit" /></div>
      <div class="action" @click="remove"><a-icon type="delete" /></div>
      <div class="action" @click="copy($event, sprite.name)">
        <a-icon type="copy" />
      </div>
    </div>

    <a-modal
      title="编辑图标名称"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleEditConfirm"
      @cancel="visible = false"
    >
      <a-input v-model="name" />
    </a-modal>
  </div>
</template>

<script>
import { message, Modal } from 'ant-design-vue'
import { copy } from '@/utils/common'
import http from '@/utils/http'

export default {
  props: {
    sprite: {
      type: Object,
      required: true
    }
  },
  data() {
    return { visible: false, confirmLoading: false, name: this.sprite.name }
  },
  methods: {
    copy,
    remove() {
      Modal.confirm({
        title: '确认删除',
        content: `删除后不可找回, 确定要删除 ${this.sprite.name} 吗?`,
        onOk: async () => {
          const res = await http.delete('/sprites', {
            params: {
              target: this.sprite.path
            }
          })
          if (res.data === 'ok') {
            this.$emit('refresh')
            message.success('删除成功')
          } else {
            message.success('删除失败')
          }
        }
      })
    },
    async edit() {
      this.visible = true
    },
    async handleEditConfirm() {
      this.confirmLoading = true
      const res = await http.put('/sprites', {
        src: this.sprite.path,
        dst: this.sprite.path.replace(this.sprite.name, this.name)
      })
      this.confirmLoading = false
      if (res.data === 'ok') {
        this.$emit('refresh')
        this.visible = false
        message.success('编辑成功')
      } else {
        message.success('编辑失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 16px;
  margin: 10px 0;
  box-sizing: border-box;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  font-size: 48px;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .svg-icon {
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
    margin-top: 16px;
    margin-bottom: 0;
  }

  .actions {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(13, 10, 49, 0.9);
  }

  &:hover {
    .actions {
      display: block;

      .action {
        height: 33%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;

        &:hover {
          background: rgba(13, 10, 49, 0.9);
          color: #f5222d;
        }
      }
    }
  }
}
</style>
