import {
  vmListPaging,
} from '@/server/api.js'

export async function downloadFile(res, globalThis) {

  let filename = ''
  let contentDisposition = res.headers['content-disposition'] || ''
  if (contentDisposition !== '' && contentDisposition.indexOf('.ica') !== -1 && contentDisposition.split('filename=').length === 2) {
    filename = contentDisposition.split('filename=')[1]
  } else {
    filename = `${new Date().getTime()}.ica`
  }
  
  // ica会出现三种异常情况
  // 1. ica内容为json。例如 {"errorId":"CouldNotConnectToWorkstation","fileFetchUrl":null,"status":"failure"}
  // 2. 服务端调用ica过程异常，会返回 success, code, msg, info 相关字段
  // 3. 文件名异常时，后缀为.ic
  // if ((res.data.type && res.data.type === 'application/json') || (typeof res.data.success !== 'undefined') || filename.endsWith('.ic')) {
  //   globalThis.$modal.show('message', {text: '连接失败，请稍后重试...'})
  //   return
  // }
  // console.log(res)
  if (res.data.type && res.data.type === 'application/json') {
    globalThis.$message.error('连接失败，请稍后重试...' )
    return
  }
  if (res.code !== undefined || !res.data) {
    globalThis.$message.error('连接失败，请稍后重试...' )
    return;
  }
  // console.log(window.location.href)
  if (globalThis.$store.state.channelNo === 5 && window.sendica) {
    window.sendica(res.data)
    return
  }
  const content = res.data

  let blob = new Blob([content], { 'type': 'text/plain;charset=utf-8' })
  window.saveAs(blob, filename)
}

export async function getBoxList(globalThis) {
  let response = await vmListPaging({
    deviceNo: globalThis.$store.state.deviceNo,
    productName: '',
    currentPage: 1,
    pageSize: 9999,

  });
  if (!response) {
    return
  }
  if (response.code === 104100004) { // 兼容极端情况，免密策略查询到状态为分配中
    globalThis.$router.push(`/loading?type=6`)
  } else if (response.code === 200) {
    let dataListLength = response.data.dataList.length;
    if (dataListLength === 0) {
      globalThis.$router.push(`/anyUser`)
      return
    }
    let vmINfo = response.data.dataList[dataListLength - 1];
    globalThis.$router.push(`/loading?type=2&user_name=${vmINfo.durationOrderVO.machineKey}&user_pwd=""&vm_type=""&vmid=""&backroute=anyuser`)
  } else {
    // globalThis.$modal.show('message', {text: response.message})
    globalThis.$router.push(`/anyUser`)
  }

}

export async function switchCustomer() {
  window.qimoChatClick()
}