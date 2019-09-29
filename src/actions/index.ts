import { LOGIN } from '../constants/actoin_type'

export const login = (data: Object) => {
  return {
    type: LOGIN,
    data
  };
}