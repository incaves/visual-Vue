<template>
  <div class="container">
    <div class="title" :style="comStyle">
      <span>{{'┃' + showTitle }}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoice = !showChoice">&#xe6eb;</span>
      <div class="select" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in selectType" :key="item.key" @click="hanleSelect(item.key)">{{item.text}}</div>
      </div>
    </div>
    <div class="chart" ref="TrendRef"></div>
  </div>
</template>

<script>
export default {
  name: 'Trend',
  data () {
    return {
      chartInstane: null, // 初始化对象
      allData: null, // 从服务器获取的数据
      showChoice: false, // 下拉框的显示 / 隐藏
      choiceType: 'map', // 显示的数据类型
      titleFontSize: 0 // 标题的字体大小
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
    console.log(this.titleFontSize)
  },
  computed: {
    // 标题栏下拉框 简化操作
    selectType () {
      if (!this.allData) { // 不存在
        return []
      } else {
        return this.allData.type.filter(item => {
          // 被选中的标题 不应该还出现在下拉框中
          return item.key !== this.choiceType
        })
      }
    },
    // 动态显示标题
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        // 根据下拉框选择的每一项 来动态获取数据 默认显示的是map中的标题
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px' // screenAdapter函数获取
      }
    },
    // 加了竖线 下拉框不对称
    marginStyle () {
      return {
        marginLeft: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    // 初始化ehartInstance对象 并保存到data中
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.TrendRef, 'chalk')
      // 设置图标的样式
      const initOption = {
        grid: {
          left: '3%',
          right: '4%',
          top: '35%',
          bottom: '1%',
          containLabel: true // 距离包含坐标轴上的文字
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          // 图例的样式
          left: 20,
          top: '15%',
          icon: 'circle' // 圆形图标
        },
        xAxis: {
          type: 'category', // 类目轴 数据在 DataOption 配置
          boundaryGap: false // 紧挨Y轴
        },
        yAxis: {
          type: 'value'
        }
      }
      this.chartInstance.setOption(initOption)
    },
    // 获取服务器数据
    async getData () {
      const { data: res } = await this.$http.get('/trend')
      this.allData = res
      this.updateChart() // 更新图表
    },
    // 处理数据
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 类目轴  -月,二月..
      const timeArr = this.allData.common.month
      // Y轴的数据 serise的数据
      const valueArr = this.allData[this.choiceType].data
      // 每一条数据
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: 'line', // 折线图
          data: item.data,
          stack: 'map',
          areaStyle: {
            // 以颜色的方式填充
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index]
              },
              {
                offset: 1,
                color: colorArr2[index]
              }
            ])
          }
        }
      })
      // 图例的数据
      const legendArr = valueArr.map((item) => item.name)
      // 设置数据
      const DataOption = {
        xAxis: {
          data: timeArr
        },
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(DataOption)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      // 设置给Vue 这里的标题不属于Echarts
      this.titleFontSize = this.$refs.TrendRef.offsetWidth / 100 * 3.6
      // 设置图例的大小
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize, // 间距
          textStyle: {
            fontSize: this.titleFontSize / 2, // 标题的大小
            color: '#fff'
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 利用下拉框 动态切换数据
    hanleSelect (currentType) {
      // currentType 下拉框的每一条 三条
      // 值是 map  seller commodity 来动态切换数据 默认是map
      this.choiceType = currentType
      this.updateChart()
      this.showChoice = false
    }
  },
  // 组件被销毁时 卸载
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>
<style lang="less" scoped>
.title{
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #fff;
  cursor: pointer;
  user-select:none;
  .select {
    background-color: #222733;
  }
  .title-icon{
    margin-left: 10px;
  }
}
</style>
