<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 提示按钮 -->
      <el-alert :title="title" type="warning" show-icon></el-alert>
      <!-- 级联选择框 -->
      <div>
        <span>选择商品分类:</span>
        <el-cascader v-model="value" :options="options" @change="handleChange" :props="props"></el-cascader>
      </div>
      <!-- Tabs标签页 -->
      <el-tabs v-model="activeName">
        <!-- 动态参数标签页 -->
        <el-tab-pane label="动态参数" name="run">
          <el-button
            type="primary"
            :disabled="disabled"
            class="mbd15"
            @click="dialogVisible = true"
          >添加参数</el-button>
          <el-table style="width: 99.9%" border :data="run_attr">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(attr,index) in scope.row.attr_vals"
                  closable
                  @close="CloseTag(index,scorp.row)"
                >{{attr}}</el-tag>
                <!-- 添加tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  class="el-icon-edit"
                  @click="showExitDialog(scope.row.attr_id,scope.row.attr_name)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  class="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数标签页 -->
        <el-tab-pane label="静态属性" name="static">
          <el-button
            type="primary"
            class="mbd15"
            :disabled="disabled"
            @click="dialogVisible=true"
          >添加属性</el-button>
          <el-table style="width: 99.9%" border :data="static_attr">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :key="index"
                  v-for="(attr,index) in scope.row.attr_vals"
                  closable
                  @close="CloseTag(index,scope.row)"
                >{{attr}}</el-tag>
                <!-- 添加tag标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm1(scope.row)"
                  @blur="handleInputConfirm1(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  class="el-icon-edit"
                  @click="showExitDialog(scope.row.attr_id,scope.row.attr_name)"
                >修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  class="el-icon-delete"
                  @click="deleteParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加静态属性/动态参数对话框 -->
      <el-dialog
        :title="'添加'+addText"
        :visible.sync="dialogVisible"
        width="50%"
        @close="beforeCloseDialog"
      >
        <el-form ref="addStaticForm" label-width="80px" :rules="rules" :model="addParams">
          <el-form-item :label="addText" prop="name">
            <el-input v-model="addParams.name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamsOK">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改静态属性/动态参数对话框 -->

      <el-dialog
        :title="'修改'+addText"
        :visible.sync="dialogExitVisible"
        width="50%"
        @close="beforeCloseDialog"
      >
        <el-form ref="ExitForm" label-width="80px" :rules="rules" :model="addParams">
          <el-form-item :label="addText" prop="name">
            <el-input v-model="addParams.name"></el-input>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogExitVisible = false">取 消</el-button>
          <el-button type="primary" @click="exitParamsOK">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
    created: function() {
        this.getGoodsList()
    },
    data() {
        return {
            title: '注意: 只允许为三级分类设置相关参数！',
            //参数分类信息
            options: [],
            //获得级联选择框选中的value值
            value: [],
            //设置级联选择框 props参数
            props: {
                label: 'cat_name',
                value: 'cat_id',
                children: 'children'
            },
            //绑定tabs标签页的name属性
            activeName: 'static',
            //获得参数信息
            commodityParameters: [],
            //控制添加属性和添加参数按钮是否能够点击
            disabled: true,
            //获取静态属性
            static_attr: [],
            //获取动态参数
            run_attr: [],
            //控制添加静态/动态属性对话框显示/隐藏
            dialogVisible: false,
            //验证form表单
            rules: {
                name: [
                    {
                        required: true,
                        message: '请输入添加属性/参数名称',
                        trigger: 'blur'
                    }
                ]
            },
            //添加属性/参数的表单
            addParams: {
                name: ''
            },
            //控制修改属性对话框显示/隐藏
            dialogExitVisible: false,
            //点击修改时获得要修改的属性id
            exitID: '',

        }
    },
    methods: {
        //tag标签 的input 按下enter 和 失去焦点时触发
        handleInputConfirm: async function(row) {
            this.handleInputConfirm0(row)
        },
        handleInputConfirm1: async  function(row) {
            this.handleInputConfirm0(row)
        },
        handleInputConfirm0: function(row){
          //当输入框为空或者输入框输入的都是空格时，不执行任何操作
            if(row.inputValue.trim().length === 0) {
               row.inputVisible = false
               return row.inputValue  = ""
            }
            row.attr_vals.push(row.inputValue)
            //如果不为空则执行后续操作
            this.savaAttrVals(row)
            row.inputValue = ""
            row.inputVisible = false
        },
        //tag标签 的button 按下button 显示input 输入框
        showInput: function(row) {
            row.inputVisible = true
            //$nextTick的作用,$nextTick的作用是当页面上的元素重新渲染之后才会执行，如果没加这个函数的话，当元素还没加载到DOM数=树上的就让它获得焦点，这样获得焦点是不生效的
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        //级联选择框选中的值改变时触发 获得静态属性和动态参数
        handleChange: async function() {
            if (this.value.length != 3) {
                this.static_attr = []
                this.run_attr = []
                return (this.value = [])
            }

            //获得参数列表
            var id = this.value[this.value.length - 1]

            //获得静态属性
            var res_static = await this.$http.get(
                `categories/${id}/attributes`,
                {
                    params: { sel: 'only' }
                }
            )

            if (res_static.meta.status != 200) {
                return this.$message.error('获取商品参数失败')
            }

            //将静态属性中的attr_vals拆分成一个数组
            res_static.data.forEach(attr => {
                attr.attr_vals = attr.attr_vals ? attr.attr_vals.split(',') : []
                attr.inputVisible = false
                attr.inputValue = ''
            })

            this.static_attr = res_static.data

            //获得动态参数
            var res_run = await this.$http.get(`categories/${id}/attributes`, {
                params: { sel: 'many' }
            })
            if (res_run.meta.status != 200) {
                return this.$message.error('获取商品参数失败')
            }

            //将动态属性中的attr_vals拆分成一个数组
            res_run.data.forEach(attr => {
                attr.attr_vals = attr.attr_vals ? attr.attr_vals.split(',') : []
                attr.inputVisible = false
                attr.inputValue = ''
            })

            this.run_attr = res_run.data
            this.disabled = false
        },
        //获取商品分类列表
        //获取商品分类
        getGoodsList: async function() {
            var res = await this.$http.get('categories', {
                params: { type: 3 }
            })

            if (res.meta.status != 200) {
                return this.message.error('获取商品分类失败')
            }
            this.options = res.data
        },
        //点击确定添加按钮
        addParamsOK: async function() {
            //表单预验证
            this.$refs.addStaticForm.validate(valid => {
                if (!valid)
                    return this.$message.error(
                        '表单验证失败，请查看输入内容是否符合规范'
                    )
            })
            //发送静态属性添加请求
            var res = await this.$http.post(
                `categories/${this.value[this.value.length - 1]}/attributes`,
                {
                    attr_name: this.addParams.name,
                    attr_sel: this.activeName === 'static' ? 'only' : 'many'
                }
            )
            if (res.meta.status !== 201) {
                return this.$message.error('添加参数失败')
            }

            this.showParamsVue(0, res.data)
            this.dialogVisible = false
            this.getGoodsList()
        },
        //关闭对话框的时候触发
        beforeCloseDialog: function() {
            //判断是否是添加对话框关闭，如皋港是则重置添加对话框
            this.$refs.addStaticForm && this.$refs.addStaticForm.resetFields()
            //判断是否是修改对话框关闭，如皋港是则重置修改对话框
            this.$refs.ExitForm && this.$refs.ExitForm.resetFields()
        },
        //点击确定修改按钮时触发
        exitParamsOK: async function() {
            this.$refs.ExitForm.validate(valid => {
                if (!valid) return this.$message.error('请输入参数/属性名称')
            })

            //发送修改属性/参数请求
            var res = await this.$http.put(
                `categories/${this.value[this.value.length - 1]}/attributes/${
                    this.exitID
                }`,
                {
                    attr_name: this.addParams.name,
                    attr_sel: this.activeName === 'static' ? 'only' : 'many'
                }
            )
            if (res.meta.status !== 200) {
                return this.$message.error('修改商品属性/参数失败')
            }

            this.dialogExitVisible = false
            this.showParamsVue(1, res.data)
        },
        //点击修改时触发，弹出修改对话框
        showExitDialog: function(id, name) {
            this.dialogExitVisible = true
            this.exitID = id
            this.addParams.name = name
        },
        //删除属性/参数
        deleteParams: async function(deleteId) {
            var choose = await this.$confirm(
                '此操作将永久删除该属性, 是否继续?',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).catch(err => err)
            if (choose == 'cancel') {
                return this.$message.info('已取消删除')
            }

            var data = await this.$http.delete(
                `categories/${
                    this.value[this.value.length - 1]
                }/attributes/${deleteId}`
            )

            this.showParamsVue(2, deleteId)
        },
        //添加，修改，删除后 页面同步刷新 参数1 判断执行添加/修改/删除操作的标志位,参数2 执行添加参数修改后返回的信息
        showParamsVue: function(flag, obj) {
            if (this.activeName === 'static') {
                //判断是 添加/修改/删除  0/1/2 操作
                if (flag === 0) {
                    return this.static_attr.push(obj)
                } else if (flag === 1) {
                    this.static_attr.forEach((attr, index) => {
                        //判断修改的是那个属性
                        if (attr.attr_id === obj.attr_id) {
                            return this.$set(this.static_attr, index, obj)
                        }
                    })
                } else {
                    this.static_attr.forEach((attr, index) => {
                        //判断修改的是那个属性
                        if (attr.attr_id === obj) {
                            console.log(1)

                            return this.static_attr.splice(index, 1)
                        }
                    })
                }
            } else {
                if (flag === 0) {
                    this.run_attr.push(obj)
                } else if (flag === 1) {
                    this.run_attr.forEach((attr, index) => {
                        //判断修改的是那个属性
                        if (attr.attr_id === obj.attr_id) {
                            this.$set(this.run_attr, index, obj)
                        }
                    })
                } else {
                    this.run_attr.forEach((attr, index) => {
                        //判断修改的是那个属性
                        if (attr.attr_id === obj) {
                            return this.run_attr.splice(index, 1)
                        }
                    })
                }
            }
        },
        //删除tag标签
        CloseTag: function(i,row) {
          row.attr_vals.splice(i,1)
          this.savaAttrVals(row)
        },
        //发送修改请求
        savaAttrVals: async function(row){
          var res = await this.$http.put(`categories/${this.value[2]}/attributes/${row.attr_id})`,{
              attr_name: row.attr_name,
              attr_sel: row.attr_sel,
              attr_vals: row.attr_vals.join(",")
            })
          if(res.meta.status!=200) {
            return this.$message.error("操作失败")
          }
          this.$message.success("操作成功")
        }

    },
    watch: {
        //监听级联选择器选中时获得的值
        commodityParameters: function() {
            //如果没有三级商品分类则禁用添加按钮
            if (this.value.length != 3) {
                return (this.disabled = true)
            } else {
                this.disabled = false
            }
        }
    },
    computed: {
        addText: function() {
            if (this.activeName === 'static') {
                return '静态属性'
            } else {
                return '动态参数'
            }
        }
    }
}
</script>
<style lang='less' scoped>
.el-cascader {
    margin: 15px;
}
.mbd15 {
    margin-bottom: 15px;
}
.el-tag {
    margin: 10px;
}
//点击 添加 tag标签 显示的input输入框
.input-new-tag {
    width: 100px;
}
</style>