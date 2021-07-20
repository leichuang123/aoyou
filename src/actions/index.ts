import { LOGIN, LOGOUT, SWITCH_LOADING } from '../constants/actoin_type'

export const login = (data: Object) => {
  return {
    type: LOGIN,
    data
  }
}

export const logout = () => {
  return {
    type: LOGOUT
  }
}

export const switch_loading = (data: Object) => {
  return {
    type: SWITCH_LOADING,
    data
  }
}