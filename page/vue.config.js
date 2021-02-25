module.exports = {
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
  }
}
