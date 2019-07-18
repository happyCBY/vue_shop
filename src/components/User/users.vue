<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-container class="user_container">
      <!-- 头部 -->
      <el-header>
        <el-input placeholder="请输入搜索内容" v-model="queryInfo.query" clearable @clear="getUserList">
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
        <el-button type="primary" @click="dialogFormVisible = true">添加</el-button>
      </el-header>

      <!-- 主体 -->
      <el-main>
        <template>
          <el-table :data="userList" style="width: 99.9%" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"></el-table-column>
            <el-table-column prop="role_name" label="角色"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.mg_state"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="changStatus(scope.row.id,scope.row.mg_state)"
                  v-loading.fullscreen.lock="fullscreenLoading"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改用户按钮 -->
                <el-tooltip class="item" effect="dark" content="修改用户" placement="top">
                  <el-button
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="showUpdate(scope.row)"
                  ></el-button>
                </el-tooltip>
                <!-- 删除用户按钮 -->
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                  <el-button type="danger" icon="el-icon-delete" circle @click="openDel(scope.row.id)"></el-button>
                </el-tooltip>
                <!-- 分配角色按钮 -->
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                  <el-button type="warning" icon="el-icon-star-off" circle></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>

      <!-- 尾部 -->
      <el-footer>
        <div class="block">
          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1,2,5,10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-footer>

      <!-- 添加用户 -->
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" modal>
        <el-form ref="adduser" :rules="rules" :model="form">
          <el-form-item label="用户名:" :label-width="formLabelWidth" clearable prop="username">
            <el-input v-model="form.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码:" :label-width="formLabelWidth" show-password prop="password">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" :label-width="formLabelWidth" clearable prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话:" :label-width="formLabelWidth" clearable prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="adduser">确 定</el-button>
          <el-button type="info" @click="resetAdd">重置</el-button>
        </div>
      </el-dialog>

      <!-- 修改用户 -->
      <el-dialog title="修改用户" :visible.sync="updateFormVisible" width="50%" modal>
        <el-form ref="updateUser" :rules="rules" :model="form">
          <el-form-item label="用户名:" :label-width="formLabelWidth" clearable>
            <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" :label-width="formLabelWidth" clearable prop="email">
            <el-input v-model="form.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话:" :label-width="formLabelWidth" clearable prop="mobile">
            <el-input v-model="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser">确 定</el-button>
          <el-button type="info" @click="resetUpdate">重置</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
export default {
    created: function() {
        this.getUserList()
    },
    data() {
        var checkEmail = function(rule, value, callback) {
            var zz = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
            if (zz.test(value)) {
                callback()
            } else {
                callback(new Error('邮箱格式不正确'))
            }
        }
        var checkMobile = function(rule, value, callback) {
            var zz = /1[34578][0-9]{9}/
            if (zz.test(value)) {
                callback()
            } else {
                callback(new Error('电话格式不正确'))
            }
        }
        return {
            //获得用户列表
            userList: [],
            //请求用户列表的携带的参数
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            //获得的总的信息条数
            total: 0,
            //loading 是否加载
            fullscreenLoading: false,
            //控制添加对话框的显示与隐藏
            dialogFormVisible: false,
            //控制修改用户对话框的显示与隐藏
            updateFormVisible: false,
            form: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            //控制
            formLabelWidth: '100px',
            //添加表单验证规则
            rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' },
                    {
                        min: 3,
                        max: 8,
                        message: '长度在 3 到 8 个字符',
                        trigger: 'blur'
                    }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    {
                        min: 6,
                        max: 15,
                        message: '长度在 6 到 15 个字符',
                        trigger: 'blur'
                    }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    {
                        validator: checkEmail,
                        trigger: 'blur'
                    }
                ],
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    {
                        validator: checkMobile,
                        trigger: 'blur'
                    }
                ]
            },
            //修改用户时传递的id
            updateId: '',


        }
    },
    methods: {
        //获得用户列表
        getUserList: async function() {
            var data = await this.$http.get('users', { params: this.queryInfo })
            if (data.meta.status != 200) {
                return this.$message.error('获取用户列表失败')
            }
            this.userList = data.data.users
            //获得用户个数
            this.total = data.data.total
        },
        //修改用户状态
        changStatus: async function(id, status) {
            // this.fullscreenLoading = true
            var data = await this.$http.put(`/users/${id}/state/${status}`)
            if (data.meta.status != 200) {
                status = !status
                return this.$message.error('修改用户状态失败')
            }
            //关闭消息弹窗
            this.$message.closeAll()
            this.$message.success('修改用户状态成功')
            this.fullscreenLoading = false
        },
        //当选择每页显示多少条数据时触发
        handleSizeChange: function(newsize) {
            this.queryInfo.pagesize = newsize
            this.getUserList()
        },
        //当页码改变时触发
        handleCurrentChange: function(newpage) {
            this.queryInfo.pagenum = newpage
            this.getUserList()
        },

        //添加用户
        adduser: function() {
            this.dialogFormVisible = false
            this.$refs.adduser.validate(async valid => {
                if (valid) {
                    var data = await this.$http.post('users', this.form)
                    console.log(data)

                    if (data.meta.status != 201) {
                        return this.$message.error('添加失败')
                    }
                    this.$message.success('添加成功')
                    this.getUserList()
                } else {
                    this.$message.error('添加用户失败，请查看格式')
                }
            })

            console.log(this.form)
        },

        //重置添加框按钮
        resetAdd: function() {
            //重置输入框以及验证信息
            this.$refs.adduser.resetFields()
        },

        //弹出修改框
        showUpdate: function(userData) {
            this.updateFormVisible = true
            for (var attr in this.form) {
                this.form[attr] = userData[attr]
            }
            this.updateId = userData.id
        },
        //重置修改框
        resetUpdate: function() {
            //重置输入框以及验证信息
            this.$refs.updateUser.resetFields()
        },

        //修改用户
        updateUser: async function() {
            var data = await this.$http.put('users/' + this.updateId, {
                email: this.form.email,
                mobile: this.form.mobile
            })
            if (data.meta.status != 200) {
                return this.$message.error('修改用户失败')
            }
            this.$message.success('修改用户成功')
            this.updateFormVisible = false
            this.getUserList()
        },

        //删除用户界面提示
       openDel: async function(id) {
        var  confirmRusult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        console.log(confirmRusult);
        //判断用户是点击取消还是确定
        if (confirmRusult === 'cancel') {
            return this.$message.info("取消删除")
        }
        var deleteUser = await this.$http.delete("users/"+id);
        if(deleteUser.meta.status != 200){
          return this.$message.error("删除失败，请重新操作")
        }
        this.$message.success("删除成功")
        this.getUserList()
      }

  }
}
</script>
<style lang='less' scoped>
.user_container {
    margin-top: 15px;
    padding: 20px;
    background-color: #fff;
    .el-header,
    .el-main,
    .el-footer {
        padding: 0;
    }
    .el-header > .el-input {
        width: 400px;
        margin-right: 20px;
    }
    .el-footer {
        margin-top: 10px;
    }
}
</style>