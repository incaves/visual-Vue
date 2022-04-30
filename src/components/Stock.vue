<template>
  <div class="container">
    <div class="chart" ref="StockRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Stock',
  data () {
    return {
      chartInstane: null, // 初始化对象
      allData: null, // 从服务器获取的数据
      currentIndex: 0, // 当前显示数据的页数
      timerId: null // 定时器的标识
    }
  },
  computed: {
    ...mapState(['theme'])
  },
  watch: {
    theme () {
      this.chartInstance.dispose() // 销毁当前图表
      this.initChart() // 重新获取最新的主题
      this.screenAdapter() // 完成屏幕适配
      this.updateChart() // 更新图标数据
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    this.updateChart()
  },
  methods: {
    // 初始化ehartInstance对象 并保存到data中
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.StockRef, this.theme)
      // 设置图表的样式
      const initOption = {
        title: {
          text: '┃ 库存和销量分析',
          left: 20,
          top: 20
        }
      }
      // 鼠标移入关闭定时器
      this.chartInstance.on('mouseover', () => clearInterval(this.timerId))
      // 鼠标移出开启定时器
      this.chartInstance.on('mouseout', () => this.startInterval(this.timerId))
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('/stock')
      this.allData = res
      this.updateChart() // 更新图表
      this.startInterval()
    },
    // 处理数据
    updateChart () {
      const centerArr = [
        // 每个项的中心点坐标
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      // 控制圆形的渐变色
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      // 截取出五条(一页只展示五条)
      const showData = this.allData.slice(start, end)
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie', // 饼图
          // radius: [50, 50], // 设置为圆环图
          center: centerArr[index], // 坐标
          hoverAnimation: false, // 关闭鼠标移入饼图的动画效果
          labelLine: {
            show: false // 指示线的移除
          },
          label: {
            position: 'center', // 文字显示在中心点
            color: colorArr[index][0]
          },
          data: [
            {
              // 销量
              name: item.name + '\n\n' + item.sales,
              value: item.sales,
              itemStyle: {
                // 渐变色的设置
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0] // 起始位置
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1] // 终止位置
                  }
                ])
              }
            },
            {
              // 库存
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      // 设置数据
      const DataOption = {
        series: seriesArr
      }
      this.chartInstance.setOption(DataOption)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      const titleFontSize = (this.$refs.StockRef.offsetWidth / 100) * 3.6
      // 设置标题等可响应的数据
      const innerRadis = titleFontSize * 2.8 // 外圆半径
      const outterRadis = innerRadis * 1.2 // 内圆半径
      // 圆形的半径 和内容的字体大小的设置
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [outterRadis, innerRadis],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadis, innerRadis],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadis, innerRadis],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadis, innerRadis],
            label: {
              fontSize: titleFontSize / 1.2
            }
          },
          {
            type: 'pie',
            radius: [outterRadis, innerRadis],
            label: {
              fontSize: titleFontSize / 1.2
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize() // 图表自适应
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId) // 清楚上一个定时器
      }
      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        this.updateChart() // 更新视图
      }, 3000)
    }
  },
  // 组件被销毁时 卸载
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timerId)
  }
}
</script>
