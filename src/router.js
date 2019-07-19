import Vue from 'vue'
import Router from 'vue-router'
//导入  登录页面 组件
import login from "./components/Login.vue"
//导入 home 组件
import home from "./components/Home.vue"
//导入后台 welcome 组件
import welcome from "./components/Welcome.vue"
//用户列表页
import users from "./components/User/Users.vue"
//用户权限页
import rights from "./components/power/Rights.vue"
//用户角色列表页
import roles from "./components/power/Rules.vue"
//vue 全局匹配路由
Vue.use(Router)


var router = new Router({
	routes: [
		{path:"/",redirect: "/welcome"},
		{path: "/login", component: login },
		{path: "/home", component: home, redirect: "/welcome", children: [
			{path: "/welcome", component: welcome},
			{path: "/users", component: users},
			{path: "/rights", component: rights},
			{path: "/roles", component: roles},
		]},

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
