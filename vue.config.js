module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api/clients': {
        // broke local proxy somehow :(
        // maybe related to trying to install php 7.3.5 for valet ????
        // target: 'http://localhost:9000/prismic-get-client-doc',
        target: 'https://maison-moire.netlify.app/.netlify/functions/prismic-get-client-doc',
        changeOrigin: true
        // secure: false,
        // logLevel: 'debug'
      }
    }
  },
  // force Safari not to cache
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'development') {
      config
        .output
        .filename('[name].[hash].js')
        .end()
    }
  }
}
