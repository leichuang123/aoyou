import { createRouter, createWebHashHistory } from 'vue-router'

// 在 Vue-router新版本中，需要使用createRouter来创建路由
export default createRouter({
  // 指定路由的模式,此处使用的是hash模式
  history: createWebHashHistory(),
  // 路由地址
  routes: [
    {
      name: 'index',
      path: '/',
      component: () => import('../views/example.vue')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('../views/login/login.vue')
    },
    {
      name: 'myVm',
      path: '/my_vm',
      component: () => import('../views/my_vm/myVm.vue')
    },
    {
      name: 'mall',
      path: '/mall',
      component: () => import('../views/mall/mall.vue')
    },{
      name: 'mine',
      path: '/mine',
      component: () => import('../views/mine/Index.vue'),
      redirect: '/mine/expense',
      children: [
        {
          name: 'expense',
          path: '/mine/expense',
          component: () => import('../views/mine/expense/Index.vue')
        },
        {
          name: 'coupon',
          path: '/mine/coupon',
          component: () => import('../views/mine/coupon/Index.vue')
        },
        {
          name: 'setting',
          path: '/mine/setting',
          component: () => import('../views/mine/setting/Index.vue')
        },
        {
          name: 'log',
          path: '/mine/log',
          component: () => import('../views/mine/log/Index.vue')
        },
        {
          name: 'change_mobile',
          path: '/mine/change_mobile',
          component: () => import('../views/mine/change_mobile/Index.vue')
        },
        {
          name: 'change_password',
          path: '/mine/change_password',
          component: () => import('../views/mine/change_password/Index.vue')
        }
      ]
    },
    {
      name: 'notice',
      path: '/notice',
      component: () => import('../views/notice/Index.vue')
    },
    {
      name: 'question',
      path: '/question',
      component: () => import('../views/question/Index.vue')
    },
    {
      name: 'search_question',
      path: '/search_question',
      component: () => import('../views/search_question/Index.vue')
    }
  ]
})