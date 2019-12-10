import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import stores from './store';
import { Provider } from 'react-redux'
import Login from './views/login/login'
import newUser from './views/new_user/new_user'
import { USER } from './constants/storage_key'

import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

const routes = [
  {
    path: "/login",
    component: Login
  },
  {
    path: "/",
    component: App,
    routes: [ // 这个配置好像没什么用，好神奇 -- 2019-10-30
      {
        path: "/new_user",
        component: newUser
      }
    ]
  }
]

function RouteWithSubRoutes(route: any) {
  const user = store.get(USER) || null
  return (
    <Route
      path={route.path}
      render={props => (
        // 路由拦截。没有用户信息。并且不是去登录页面时，重定向到登录页面
        user === null && route.path !== '/login' ? <Redirect to={{ pathname: '/login'}} /> : <route.component {...props} routes={route.routes} />
      )}
    />
  )
}



const Home: React.FC = () => {
  return (
    <Router>
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    </Router>
  )
}


ReactDOM.render(
    <Provider store={stores}>
      <Home />
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
