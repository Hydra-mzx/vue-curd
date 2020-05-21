// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import './assets/css/style.css'

import myaxios from '@/assets/js/myaxios';
//封装 为全局插件 参考vue文档的插件

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(myaxios);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
