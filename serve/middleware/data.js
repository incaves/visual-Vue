// 业务逻辑的中间价 读取data文件夹下的json数据 响应给前端
const path = require('path')
const fileUtils = require('../utils/file_utils') // 获取读取文件的工具
module.exports = async (ctx, next) => {
  // 根据qing的url获取对应的数据
  const url = ctx.request.url // 获取请求那个路径
  let filePath = url.replace('/api', '') // 先截取掉 /api
  filePath = '../data' + filePath + '.json'
  filePath = path.join(__dirname, filePath) // 获取到绝对路径
  try {
    const ret = await fileUtils.getFileJsonData(filePath) // 把绝对路径给工具 并接受数据
    ctx.response.body = ret // 设置响应体
  } catch (error) {
    const errMsg = {
      message: "File does not exist. Read failed",
      status:404
    }
    ctx.response.body = JSON.stringify(errMsg)
  }

  await next()
} 