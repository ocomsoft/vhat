// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/ws/*': {
        target: 'http://' + process.env.VUE_APP_GOTIFY_URL + '/',
        ws: true,
        pathRewrite: {
          '^/ws': ''
        },
        secure: false,
        logLevel: 'debug'
      },
      '/stream*': {
        target: 'ws://' + process.env.VUE_APP_GOTIFY_URL + '',
        ws: true,
        secure: false,
        logLevel: 'debug',
        changeOrigin: false
      }
    }
  }
}
