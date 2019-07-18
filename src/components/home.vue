<template>
  <el-container class="home_container">
    <!-- 标题 -->
    <el-header class="set_bgc">
      <div>
        <img src="../../public/uploads/heima.png" alt />
        <span>电商后台管理系统</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container class="home_container">
      <!-- 侧边栏 -->
      <el-aside :width=" isCollapse?'64px':'200px' ">
        <!-- 折叠菜单栏按钮 -->
        <div class="isCollapse" @click="changeCollapse">|||</div>
        <!-- 菜单栏 -->
        <el-menu
          :default-active="path"
          background-color="#333744"
          text-color="#fff"
          class="el-menu-vertical-demo"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 用户列表 -->
          <el-submenu :index="attr.id+''" v-for="attr in menu_list" :key="attr.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[attr.id]"></i>
              <span>{{attr.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+item.path"
              v-for="item in attr.children"
              :key="item.id"
              @click="setSession(item.path)"
            >
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{item.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
var vm = {
    //创建时触发
    created: function() {
        this.getMenuList()
        this.path = window.sessionStorage.getItem("path");
    },
    data: function() {
        return {
            //获得菜单列表
            menu_list: '',
            //获得各个菜单选项的图标
            iconObj: {
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            //是否折叠菜单栏
            isCollapse: false,
            path: '/users'
        }
    },

    methods: {
        //退出登录
        logout: function() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        //将路由存储在sessionStorage中
        setSession: function(path) {
            this.path = "/"+path;
            window.sessionStorage.setItem("path","/"+path);

        },
        //想数据库发送请求获得菜单数据
        getMenuList: async function() {
            var data = await this.$http.get('/menus')
            if (data.meta.status !== 200) {
                this.$message.error(data.meta.msg)
            }
            this.menu_list = data.data
        },
        //折叠/展开菜单栏
        changeCollapse: function() {
            this.isCollapse = !this.isCollapse
        }
    }
}

export default vm
</script>

<style lang="less" scoped>
//折叠菜单栏按钮
.isCollapse {
    background-color: #4a5064;
    text-align: center;
    line-height: 24px;
    letter-spacing: 0.2em;
    color: #fff;
    font-size: 12px;
    cursor: pointer;
}
.home_container {
    height: 100%;
}
.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: 0;
    }
}
.el-main {
    background-color: #eaedf1;
}
.el-submenu {
    i {
        margin-right: 10px;
    }
}
.set_bgc {
    display: flex;
    background-color: #373d41;
    color: #ededee;
    line-height: 60px;
    justify-content: space-between;
    align-items: center;
    img {
        vertical-align: middle;
    }
    span {
        display: inline-block;
        font-size: 20px;
        margin-left: 20px;
        vertical-align: middle;
    }
}
</style>
