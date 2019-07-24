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
//树形表格
import treeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//将富文本编辑器注册为全局组件
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component("treeTable",treeTable)

//导入loadsh 库
import _ from 'loadsh'

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

//全局过滤器，用来过滤时间
Vue.filter("dateFormat",function (num){
  var time = new Date(num);
  const y = time.getFullYear()
  const m = (time.getMonth()+1+"").padStart(2,'0')
  const d = (time.getDate()+"").padStart(2,'0')
  const hh = (time.getHours()+"").padStart(2,'0')
  const mm = (time.getMinutes()+"").padStart(2,'0')
  const ss = (time.getSeconds()+"").padStart(2,'0')
  return ` ${y}-${m}-${d} ${hh}:${mm}:${ss} `
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
