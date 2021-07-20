import axios from "axios";
import { TIMEOUT, BASE_URL } from "../config/request_config"
import { USER } from '../constants/storage_key'
import stores from '../store'
import { switch_loading } from '../actions/index'

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})

// 请求拦截器
service.interceptors.request.use(config => {
  const user = store.get(USER) || null
  if (!config.data) {
    config.data = {}
  }
  if (!config.data.isDisableLoading) {
    // stores.dispatch(switch_loading({show: true}))
    delete config.data.isDisableLoading
    layer.load(0, { shade: 0.4 })
  }
  if (!config.headers) {
    config.headers = {}
  }
  config.headers.platformTag = 2
  if (user !== null) {
    if (user.token) {
      config.headers.token = user.token
    }
  }
  // config.headers.channelNo = 1;
  return config;
})

// 响应拦截器
service.interceptors.response.use(response => {
  // stores.dispatch(switch_loading({show: false}))
  layer.closeAll()
  if (response.data.code  === 12010005 || response.data.code === 12010007) {
    store.remove(USER)
    window.location.reload()
  }

  if (!response.data.message) {
    response.data.message = '服务器异常'
  }

  let filename = ''
  if (response.headers['content-disposition']) {
    filename = decodeURIComponent(response.headers['content-disposition'].replace('filename=', '').replace('attachment;', ''))
  }
  if (filename !== '') {
    response.headers.filename = filename
  }
  return response
}, err => {
  
  console.log(err)
  stores.dispatch(switch_loading({ show: false }))
  layer.closeAll()
})

export default service;