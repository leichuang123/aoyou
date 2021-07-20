
import service from "./request"
import { downloadXls } from '../tools/tools'
import { SERVER_ERROR } from '../config/config'

function request(url: string, data: any) {
  return service.post(url, data)
    .then((res: Ajax.AxiosResponse) => {
      return res.data
    })
    .catch((err: any) => {
      console.error(err)
      return SERVER_ERROR
    })
}

function ajax(url: string, data: any, isJson = false) {
  let params = data;
  if (isJson) {
    for (let key in data) {
      url += `${url.indexOf('?') === -1 ? '?' : '&'}${key}=${data[key]}`
    }
    params = null
  }
  return service.get(url, params)
    .then((res: Ajax.AxiosResponse) => {
      return res.data
    })
    .catch((err: any) => {
      console.error(err)
      return SERVER_ERROR
    })
}

function update(url: string, data: any) {
  return service.put(url, data)
    .then((res: Ajax.AxiosResponse) => {
      return res.data
    })
    .catch((err: any) => {
      console.error(err)
      return SERVER_ERROR
    })
}

function deleter(url: string, data: any) {
  let path = url + data
  return service.delete(path)
    .then((res: Ajax.AxiosResponse) => {
      return res.data
    })
    .catch((err: any) => {
      console.error(err)
      return SERVER_ERROR
    })
}

function download(url: string, data: any) {
  return service.post(url, data, {
    responseType: 'blob'
  })
    .then((res: Ajax.Download) => {
      downloadXls(res.data, res.headers.filename)
      return res.data
    })
    .catch((err: any) => {
      console.error(err)
      return SERVER_ERROR
    })
}

// 新用户列表
export function newUserList(data = {}) {
  return request("/buryingPointSystem/retention/userRegister", data)
}

// 新用户列表导出
export function newUserListExport(data = {}) {
  return download("/buryingPointSystem/retention/userRegister/export", data)
}

// 退出登录
export function serverLoginout(data = {}) {
  return request("/user/user/logout", data)
}

// 获取验证码
export function getCode(data = {}) {
  return request("/user/mobile/send/msg", data)
}

// 登录
export function serverLogin(data = {}) {
  return request("user/user/login", data)
}

// 下拉框数据
export function singSelectList(data = {}) {
  return request("/buryingPointSystem/retention/singSelect", data)
}

// 盒子列表
export function boxList(data = {}) {
  return request("/user/device/listByPage", data)
}

// 加加入小组的盒子列表
export function notJoinBoxList(data = {}) {
  return request("/user/device/noAddGroupSelectByPage", data)
}

// 新增用户组
export function addGroup(data = {}) {
  return request("/groupInfo/create", data)
}

// 组列表
export function groupList(data = {}) {
  return request("/user/userGroup/getUserGroupListByQuery", data)
}

// 退出小组
export function quitGroup(data = {}) {
  return request("/user/userDevice/backUser", data)
}

// 修改组
export function updateGroup(data = {}) {
  return request("/user/groupInfo/update", data)
}

// 修改组
export function groupUserList(data = {}) {
  return request("/user/userGroup/listByPage", data)
}

// 设备入组
export function addDeviceToGroup(data = {}) {
  return request("/user/device/deviceAddGroup", data)
}

// 删除组内设备
export function delGroupDevice(data = {}) {
  return request("/user/userDevice/backDevice", data)
}

// 组内设备列表
export function groupDeviceList(data = {}) {
  return request("/user/deviceGroup/listByPage", data)
}

// 修改设备服务类型
export function updateServiceType(data = {}) {
  return request("/user/userDevice/bindUser", data)
}



// 角色列表
export function roleListData(data = {}) {
  return request("/user/roleGroup/listByPage", data)
}

// 编辑角色
export function editRole(data = {}) {
  return request("/user/roleGroup/update", data)
}

// 新增角色
export function addRole(data = {}) {
  return request("/user/roleGroup/create", data)
}

// 邀请用户入组
export function inviteUser(data = {}) {
  return request("/user/userGroup/invate", data)
}

// 设置超级管理员
export function setSuperMan(data = {}) {
  return request("/user/userGroup/changeAdmin", data)
}

// 消息列表
export function NoticeListData(data = {}) {
  return request("/user/notice/info/listByPage", data)
}

// 新建设备组
export function addDeviceGroup(data = {}) {
  return request("/user/deviceGroup/add", data)
}

// 获取用户信息
export function getUserInfo(data = {}) {
  return request("/user/user/base/get", data)
}

// 成员状态操作
export function changeUserState(data = {}) {
  return request("/user/userGroup/changeUserGroup", data)
}

// 角色权限列表
export function rolePermissionList(data = {}) {
  return request("/user/userResource/userResourceList", data)
}

// 更新角色权限
export function updateRolePermission(data = {}) {
  return request("/user/userRoleResource/update", data)
}

// 获取盒子策略类型
export function getDeviceStrategy(data = {}) {
  return request("/user/userDevice/bindUserSelect", data)
}

// 通过或拒绝消息
export function acceptOrNotInviate(data = {}) {
  return request("/user/userGroup/acceptUserInvate", data)
}

// 删除消息
export function delNotice(data = {}) {
  return request("/user/notice/sign/delete", data)
}

// 标记消息为已读
export function setNoticeRead(data = {}) {
  return request("/user/notice/sign/read", data)
}

// 获取用户角色
export function getUserRole(data = {}) {
  return request("/user/userGroup/userInfoDetail", data)
}

// 编辑组员角色
export function editGroupUserRole(data = {}) {
  return request("/user/userGroup/modifyUserRole", data)
}

// 操作鉴权
export function checkOperatePermission(data = {}) {
  return request("/user/userResource/ifHaveResource", data)
}

// 还原主机
export function resetBoxVm(data = {}) {
  return request("/machineOperation/vm/resetVmByDeviceNo", data)
}

// 保存封面图
export function saveCover(data = {}) {
  return request("/user/groupInfo/updateCoverInfoById", data)
}

//  2021/6 企业管理同步钉钉企业的功能

// 企业管理平台，使用云之趣账号临时登录
export function yunnyLogin(data = {}) {
  return request("/login/yunny/login", data)
}

// 使用云之趣账号并选择一个公司登录
export function loginWithCompany(data = {}) {
  return request("/login/yunny/loginWithCompany", data)
}

// 创建公司
export function createCompany(data = {}) {
  return request("/company/user/register", data)
}

// 注销登录
export function logoutSystem(data = {}) {
  return request("/login/logout", data = {})
}

// 获取公司组织架构
export function getCompanyTree(data = {}) {
  return ajax("/department/listAsTree", data = {})
}
// 新增部门
export function createDepartment(data = {}) {
  return request("/department/create", data)
}
// 获取单个部门详情数据
export function getRowDepartmentDetail(departmentId: any) {
  let requestUrl = `/department/info/${departmentId}`
  return ajax(requestUrl, null)
}
// 查询指定部门下所有员工列表
export function getRowDepartmentOption(departmentId: any) {
  let requestUrl = `/employee/listByDepartment/${departmentId}`
  return ajax(requestUrl, null)
}
// 查询指定部门下员工列表
export function getRowDepartmentList(data = {}) {
  return request("/employee/listByPage", data)
}

// 编辑单个部门
export function updateRowDepartment(data = {}) {
  return update("/department/update", data)
}

// 删除部门
export function deleteRowDepartment(data = {}) {
  return deleter("/department/delete/", data)
}

// 查询所有角色下拉数据
export function getRoleOption() {
  return ajax('/companyRole/list', null)
}
// 新增成员
export function addMember(data = {}) {
  return request('/employee/invitation/send', data)
}
// 编辑成员
export function editMember(data = {}) {
  return update('/employee/update', data)
}
// 修改成员状态和角色
export function editMemberStatusAndRole(data = {}) {
  return update('/employee/roleAndStatus/update', data)
}

// 查询所有的权限
export function getAllAuthority() {
  return ajax('/companyResource/listAsTree', null)
}

// 设备列表
export function getDeviceList(data = {}) {
  return request('/company/companyDeviceList', data)
}
// 新增设备
export function addDevice(data = {}) {
  return request('/company/addEmployeeDevice', data)
}

// 设置设备类型
export function setDeviceType(data = {}) {
  return request('/company/batchEmployeeAndDevice', data)
}

// 获取角色列表
export function roleList(data: {}) {
  return request('/companyRole/listByPage', data)
}

// 获取设备类型详情
export function getBoxSetting(data: {}) {
  return ajax('/company/device/strategyInfo', data, true)
}
// 新增角色
export function addCompanyRole(data: {}) {
  return request('/companyRole/create', data)
}
// 编辑角色
export function editCompanyRole(data: {}) {
  return request('/companyRole/update', data)
}
// 获取所有权限展示
export function getAllRoleList() {
  return ajax('/companyResource/listAsTree', null)
}
// 获取角色权限
export function getRoleHaveResource(data: {}) {
  return request('/companyRoleResource/roleHaveResourceList', data)
}
// 更新角色权限
export function updateRoleResource(data: {}) {
  return request('/companyRoleResource/endowResource', data)
}
// 登陆后获取登录用户信息
export function getInfo() {
  return ajax('/employee/info', null)
}
// 钉钉二维码登录
export function ddLogin(code: any) {
  let path = `/login/dingtalk/qrCode?authCode=${code}`
  return request(path, {})
}
