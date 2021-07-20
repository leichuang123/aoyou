import request from './request'
import qs from 'qs'
import { REQUSET_CONFIG } from '../config/requestConfig'

function postByFromData(data) {
  let form = new FormData()
  let keys = Object.keys(data)
  keys.forEach(key => {
    form.append(key, data[key])
  })
  data = form
  let headers = {
    'Content-Type': 'multipart/form-data'
  }
  return { data, headers }
}

export function login(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/user/login',
    method: 'POST',
    data: data
  })
}
export function getUserInfo(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/user/base/get',
    method: 'POST',
    data: data
  })
}

export function getVcode(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/mobile/send/msg',
    method: 'POST',
    data: data
  })
}

export function checkoutNode(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/mobile/checkoutNode',
    method: 'POST',
    data: data
  })
}

export function register(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/user/register',
    method: 'POST',
    data: data
  })
}

export function changePW(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/user/password/change',
    method: 'POST',
    data: data
  })
}

export function getUserBalance(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/user/getUserBalance',
    method: 'POST',
    data: data
  })
}

export function logout(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/user/logout',
    method: 'POST',
    data: data
  })
}


export function getQuestionCategory(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/system/contents/categoriesList',
    method: 'POST',
    data: data
  })
}

export function getQuestionList(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/system/contents/personalListByQuery',
    method: 'POST',
    data: data
  })
}

// 查询消费记录
export function queryExpensesRecord(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/user/userResource/queryExpensesRecord',
    method: 'POST',
    data: data
  })
}
export function queryDicList(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/system/codeInfo/listByPage',
    method: 'POST',
    data: data
  })
}

export function getProductTypeList(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/system/goods/type/listByPage',
    method: 'POST',
    data: data
  })
}

export function getProductList(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/product/productInfo/queryByTypeNo',
    data
  })
}

export function queryVMDetailsNotUerNo(data) {
  let info = postByFromData(data)
  return request({
    ...REQUSET_CONFIG,
    url: '/product/productInfo/queryVMDetailsNotUerNo',
    headers: { 'Content-Type': "application/x-www-form-urlencoded" },
    data: info.data
  })
}

export function queryVMDetails(data) {
  let info = postByFromData(data)
  return request({
    ...REQUSET_CONFIG,
    url: '/product/productInfo/queryVMDetails',
    headers: { 'Content-Type': "application/x-www-form-urlencoded" },
    data: info.data
  })
}

export function getStock(data) {
  let info = postByFromData(data)
  return request({
    ...REQUSET_CONFIG,
    url: '/machineOperation/vm/queryvmIsExist',
    headers: { 'Content-Type': "application/x-www-form-urlencoded" },
    data: info.data
  })
}

export function getTimeChargeInfo(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'GET',
    url: `/product/timeCharge/get?${qs.stringify(data)}`,
    data
  })
}

export function getVmInfoList(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: `/product/vmInfo/getVmInfoList`,
    data
  })
}
export function crystalBuyVm(data) {
  return request({
    ...REQUSET_CONFIG,
    url: `/order/duration/crystalBuyVm`,
    data
  })
}

export function userCardInfo(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: `/activity/userCard/userCardInfo`,
    data
  })
}
export function rmbBuyVm(data) {
  return request({
    ...REQUSET_CONFIG,
    url: `order/RMBBuyOrder/buyProduct`,
    data
  })
}

export function getNotice(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: '/user/notice/info/listByPage',
    data
  })
}
export function paylogState(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/order/payLog/getByCrystalOrderNo',
    data
  })
}

export function noticeSignRead(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: '/user/notice/sign/read',
    data
  })
}

export function vmListPaging(data) {
  return request({
    ...REQUSET_CONFIG,
    url: 'product/vmInfo/getVmInfoList',
    data
  })
}

export function noticeSignDelete(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: '/user/notice/sign/delete',
    data
  })
}
export function getICA (data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/machineOperation/vm/downloadIca',
    data
  })
}

export function userInfoUpdate(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: '/user/user/base/update',
    data
  })
}
export function vmRestart (data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/machineOperation/vm/restartVm',
    data
  })
}

export function userMobileUpdate(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: '/user/user/base/mobile/update',
    data
  })
}
export function vmReset(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/machineOperation/vm/resetVm',
    data
  })
}

export function getVmPoswer(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/machineOperation/vm/getStatePower',
    data
  })
}

export function getVmStatus(data) {
  return request({
    ...REQUSET_CONFIG,
    url: '/machineOperation/vm/getStatus',
    data
  })
}

export function changePassWord(data) {
  return request({
    ...REQUSET_CONFIG,
    method: 'POST',
    url: '/user/user/password/update',
    data
  })
}

export function renewalByMoney(data) {
  return request({
    ...REQUSET_CONFIG,
    url: `/order/crystalOrder/renewalByMoney`,
    data
  })
}

export function renewalByCrystal(data) {
  return request({
    ...REQUSET_CONFIG,
    url: 'order/durationOrder/renewalByCrystal',
    data
  })
}

export function upgradePackageList(data = {}) {
  return request({
    ...REQUSET_CONFIG,
    url: `/product/upgrade/upgradePackageList`,
    data
  })
}

// 获取购买升级包所需要的金额
export function getPaymentAmount(data = {}) {
  return request({
    ...REQUSET_CONFIG,
    url: `/order/crystalOrder/getPaymentAmount`,
    method: 'post',
    data
  })
}

// 现金升级
export function upgradeByMoney(data = {}) {
  return request({
    ...REQUSET_CONFIG,
    url: `order/crystalOrder/upgradeByMoney`,
    method: 'post',
    data
  })
}

// 查询升级结果
export function queryUpgradeStatus(data = {}) {
  return request({
    url: `/machineOperation/vmOperateLog/queryUpgradeVmLog`,
    method: 'post',
    headers: { 'Content-Type': 'application/json', },
    data
  })
}

// 查询升级结果
export function getToken(data = {}) {
  return request({
    url: `/user/user/getToken`,
    method: 'post',
    headers: { 'Content-Type': 'application/json', },
    data
  })
}

// 微信登录 登录
export function scanningLoginCallBack(data = {}) {
  return request({
    url: `/user/wechat/scanningLoginCallBack`,
    method: 'post',
    headers: { 'Content-Type': 'application/json', },
    data
  })
}

// 微信登录绑定手机号
export function mobileBinding(data = {}) {
  return request({
    url: `/user/wechat/mobileBinding`,
    method: 'post',
    headers: { 'Content-Type': 'application/json', },
    data
  })
}

// 微信登录绑定手机号
export function updateRemarks(data = {}) {
  return request({
    url: `/order/orderAd/updateRemarks`,
    method: 'post',
    headers: { 'Content-Type': 'application/json', },
    data
  })
}

// 根据ip解析用户地址
export function getDataCenterAddress(data = {}) {
  return request({
    url: `/system/dataCenterAddress/ipAddressDecide`,
    method: 'get',
    headers: { 'Content-Type': 'application/json', },
    data
  })
}

/**
 * 获取绑定地区二级树
 * @param data 
 * @returns 
 */
 export function getAreaList (data = {}) {
  return request("/system/dataCenterAddress/addressTree",data,'get')
}
