<template>
  <div class="container" @dblclick="revertMap">
    <div class="chart" ref="MapRef"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/conversion'
export default {
  name: 'Map',
  data () {
    return {
      chartInstane: null, // 初始化对象
      allData: null, // 从服务器获取的数据
      mapData: {} // 获取的省份的地图矢量数据
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
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.MapRef, 'chalk')
      // 获取地图矢量数据
      const res = await axios.get('http://localhost:7777/static/map/china.json')
      this.$echarts.registerMap('china', res.data) // 注册地图数据
      // 设置图表的样式
      const initOption = {
        title: {
          text: '┃ 商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            border: '#333'
          }
        },
        // 图例的位置
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 竖着
        }
      }
      this.chartInstance.setOption(initOption)
      // 地图的点击事件 arg就是每个省份的数据
      this.chartInstance.on('click', async arg => {
        // 转换为拼音 并对应它的文件夹路径
        const provinceInfo = getProvinceMapInfo(arg.name)
        // 获取省份地图矢量数据(省)
        // 进行缓存 优化 如果地图被加载过了 下次就不发请求了
        // 判断是否在该省份的key是否在mapData中存在 如果存在不发送请求 如果不存在发送请求
        if (!this.mapData[provinceInfo.key]) {
          const res = await axios.get('http://localhost:7777' + provinceInfo.path)
          this.mapData[provinceInfo.key] = res.data
          // 第一个参数时别名 第二个是数据
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }
        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    // 获取服务器数据
    async getData () {
      // 获取服务器的散点数据
      const { data: res } = await this.$http.get('/map')
      this.allData = res
      this.updateChart() // 更新图表
    },
    // 处理数据
    updateChart () {
      // 设置数据
      // 图例的数据
      const legendArr = this.allData.map(item => item.name)
      // 图表的数据 坐标等
      const seriesArr = this.allData.map(item => {
        // return 一个类别下的所有数据
        return {
          type: 'effectScatter',
          rippleEffect: {
            // 涟漪效果
            scale: 5,
            brushType: 'stroke' // 空心
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo' // 地图坐标系统
        }
      })
      const DataOption = {
        series: seriesArr, // 设置图表的坐标等
        legend: {
          data: legendArr // 设置图例的效果
        }
      }
      this.chartInstance.setOption(DataOption)
    },
    // 当浏览窗口大小发生变化时,会调用该方法 来完成屏幕的适配
    screenAdapter () {
      const titleFontSize = this.$refs.MapRef.offsetWidth / 100 * 3.6
      // 设置标题和图例的自适应
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 3,
            color: '#fff'
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    // 双击回到中国地图
    revertMap () {
      const reverOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(reverOption)
    }
  },
  // 组件被销毁时 卸载
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  }
}
</script>
