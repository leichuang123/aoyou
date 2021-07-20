
import { TEST_ISINCOGNITOMODE } from '../constants/storage_key'
import { PLATFORM_TAG } from '../config/config'
import { USER } from '../constants/storage_key'

export const getUploadHeader = () => {
  const user = store.get(USER) || null
  return {
    token: user.token,
    platformTag: PLATFORM_TAG
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
  let blob = new Blob([content], {'type': 'application/vnd.ms-excel'});
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
}

export const formatProduct = (originList: any) => {
  let list: any = []
  originList.forEach((item: any) => {
    var obj = {
      label: item.name,
      value: item.id + '',
      id: item.id,
      url: item.url || '',
      parentId: item.parentId,
      isLeaf: true,
      state: item.state,
    }
    const key = item.parentId + ''
    if (typeof list[item.parentId] === 'undefined') {
      list[key] = [obj]
    } else {
      list[key].push(obj)
    }
  })
  list = list.filter((item: any) => {
    return typeof item !== 'undefined'
  })
  let index = list.length - 1
  for (; index >= 1; index--) {
    let litem = list[index]
    list.splice(index, 1)
    list.forEach((itemList: any) => {
      itemList.forEach((item: any) => {
        if (item.id === litem[0].parentId) {
          item.children = litem
          item.isLeaf = false
        }
      })
    })
  }
  return list[0]
}

// 格式化数据中心数据
export const formatDataCenter = (originList: any) => {
  let list: any = []
  originList.forEach((item: any) => {
    var obj = {
      label: item.name,
      value: item.id + '',
      id: item.id,
      url: item.apiUrl || '',
      parentId: item.parentId,
      isLeaf: true,
      state: item.status,
      level: item.level
    }
    const key = item.parentId + ''
    if (typeof list[item.parentId] === 'undefined') {
      list[key] = [obj]
    } else {
      list[key].push(obj)
    }
  })
  list = list.filter((item: any) => {
    return typeof item !== 'undefined'
  })
  let index = list.length - 1
  for (; index >= 1; index--) {
    let litem = list[index]
    list.splice(index, 1)
    list.forEach((itemList: any) => {
      itemList.forEach((item: any) => {
        if (item.id === litem[0].parentId) {
          item.children = litem
          item.isLeaf = false
        }
      })
    })
  }
  return list[0]
}

export const formatMenu = (originList: any) => {
  let list: any = []
  if (originList.length === 0) {
    return list
  }
  originList.forEach((item: any) => {
    var obj = {
      id: item.id,
      title: item.name,
      key: item.url || '',
      parentId: item.parentId,
      isLeaf: true,
    }
    const key = item.parentId + ''
    if (typeof list[item.parentId] === 'undefined') {
      list[key] = [obj]
    } else {
      list[key].push(obj)
    }
  })
  
  list = list.filter((item: any) => {
    return typeof item !== 'undefined'
  })
  if (list.length === 1 && list[0].parentId === 0) {
    // console.log(list)
    return list[0]
  }
  let index = list.length - 1
  for (; index >= 1; index--) {
    let litem = list[index]
    list.splice(index, 1)
    list.forEach((itemList: any) => {
      itemList.forEach((item: any) => {
        if (item.id === litem[0].parentId) {
          item.subList = litem
          item.isLeaf = false
        }
      })
    })
  }
  return list.length > 0 ? list[0] : []
}

export function codeInfoListFilter(list = []) {
  let newList:any = [];
  try {
    newList = list.filter((item:any) => {
      return +item.state === 1;
    });
  } catch (error) {
    console.warn('codeInfoListFilter err:',error);
  }
  return newList;
}
