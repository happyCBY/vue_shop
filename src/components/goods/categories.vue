<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="addItemizeFun">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        class="treeTable"
        :data="goodsList"
        :columns="columns"
        border
        tree-type
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted == false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-if="scope.row.cat_deleted == true" class="el-icon-error" style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope">
          <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="small" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>

      <!-- 添加分类选择框 -->
      <el-dialog title="添加分类" :visible.sync="addItemize" @close = "closeDialog" >
        <el-form ref="form" :model="addItemizeForm" label-width="100px" :rules="rules">
          <el-form-item label="分类名称:" prop="cat_name">
            <el-input v-model="addItemizeForm.cat_name"></el-input>
          </el-form-item>
          <!-- 级联选择器 -->
          <el-form-item label="父级分类:">
                <!-- options用来指定数据源 -->
              <el-cascader v-model="chooseJL" :options = "getOneOrTwo" :props = "props" @change="chooseOk" ></el-cascader>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addItemize = false">取 消</el-button>
          <el-button type="primary" @click="addCateGory">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
            goodsList: [],
            //分页数组
            pageInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            //tree-table配置
            columns: [
                {
                    label: '分类名称',
                    prop: 'cat_name',
                    width: '200px'
                },
                {
                    label: '是否有效',
                    width: '200px',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    prop: 'cat_level',
                    width: '200px',
                    template: 'sort',
                    type: 'template'
                },
                {
                    label: '操作',
                    width: '200px',
                    type: 'template',
                    template: 'operation'
                }
            ],
            //分类对话框
            addItemize: false,
            //获得表单
            addItemizeForm: {
                cat_name: '',
                //添加分类的等级
                cat_level: 0,
                //添加分类的分类父 ID
                cat_pid: 0
            },
            rules: {
                cat_name: [
                    {
                        required: true,
                        message: '请输入添加分类名称',
                        trigger: 'blur'
                    }
                ]
            },
            //获得一级和二级商品的分类id
            getOneOrTwo: [],
            //指定级联选择器的配置对象
            props: {
                label: 'cat_name',
                children: 'children',
                value: "cat_id"
            },
            //存放级联选择器选中的值
            chooseJL: [],
        }
    },
    methods: {
        //页码改变时
        handleCurrentChange: function(newpagenum) {
            this.pageInfo.pagenum = newpagenum
            this.getGoodsList()
        },
        //每页显示数量改变时
        handleSizeChange: function(newpagesize) {
            this.pageInfo.pagesize = newpagesize
            this.getGoodsList()
        },
        //获取商品分类
        getGoodsList: async function() {
            var res = await this.$http.get('categories', {
                params: this.pageInfo
            })

            if (res.meta.status != 200) {
                return this.message.error('获取商品分类失败')
            }
            this.total = res.data.total

            this.goodsList = res.data.result
        },
        //打开添加商品对话框，获得一级和二级商品的分类id
        addItemizeFun : async function (){
            this.addItemize = true
             var res = await this.$http.get('categories', {
                params: {type:2 }
            })
            this.getOneOrTwo = res.data

        },
        //级联选择器值改变时触发
        chooseOk: function (){

            if(this.chooseJL.length > 0){
              //存放 添加元素的父节点的id
               this.addItemizeForm.cat_pid = this.chooseJL[this.chooseJL.length-1];
               //存放 添加元素的分类等级
               this.addItemizeForm.cat_level = this.chooseJL.length;

            }else {
              this.addItemizeForm.cat_pid = 0;
              this.addItemizeForm.cat_level = 0;
            }
        },
        //点击确定发送添加商品的请求
        addCateGory: async function(){
          //表单预校验
          var flag = this.$refs.form.validate(valid=>{
            if(!valid)
            return this.$message.error("表单填写错误")
          })
          var data = await this.$http.post("categories",this.addItemizeForm);

          if(data.meta.status != 201){
            return this.$message.error("添加商品失败")
          }
          this.$message.success("添加商品成功")
          this.getGoodsList()
          this.addItemize = false
        },
        //关闭对话框重置信息
        closeDialog: function (){
          this.$refs.form.resetFields();
          this.chooseJL = [];
        }
    }
}
</script>
<style lang='less' scoped>
.treeTable {
    font-size: 16px;
    margin-top: 20px;
}
.el-cascader ul {
    height: 50px;
}
</style>