import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux'
import Login from './views/login/login'

import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

const Home: React.FC = () => {
  return (
    <Router>
      <div>
      <Route exact path="/" component={App} />
      <Route path='/login' component={Login}></Route>
      </div>
    </Router>
  )
}


ReactDOM.render(
    <Provider store={store}>
      <Home />
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
