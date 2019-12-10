import { LOGIN, LOGOUT, SWITCH_LOADING } from '../constants/actoin_type'
import { USER } from '../constants/storage_key'

interface ActionType {
  type: String,
  data: {
    show: boolean
  }
}

const initialState = {
  user: store.get(USER) || null,
  isShowLoading: false
}

const incrementReducer = (state = initialState, action: ActionType) => {
  switch(action.type) {
    case LOGIN: // 登录
      state.user = action.data
      store.set(USER, action.data)
      return { ...state }
    case LOGOUT: // 退出登录
      state.user = action.data
      store.remove(USER)
      return { ...state }
    case SWITCH_LOADING: // 切换加载中状态
      state.isShowLoading = action.data.show
      return { ...state }
    default: return state
  }
};
export default incrementReducer