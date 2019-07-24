<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'loadsh'

export default {
    created: function() {
        this.getReports()
    },
    data() {
        return {
            reportData: {},
            // 指定图表的配置项和数据
            option: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    },
    methods: {
        getReports: async function() {
            var res = await this.$http.get('reports/type/1')
            console.log(res)
            if (res.meta.status !== 200) {
                return this.$message.error(res.meta.msg)
            }
            //获得折线图数据
            this.reportData = res.data
        }
    },
    mounted: function() {
        setTimeout(() => {
            var myChart = echarts.init(document.getElementById('main'))
            console.log(this.reportData)
            console.log(this.option)

            //合并对象
            var result = _.merge(this.option, this.reportData)
            console.log(result)

            myChart.setOption(result)
        }, 1000)
    }
}
</script>
<style lang='less' scoped>
</style>