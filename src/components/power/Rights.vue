<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
        <el-table style="width: 99.9%" :data = "powerList"  border stripe>
          <el-table-column type="index" style="width: 9%"></el-table-column>
          <el-table-column prop="authName" label="权限名称"  style="width: 30%"></el-table-column>
          <el-table-column prop="path" label="路径"  style="width: 30%"></el-table-column>
          <el-table-column prop="level" label="权限等级" style="width: 30%">
                <template slot-scope="scope">
                    <!-- 权限等级 -->
                    <el-tag v-if="scope.row.level == 0" >一级</el-tag>
                    <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
                </template>
          </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
    created: function (){
        this.getAllPowerList()
    },
    data() {
        return {
            powerList: []
        }
    },
    methods: {
        //获得全部权限列表
        getAllPowerList: async function() {
            var list = await this.$http.get('rights/list')
            if(list.meta.status != 200) {
                return this.$message.error("获取权限列表失败")
            }
            this.powerList = list.data;

        }
    }
}
</script>
<style lang='less' scoped>
</style>