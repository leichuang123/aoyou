export const TIMEOUT = 50000; // 超时时间（毫秒）

let url = '';
switch (process.env.REACT_APP_ENV) {
    case 'development': // 日常开发
        url = 'http://192.168.6.55:1211';
        break;
    case 'test': // 测试环境
        url = 'https://dcallback.yunzhiqu.com';
        //'http://192.168.7.243:9195';
        break;
    case 'preview': // 预发布
    case 'production': // 正式环境
        url = '/api/';
        break;
    default:
        url = '/api/';
        break;
}
export const BASE_URL = url;
