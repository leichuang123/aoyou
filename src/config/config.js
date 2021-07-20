export const PAGE_SIZE = 10

export const DATE_FORMAT = 'YYYY-MM-DD'

export const PLATFORM_TAG = 1

export const UPLOAD_MAX_SIZE = 10 // 文件上传最大值，单位M

export const MIN_PAGE = 1

export const MAX_PAGE_SIZE = 99999999

export const STATEGY_0 = 0 // 无限制

export const STATEGY_1 = 1 // 指定使用者

export const STATEGY_2 = 2 // 免密

export const UPLOAD_IMAGE_TYPE = 0 // 上传图片

export const PERMISSION_ERROR_MESSAGE = '无权限'

export const PERMISSION = {
  delete_device: {
    id: 3,
    name: '删除设备'
  },
  setting_admin: {
    id: 8,
    name: '指定管理员'
  },
  edit_group_name: {
    id: 7,
    name: '组名编辑'
  },
  edit_group_user: {
    id: 10,
    name: '编辑成员'
  },
  edit_role: {
    id: 13,
    name: '修改角色'
  },
  role_setting: { // 父菜单
    id: 6,
    name: '角色选项'
  },
  invate_user: {
    id: 9,
    name: '邀请用户'
  },
  add_role: {
    id: 12,
    name: '增加角色'
  },
  edit_service_type: {
    id: 2,
    name: '使用限制'
  },
  group_user_setting: { // 父菜单
    id: 5,
    name: '成员选项'
  },
  eidt_user_status: {
    id: 11,
    name: '停启用'
  },
  permission_setting: {
    id: 14,
    name: '权限配置'
  },
  box_navigation: { // 父菜单
    id: 1,
    name: '盒子导航'
  },
  group_list_navigation: { // 父菜单
    id: 4,
    name: '设备组导航'
  },
} 

export const SERVER_ERROR = {
  success: 'false',
  code: -1,
  msg: '服务器或网络异常',
  data: '',
  info: '',
  message: '服务器或网络异常'
}

export const IMAGE_PREFIX = (process.env.REACT_APP_ENV === 'preview' || process.env.REACT_APP_ENV === 'production') ? 'https://static.yunzhiqu.com/' : 'https://static-test.yunzhiqu.com/' 