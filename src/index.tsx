import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import stores from './store';
import { Provider } from 'react-redux';
import Login from './views/login/login';
import { USER } from './constants/storage_key';
import VueCookies from 'vue-cookies';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

const routes = [
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/',
        component: App,
    },
];

function RouteWithSubRoutes(route: any) {
    let user = store.get(USER) || null;
    // @ts-ignore
    if (VueCookies.get('userInfo')) {
        // @ts-ignore
        user = VueCookies.get('userInfo');
    } else if (localStorage.getItem('userInfo')) {
        // @ts-ignore
        user = JSON.parse(localStorage.getItem('userInfo'));
    }
    // user = {}
    return (
        <Route
            path={route.path}
            render={(props) =>
                // 路由拦截。没有用户信息。并且不是去登录页面时，重定向到登录页面
                user === null && route.path !== '/login' ? (
                    <Redirect to={{ pathname: '/login' }} />
                ) : (
                    <route.component {...props} routes={route.routes} />
                )
            }
        />
    );
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
    );
};

ReactDOM.render(
    <Provider store={stores}>
        <Home />
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
