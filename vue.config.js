module.exports = {
  productionSourceMap: false,
  assetsDir: "s",
  configureWebpack: {
    externals: {
      vue: "Vue",
      vuex: "Vuex",
      "vue-router": "VueRouter",
      "element-ui": "ELEMENT",
    },
  },
  lintOnSave: false,
  devServer: {
    inline: true,
    disableHostCheck: true,
    port: 8085,
    hot: true, //自动保存
    proxy: {
      "/m": {
        target: "http://192.168.0.98:11078",
        //target: 'http://127.0.0.1:18222',
        changeOrigin: true,
        secure: false
      },
      "/file": {
        target: "http://192.168.0.98:11078",
        //target: 'http://127.0.0.1:18222',
        changeOrigin: true,
      },
      // "/module": {
      //   target: "http://192.168.0.98:11091",
      //   changeOrigin: true,
      //   // pathRewrite:{
      //     // '^/dd': ''
      //   // }
      // },
    },
  },
};
