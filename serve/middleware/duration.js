// 计算服务器消耗时长的中间价
module.exports = async (ctx, next) => {
  // 记录开始的时间
  const start = Date.now()
  // 让内层中间价得到执行
  await next() // 得到结束时第二层中间价的响应 是一个Promise
  // 记录结束的时间
  const end = Date.now()
  // 计算所耗时间
  const duration = end - start  // 服务器总耗时
  // 设置给响应头时间
  ctx.set('X-Response-Time',duration + 'ms')
}