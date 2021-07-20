
// declare const moment:(selector:any) => any

declare const md5:(str: string) => string

declare namespace store {
  function get(key: string): any
  function set(key: string, value: any): void
  function remove(key: string): any
}

declare namespace window {
  const location: any
  const open: any
  const loginUrl: any
}

declare namespace Ajax {
  // axios 返回数据
  export interface AxiosResponse {
    data: AjaxResponse;
  }

  export interface Download {
    data: string,
    headers: any
  }

  // 请求接口数据
  export interface AjaxResponse {
    code: number;
    info: any;
    msg: string;
    success: string;
    data?: any,
    message: string,
  }
}

declare module request {
  interface param {
    [key: string]: any,
  }
}

declare interface Window {
  DDLogin: any
}