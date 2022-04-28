<template>
  <div class="container">
    <div class="chart" ref="RankRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data () {
    return {
      chartInstane: null, // 初始化对象
      allData: null // 从服务器获取的数据
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  methods: {
    // 初始化ehartInstance对象 并保存到data中
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.RankRef, 'chalk')
      // 设置图标的样式
      const initOption = {
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('/rank')
      this.allData = res
      // 从大到小的排列
      this.allData.sort((a, b) => b.value - a.value)
      this.updateChart() // 更新图表
    },
    // 处理数据
    updateChart () {
      // 省份数组
      const provinceArr = this.allData.map(item => item.name)
      // 省份对应的数据
      const valueArr = this.allData.map(item => item.value)
      // 设置图表数据
      const DataOption = {
        xAxis: {
          data: provinceArr
        },
        series: [
          {
            data: valueArr
          }
        ]
      }
      this.chartInstance.setOption(DataOption)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      // 设置标题
      const adapterOption = {}
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    }
  },
  // 组件被销毁时 卸载
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>
