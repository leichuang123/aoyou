import { createStore } from 'vuex'
import { USER } from '../config/storage_key'
import debounce from '../utils/debounce.js'

function resetIs1366() {
  return document.body.offsetWidth <= 1919
}
let deviceNo = localStorage.getItem('SERIAL_NUMBER') || ''
deviceNo = '001001A01000100E04C490D99'
const store = createStore({
  state: {
    // user: localStorage.getItem(USER) ? JSON.parse(localStorage.getItem(USER)) : null,
    user: { "userNo": "C201904302311414977", "userNickName": "😂🤡🙀😿😾", "mobile": "13750803526", "status": null, "userName": "", "userPicture": "2020-44-24/15877106563294416.png", "userEmail": "", "limitType": 1, "roleName": null, "type": null, "state": null, "createTime": null, "roleList": null, "token": "c3f8178cf13feb0cf13ffc809a97" },
    deviceNo,
    channelNo: 5,
    mac: deviceNo,
    is1366: resetIs1366(),
  },
  mutations: {
    screenResize(state, is1366) {
      state.is1366 = is1366
    },
    login(state, user) {
      state.user = user
      localStorage.setItem(USER, JSON.stringify(user))
    },
    editName(state, userNickName) {
      const user = JSON.parse(JSON.stringify(state.user))
      user.userNickName = userNickName
      state.user = user
      localStorage.setItem(USER, JSON.stringify(user))
    },
    logout(state) {
      state.user = null
      localStorage.removeItem(USER)
    }
  }
});
export default store

window.onresize = debounce(() => {
  store.commit('screenResize', resetIs1366())
}, 500)
