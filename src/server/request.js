import axios from "axios";
import { TIMEOUT, BASE_URL } from "../config/request_config"

const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL
  baseURL: BASE_URL,
  timeout: TIMEOUT,
})

// 请求拦截器
service.interceptors.request.use((config) => {
  console.log(config)
  return config;
})

// 响应拦截器
service.interceptors.response.use((response) => {
  console.log(response)
})

export default service;