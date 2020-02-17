<template>
  <div id="file">
    <div class="fl treebg" style="min-width:230px;width:10%;">
      <el-tree
        @node-click="handleNodeClick"
        class="filter-tree"
        :data="fileData"
        default-expand-all
        :props="defaultProps"
        ref="tree2"
      ></el-tree>
    </div>
    <div class="fl" style="width:70%;margin:20px 15px">
      <div style="margin-top:60px">
        <div id="echart" :style="{width: '1000px', height: '600px'}"></div>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/api/system/graphics";

export default {
  data() {
    return {
      line: 0,
      pie: 0,
      bar: 0,
      chartData: {},
      defaultProps: {
        children: "children",
        label: "name"
      },
      fileData: [],
      type: ""
    };
  },

  mounted() {
    this.selectAll();
  },
  methods: {
    drawLine(data) {
      let echart = this.$echarts.init(document.getElementById("echart"));
      let dataName = data.sourceList.map(item => {
        return item.name;
      });
      let dataValue = data.sourceList.map(item => {
        return item.source;
      });
      let dataList = [];
      if (data.template == 1) {
        dataList = data.sourceList.map(item => {
          return {
            name: item.name,
            type: "line",
            data: item.source.split(",")
          };
        });
        echart.setOption({
          legend: {
            data: dataName
          },
          title: { text: data.name },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "cross"
            }
          },
          xAxis: {
            data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
          },
          yAxis: {
            type: "value",
            axisLabel: {
              formatter: "{value} W"
            },
            axisPointer: {
              snap: true
            }
          },
          series: dataList
        });
      } else if (data.template == 2) {
        // 柱状图
        dataList = data.sourceList.map(item => {
          return {
            name: item.name,
            type: "bar",
            data: item.source.split(",")
          };
        });
        console.log(dataName, "dataName");
        echart.setOption({
          title: { text: data.name },
          legend: {
            data: dataName
          },
          tooltip: {},
          xAxis: [
            {
              data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: dataList
        });
      } else {
        dataList = data.sourceList.map(item => {
          return {
            name: item.name,
            value: item.source
          };
        });
        console.log(dataName, "dataName");
        echart.setOption({
          legend: {
            data: dataName
          },
          title: { text: data.name },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: {
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: dataList
          }
        });
      }
      // 基于准备好的dom，初始化echarts实例

      // 绘制图表
    },
    handleNodeClick(data) {
      let echart = this.$echarts.init(document.getElementById("echart"));
      echart.clear();
      request.findById(data.id).then(res => {
        this.chartData = res.data;

        this.drawLine(this.chartData);
      });
    },
    // 档案级别树形
    selectAll() {
      request.selectTreeGraphic().then(res => {
        this.fileData = res.data.tableData;
      });
    }
  }
};
</script>
<style>
#file .treebg {
  width: 200px;
  border-right: 1px solid #e8e8e8;
  padding: 40px;
  height: 600px;
  background: #f4f4f5;
}
#file .el-tree {
  background: #f4f4f5;
}
</style>