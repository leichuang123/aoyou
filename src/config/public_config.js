export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 30;
export const PHONE_NUMBER_LENGTH = 11;
export const VCODE_LENGTH = 6;
export const ACODE_MIN_LENGTH = 10;
export const ACODE_MAX_LENGTH = 12;
export const VCODE_TIME = 60;
export const PAGE_SIZE = 10


export const PREPARE_SOFTWARE_ID = 'prepare_software' // 预装软件
export const SYSEM_DISK_ID = 'system_disk' // 系统盘类型
export const HARD_DISK_ID = 'hard_disk' // 硬盘类型
export const GRAPHIC_MEMORY_ID = 'graphics_memory' // 显存类型
export const OPERATE_SYSTEM_ID = 'operate_system' // 操作系统类型

export const IMAGE_PREFIX = (process.env.VUE_APP_BUILD_ENV === 'preview' || process.env.VUE_APP_BUILD_ENV === 'production') 
? 'https://static.yunzhiqu.com/' : 'https://static-test.yunzhiqu.com/' 

export const TIME_UNIT_LIST = [{ name: '-', count: 0 }, { name: '天', count: 1 }, { name: '月', count: 30 }, { name: '年', count: 365 }]
export const EXCHANGE_RATE = 1000
