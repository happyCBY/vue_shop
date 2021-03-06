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
//商品分类页
import categories from "./components/goods/Categories.vue"
//商品分类参数页面
import params from "./components/goods/Params.vue"
//商品列表参数页面
import list from "./components/goods/List.vue"
//添加商品页面
import add from "./components/goods/Add.vue"
//订单管理页面
import orders from "./components/order/Order.vue"
//数据统计页面
import reports from "./components/report/Report.vue"
//vue 全局匹配路由
Vue.use(Router)


var router = new Router({
	routes: [
		{path:"/",redirect: "/welcome"},
		{path: "/login", component: login },
		{path: "/home", component: home, redirect: "/welcome", children: [
			{path: "/welcome", component: welcome},
			//用户列表页
			{path: "/users", component: users},
			//权限列表页
			{path: "/rights", component: rights},
			//角色列表页
			{path: "/roles", component: roles},
			//商品分类页
			{path: "/categories", component: categories},
			{path: "/params", component: params},
			{path: "/goods", component: list},
			{path: "/goods/add", component: add},
			{path: "/orders", component: orders},
			{path: "/reports", component: reports},
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
