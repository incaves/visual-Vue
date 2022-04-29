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
      allData: null, // 从服务器获取的数据
      startValue: 0, // 区域缩放的起始值
      endValue: 9, // 区域缩放的终点值
      timerId: null // 定时器的标识
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
        title: {
          text: '┃ 地区销售排行',
          left: 20,
          top: 20
        },
        grid: { // 图表的位置
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        tooltip: {
          show: true // 鼠标放下上有文字提示
        },
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
      // 鼠标移入关闭定时器
      this.chartInstance.on('mouseover', () => clearInterval(this.timerId))
      // 鼠标移出开启定时器
      this.chartInstance.on('mouseout', () => this.startInterval(this.timerId))
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('/rank')
      this.allData = res
      // 从大到小的排列
      this.allData.sort((a, b) => b.value - a.value)
      this.updateChart() // 更新图表
      this.startInterval() // 启动定时器
    },
    // 处理数据
    updateChart () {
      // 省份数组
      const provinceArr = this.allData.map(item => item.name)
      // 省份对应的数据
      const valueArr = this.allData.map(item => item.value)
      // 渐变色数组
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 设置图表数据
      const DataOption = {
        xAxis: {
          data: provinceArr
        },
        dataZoom: { // 平易动画
          show: false,
          // 默认显示第一条道第九条数据
          startValue: this.startValue, // 起始
          endValue: this.endValue // 位置
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              // arg是每一条数据
              color: arg => {
                let targetColor = null
                if (arg.value > 300) {
                  targetColor = colorArr[0]
                } else if (arg.value > 200) {
                  targetColor = colorArr[1]
                } else {
                  targetColor = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(DataOption)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      // 计算字体大小
      const titleFontSize = this.$refs.RankRef.offsetWidth / 100 * 3.6
      // 设置标题
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize, // 柱子宽度
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId) // 如果有上个定时器还存在 清楚了才能进入下一个
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.startValue > this.allData.length - 1) { // 到达了最后一个值
          this.startValue = 0
          this.endValue = 9
        }
        this.updateChart()
      }, 1000)
    }
  },
  // 组件被销毁时 卸载
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  }
}
</script>
