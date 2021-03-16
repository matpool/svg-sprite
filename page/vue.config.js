const webpack = require('webpack')
const { readFileSync } = require('fs')
const { resolve } = require('path')

module.exports = {
  productionSourceMap: false,
  devServer: {
    port: 10010,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:10086'
      },
      '/svg-sprite.js': {
        target: 'http://localhost:10086'
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        DOC: JSON.stringify(
          readFileSync(resolve(__dirname, '../doc.md'), 'utf8')
        )
      })
    ]
  }
}
