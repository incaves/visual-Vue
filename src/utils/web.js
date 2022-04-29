export default class SocketService {
  /**
   * 单例
   */
  static instance = null;
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketService()
    }
    return this.instance
  }

  // 和服务端连接的socket对象
  ws = null;
  // 存储回掉函数
  callBackMapping = {}
  connected = false
  sendRetryCount = 0
  connectRetryCount = 0
  // 连接服务器的方法
  connect () {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('浏览器不支持WebSocket')
    }
    this.ws = new WebSocket('ws://localhost:9998')
    // 连接成功
    this.ws.onopen = () => {
      console.log('连接成功')
      this.connected = true
      this.connectRetryCount = 0
    }
    // 连接失败
    this.ws.onclose = () => {
      console.log('连接失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, this.connectRetryCount * 500)
    }
    // 获取数据
    this.ws.onmessage = (msg) => {
      // console.log('获取到的数据', msg.data)
      const recvData = JSON.parse(msg.data)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        const action = recvData.action
        if (action === 'getData') {
          // 某一个图表需要获取数据
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {

        } else if (action === 'themeChange') {}
      }
    }
  }

  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  //  取消某一个回调函数
  unRegiserCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据方法
  send (data) {
    if (this.connected) {
      this.sendRetryCount = 0
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
