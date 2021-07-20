import { LOGIN, LOGOUT, SWITCH_LOADING, AUTHORITY } from '../constants/actoin_type'
import { USER, CHANNEL_NO } from '../constants/storage_key'
import VueCookies from 'vue-cookies'
import { boxManager, roleList, OrganizationStructure } from '../router/route';

interface ActionType {
  type: String,
  data: any
}

let user = store.get(USER) || null

// @ts-ignore
if (VueCookies.get('userInfo')) {
  // @ts-ignore
  user = VueCookies.get('userInfo')
} else if (localStorage.getItem('userInfo')) {
  // @ts-ignore
  user = JSON.parse(localStorage.getItem('userInfo'))
}

const initialState = {
  user,// token
  isShowLoading: false,
  channelNo: store.get(CHANNEL_NO) || 2, // 1.云之盒web  2.云之盒client 3.pc web， 4.pc client 5.ios  6 安卓
  defaultMenuAuthority: [
    {
      title: '设备管理',
      key: '4',
      icon: 'windows',
      subList: [
        {
          key: '/device/list',
          title: '设备列表',
          component: boxManager,
        },
      ],
    },
    {
      title: '员工管理',
      key: '5',
      icon: 'apartment',
      subList: [
        {
          key: '/employee/list',
          title: '员工列表',
          component: OrganizationStructure,
        },
      ],
    },
    {
      title: '角色管理',
      key: '6',
      icon: 'user',
      subList: [
        {
          key: '/role/list',
          title: '角色列表',
          component: roleList,
        },
      ],
    },],
  // 默认所有的菜单权限
  menuAuthority: [
    {
      title: '设备管理',
      key: '4',
      icon: 'windows',
      subList: [
        {
          key: '/device/list',
          title: '设备列表',
          component: boxManager,
        },
      ],
    },
    {
      title: '员工管理',
      key: '5',
      icon: 'apartment',
      subList: [
        {
          key: '/employee/list',
          title: '员工列表',
          component: OrganizationStructure,
        },
      ],
    },
    {
      title: '角色管理',
      key: '6',
      icon: 'user',
      subList: [
        {
          key: '/role/list',
          title: '角色列表',
          component: roleList,
        },
      ],
    },
  ]
}

const incrementReducer = (state = initialState, action: ActionType) => {
  switch (action.type) {
    case LOGIN: // 登录
      state.user = action.data
      localStorage.setItem('userInfo', JSON.stringify(state.user))
      // document.cookie=`userInfo=${JSON.stringify(state.userInfo)};domain=${location.host.split('.').splice(1,2).join('.')}`;
      // DOTO
      // document.cookie=`userInfo=${JSON.stringify(state.userInfo)};${process.env.NODE_ENV === 'development' ? '' : 'domain=yunzhiqu.com;'}path=/`;
      const expire = '30d'
      // @ts-ignore
      VueCookies.set('userInfo', state.user, expire, '/', process.env.REACT_APP_ENV === 'production' ? 'yunzhiqu.com' : '')
      store.set(USER, action.data)
      return { ...state }
    case LOGOUT: // 退出登录
      state.user = action.data
      store.remove(USER)
      localStorage.removeItem('userInfo')
      // @ts-ignore
      VueCookies.remove('userInfo', null, process.env.REACT_APP_ENV === 'production' ? 'yunzhiqu.com' : '')
      return { ...state }
    case SWITCH_LOADING: // 切换加载中状态
      state.isShowLoading = action.data.show
      return { ...state }
    case AUTHORITY: // 更新用户权限菜单
      state.menuAuthority = state.defaultMenuAuthority.filter((menuItem: any) => {
        return action.data.indexOf(menuItem.key) > -1;
      });
      return { ...state }
    default: return state
  }
};
export default incrementReducer