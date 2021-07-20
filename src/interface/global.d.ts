
// declare const moment:(selector:any) => any

declare const md5:(str: string) => string

declare namespace layer {
  function load(type: number, params: any): any
  function open(params: any): any
  function close(index: number): any
  function closeAll(): any
}

declare namespace store {
  function get(key: string): any
  function set(key: string, value: any): void
  function remove(key: string): any
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
    message: string;
    data: any,
  }
}

declare module request {
  interface param {
    [key: string]: any,
  }
}