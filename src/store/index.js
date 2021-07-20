import Vue from 'vue'
import Vuex from 'vuex'
import {TOURIST} from '../config/rolesConfig'
import { getUserInfo, getUserBalance, logout } from '@/server/api'
import router from "../router/index"
const uuid = require('uuid')

Vue.use(Vuex)
let userInfo = localStorage.getItem('userInfo');
let userBalance = localStorage.getItem('userBalance');
let mac = localStorage.getItem('MAC') || ''
if (!mac) {
  mac = uuid.v4()
  localStorage.setItem('MAC', mac)
}
const store = new Vuex.Store({
  state: {
    count: 10,
    userRoles: TOURIST,
    token: localStorage.getItem('Token'), // 用户token
    userInfo: userInfo ? JSON.parse(userInfo) : null, // 用户信息
    userBalance: userBalance ? JSON.parse(userBalance) : null,
    deviceNo: '',
    mac,
  },
  mutations: {
    editCount(state, payload) {
      Vue.set(state, 'count', payload.count)
    },
    editToken(state,payload) {
      Vue.set(state, 'token', payload)
    },
    updateUserInfo(state,payload) {
      Vue.set(state, 'userInfo', payload)
    },
    updateUserBalance(state,payload) {
      Vue.set(state, 'userBalance', payload)
    },
  },
  actions: {
    editCount(context,payload) {
      context.commit('editCount', payload)
    },
    editToken(context,payload) {
      window.localStorage.setItem('Token',payload.token)
      context.commit('editToken', payload.token)
      store.dispatch('updateUserInfo',{token:payload.token})
    },
    async updateUserInfo(context,payload) {
      let params = {
        token: payload.token
      }
      let response = await getUserInfo(params);
      if(response.code === 200 ) {
        context.commit('updateUserInfo', response.data)
        store.dispatch('updateUserBalance',response.data)
        window.localStorage.setItem("userInfo",JSON.stringify(response.data))
      } else {
        console.warn("用户信息获取失败：",response.msg);
      }
    },
    async updateUserBalance(context,payload){
      let params = {
        token: this.state.token,
        userNo: payload.userNo
      }
      let response = await getUserBalance(params);
      if(response.code === 200 ) {
        context.commit('updateUserBalance', response.data)
        window.localStorage.setItem("userBalance",JSON.stringify(response.data))
      } else {
        console.warn("用户信息获取失败：",response.msg);
      }
    },
    async logout(context) {
      let params = {
        xx: new Date().getTime()
      }
      await logout(params);
      context.commit('editToken', null)
      context.commit('updateUserInfo', null)
      context.commit('updateUserBalance', null)
      window.localStorage.removeItem("Token")
      window.localStorage.removeItem("userInfo")
      window.localStorage.removeItem("userBalance")
      router.replace("/")
    },
    removeUserInfo(context) {
      context.commit('editToken', null)
      context.commit('updateUserInfo', null)
      context.commit('updateUserBalance', null)
      window.localStorage.removeItem("Token")
      window.localStorage.removeItem("userInfo")
      window.localStorage.removeItem("userBalance")
    },
  },
  getters: {
    getCount(state) {
      return state.count;
    },
    getUserRoles(state) {
      return state.userRoles
    },
    getToken(state) {
      return state.token
    },
    getUserInfo(state) {
      return state.userInfo
    },
    getUserBalance(state) {
      return state.userBalance
    },
  },
  modules: {
  }
})

export default store;

// 登录后初始化客服
// window.qimoClientId = {
//   userId: user.cardNo, // 自定义用户的唯一id，不能传空字符串、null、中文，id由字母大小写、数字及'-'和 '_'组成
//   priority: false, // 是否优先进线设置，非必填，值为boolean类型的true或false
//   nickName: user.mobile, // 自定义用户昵称，定义用户昵称则userId必传
//   customField: { // 扩展字段，json对象，对象中的key-value都自定义
//   name: user.userNickName,
//   mobile: user.mobile,
//   }



// 退出登录后清除qimoClientId
// const id = uuid().split('-').join('')
// window.qimoClientId = `offical-${id}`