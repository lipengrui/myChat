import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import mainCon from '@/components/main'
import employees from '@/components/employees/index'
import toview from '@/components/toview/index'
import discount from '@/components/discount/index'
import calculate from '@/components/calculate/index'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
      
    },
    {
      path:'/main',
      name:'mainCon',
      component: mainCon,
      children:[
        {
          path:'/',
          name: 'chat',
          component: employees
        },
        {
          path:'/chat',
          name: 'chat',
          component: employees
        },
        {
          path: '/toview',
          name: 'toview',
          component: toview
        },
        {
          path: '/discount',
          name: 'discount',
          component: discount
        },{
          path: '/calculate',
          name: 'calculate',
          component: calculate
        }
      ]
    }
  ]
})
