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