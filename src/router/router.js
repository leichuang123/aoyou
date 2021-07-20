import { NORMAL_USER } from '@/config/rolesConfig.js'
const routes = [
  {
    path: '/login',
    name: 'Login',
    meta: {

    },
    component: () => import('../views/Login.vue')
  },
  {
    path: '/mall',
    // name: 'Mall',
    meta: {
      role: NORMAL_USER
    },
    // component: () => import('../views/mall/Mall.vue'),
    component: () => import(/* webpackChunkName: "home" */ '../layout/Layout.vue'),
    children: [
      {
        path: '/',
        name: 'MallIndex',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/mall/page/Index.vue')
      },
      {
        path: 'list',
        name: 'MallList',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/mall/page/List.vue')
      },
      {
        path: 'detail',
        name: 'MallDetail',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/mall/page/Detail.vue')
      },
      {
        path: 'my_vm',
        name: 'MyVm',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/mall/page/MyVm.vue')
      },
      {
        path: 'loading',
        name: 'Loading',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/mall/page/Loading.vue')
      }
    ]
  },
  {
    path: '/',
    // name: 'Home',
    component: () => import('../layout/Layout.vue'),
    children: [
      {
        path: '/',
        name: 'Index',
        component: () => import('../views/official/index/Index.vue'),
      },
      {
        path: '/index',
        name: 'index',
        component: () => import('../views/official/index/Index.vue'),
      },
      {
        path: '/download',
        name: 'download',
        component: () => import('../views/official/download/Download.vue'),
      },
      {
        path: '/product',
        name: 'product',
        component: () => import('../views/official/product/Product.vue'),
      },
      {
        path: '/contact',
        name: 'contact',
        component: () => import('../views/official/Contact.vue'),
      },
      {
        path: '/about',
        name: 'About',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/official/about/About.vue')
      },
      {
        path: '/service_support',
        name: 'ServiceSupport',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/official/service_support/ServiceSupport.vue')
      },
      {
        path: '/proxy',
        name: 'Proxy',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/official/Proxy.vue')
      },
      {
        path: '/resolve',
        name: 'Resolve',
        meta: {
          role: NORMAL_USER
        },
        component: () => import( '../views/official/Resolve.vue')
      },
      {
        path: '/product',
        name: 'Product',
        meta: {
          role: NORMAL_USER
        },
        component: () => import('../views/official/product/Product.vue')
      },
    ]
  },
  {
    path: '/mine',
    name: "MINE",
    meta: {
      Token: true
    },
    component: () => import(/* webpackChunkName: "home" */ '../views/mine/Layout.vue'),
    children:[
      {
        path: '',
        name: 'MineIndex',
        meta: {
          Token: true
        },
        component: () => import('../views/mine/index/Index.vue'),
      },
      {
        path: 'index',
        name: 'Index',
        meta: {
          Token: true
        },
        component: () => import('../views/mine/index/Index.vue'),
      },
      {
        path: 'info',
        name: 'Info',
        meta: {
          Token: true
        },
        component: () => import('../views/mine/info/Info.vue'),
      },
      {
        path: 'message',
        name: 'Message',
        meta: {
          Token: true
        },
        component: () => import('../views/mine/message/Message.vue'),
      },
    ]
  }
]
export default routes;