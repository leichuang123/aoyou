import { createStore } from 'redux';
import loginReducer from './reducers/index';

const store = createStore(loginReducer);

export default store