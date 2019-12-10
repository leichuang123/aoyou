import axios from "axios";
import { TIMEOUT, BASE_URL } from "../config/request_config"
import { USER } from '../constants/storage_key'


const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})

// 请求拦截器
service.interceptors.request.use(config => {
  const user = store.get(USER) || null
  if (user !== null) {
    if (!config.data) {
      config.data = {}
    }
  }
  if (user !== null) {
    if (!config.headers) {
      config.headers = {}
    }
    config.data.memberKey = user.memberKey
    config.headers.memberKey = user.memberKey
  }
  return config;
})

// 响应拦截器
service.interceptors.response.use(response => {
  // console.log(response)
  if (response.data.code * 1 === 30004) {
    store.remove(USER)
    window.location.reload()
  }
  let filename = ''
  if (response.headers['content-disposition']) {
    filename = decodeURIComponent(response.headers['content-disposition'].replace('filename=', '').replace('attachment;', ''))
  }
  if (filename !== '') {
    response.headers.filename = filename
  }
  return response
})

export default service;