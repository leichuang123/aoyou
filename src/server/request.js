import axios from 'axios'
import { BASE_URL, TIME_OUT } from '../config/requestConfig'
import { REQUSET_CONFIG } from '../config/requestConfig'
import store from '@/store/index.js'
import router from "../router/index"
const service = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
})

service.interceptors.request.use(
  config => {
    config.headers.channelNo = 2
    config.headers.platformTag = 1
    // if (!localStorage.getItem('ktest')) {
    //  config.headers.mac = store.state.mac
    // }
    let token = localStorage.getItem("Token")
    if(token) {
      config.headers.token = token
    }
    return Object.assign({},REQUSET_CONFIG,config)
  },
  error => {
    return Promise.reject(error);
  }
)

service.interceptors.response.use(
  response => {
    if (response.data.code === 12010005 || response.data.code === 12010007) {
      store.dispatch('removeUserInfo')
      if (router.history.current.path !== '/login') {
        router.push("/login?from=" + encodeURIComponent(window.location.href))
      }
      return {
        code: 200,
        tokenError: true,
        message: 'token异常'
      }
    }
    if (response.config.url.indexOf('machineOperation/vm/downloadIca') !== -1) {
      return response
    }
    return response.data;
  },
  error => {
    let err = {
      code: 500,
      message: "服务器异常",
      data: error
    }
    return err
  }
)

export default service