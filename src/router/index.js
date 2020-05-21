import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/home'
import Login from '@/components/login/login'
import Users from '@/components/users/users'
import Rights from '@/components/rights/rights'
import Roles from '@/components/roles/roles'

Vue.use(Router)

var route = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children:[
        {
          path: '/users',
          name: 'Users',
          component: Users
        },
        {
          path: '/rights',
          name: 'Rights',
          component: Rights
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
// 导航守卫
route.beforeEach((to,from,next)=>{
  if(to.name == 'Login'){
    next();
  }else{
    var token = localStorage.getItem('token');
    if(!token){
      next({name:'Login'});
    }else{
      next();
    }
  }
});

export default route;
