<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 主体卡片 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入搜索商品" v-model="queryInfo.query" clearable @clear = "getGoodList" >
            <el-button slot="append" icon="el-icon-search" @click="getGoodList" ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage" >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品显示表格 -->
      <el-table :data="goodsList" border style="width: 99.9%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width = "500px" ></el-table-column>
        <el-table-column label="商品价格(元)" prop = "goods_price" ></el-table-column>
        <el-table-column label="商品重量" prop = "goods_weight" ></el-table-column>
        <el-table-column label="创建时间" width = "170px" >
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width = "120px">
            <template slot-scope="scope" >
                <el-button size = 'mini' type = "primary" icon = "el-icon-edit" >
                </el-button>
                <el-button size = 'mini' type = "danger" icon = 'el-icon-delete' @click="deleteGoods(scope.row)" >
                </el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
    created: function() {
        this.getGoodList()
    },
    data() {
        return {
            //显示商品列表
            goodsList: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
        }
    },
    methods: {
        //获得商品列表
        getGoodList: async function() {
            var res = await this.$http.get('goods', {params: this.queryInfo})
            if(res.meta.status !== 200) {
                return this.$message.error("获取商品列表失败")
            }

            this.total = res.data.total
            this.goodsList = res.data.goods
        },
        //每页显示条数改变时触发
        handleSizeChange: function(val){
            this.queryInfo.pagesize = val
            this.getGoodList()
        },
        // 页码改变时触发
        handleCurrentChange: function(val){
            this.queryInfo.pagenum = val
            this.getGoodList()
        },
        //删除商品
        deleteGoods: async function (row){
            var deleteConfirm = await this.$confirm("删除后不能找回,确定删除？","提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
            }).catch(err=>err)
            if(deleteConfirm === "cancel"){
                return this.$message.info("已取消删除")
            }
            var res = await this.$http.delete("goods/"+row.goods_id)

            this.goodsList.forEach((attr,index)=>{
                if(attr.goods_id === row.goods_id) {
                    return this.goodsList.splice(index,1)
                }
            })


        },
        //点击添加按钮跳转到添加商品界面
        goAddPage: function (){
            this.$router.push("/goods/add")
        }
    },

}
</script>
<style lang='less' scoped>
.el-table {
    margin-top: 10px
}
</style>