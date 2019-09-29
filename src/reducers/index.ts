import { LOGIN } from '../constants/actoin_type'

interface ActionType {
  type: String,
  data: Object
}

const initialState = {
  user: {}
};

const incrementReducer = (state = initialState, action: ActionType) => {
  switch(action.type) {
    case LOGIN:
      state.user = action.data
      return { ...state }
    default: return state
  }
};
export default incrementReducer