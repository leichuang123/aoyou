import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router.js'
import store from '../store/index.js'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) =>{
  const userToken = store.getters.getToken;
  const nextPageMeta = to.meta;
  if(nextPageMeta.Token && !userToken) {
    
    if(to.name === 'Login') {
      next()
    } else {
      console.log('>>',to.name)
      next({ path: '/login' })
    }
  } else {
    next()
  }
//   if (to.path === '/login') {
//     // if is logged in, redirect to the home page
//     next({ path: '/' })
//   }  else {
//     console.log(userRoles, nextPageRoles)
//     if( userRoles === nextPageRoles) {
//       next({ ...to, replace: true })
//     } else {
//       console.log('mmp')
//       next({ path: '/login' })
//     }
//   }
  // next();
})

export default router
