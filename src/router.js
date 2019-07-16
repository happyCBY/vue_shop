import Vue from 'vue'
import Router from 'vue-router'
//导入  登录页面 组件
import login from "./components/login.vue"
//导入 home 组件
import home from "./components/home.vue"

//vue 去全局匹配路由
Vue.use(Router)



var router = new Router({
	routes: [
		{path:"/",redirect: "/login"},
		{path: "/login", component: login },
		{path: "/home", component: home },
	]
})

//导航守卫
router.beforeEach((to,from,next)=>{
	//to 代表要访问的路径 to.path 获得访问的路径
	//from 代表从哪个路径跳转 from.path 获得访问的路径
	//next 代表放行 next() 直接放行  next("/login") 强制跳转
	if(to.path === "/login") return next();
	if( !window.sessionStorage.getItem("token")) return next("/login");
	next();

})

export default router
