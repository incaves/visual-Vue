<template>
  <div class="container">
    <div
      class="chart"
      ref="HotRef"
    ></div>
    <!-- 左箭头 -->
    <span
      class="iconfont arr-left"
      @click="toLeft"
      :style="iconStyle"
    >&#xe6ef;</span>
    <!-- 右箭头 -->
    <span
      class="iconfont arr-right"
      @click="toRight"
      :style="iconStyle"
    >&#xe6ed;</span>
    <!-- 名称 -->
    <span class="name">{{ HotTitle }}</span>
  </div>
</template>

<script>
export default {
  name: 'Hot',
  data () {
    return {
      chartInstane: null, // 初始化对象
      allData: null, // 从服务器获取的数据
      currentIndex: 0, // 当前所展示的一级分类数据
      titleFontSize: 0
    }
  },
  computed: {
    // 显示每个名称在右下角
    HotTitle () {
      if (!this.allData) {
        // 没有数据
        return ''
      } else {
        return this.allData[this.currentIndex].name
      }
    },
    // 控制箭头的大小
    iconStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
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
      this.chartInstance = this.$echarts.init(this.$refs.HotRef, 'chalk')
      // 设置图表的样式
      const initOption = {
        title: {
          text: '┃ 热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          // 图例的位置
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          // 工具提示
          show: true,
          // 展示三级分类 arg是每一项数据
          formatter: (arg) => {
            const thirdCategory = arg.data.children
            // 计算所以三级分类的数值总和
            let total = 0 // 总和
            thirdCategory.forEach((item) => {
              total += item.value
            })
            // 三级类型占比情况  '三级分类民称 三级分类数据'
            let resStr = ''
            thirdCategory.forEach((item) => {
              resStr += `${item.name}:${
                parseInt((item.value / total) * 100) + '%'
              } <br/>`
            })
            return resStr
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false // 默认不显示
            },
            emphasis: {
              label: {
                show: true // 鼠标放上 再显示
              }
            },
            labelLine: {
              // 线
              show: false
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('/hotproduct')
      this.allData = res
      this.updateChart() // 更新图表
    },
    // 处理数据
    updateChart () {
      // 获取图例的数据
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => item.name
      )
      // 获取数据 - 名称和数据
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            // 为了鼠标放上去的展示 提取出来 arg  formatter 可以获取到
            children: item.children
          }
        }
      )
      // 设置数据
      const DataOption = {
        legend: {
          data: legendData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(DataOption)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      this.titleFontSize = (this.$refs.HotRef.offsetWidth / 100) * 3.6
      // 设置标题
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2,
            color: '#fff'
          }
        },
        series: [
          {
            radius: this.titleFontSize * 4.5, // 控制饼图的半径
            center: ['50%', '55%'] // 位置
          }
        ]
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    toLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        // 如果没有数据了 回到最后一个
        this.currentIndex = this.allData.length - 1
      }
      this.updateChart()
    },
    toRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    }
  },
  // 组件被销毁时 卸载
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>
<style lang="less" scoped>
.container {
  color: #fff;
}
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}
.name {
  position: absolute;
  left: 80%;
  bottom: 30px;
  cursor: pointer;
  user-select: none;
}
</style>
