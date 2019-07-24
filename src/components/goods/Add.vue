<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条 -->
      <el-steps :active="active-0" finish-status="success" align-center style="font-size: 12px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 添加商品的表单 -->
      <el-form ref="form" :model="form" :rules="rules" label-position="top">
        <!-- 左侧tabs面板 -->
        <el-tabs
          :tab-position="'left'"
          :stretch="false"
          v-model="active"
          :before-leave="beforeLeave"
          @tab-click="tabClick"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 商品名称 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="form.goods_name"></el-input>
            </el-form-item>
            <!-- 商品价格 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="form.goods_price" type="number"></el-input>
            </el-form-item>
            <!-- 商品重量 -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="form.goods_weight" type="number"></el-input>
            </el-form-item>
            <!-- 商品数量 -->
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="form.goods_number" type="number"></el-input>
            </el-form-item>

            <!-- 商品分类 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="form.goods_cat"
                :options="goodsCategoriesList"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品价格 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :key="attr.attr_id" v-for="attr in manyParameter" :label="attr.attr_name">
              <el-checkbox-group v-model="attr.attr_vals">
                <el-checkbox
                  border
                  :key="index"
                  v-for=" (item,index) in attr.attr_vals"
                  :label="item"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :key="item.attr_id" v-for="item in onlyParameter" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="uploadSuccess"
              :headers="headerObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本选择器 -->
            <quill-editor class="mb15" v-model="form.goods_introduce"></quill-editor>
            <!-- 添加商品按钮 -->
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-button style="margin-top: 12px;" @click="next">下一步</el-button>
      <!-- 图片预览对话框 -->
      <el-dialog title="图片预览" :visible.sync="dialogPicVisible" width="50%">
        <img :src="picPath" class="show_pic" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
    created: function() {
        this.getGoodsCategories()
    },
    data() {
        return {
            //控制步骤条进度
            active: '0',
            //提交的表单内容
            form: {
                //商品名称
                goods_name: '',
                //商品价格
                goods_price: 0,
                //商品重量
                goods_weight: 0,
                //商品数量
                goods_number: 0,
                //级联选择器选中的分类id
                goods_cat: [],
                //图片上传的零时路径
                pics: [],
                //商品详情描述
                goods_introduce: '',
                //商品的参数（数组），包含 `动态参数` 和 `静态属性`
                attrs: []
            },
            //表单验证规则
            rules: {
                goods_name: [
                    {
                        required: true,
                        message: '商品名称不能为空',
                        trigger: 'blur'
                    }
                ],
                goods_price: [
                    {
                        required: true,
                        message: '商品价格不能为空',
                        trigger: 'blur'
                    }
                ],
                goods_weight: [
                    {
                        required: true,
                        message: '商品重量不能为空',
                        trigger: 'blur'
                    }
                ],
                goods_number: [
                    {
                        required: true,
                        message: '商品数量不能为空',
                        trigger: 'blur'
                    }
                ],
                goods_cat: [
                    {
                        required: true,
                        message: '商品数量不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            //商品分类列表
            goodsCategoriesList: [],
            //配置级联选择器
            props: {
                //配置级联选择器设置的名称
                label: 'cat_name',
                //指定选项的子选项为选项对象的某个属性值
                children: 'children',
                //指定选项的值为选项对象的某个属性值
                value: 'cat_id'
            },
            //获得动态分类参数
            manyParameter: [],
            //获得静态分类参数
            onlyParameter: [],
            //上传图片的url地址
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            //设置上传文件携带token
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            //控制图片预览对话框的开启和关闭
            dialogPicVisible: false,
            //获取预览图片的路径
            picPath: ''
        }
    },
    methods: {
        //步骤条下一步
        next: function() {
            this.active < 6 ? this.active++ : this.active
        },
        //获取商品分类列表
        getGoodsCategories: async function() {
            var res = await this.$http.get('categories')

            this.goodsCategoriesList = res.data
        },
        //级联选择器值变更的时候触发
        handleChange: function() {
            if (this.form.goods_cat.length < 3) {
                this.form.goods_cat = []
            }
        },
        beforeLeave: function(activename, oldname) {
            if (oldname === '0' && this.form.goods_cat.length < 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },
        //tabs标签页切换的时候触发
        tabClick: async function() {
            if (this.active === '1') {
                //获取分类参数
                var res = await this.$http.get(
                    `categories/${this.cateId}/attributes`,
                    { params: { sel: 'many' } }
                )

                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                res.data.forEach(attr => {
                    if (attr.attr_vals.trim() === '') {
                        attr.attr_vals = []
                    } else {
                        attr.attr_vals = attr.attr_vals.split(',')
                    }
                })

                this.manyParameter = res.data
            } else if (this.active === '2') {
                var res = await this.$http.get(
                    `categories/${this.cateId}/attributes`,
                    { params: { sel: 'only' } }
                )

                this.onlyParameter = res.data
            } else if (this.active === '3') {
            }
        },
        //图片移除时触发
        handleRemove(file) {
            //获得删除图片的名称
            const path = file.response.data.tmp_path
            //获取删除的图片在pics数组中的位置
            const index = this.form.pics.findIndex(attr => {
                return attr.pic === path
            })
            //删除提交表单中 pics中对应的图片
            this.form.pics.splice(index, 1)
        },
        //点击图片时触发
        handlePreview(file) {
            console.log(file)
            ;(this.dialogPicVisible = true),
                (this.picPath = file.response.data.url)
            console.log(this.picPath)
        },
        //上传成功后触发
        uploadSuccess: function(response) {
            var pic = {
                pic: response.data.tmp_path
            }
            this.form.pics.push(pic)
        },
        //添加商品
        addGoods:  function() {
            //提交商品表单预验证
            this.$refs.form.validate( async valid => {
                if (!valid) {
                    return this.$message.error('请填写必要选项')
                }

                //将form表单深拷贝
                var newform = _.cloneDeep(this.form)
                //处理goods_cat参数
                newform.goods_cat = newform.goods_cat.join(",")
                //处理静态参数
                this.onlyParameter.forEach(attr => {
                    const obj = {
                        attr_id: attr.attr_id,
                        attr_value: attr.attr_vals
                    }
                    newform.attrs.push(obj)
                })
                //处理动态参数
                this.manyParameter.forEach(attr => {
                    const obj = {
                        attr_id: attr.attr_id,
                        attr_value: attr.vals
                    }
                    newform.attrs.push(obj)
                })
                var res = await this.$http.post("goods",newform)
                if(res.meta.status == 201) {
                  return this.$message.error(res.meta.msg)
                }
                this.$message.success("添加商品成功")
                this.$router.push("/goods")
            })
        }
    },
    computed: {
        //判断是否选中了三级商品分类，选中则返回三级分类的id 没有则返回null
        cateId: function() {
            if (this.form.goods_cat.length === 3) {
                return this.form.goods_cat[this.form.goods_cat.length - 1]
            } else {
                return null
            }
        }
    }
}
</script>
<style lang='less' scoped>
.el-steps {
    margin: 15px;
}
.show_pic {
    width: 100%;
    // height: 300px;
}
</style>