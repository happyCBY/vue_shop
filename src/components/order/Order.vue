<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索订单 -->
      <el-row>
        <el-col :span = 8>
          <el-input placeholder="请输入搜索商品" v-model="queryInfo.query" clearable @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表 -->
      <el-table :data="orderList" border style="width: 99.9%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop = "order_number" width = "300px" ></el-table-column>
        <el-table-column label="订单价格" prop = "order_price" ></el-table-column>
        <el-table-column label="是否付款" prop = "order_pay" >
            <template slot-scope="scope" >
                <el-tag v-if="scope.row.order_pay === '0'" type = 'danger' >
                    未付款
                </el-tag>
                <el-tag v-else type = 'success' >
                    已付款
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="是否发货" prop = "is_send"></el-table-column>
        <el-table-column label="下单时间" width = "170px" >
            <template slot-scope="scope" >
                {{scope.row.create_time | dateFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template>
                <el-button size = 'mini' type = "primary" icon = "el-icon-edit" @click="showUpdateAdress" ></el-button>
                <el-button size = 'mini' type = "success" icon = "el-icon-location" @click="showProgress" ></el-button>
            </template>
        </el-table-column>
      </el-table>
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
    <!-- 修改地址对话框 -->
    <el-dialog
        title="修改地址"
        :visible.sync="dialogAdressVisible"
        width="50%"
        @close = "beforeClose"
        >

        <el-form ref="orderForm" label-width="100px" :model = 'orderForm' :rules = "rules" >
            <el-form-item label = "省市区/县" prop = "adress1" >
                <el-cascader
                    v-model="jlValue"
                    :options="cityData"
                    :props = "props"

                    >
                </el-cascader>
            </el-form-item>
            <el-form-item label = "详细地址" prop = "adress2" >
                <el-input v-model="orderForm.adress2"></el-input>
            </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogAdressVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateAdress">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog
        title="物流进度"
        :visible.sync="dialogProgressVisible"
        width="50%">

        <el-timeline >
            <el-timeline-item
            v-for="(activity, index) in logistics"
            :key="index"
            :timestamp="activity.time">
            {{activity.context}}
            </el-timeline-item>
        </el-timeline>

        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogProgressVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogProgressVisible = false">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>
<script>
import cityData from '../../assets/js/citydata'
export default {
    created: function() {
        this.getOrderList()
    },
    data() {
        return {
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            //订单数据总条数
            total: 0,
            //订单列表
            orderList: [],
            //控制修改地址对话框的显示和隐藏
            dialogAdressVisible: false,
            //提交的表单
            orderForm: {
                adress1: [],
                adress2: ""
            },
            //表单验证规则
            rules: {
                adress1: [
                    {
                        required: true,
                        message: "请输入省市区县",
                        trigger: 'blur'
                    }
                ],
                adress2: [
                    {
                        required: true,
                        message: "请输入详细地址",
                        trigger: 'blur'
                    }
                ]
            },
            //获得城市列表
            cityData,
            //获得省市区/县 级联选择器 的值
            jlValue: [],
            //级联选择器配置对象
            props: {
                label: 'label',
                value: 'value',
                children: 'children'
            },
            //控制物流进度的显示与隐藏
            dialogProgressVisible: false,
            //获得物流进度
            logistics: []
        }
    },
    methods: {
        //获得订单列表
        getOrderList: async function() {

            var res = await this.$http.get('orders', { params: this.queryInfo })
            if(res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            this.orderList = res.data.goods
            this.total = res.data.total
        },
        //每页显示条数变更时触发
        handleSizeChange: function (size){
            this.queryInfo.pagesize = size,
            this.getOrderList()
        },
        //页码发生变化时触发
        handleCurrentChange: function (page){
            this.queryInfo.pagenum = page
            this.getOrderList()

        },
        //点击修改地址按钮时触发
        showUpdateAdress: function (){
            this.dialogAdressVisible = true
        },
        //对话框关闭时触发,清空表单
        beforeClose: function (){
            this.$refs.orderForm.resetFields()
        },
        //修改对话框点击确定按钮
        updateAdress: function (){
            this.dialogAdressVisible = false
        },
        //显示物流进度对话框
        showProgress: async function (){
            this.dialogProgressVisible = true
            var res = await this.$http.get("kuaidi/1106975712662")
            if(res.meta.status != 200) {
                return this.message.error(res.meta.msg)
            }
            this.logistics = res.data

        }
    }
}
</script>
<style lang='less' scoped>
.el-table {
    margin-top: 15px;
}
</style>