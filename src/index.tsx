import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import stores from './store';
import { Provider } from 'react-redux'
import Login from './views/login/login'
import  dictionary from './views/system_management/aid_data/dictionary/dictionary'
import  roles from './views/system_management/company_management/roles/roles'
import { USER, MENUS } from './constants/storage_key'

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
    routes: [ // 这一块主要做权限控制
      {
        path: "/dictionary",
        component: dictionary
      },
      {
        path: "/roles",
        component: roles
      }
    ]
  }
]

function RouteWithSubRoutes(route: any) {
  const user = store.get(USER) || null
  const menus = (store.get(MENUS) || []).map((item: any) => {
    return item.url
  })
  if (user === null && route.path !== '/login') {
    return (
      <Route
        path={route.path}
        render={props => (
          // 路由拦截。没有用户信息。并且不是去登录页面时，重定向到登录页面
          <Redirect to={{ pathname: '/login' }} />
        )}
      />
    )
  }

  if ((menus.length > 0 && user !== null && route.location.pathname !== '/empty' && route.location.pathname !== '/login' && route.location.pathname !== '/' && menus.indexOf(route.location.pathname.substring(1)) === -1)) {
  
    return (
      <Route
        path={route.path}
        render={props => (
          <Redirect to={{ pathname: '/empty' }} />
        )}
      />
    )
  }
  return (
    <Route
      path={route.path}
      render={props => (
        <route.component {...props} routes={route.routes} />
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
