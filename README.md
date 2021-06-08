# yunny_dingding_h5

#### 介绍

企业管理 CRM-钉钉 H5 应用

#### 软件架构

1.  vue-cli3
2.  vue^2.6.11
3.  vant^2.2.1
4.  钉钉 SDK^2.13.40

#### 安装教程

1.  npm-install
2.  参考.env.example，新建.env 项目配置文件
3.  npm-serve 运行项目
4.  npm-build 打包项目

#### 使用说明

1.  需要在钉钉环境中打开
2.  日常开发浏览器不能调用钉钉 SDK，需要在https://open-dev.dingtalk.com/apiExplorer?spm=ding_open_doc.document.0.0.4ec82ff47fuFV1#/jsapi?api=runtime.permission.requestAuthCode 模拟调用

#### 项目说明

1.  server/api.js 封装的请求
2.  views/empl 界面文件
3.  global.js 公共方法
4.  main.js 入口 js 文件
5.  router.js 路由文件
6.  store.js 全局状态
