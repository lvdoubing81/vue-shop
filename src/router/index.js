import Vue from 'vue'
import VueRouter from 'vue-router'
import login from "../components/common/login/login";
import home from "../page/home/home";
import welcome from "../page/home/welcome";
import users from "../page/home/users/users";
import rights from "../page/home/power/rights";
import roles from "../page/home/power/roles";
import categories from "../page/home/goods/categories";
import params from "../page/home/goods/params";
import goods from "../page/home/goods/goods";
import add from "../page/home/goods/add";
import orders from "../page/home/order/orders";
import reports from "../page/home/reports/reports";

Vue.use(VueRouter)

  const routes = [
    {
      path: "/",
      redirect:"/login"
    },
    {
      path:"/login",
      component:login
    },
    {
      path: "/home",
      component: home,
      redirect: '/welcome',
      children:[{
        path:'/welcome',
        component:welcome
      },
        {
          path: '/users',
          component: users
        },
        {
          path: '/rights',
          component: rights
        },
        {
          path: '/roles',
          component: roles
        },
        {
          path: '/categories',
          component: categories
        },
        {
          path: '/params',
          component: params
        },
        {
          path: "/goods",
          component: goods
        },
        {
          path: "/goods/add",
          component: add
        },
        {
          path:"/orders",
          component: orders
        },
        {
          path:'/reports',
          component: reports
        }
      ]
    }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next)=>{
  if(to.path === '/login') return next()

  const tokenStr = window.sessionStorage.getItem('token')

  if(!tokenStr) return  next('/login')

  next()
})

export default router
