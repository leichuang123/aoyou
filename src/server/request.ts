import axios from "axios";
import { TIMEOUT, BASE_URL } from "../config/request_config"
import { USER } from '../constants/storage_key'
import stores from '../store'
import { switch_loading } from '../actions/index'
import VueCookies from 'vue-cookies'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})

// 请求拦截器
service.interceptors.request.use((config: any) => {
  let user = store.get(USER) || null
  // @ts-ignore
  if (VueCookies.get('userInfo')) {
    // @ts-ignore
    user = VueCookies.get('userInfo')
  } else if (localStorage.getItem('userInfo')) {
    // @ts-ignore
    user = JSON.parse(localStorage.getItem('userInfo'))
  }
  if (user !== null) {
    if (!config.data) {
      config.data = {}
    }
  }
  if (!config.data.isDisableLoading) { 
    stores.dispatch(switch_loading({show: true}))
    delete config.data.isDisableLoading
  }
  if (user !== null) {
    if (!config.headers) {
      config.headers = {}
    }
    config.headers.token = user.token
  }
  config.headers.platformTag = 1
  config.headers.channelNo = stores.getState().channelNo
  return config;
})

// 响应拦截器
service.interceptors.response.use((response: any) => {
  stores.dispatch(switch_loading({show: false}))
  if (response.data.code * 1 === 12010005 || response.data.code * 1 === 12010007) {
    store.remove(USER)
    // if (localStorage.getItem('INIT_URL')) {
    //   window.location.href = localStorage.getItem('INIT_URL') || ''
    //   return
    // }
    // window.location.reload()
    // @ts-ignore
    if (window.loginUrl) { 
      // @ts-ignore
      var loginUrl = window.loginUrl
      window.location.href = `${loginUrl}${loginUrl.indexOf('?') === -1 ? '?' : '&'}fromType=0&from=${encodeURIComponent(window.location.href)}`
    } else {
      if (process.env.REACT_APP_ENV === 'development' || process.env.REACT_APP_ENV === 'test') {
        window.location.href = 'http://localhost:3000#/login'
      } else {
        window.location.href = 'https://yunny.yunzhiqu.com/pc/strategy/index.html#/login'
      }
    }
    return
  }
  let filename = ''
  if (response.headers['content-disposition']) {
    filename = decodeURIComponent(response.headers['content-disposition'].replace('filename=', '').replace('attachment;', ''))
  }
  if (filename !== '') {
    response.headers.filename = filename
  }
  return response
}, () => {  // 网络或服务器异常时
  stores.dispatch(switch_loading({ show: false }))
})

export default service;