
import service from "./request"
import { downloadXls } from '../tools/tools'
import { SERVER_ERROR } from '../config/config'

// 新用户列表
export function newUserList (data = {}) {
  return service.post("/buryingPointSystem/retention/userRegister", data)
  .then((res: Ajax.AxiosResponse) => {
    return res.data
  })
  .catch(err => {
    console.error(err)
    return SERVER_ERROR
  })
}

// 新用户列表导出
export function newUserListExport (data = {}) {
  return service.post("/buryingPointSystem/retention/userRegister/export", data, {
    responseType: 'blob'
  })
  .then((res: Ajax.Download) => {
    downloadXls(res.data, res.headers.filename)
    return res.data
  })
  .catch(err => {
    console.error(err)
    return SERVER_ERROR
  })
}

// 退出登录
export function serverLoginout (data = {}) {
  return service.post("/buryingPoint/logout", data).then((res: Ajax.AxiosResponse) => {
    return res.data
  })
  .catch(err => {
    console.error(err)
    return SERVER_ERROR
  })
}

// 登录
export function serverLogin (data = {}) {
  return service.post("/buryingPoint/login", data)
  .then((res: Ajax.AxiosResponse) => {
    return res.data
  })
  .catch(err => {
    console.error(err)
    return SERVER_ERROR
  })
}