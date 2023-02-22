export default (date, format) => {
  if (date?.constructor !== Date) {
    if (
      typeof date === 'number' &&
      date.toString().length !== Date.parse(new Date()).toString().length
    ) {
      date = parseInt(date.toString() + '000')
    }
    date = new Date(date)
  }
  var paddNum = function (num) {
    num += ''
    return num.replace(/^(\d)$/, '0$1')
  }
  // 指定格式字符
  var cfg = {
    yyyy: date.getFullYear(), // 年 : 4位
    yy: date.getFullYear().toString().substring(2), // 年 : 2位
    M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
    MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
    d: date.getDate(), // 日 : 如果1位的时候不补0
    dd: paddNum(date.getDate()), // 日 : 如果1位的时候补0
    h: date.getHours(), // 时 补零
    hh: paddNum(date.getHours()), // 时
    m: date.getMinutes(), // 分 补零
    mm: paddNum(date.getMinutes()), // 分
    s: date.getSeconds(), // 秒 补零
    ss: paddNum(date.getSeconds()), // 秒
    timestamp: date.getTime(), // 时间戳
    date: date, // 默认
  }
  switch (format) {
    case 'timestamp':
      return cfg[format]
    case 'date':
      return cfg[format]
    default:
      return format.replace(/([a-z])(\1)*/gi, function (m) {
        return cfg[m]
      })
  }
}

function isValidDate(date) {
  return date instanceof Date && isNaN(date.getTime())
}
