import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login'
import Register from '@/components/login/register'
import RegisterSuccess from '@/components/login/registerSuccess'
import History from '@/components/operationLog/history'
import CompressGltf from '@/components/3dtilesTools/CompressGltf'
import NotFound from '@/components/others/404'
import Home from '@/components/home'

Vue.use(Router)


//解决vue-router 同一路由多次点击报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component:  Login
    },
    {
      path: '/login',
      name: 'login',
      component:  Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/register-success',
      name: 'register-success',
      component: RegisterSuccess
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path:'/',
      component:Home,
      children: [
        {
          path: '/history',
          name: 'history',
          component: History
        },
        {
          path: '/compressGltf',
          name: 'compressGltf',
          component: CompressGltf
        },
        {
          path: '/404',
          component: NotFound
        }
      ]
    },
    {
      path: '*',
      redirect: { path: '/404' }
    }
  ]
})
