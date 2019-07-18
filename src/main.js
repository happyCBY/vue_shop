import Vue from 'vue'
import App from './App.vue'
//导入路由模块
import router from './router'
import './plugins/element.js'
//导入全局样式表
import "./assets/css/global.css"
//导入字体图标
import "./assets/fonts/iconfont.css"
//导入axios发送请求模块
import axios from "axios"


//配置全局路径
axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/";

//请求拦截器
//axios请求拦截器
axios.interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem("token");

  return config;
}, function (error) {
  console.log(error)
})


//axios响应拦截器
axios.interceptors.response.use(function (config) {
  return config.data;
}, function (error) {
  console.log(error)
})

Vue.prototype.$http = axios;


Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
