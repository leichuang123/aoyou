
import { TEST_ISINCOGNITOMODE } from '../constants/storage_key'

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