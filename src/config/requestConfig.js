let prefixUrl = '' // 配置中必须以VUE_APP 开头
switch (process.env.VUE_APP_BUILD_ENV) {
  case 'development':
    prefixUrl = 'http://192.168.7.243:9195/' // 开发
    break;
  case 'test':
    prefixUrl = 'http://192.168.7.243:9195/' // 测试
    break;
  case 'xjj':
  case 'production':
  case 'preview':
    prefixUrl = '/api/' // 预发布和线上
    break;
  default:
    prefixUrl = '/api/' // 默认线上
    break;
}
export const BASE_URL = prefixUrl;
export const TIME_OUT = 30000;
export const REQUSET_CONFIG = {
  url: '/',
  method: 'POST',
  headers: { 'Content-Type': 'application/json', channelNo: 2, platformTag: 1},
  data: null,
}