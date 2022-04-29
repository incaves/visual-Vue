const fs = require('fs')
// 读取文件的工具方法
// filePath 是绝对路径
module.exports.getFileJsonData = (filePath) => {
  return new Promise((resolve, reject) => {
    // 根据文件的路径,读取文件的内容
    fs.readFile(filePath, 'utf-8', (error, data) => {
      if (error) {
        reject(error) // 读取失败
      } else {
        resolve(data) // 读取成功
      }
    })
  })
}
