import { AnyObject } from "element-plus/lib/el-table/src/table.type"
import { orderBy } from "lodash"

export function formatThousand(num: number | string): string {
  if (!num && Number(num) !== 0) {
    return '-'
  }
  return (num + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')
}

export function formatFix2(num: number | string): string {
  const str = num + ''
  const xsd = str.split('.')
  if (xsd.length == 1) {
    return str + '.00'
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      return str + '0'
    }
    return xsd[0] + '.' + xsd[1].slice(0, 2)
  }
  return ''
}

export function formatFix1(num: number | string): string {
  const str = num + ''
  const xsd = str.split('.')
  if (xsd.length == 1) {
    return str + '.0'
  }
  if (xsd.length > 1) {
    return xsd[0] + '.' + xsd[1].slice(0, 1)
  }
  return ''
}

export function formatYearMonth(date: Date): string {
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const mon = month > 9 ? month : `0${month}`
  return `${year}-${mon}`
}

/**
 * 数字处理(转成以万为单位):保留几位小数，不四舍五入
 * @param num  数字
 * @param decimal  保留位数(默认为2)
 */
export function formatThousandAndReservedBits(num: string, decimal = 2) {
  let money = formatReservedBitsNumber(num, 10000, decimal)
  return money;
}
/**
 * 关于金额数值的处理用这个方法（万元为单位）
 * @param num  数字
 * @param decimal  保留位数(默认为2)
 */
export function formatThousandMoney(num: string, decimal = 2) {
  return formatReservedBitsNumber(num, 100 * 10000, decimal)
}
/**
 * 关于金额数值的处理用这个方法（元为单位）
 * @param num  数字
 * @param decimal  保留位数(默认为2)
 */
export function formatMoney(num: string, decimal = 2) {
  return formatReservedBitsNumber(num, 100, decimal)
}
/**
 * 数字处理:按传入的数字整除并保留几位小数，不四舍五入
 * @param num  数字
 * @param handlerNum 整除多少
 * @param decimal  保留位数(默认为2)
 */
export function formatReservedBitsNumber(num: string, handlerNum = 1, decimal = 2) {
  if (!num) return '0';
  let money = parseFloat(num) / handlerNum;
  let moneyStr = money.toString();
  let index = moneyStr.indexOf('.');
  if (index !== -1) {
    moneyStr = moneyStr.substring(0, decimal + index + 1);
  } else {
    moneyStr = moneyStr.substring(0);
  }
  return parseFloat(moneyStr).toFixed(decimal);
}
/**
 * 日期格式化
 * @param date  日期
 * @param format 格式 类型(yyyy-MM-dd hh:mm:ss)
 * @returns {string}
 */
export function formatDate(date: Date, format: string): string {
  let year = `${date.getFullYear()}`;
  let month = `${date.getMonth() + 1}`;
  if (month.length === 1) {
    month = `0${month}`;
  }
  let day = `${date.getDate()}`;
  if (day.length === 1) {
    day = `0${day}`;
  }

  let hours = `${date.getHours()}`;
  if (hours.length === 1) {
    hours = `0${hours}`;
  }
  let minutes = `${date.getMinutes()}`;
  if (minutes.length === 1) {
    minutes = `0${minutes}`;
  }
  let seconds = `${date.getSeconds()}`;
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }
  return (format || "yyyy-MM-dd hh:mm:ss")
    .replace(/yyyy/g, year)
    .replace(/MM/g, month)
    .replace(/dd/g, day)

    .replace(/hh/g, hours)
    .replace(/mm/g, minutes)
    .replace(/ss/g, seconds);
}
/**
 * 比较函数
 * @param properties  根据传入的属性进行排序数组
 * @param orderMethods 排序方式-- 0 升序 1降序（默认降序）
 * @returns {string}
 */
export function compare(properties: string, orderMethods = 1) {
  return function (m: any, n: any) {
    var a = m[properties];
    var b = n[properties];
    if (!orderMethods) {
      return b - a;
    }
    return a - b; //降序
  };
}
/**
 * 随机生成十六进制颜色
 * @returns {string}
 */
 export function randomHexColor() {
  let hex = Math.floor(Math.random() * 16777216).toString(16); //生成ffffff以内16进制数
  while (hex.length < 6) {
    //while循环判断hex位数，少于6位前面加0凑够6位
    hex = '0' + hex;
  }
  return '#' + hex; //返回‘#'开头16进制颜色
}
/**
 * 生成随机数
 * @param min  最小值
 * @param max 最大值
 * @returns {number}
 */
 export function random(min : number, max : number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeSearchParams(obj:any) {
  const params:any = []

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='))
  })

  return params.join('&')
}