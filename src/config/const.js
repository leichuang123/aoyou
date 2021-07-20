export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_LOGIN = 6;
export const PASSWORD_MAX_LENGTH = 16;
export const PHONE_NUMBER_LENGTH = 11;
export const VCODE_LENGTH = 6;
export const ACODE_MIN_LENGTH = 10;
export const ACODE_MAX_LENGTH = 12;
export const VCODE_TIME = 60;
export const REBOOT_COUNT_TIME = 3; //重启倒计时，单位分钟
export const RESET_COUNT_TIME = 3; // 重置倒计时，单位分钟
export const LOOP_HEAET_TIME = 5 * 1000 // 统计心跳轮询时间
export const NICKNAME_MAX_LENGTH = 15;
export const EMPTY_TIP = {
  phone: "手机号码输入为空，请重新输入",
  password: "密码输入为空，请重新输入",
  passwda: "确认密码输入为空，请重新输入",
  vcode: "验证码输入为空，请重新输入",
  acode: "激活码输入为空，请重新输入"
}
export const PLACEHOLDER = {
  phone: "请输入手机号",
  password: "请输入密码",
  passworda: "请再次输入密码",
  vcode: "请输入验证码",
  acode: "请输入激活码"
}
export const ERRORTIP = {
  phone: `请输入正确的${PHONE_NUMBER_LENGTH}位手机号`,
  vcode: `请输入${VCODE_LENGTH}位验证码`,
  password: `请输入${PASSWORD_MIN_LENGTH}到${PASSWORD_MAX_LENGTH}位的密码`,
  passwordlogin: `请输入${PASSWORD_MIN_LENGTH_LOGIN}到${PASSWORD_MAX_LENGTH}位的密码`,
  acode: `请输入${ACODE_MIN_LENGTH}到${ACODE_MAX_LENGTH}位的激活码`,
  passwdNotSame: "两次密码不一致"
}
export const REGEXPRULE = {
  phone: /^1[0-9]{10}$/,
  number: /[^0-9]+/g,
  chinese: /[\u4E00-\u9FA5\uF900-\uFA2D]/,
}

export const STATEGY_0 = 0 // 无限制
export const STATEGY_1 = 1 // 指定使用者
export const STATEGY_2 = 2 // 免密

export const PREPARE_SOFTWARE_ID = 'prepare_software' // 预装软件
export const SYSEM_DISK_ID = 'system_disk' // 系统盘类型
export const HARD_DISK_ID = 'hard_disk' // 硬盘类型
export const GRAPHIC_MEMORY_ID = 'graphics_memory' // 显存类型
export const OPERATE_SYSTEM_ID = 'operate_system' // 操作系统类型
export const IMAGE_PREFIX = (import.meta.env.MODE === 'preview' || import.meta.env.MODE === 'production') ? 'https://static.yunzhiqu.com/' : 'https://static-test.yunzhiqu.com/'
// export const IMAGE_PREFIX = 'https://static-test.yunzhiqu.com/'
// export const IMAGE_PREFIX = 'https://static.yunzhiqu.com/'
export const TIME_UNIT_LIST = [{ name: '-', count: 0 }, { name: '天', count: 1 }, { name: '月', count: 30 }, { name: '年', count: 365 }]
export const EXCHANGE_RATE = 1000
export const PAGE_SIZE = 10

// export const WEBSOCKET_ADDRESS = 'ws://192.168.7.245:3002'
export const WEBSOCKET_ADDRESS = 'wss://socket.yunzhiqu.com'

export const COVER_PREFIX = 'https://yunnybox.yunzhiqu.com/vm_cover/'
// export const WEBSOCKET_ADDRESS = 'ws://192.168.6.81:3002'

export const QUESTION_ARTIEL_TYPE = 'contents_categories' // 常见问题
export const INTRO_ARTIEL_TYPE_VALUE = 1 // 使用说明
export const QUESTION_ARTIEL_TYPE_VALUE = 2 // 常见问题
