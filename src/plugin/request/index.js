import axios from 'axios'
import store from '@/store/index.js'
let baseURL = ''
switch (import.meta.env.MODE) {
  case 'test':
  case 'development':
    // baseURL = 'http://192.168.7.243:9195'
    baseURL = '/dev'
    break;
  default:
    baseURL = '/api'
    break;
}
axios.defaults.baseURL = baseURL


axios.interceptors.response.use(response => {
  if (response.data.code && response.data.code !== 200) {
    if (!response.data.message) {
      response.data.message = '服务器异常'
    }
    // alert(response.data.message || '服务器异常')
  }
  return response.data;
},
  error => {
    return {
      code: 500,
      message: "服务器异常",
      data: error
    }
  })

axios.interceptors.request.use(config => {
  if (config.url.indexOf('/') !== 0) {
    config.url = '/' + config.url
  }

  if (typeof config.data === 'string') {
    config.data = `${config.data}&deviceNo=${store.state.deviceNo}`
  }

  if (config.method == 'get') {
    config.params = {
      deviceNo: storea.state.deviceNo,
      ...config.params
    }
  }

  if (config.data.token) {
    config.headers.token = config.data.token
  } else if(store.state.user) {
    config.headers.token = store.state.user.token
  }
  config.headers.channelNo = store.state.channelNo || 1
  config.headers.platformTag = 1

  if (config.method.toLowerCase() === 'post') {
    config.data = config.data || {}
    if (config.data.token) {
      config.headers.token = config.data.token
    }
    config.data.deviceNo = store.state.deviceNo
    if (config.data.isFormData) {
      delete config.data.isFormData
      let form = new FormData()
      let keys = Object.keys(config.data)
      keys.forEach(key => {
        form.append(key, config.data[key])
      })
      config.data = form
      config.headers['Content-Type'] = 'multipart/form-data'
    }
  }
  return config
}, error => {
  // Do something with request error
  return Promise.reject(error)
})


export default {
  install: (app, options) => {
    app.config.globalProperties.$axios = axios
  }
}