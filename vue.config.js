// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  publicPath: './', // 在正式版本，路径为 ./ 或者 /， 如果是测试版本，路径 ./ 失效 可写成 /box 
	// publicPath: '/112box',
	assetsDir: "static",
  "transpileDependencies": [
    "vuetify"
  ],
  // configureWebpack: {
  //   plugins: [
  //      new BundleAnalyzerPlugin()
  //    ]
  // },
  devServer: {
    open: true,
    host: "0.0.0.0",
    port: "8080",
    // proxy: {
    //   "/kcy": {
    //     target: "http://yunnyweb.yunzhiqu.com/api/",
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/kcy": ""
    //     }
    //   }
    // }
  },
}