export const PAGE_SIZE = 10

export const DATE_FORMAT = 'YYYY-MM-DD'

export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

export const SERVER_ERROR = {
  code: -1,
  message: '服务器或网络异常',
  data: null
}
export const ACTIVITY_TYPE_ID = 'activity_type' // 字典获取活动列表
export const CHANNEL_ID =  'putaway_channel' // 字典获取渠道列表
export const PRODUCT_TYPE_ID = '' // 商品类型ID
export const PREPARE_SOFTWARE_ID = 'prepare_software' // 预装软件
export const AGREEMENT_TYPE_ID = 'agreement_type' // 协议类型 1思杰 2串流
export const NOTICE_TYPE_ID = 'notice_type' // 通知类型
export const NOTICE_RECEIVER_TYPE_ID = 'notice_receiver_type' // 通知类型
export const TITLE_SLICE_LENGTH = 10; // 表格标题截取长度
export const VIRTUAL_MACHINE_ID = 'vm_type' // 虚拟机类型
export const DURATION_UNIT = 'duration_unit' // 时长类型
export const SYSEM_DISK_ID = 'system_disk' // 系统盘类型
export const HARD_DISK_ID = 'hard_disk' // 硬盘类型
export const GRAPHIC_MEMORY_ID = 'graphics_memory' // 显存类型
export const OPERATE_SYSTEM_ID = 'operate_system' // 操作类型
export const SELL_CHANNEL = 'sell_channel'
export const CHINANET_SELLCHANNEL = 2
export const MOBILE_MAX_LENGTH = 11 // 手机号最大长度

export const SMALL_IMAGE_TYPE = 1 // 商品上传文件小图类型值
export const BIG_IMAGE_TYPE = 2 // 商品文件上传大图类型值
export const IMAGE_PREFIX = (process.env.REACT_APP_ENV === 'preview' || process.env.REACT_APP_ENV === 'production') ? 'https://static.yunzhiqu.com/' : 'https://static-test.yunzhiqu.com/' 
// export const IMAGE_PREFIX = 'https://static-test.yunzhiqu.com/'
// export const IMAGE_PREFIX = 'https://static.yunzhiqu.com/'
export const UPLOAD_MAX_SIZE = 10 // 文件上传最大值，单位M
export const UPLOAD_IMAGE_TYPE = 0 // 上传图片
export const UPLOAD_FILE_TYPE = 1 // 上传文件

export const DIALOG_WIDTH = 800 // 全局dialog 和drawer宽度
export const DIALOG_MASK_CLOSABLE = true  // 全局配置是否可点击蒙版关闭弹窗
export const PLATFORM_TAG = 2
export const MAXIMUM_RELIEF_AMOUNT = 9999999 // 最大减免金额
export const MAX_STOCK = 9999999  // 最大库存
export const MAXIMUM_CONSUMPTION = 9999999 //最大消费
export const TIME_UNIT_LIST = ['-', '天', '月', '年']

export const INPUT_MAXLENGTH = 20
export const INPUT_MAXVALUE = 9999990000
