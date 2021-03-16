## 背景

iconfont.cn 对图标的绘制有一定要求，部分图标上传后展示有问题，且为了兼容字体图标的形式，iconfont.cn 对 svg 做了重绘，可能与 ui 设计的图标会有些许出入；而且 iconfont.cn 没有开放相关的 api，对持续集成很不友好

## 解决方案

通过命令行工具直接将一批 svg 图标转换成一个 svg sprite 的脚本，这个脚本与 iconfont.cn 生成的 js 脚本基本一致
同时可以通过命令行起一个服务，展示图标的管理页面（类似 iconfont 的项目管理页面）

## 如何使用

### 全局安装

`yarn global add @matpool/svg-sprite`
安装完成后，命令行可以执行 `ss -v` 确认安装成功

### 新建项目

在项目根目录下执行 `ss init` , 执行完毕后会在根目录下生成 .iconrc 文件和 icons 目录
.iconrc 是项目的配置文件，icons 是默认的图标资源的存放目录

### 脚本生成

项目根目录下执行 `ss gen` ，执行完毕后会在 .iconrc 中设置的 output 目录下生成一个 svg-sprite.js 文件

### 管理页面

项目根目录下执行 `ss serve` , 默认监听 10086 端口，ui 如下图

![image.png](https://i.loli.net/2021/03/16/cp8ToEKXQjzCM4g.png)

可通过该管理页面对图标进行增删改查

## 使用示例

### React 中使用 svg sprite

```jsx
import React from 'react'
import styled from 'styled-components'

const SvgIcon = styled.svg`
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
`

export function Icon(props) {
  const { name } = props

  return (
    <SvgIcon aria-hidden="true">
      <use xlinkHref={`#${name}`} />
    </SvgIcon>
  )
}
```

### Vue 中使用 svg sprite

```vue
<template>
  <svg class="mat-icon" aria-hidden="true">
    <use :xlink:href="`#${name}`"></use>
  </svg>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
}
</script>

<style lang="less" scoped>
.mat-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
```
