import Vue from 'vue'
//按钮
import { Button } from 'element-ui'
//表单
import { Form, FormItem } from 'element-ui'
//输入框
import { Input } from 'element-ui'
//消息提示
import { Message } from 'element-ui'

//主体
import { Container } from 'element-ui'
//头部
import { Header } from 'element-ui'
//侧边栏
import { Aside } from 'element-ui'
//底部
import { Footer } from 'element-ui'
//右侧主体内容
import { Main } from 'element-ui'
//下拉
import { Menu } from 'element-ui'
import { Submenu } from 'element-ui'
import { MenuItem } from 'element-ui'
import { MenuItemGroup } from 'element-ui'

//面包屑
import { Breadcrumb } from 'element-ui'
import { BreadcrumbItem } from 'element-ui'

//表格
import { Table } from 'element-ui'
import { TableColumn } from 'element-ui'
//switch开关
import { Switch } from 'element-ui'

//分页
import { Pagination } from 'element-ui'

//文字提示
import { Tooltip } from 'element-ui'

//loading 加载
import {Loading} from 'element-ui'

//对话框
import {Dialog} from 'element-ui'

//MessageBox 弹框
import { MessageBox } from 'element-ui';

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Footer)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Loading)
Vue.use(Dialog)

//全局挂载

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading
Vue.prototype.$confirm = MessageBox.confirm