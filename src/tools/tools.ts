
import { TEST_ISINCOGNITOMODE, USER } from '../constants/storage_key'
import { PLATFORM_TAG } from '../config/config'
import VueCookies from 'vue-cookies'

export const getUploadHeader: any = () => {
  let user = store.get(USER) || null
  // @ts-ignore
  if (VueCookies.get('userInfo')) {
    // @ts-ignore
    user = VueCookies.get('userInfo')
  } else if (localStorage.getItem('userInfo')) {
    // @ts-ignore
    user = JSON.parse(localStorage.getItem('userInfo'))
  }
  return {
    token: user.token,
    platformTag: PLATFORM_TAG,
    channelNo: 2,
  }
}

export const isIncognitoMode = () => {
  try {
    localStorage.setItem(TEST_ISINCOGNITOMODE, 'aoyou')
    return false
  } catch (e) {
    console.log(e)
    return true
  }
}

export const downloadXls = (content: string, filename = '') => {
  let elink = document.createElement("a");
  // 设置下载文件名
  if (filename === '') {
    filename = new Date().getTime() + '.xlsx'
  }
  elink.download = filename
  elink.style.display = "none";
  let blob = new Blob([content], { 'type': 'application/vnd.ms-excel' });
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
}

export const getUrlParam = (url: string) => {
  if (url.indexOf('?') === -1) {
    return {}
  }
  const paramArr = url.split('?')[1].split('&')
  const param: any = {}
  paramArr.forEach((item: string) => {
    param[item.split('=')[0]] = item.split('=')[1]
  })
  return param
}

// 防抖处理:一般用于按钮重复点击，浏览器窗口缩放....
// demo:onClick={debounce(this.handleOkInvite, 500)}
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout | null = null;//借助闭包
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, delay) // 简化写法
  }
}

// 节流处理:一般用户输入框远程搜索...
//  demo:onchange = throttle((e: any) => {
//       ...
//     }, 3000);
export const throttle = (fn: { apply: (arg0: any, arg1: any[]) => void }, wait: number) => {
  let flag = true
  const interval = wait || 2000
  return function (this: any, ...args: any) {
    if (flag) {
      fn.apply(this, args)
      flag = false
      setTimeout(() => {
        flag = true
      }, interval)
    }
  }
}