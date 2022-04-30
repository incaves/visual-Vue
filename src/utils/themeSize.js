const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题颜色
    titleColor: '#ffffff',
    // 切换主题的按钮
    themeSrc: 'qiehuan_dark.png',
    // 页面顶部边框图片
    headerBorderSrc: 'header_border_dark.png'
  },
  vintage: {
    // 背景颜色
    backgroundColor: '#ffffff',
    // 标题颜色
    titleColor: '#000000',
    // 切换主题的按钮
    themeSrc: 'qiehuan_light.png',
    // 页面顶部边框图片
    headerBorderSrc: 'header_border_light.png'
  }
}
// 根据不同的主题 返回不同的颜色
export function getThemeValue (themeName) {
  return theme[themeName]
}
