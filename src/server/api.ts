
import service from "./request"
import { downloadXls } from '../tools/tools'
import { SERVER_ERROR } from '../config/config'

function request (url: string, data: any, method='post',headers= {}) {
  if (method === 'post') {
    if (data.isFormData) {
      delete data.isFormData
      let form = new FormData()
      let keys = Object.keys(data)
      keys.forEach(key => {
        form.append(key, data[key])
      })
      return service.post(url, form, {
        headers: {
        'Content-Type': 'multipart/form-data',
        ...headers
      }})
        .then((res: Ajax.AxiosResponse) => {
          return res.data
        })
        .catch(err => {
          console.error(err)
          return SERVER_ERROR
        })
    } else {
      return service.post(url, data)
        .then((res: Ajax.AxiosResponse) => {
          return res.data
        })
        .catch(err => {
          console.error(err)
          return SERVER_ERROR
        })
    }
    
  } else {
    for (let key in data) {
      url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${data[key]}`
    }
    return service.get(url)
    .then((res: Ajax.AxiosResponse) => {
      return res.data
    })
    .catch(err => {
      console.error(err)
      return SERVER_ERROR
    })
  }
}

function download (url: string, data: any) {
  return service.post(url, data, {
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

// 新用户列表
export function newUserList (data = {}) {
  return request("/buryingPointSystem/retention/userRegister", data)
}

// 新用户列表导出
export function newUserListExport (data = {}) {
  return download("/buryingPointSystem/retention/userRegister/export", data)
}

// 退出登录
export function serverLoginout (data = {}) {
  return request("/system/systemUser/logout", data)
}

// 登录
export function serverLogin (data = {}) {
  return request("/system/systemUser/login", data)
}

// 虚拟机列表
export function virtualList(data = {}) {
  return request("/product/vmInfo/listByPage", data)
}

// 虚拟机详情
export function getVirtualMachineById(data = {}) {
  return request("/product/vmInfo/getById", data, 'get')
}

// 创建虚拟机列表
export function createVirtual(data = {}) {
  return request("/product/vmInfo/create", data)
}

// 修改虚拟机
export function updateVirtual(data = {}) {
  return request("/product/vmInfo/update", data)
}

// 下拉框数据
export function singSelectList (data = {}) {
  return request("/buryingPointSystem/retention/singSelect", data)
}

/**
 * 字典相关
 */

/**
 * 查询字典类型集合
 * @param state 状态 0 无效 1 有效
 * @param name
 * @param currentPage 页码
 * @param pageSize 页数
 */
export function queryDictType (data = {}) {
  return request("/system/codeType/listByPage", data)
}
/**
 * 查询字典列表
 * @param codeTypeNo 字典类型id
 * @param currentPage 页码
 * @param pageSize 页数
 */
export function queryDictList (data = {}) {
  return request("/system/codeInfo/listByPage", data)
}
/**
 * 查询字典列表
 * @param codeTypeNo 字典类型id
 * @param currentPage 页码
 * @param pageSize 页数
 */
 export function queryDataCenterList (data = {}) {
  return request("/system/dataCenterAddress/listByPage", data)
}
/**
 * 创建字典类型
 * @param name 名字
 * @param state 是否可用
 */
export function addDictType (data = {}) {
  return request("/system/codeType/create", data)
}
/**
 * 修改字典类型
 * @param id id
 * @param state 是否可用
 */
export function editDictType (data = {}) {
  return request("/system/codeType/update", data)
}
/**
 * 查询字典类型
 * @param id 字典类型id
 */
export function queryDictTypeById (data = {}) {
  return request("/system/codeType/getById", data, "get")
}

/**
 * 创建字典详情
 * @param codeTypeNo codeTypeNo
 * @param name 名称
 * @param serialNo 编号
 * @param state 是否可用
 */
export function addDictDetail (data = {}) {
  return request("/system/codeInfo/create", data)
}
/**
 * 修改字典详情
 * @param codeTypeNo codeTypeNo
 * @param name 名称
 * @param serialNo 编号
 * @param state 是否可用
 * @param id 字典id
 */
export function editDictDetail (data = {}) {
  return request("/system/codeInfo/update", data)
}

/**
 * 获取消息列表
 * @param title
 * @param currentPage
 * @param pageSize
 */
export function queryNoticeList (data = {}) {
  return request("/user/noticeInfo/listByPage", data)
}
/**
 * 新建消息
 * @param title
 * @param content
 * @param sendTime
 * @param receiverType
 * @param type
 * @param channelNoList
 * @param url
 */
export function addNotice (data = {}) {
  return request("/user/noticeInfo/insert", data)
}
/**
 * 更新消息
 * @param title
 * @param content
 * @param sendTime
 * @param receiverType
 * @param type
 * @param channelNoList
 * @param url
 * @param noticNo
 */
export function editNotice (data = {}) {
  return request("/user/noticeInfo/update", data)
}
/**
 * 发送消息
 * @param noticeNo
 */
export function sendNotice (data = {}) {
  return request("/user/noticeInfo/send", data, "get")
}
/**
 * 预订单分页查询
 * @param mobile
 * @param state
 * @param currentPage
 * @param pageSize
 */
export function getPreOrderList (data = {}) {
  return request("/order/preOrder/listByPage", data)
}
/**
 * 获取绑定地区二级树
 * @param data 
 * @returns 
 */
 export function getAreaList (data = {}) {
  return request("/system/dataCenterAddress/addressTree",data,'get')
}
/**
 * 获取绑定三级数据中心
 * @param data 
 * @returns 
 */
 export function getDataCenterList (data = {}) {
  return request("/system/dataCenterAddress/dataCenterTree",data,'get')
}
/**
 * 数据中心创建
 * @param data
 * @returns 
 */
 export function createDataCenterList (data = {}) {
  return request("/system/dataCenterAddress/listByPage",data)
}
/**
 * 数据中心添加
 * @param data 
 * @returns 
 */
 export function addDataCenter (data = {}) {
  return request("/system/dataCenterAddress/create",data)
}
/**
 * 数据中心编辑
 * @param data 
 * @returns 
 */
 export function updateDataCenter (data = {}) {
  return request("/system/dataCenterAddress/update",data)
}
/**
 * 预订单创建
 * @param mobile
 * @param type
 * @param remark
 * @param preOrderDeviceDTOList
 *        deviceNo
 * @param preOrderPictureDTOList
 *        url
 */
export function createPreOrder (data = {}) {
  return request("/order/preOrder/create", data)
}
/**
 * 预订单提交
 * @param preOrderNo
 */
export function preOrderSubmit (data = {}) {
  Object.assign(data, {isFormData: true})
  return request("/order/preOrder/submit", data)
}
/**
 * 预订单查询
 * @param preOrderNo
 */
export function queryPreOrderByNo (data = {}) {
  return request("/order/preOrder/getByPreOrderNo", data, 'get')
}
/**
 * 预订单撤销
 * @param preOrderNo
 */
export function cancelPreOrder (data = {}) {
  Object.assign(data, {isFormData: true})
  return request("/order/preOrder/cancel", data, 'post')
}

/**
 * 手工订单分页查询
 * @param mobile
 * @param state
 * @param currentPage
 * @param pageSize
 */
export function getManOrderList (data = {}) {
  return request("/order/manualOrder/listByPage", data)
}
/**
 * 预订单修改
 */
export function preOrderUpdate(data = {}) {
  return request("/order/preOrder/update", data)
}



/**
 * 预订单关联设备分页查询
 * @param preOrderNo
 * @param state
 * @param currentPage
 * @param pageSize
 */
export function getDeviceListByPreNo (data = {}) {
  return request("/order/preOrder/listByPreOrderDevicePage", data)
}
/**
 * 手工订单创建
 */
export function crateManualOrder (data = {}) {
  return request("/order/manualOrder/create", data)
}
/**
 * 手工订单提交
 */
export function submitPmanualOrder (data = {}) {
  Object.assign(data, {isFormData: true})
  return request("/order/manualOrder/submit", data)
}
/**
 * 手工订单作废
 */
export function cancelManualOrder (data = {}) {
  Object.assign(data, {isFormData: true})
  return request("/order/manualOrder/cancel", data)
}
/**
 * 手工订单查询
 */
export function getManualOrderByNo (data = {}) {
  return request("/order/manualOrder/getByManualOrderNo", data,'get')
}
/**
 * 手工订单关联设备分页查询
 */
export function getManualOrderDeviceInfo (data = {}) {
  return request("/order/manualOrder/listByManualOrderDevicePage", data)
}
/**
 * 手工订单设备信息查询
 */
export function getManualDeviceInfo (data = {}) {
  return request("/order/manualOrderDevice/info", data)
}
/**
 * 手工订单修改
 */
export function updateManualOrder (data = {}) {
  return request("/order/manualOrder/update", data)
}

// 实时计费
export function realTimelList(data = {}) {
  return request("/real_time", data)
}

// 时长计费
export function timeQuantumList(data = {}) {
  return request("/product/timeCharge/listByPage", data)
}

// 创建时长计费
export function createTimeQuantum(data = {}) {
  return request("/product/timeCharge/create", data)
}

// 编辑时长计费
export function updateTimeQuantum(data = {}) {
  return request("/product/timeCharge/update", data)
}

// 时长计费详情
export function getTimeQuantumById(data = {}) {
  return request("/product/timeCharge/get", data, 'get')
}

// 查询商品类型
export function getProductTypeList(data = {}) {
  return request("/system/goods/type/listByPage", data)
}

// 新增商品类型
export function addProductType(data = {}) {
  return request("/system/goods/type/add", data)
}

// 更新商品类型
export function updateProductType(data = {}) {
  return request("/system/goods/type/update", data)
}

// 商品列表
export function productList(data = {}) {
  return request("/product/productInfo/listByPage", data)
}

// 创建商品
export function createProduct(data = {}) {
  return request("/product/productInfo/create", data)
}

// 商品详情
export function getProductById(data = {}) {
  // return request("/product/productInfo/getByProductNo", data, 'get')
  Object.assign(data, { isFormData: true})
  return request("/product/productInfo/getProductInfoByProductNo", data)
}

// 商品上下架
export function changeProductStatus(data = {}) {
  Object.assign(data, { isFormData: true })
  return request("/product/productInfo/updateStateByProductNoAndState", data)
}

// 修改商品
export function updateProduct(data = {}) {
  return request("/product/productInfo/update", data)
}

// 时长订单列表
export function timequanOrderList(data = {}) {
  return request("/time_quan_order", data)
}

// 活动列表
export function ActivityList(data = {}) {
  return request("/activity/activity/activeListByPage/query", data)
}

// 已关联活动奖品查询 
export function activityAlreadyAward (data = {}) {
  return request("/activity/activity/getAwardByActivityNo", data)
}

// 活动详情
export function getActivityById(data = {}) {
  return request("/activity/activity/getById", data)
}

// 活动发布
export function publishActive (data ={}) {
  return request("/activity/activity/releaseActive", data)
}

// 活动奖品
export function activePrize(data = {}) {
  return request("/activity/activity/awardListByPage/query", data,)
}

// 获取奖品信息
export function getAwardStockInfo(data = {}) {
  return request("/activity/activity/getAwardStock", data)
}

// 创建活动
export function createActivity(data = {}) {
  return request("/activity/activity/active/create", data)
}

// 编辑活动
export function updateActivity(data = {}) {
  return request("/activity/activity/active/update", data)
}

// 终止活动 
export function stopActivity(data = {}) {
  return request("/activity/activity/endActive", data, 'get')
}

// 激活卡列表
export function activeCardList(data = {}) {
  return request("/activity/activeCode/cardListAllByPage/query", data)
}

// 创建激活卡
export function createActivityCard(data = {}) {
  return request("/activity/activeCode/card/create", data)
}

// 更新激活卡
export function updateActivityCard(data = {}) {
  return request("/activity/activeCode/card/update", data)
}

// 活动关联奖品
export function activityConnectCard(data = {}) {
  return request("/activity/activity/activityConnectCard", data)
}

// 激活卡商品列表
export function activeCardProductList(data = {}) {
  return request("/product/productInfo/productListByPage/query", data)
}

// 激活码列表
export function activeCodeList(data = {}) {
  return request('/activity/activeCode/codeListByPage/query', data)
}

// 激活码列表导出
export function activeCodeListExport(data = {}) {
  download('/activity/activeCode/exportCode', data)
}


//激活卡启用和停用
export function operateActiveCard(data = {}) {
  return request("/activity/activeCode/operateCard", data, 'get')
}

//通过激活卡的productNo获取商品虚机名称
export function getVirtualMachineName(data = {}) {
  return request("/product/productInfo/queryByProductNo", data)
}

/**
 * 可关联激活卡列表
 * @param name 激活卡名称
 * @param pageSize 每页显示条数
 * *@param currentPage 页码
 */
export function usableCardList(data = {}) {
  return request("/activity/activeCode/cardListByPage/query", data)
}

// 用户列表
export function userInfoList(data = {}) {
  return request("/system/userManage/getUserInfo", data)
}

// 用户机器
export function userMachine(data = {}) {
  return request("/system/userManage/getUserOrderInfoAndVmId", data)
}

// 用户水晶 
export function userCrystalList(data = {}) {
  return request("/system/userManage/getCrystalOrderDetail", data)
}

// 用户卡券
export function userCoupon(data = {}) {
  return request("/system/userManage/getCardCouponInfo", data)
}

// 登录
export function login(data = {}) {
  return request("/user/user/login", data)
}

// 用户信息
export function getUserInfo(data = {}) {
  return request("/user/user/base/get", data)
}

// 编辑用户信息
export function editUserInfo(data = {}) {
  return request("/user/user/updateUserAdditionInfo", data)
}

// 创建用户
export function createUser(data = {}) {
  return request("/system/systemUser/create", data)
}

// 时长订单
export function getTimeQuantumOrder(data = {}) {
  return request("/order/orderAd/listByQuery", data)
}

// 操作订单: 停用或启用
export function operateOrderState(data = {}) {
  return request("/order/durationOrder/operationSwitch", data)
}

// 获取订单中的虚拟机信息
export function getVmInfoByProductNo(data = {}) {
  Object.assign(data, { isFormData: true})
  return request("/product/vmInfo/queryVmInfoDetailsByProductNo", data)
}

// 查询订单中的时长计费信息
export function getTimeCharge(data = {}) {
  Object.assign(data, { isFormData: true })
  return request("/product/productInfo/queryTimeChargeByProductNo", data)
}

// 根据订单号查询购买记录
export function getBuyList (data = {}) {
  // Object.assign(data, { isFormData: true })
  return request("/order/durationSubOrder/listByQuery", data)
}

// 获取订单优惠券信息
export function getOrderCoupon(data = {}) {
  Object.assign(data, { isFormData: true })
  return request("/order/durationSubOrderAward/listCouponDetailsSummary", data)
}

// 获取水晶券列表
export function crystalListGet(data = {}) {
  return request("/activity/crystalVoucher/crystalListByPage/query", data)
}

// 获取水晶券详情
export function crystalDetailGet(data = {}) {
  return request("/activity/crystalVoucher/crystal/selectById", data, 'get')
}

// 新建水晶券
export function crystalVoucherCreate(data = {}) {
  return request("/activity/crystalVoucher/crystal/create", data)
}

// 编辑水晶券
export function crystalVoucherUpdata(data = {}) {
  return request("/activity/crystalVoucher/crystal/update", data)
}

// 停用/启用 水晶券
export function crystalVoucherOperate(data = {}) {
  return request("/activity/crystalVoucher/crystal/operateCrystal", data, 'get')
}

// 获取代金券列表
export function cashVoucherGet(data = {}) {
  return request("/activity/cashVoucher/cashListByPage/query", data)
}

// 获取代金券详情
export function cashVoucherDetailGet(data = {}) {
  return request("/activity/cashVoucher/cash/selectById", data, 'get')
}

// 新建代金券
export function cashVoucherCreate(data = {}) {
  return request("/activity/cashVoucher/cash/create", data)
}

// 编辑代金券
export function cashVoucherUpdata(data = {}) {
  return request("/activity/cashVoucher/cash/update", data)
}

// 停用/启用 代金券
export function cashVoucherOperate(data = {}) {
  return request("/activity/cashVoucher/cash/operateCash", data, 'get')
}

// 获取体验券列表
export function experienceVoucherGet(data = {}) {
  return request("/activity/experienceVoucher/experienceListByPage/query", data)
}

// 获取体验券详情
export function experienceVoucherDetailGet(data = {}) {
  return request("/activity/experienceVoucher/experience/selectById", data, 'get')
}

// 新建体验券
export function experienceVoucherCreate(data = {}) {
  return request("/activity/experienceVoucher/experience/create", data)
}

// 编辑体验券
export function experienceVoucherUpdata(data = {}) {
  return request("/activity/experienceVoucher/experience/update", data)
}

// 停用/启用 体验券
export function experienceVoucherOperate(data = {}) {
  return request("/activity/experienceVoucher/experience/operateExperience", data, 'get')
}

// 优惠券使用明细
export function couponGrandDetail(data = {}) {
  return request("/activity/userCard/selectVoucherInfoByQuery", data)
}

// 预装软件列表
export function preinstallSoftwareList(data = {}) {
  return request('/system/preinstallSoftware/listByPage', data)
}

// 预装软件详情
export function preinstallSoftwareGetById(data = {}) {
  return request('/system/preinstallSoftware/getById', data, 'get')
}

// 新增预装软件
export function createpreSoftWare(data = {}) {
  return request('system/preinstallSoftware/create', data)
}

// 查询虚机详情
export function queryVMDetails(data = {}) {
  let form = new FormData()
  let keys = Object.keys(data)
  keys.forEach(key => {
    form.append(key, data[key])
  })
  data = form
  return request('product/productInfo/queryVMDetails', data, 'post', {"Content-Type":'application/x-www-form-urlencoded'})
}

// 角色列表
export function roleList(data = {}) {
  return request('/system/systemRole/roleListByQuery', data)
}

// 新增角色
export function addRole(data = {}) {
  return request('/system/systemRole/create', data)
}

// 更新角色
export function editRole(data = {}) {
  return request('/system/systemRole/update', data)
}

// 资源列表
export function getResourcesList(data = {}) {
  return request('/system/systemResource/resourceListByQuery', data)
}

// 更新资源
export function updateResources(data = {}) {
  return request('/system/systemResource/update', data)
}

// 新增资源
export function addResources(data = {}) {
  return request('/system/systemResource/create', data)
}

// 后台用户列表
export function userList(data = {}) {
  return request('/system/systemUser/list', data)
}

// 用户角色列表
export function userRoleList(data = {}) {
  // Object.assign(data, { isFormData: true })
  return request('/system/systemUserRole/roleList', data)
}

// 用户权限列表
export function userPermission(data = {}) {
  return request('/system/systemUserResource/userHaveResourceList', data)
}

// 保存用户角色
export function updateUserRole(data = {}) {
  return request('/system/systemUserRole/assign', data)
}

// 角色权限列表
export function rolePermissionList(data = {}) {
  return request('/system/systemRoleResource/roleHaveResourceList', data)
}

// 保存角色权限
export function updateRolePermission(data = {}) {
  return request('/system/systemRoleResource/endow', data)
}


// 角色列表
export function getRolesList(data = {}) {
  return request('system/systemRole/roleListByQuery', data, 'post')
}

// 增加角色
export function createRoles(data = {}) {
  return request('system/systemRole/create', data, 'post')
}

// 更新角色
export function updateRoles(data = {}) {
  return request('system/systemRole/update', data, 'post')
}

// 更新用户
export function operateUserState(data = {}) {
  return request('/system/systemUser/operate', data, 'post')
}

// 续费时查寻快捷时长
export function queryVmDetilByProductNo(data = {}) {
  return request('/product/productInfo/queryVMDetails', data, 'post')
}

// 后台续费
export function renewalByManage(data = {}) {
  return request('/order/durationOrder/renewalByManage', data, 'post')
}

// 机器操作日志
export function MachineLog(data = {}) {
  return request('/machineOperation/vmOperateLog/listByQuery', data, 'post')
}

// 重启
export function RebootVm(data = {}) {
  return request('/machineOperation/vm/manageRestartVm', data, 'post')
}

// 获取文章列表
export function getArticleList(data = {}) {
  return request('/system/contents/adminListByPage',data,'post')
}

// 新建文章列
export function insertArticle(data = {}) {
  return request('/system/contents/insert',data,'post')
}

// 获取文章详情
export function getArticleDetail(data = {}) {
  return request('/system/contents/getPersonalContents',data,'post')
}

// 更新文章
export function updateArticle(data = {}) {
  return request('/system/contents/update',data,'post')
}

// 更换设备
export function changDevice(data = {}) {
  return request('/order/durationOrder/orderBindingDevice', data, 'post')
}

// 重新初始化
export function resetOrderOldDevice(data = {}) {
  Object.assign(data, { isFormData: true })
  return request('/order/orderDeviceLog/initializeDevice', data, 'post')
}

// 分页查询出库号
export function queryDeliveryNumber(data = {}) {
  return request('/user/deliveryNumber/listByQuery', data, 'post')
}

// 导出出库号
export function deliveryNumberListExport(data = {}) {
  download('/user/deliveryNumber/export', data)
}

// 批量生成设备出库号
export function batchGenDeliveryNumber(data = {}) {
  return request('/user/deliveryNumber/batchGenDeliveryNumber', data, 'post')
}

// 出库号绑定设备
export function bindingDeliveryNo(data = {}) {
  return request('/user/deliveryNumber/bindingDeliveryNo', data, 'post')
}

// 临时绑定一个异常设备
export function bindErrorDeliveryNo(data = {}) {
  return request('/user/deliveryNumber/bindingErrorDeviceNo', data, 'post')
}

// 出库号换绑
export function changeBindingDeliveryNo(data = {}) {
  return request('/user/deliveryNumber/changeBindingDeliveryNo', data, 'post')
}
// 根据激活码查询用户
export function queryUserByActiveCode(data = {}) {
  Object.assign(data, { isFormData: true })
  return request('/activity/userCard/getUserInfoByCode', data, 'post')
}

// 获取导出批次列表
export function getBatchList(data = {}) {
  return request('/user/deliveryNumber/queryBatch', data, 'post')
}

// 设备解绑
export function unBundling(data = {}) {
  Object.assign(data, { isFormData: true })
  return request('/order/durationOrder/orderDeviceUnbundling', data, 'post')
}

// 升级包列表
export function managerProductNoByList(data = {}) {
  return request('/product/upgrade/managerProductNoByList', data, 'post')
}

// 升级包虚拟机列表
export function upgradeVmListByQuery(data = {}) {
  return request('/product/vmInfo/upgradeVmListByQuery', data, 'post')
}

// 编辑升级包
export function saveProductUpgrade(data = {}) {
  return request('/product/upgrade/editUpgrade', data, 'post')
}

// 创建升级包
export function createProductUpgrade(data = {}) {
  return request('/product/upgrade/createUpgrade', data, 'post')
}

// 获取商品升级包列表 
export function upgradePackageList(data = {}) {
  return request('/product/upgrade/upgradePackageList', data, 'post')
}

// 升级虚拟机
export function UpgradeByManage(data = {}) {
  return request('order/crystalOrder/UpgradeByManage', data, 'post')
}

// 升级虚拟机
export function asyncProduct(data = {}) {
  return request('/product/upgrade/syncNewVmByUpgradeNo', data, 'post')
}

// 查询软件列表
export function queryLogVisitManager(data = {}) {
  return request('/system/logVisit/queryLogVisitManager', data, 'post')
}

// 新增软件
export function logVisitAdd(data = {}) {
  return request('/system/logVisit/add', data, 'post')
}

// 编辑软件
export function logVisitEdit(data = {}) {
  return request('/system/logVisit/edit', data, 'post')
}

// 设备列表
export function deviceList(data = {}) {
  return request('/user/device/effectiveDeviceListByPage', data, 'post')
}

// 硬件区域绑定列表
export function hardWareAreaList(data = {}) {
  return request('/user/device/bindDataCenterAddressList', data, 'post')
}

// 硬件区域绑定提交
export function hardWareAreaSubmit(data = {}) {
  return request('/user/device/bindDataCenterAddress', data, 'post')
}

// 编辑软件
export function restoryDevice(data = {}) {
  Object.assign(data, { isFormData: true })
  return request('/user/device/deleteVmUpdateDeviceRelatedBusiness', data, 'post')
}

// 删除软件
export function deleteLogVisitById(data = {}) {
  return request('/system/logVisit/deleteLogVisitById', data, 'post')
}

// /user/device/effectiveDeviceListByPage