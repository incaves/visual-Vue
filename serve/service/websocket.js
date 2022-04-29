// 1.创建WebSocke服务端 对象
const WebSocket = require('ws')
const path = require('path')
const fileUtils = require('../utils/file_utils')
const wss = new WebSocket.Server({
  port: 9998 // 绑定的端口号
})
// 服务端开启了监听
module.exports.linsten = () => {
  // 2.对客户端的连接事件进行监听
  // client 代表的是客户端连接的socket对象
  wss.on('connection', (client) => {
    console.log('有客户端连接成功了')
    // 对客户端的连接对象进行message事件进行监听 有没有数据连接到客户端
    // message 由客户端发给服务端的数据
    client.on('message', async msg => {
      console.log('客户端发送数据给服务端了:' + msg)
      const payload = JSON.parse(msg)
      const action = payload.action
      if (action === 'getData') {
        // 1.取出数据中的chartName字段
        let filePath = '../data/' + payload.chartName + '.json'
        // payload.chartName; // trend | seller | map | ran | hot | stock
        // 2.拼接json文件的路径
        filePath = path.join(__dirname, filePath)
        // 3.读取该文件的内容
        const ret = await fileUtils.getFileJsonData(filePath)
        // 需要在服务端获取到数据的基础之上,增加一个data的字段
        // data所对应的值 就是 某个json文件的值
        payload.data = ret
        client.send(JSON.stringify(payload))
      } else {
        // 原封不到的将所接受的数据 转发给每一个处于连接状态的客户端
        //  wss.clients 所以客户端的连接
        wss.clients.forEach((client) => {
          client.send(JSON.stringify(JSON.parse(msg)))
        })
      }
      // 由服务端往客户端发送数据(发送数据给客户端)
      // client.send('hello socket from backend')
    })
  })
}
