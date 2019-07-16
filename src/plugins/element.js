import Vue from 'vue'
//按钮
import { Button } from 'element-ui'
//表单
import {Form,FormItem} from 'element-ui'
//输入框
import {Input} from 'element-ui'
//消息提示
import {Message} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

//全局挂载Message  消息弹窗提示
Vue.prototype.$message = Message;