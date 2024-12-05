const transformTime = (timeArray: Array<number>) => {
  const year = timeArray[0]
  const month = timeArray[1] - 1 // 月份从0开始，所以需要减1
  const day = timeArray[2]
  const hours = timeArray[3]
  const minutes = timeArray[4]
  const seconds = timeArray[5]
  // 创建一个Date对象
  const date = new Date(year, month, day, hours, minutes, seconds)

  // 格式化日期和时间
  const formattedDate = date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
  })
  return formattedDate
}
export default
  transformTime
