// 服务器入口

// 1.创建Koa 实例对象

const Koa = require('koa')
const app = new Koa()
// 2.绑定中间价

// 绑定第一层中间价(duration.js记录时间)
const resDurationMiddleware = require('./middleware/duration')
app.use(resDurationMiddleware)

// 绑定第二层中间价(header.js响应头)
const resHaderMiddleware = require('./middleware/header')
app.use(resHaderMiddleware)

// 绑定第三层中间价(data.js 根据url响应数据)
const resDataMiddleware = require('./middleware/data')
app.use(resDataMiddleware)

// 3.绑定端口号
app.listen(3333)

const WebSocketService = require('./service/websocket')
// 开启服务端的监听 监听客户端的连接
// 当某一个客户端连接成功之后 就会对这个客户端进行message事件的监听
WebSocketService.linsten()
