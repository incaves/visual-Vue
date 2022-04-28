<template>
<!-- 商家销量模块柱状图 -->
  <div class="container">
      <div class="chart" ref="SellerRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Seller',
  data () {
    return {
      chartInstance: null, // 初始化对象
      allData: null, // 存储服务器获取的数据
      currentPage: 1, // 默认显示第一页
      totalPage: 0, // 一共有多少页
      timerId: null // 定时器的标识(用于destroyed)
    }
  },
  mounted () { // DOM结构加载完成挂载
    this.initChart()
    this.getData()
    // 监听浏览器窗口的变化
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter() // 上来接挂载
  },
  methods: {
    // 初始化ehartInstance对象 并保存到data中
    initChart () {
      // 获取DOM 并引入主题
      this.chartInstance = this.$echarts.init(this.$refs.SellerRef, 'chalk')
      // 对图表初始化的控制样式等等
      const initOption = {
        title: { // 标题
          text: '┃ 商家销售统计',
          left: 20,
          top: 20
        },
        grid: { // 图表的位置
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离包含坐标轴上的文字
        },
        xAxis: {
          type: 'value' // 数值轴
        },
        yAxis: {
          type: 'category' // 类目轴
        },
        tooltip: {
          trigger: 'axis', // 鼠标移入主治时触发
          axisPointer: { // 鼠标移入柱子时的样式
            type: 'line', // 线形
            z: 0, // 层级
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true, // 展示柱子上的文字
              position: 'right', // 展示在右侧
              textStyle: {
                color: 'white' // 文字颜色
              }
            },
            itemStyle: {
              //  设置颜色的渐变
              // 1.指明颜色渐变的方向 2.指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0, // 0%
                  color: '#5052EE'
                },
                {
                  offset: 1, // 100%
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 鼠标移入关闭定时器
      this.chartInstance.on('mouseover', () => clearInterval(this.timerId))
      // 鼠标移出开启定时器
      this.chartInstance.on('mouseout', () => this.startInterval(this.timerId))
    },
    // 获取服务器的数据
    async getData () {
      const { data: res } = await this.$http.get('/seller')
      this.allData = res
      // 对数组进行从小到大的排序
      this.allData.sort((a, b) => a.value - b.value)
      // 每五个元素显示一页 计算出总页数
      this.totalPage = Math.ceil(this.allData.length / 5)
      this.updateChart() // 更新图标
      this.startInterval() // 启动定时器
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * 5 // 开始的索引 0
      const end = this.currentPage * 5 // 结束的索引 5
      const showData = this.allData.slice(start, end)
      const sellerName = showData.map((item) => item.name) // 循环获取每个商家名称
      const sellerValue = showData.map((item) => item.value) // 循环获取每个商家数据
      // 对图标进行数据的灌入
      const Dataoption = {
        yAxis: {
          data: sellerName
        },
        series: [
          {
            data: sellerValue
          }
        ]
      }
      this.chartInstance.setOption(Dataoption)
    },
    // 每隔三秒自动切换
    startInterval () {
      if (this.timerId) { // 函数节流
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.currentPage++
        // 表示没有数据了
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }
        this.updateChart() // 更新图标
      }, 3000)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      const titleFontSize = this.$refs.SellerRef.offsetWidth / 100 * 3.6
      // 随着屏幕的大小来改变 标题的大小
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize // 标题文字的大小
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              // 鼠标移入背景色的大小
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize, // 柱子的宽度
            itemStyle: {
              // 柱子的圆角 可以设置四个角 所以是数组 右上和右下
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize() // 图标对象的resize 才能产生效果
    }
  },
  // 组件被销毁关闭定时器 防止内存泄漏
  destroyed () {
    clearInterval(this.timerId)
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>
