import Vue from 'vue'
import Router from 'vue-router'
// import Home from '@/components/home/home'
//路由懒加载 指页面在加载路由时 的首频优化 ：只在使用当前路由时，才去加载js文件
const Home = ()=> import('@/components/home/home')
const Login = ()=> import('@/components/login/login')
const Users = ()=> import('@/components/users/users')
const Roles = ()=> import('@/components/roles/roles')

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
