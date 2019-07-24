<template>
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 圆形图标 -->
      <div class="login_logo">
        <img :src="url" alt="">
      </div>
      <!-- 登录框 -->
      <div>
        <!-- ref获得element-ui提供的表单对象，可以使用 this.$refs.loginReset.方法 调用 -->
        <el-form
          ref="loginReset"
          label-width="0"
          :rules="rules"
          class="login_form"
          :model="loginForm"
        >
          <el-form-item prop="name">
            <el-input
              placeholder="请输入账号"
              prefix-icon="iconfont icon-user"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              prefix-icon="iconfont icon-3702mima"
              type = "password"
              v-model="loginForm.password"
              @blur="getBlueImgUrl"
              @focus="getFocusImgUrl"
            ></el-input>
          </el-form-item>
          <el-form-item class="vue-button">
            <el-button type="primary" @click="submitForm">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      //表单提交数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      url: require("../assets/logo.png")
    }
  },
  methods: {
    //提交按钮
    submitForm: function() {

      //判断表单所有输入项验证是否成功，成功valid返回 true 失败返回 false
      this.$refs.loginReset.validate(async valid => {
        if (!valid) {
          return this.$message.error('账号不存在或密码错误')
        }
        //获得后台返回的数据
        var data = await this.$http.post('/login', this.loginForm)
        if(data.meta.status != 200) return this.$message.error('账号不存在或密码错误')
        //将token保存在 浏览器的 sessionStorage 中
        window.sessionStorage.setItem('token', data.data.token)
        //消息弹框
        this.$message.success('登录成功')
        //跳转页面
        this.$router.push('/')
      })
    },
    //重置按钮
    reset: function() {
      //重置输入框以及验证信息
      this.$refs.loginReset.resetFields()
    },
    getBlueImgUrl: function (){
      this.url = require("../assets/logo.png")
    },
    getFocusImgUrl: function(){
      this.url = require("../../public/uploads/5d88ce36acaf2edd4453a9d2811001e9380193e9.gif")
    }
  },
  name: 'login'
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 300px;
    width: 400px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 3px;
    // 头像
    .login_logo {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border: 8px solid #fff;
      box-shadow: 0px 0px 10px #ddd;
      border-radius: 50%;
      // background-image: url('../../public/uploads/5d88ce36acaf2edd4453a9d2811001e9380193e9.gif');
      background-size: cover;
      background-color: rgb(238, 238, 238);

      img {
       width: 100%;
       height: 100%;
       border-radius: 50%;
      }
    }

    .login_form {
      margin-top: 95px;
      padding: 0 30px;
    }
    .vue-button {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
