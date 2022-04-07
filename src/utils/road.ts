/**
 * 转化桩号格式
 * K1234+567 => 1234.567
 * @param {String} stakeText 桩号
 * @return {Number}
 */
export function parseStake(stakeText: any) {
  stakeText = stakeText && String(stakeText).trim()
  if (!stakeText) {
    return null
  }
  return Number(stakeText.replace(/[a-z]+/gi, '').replace('+', '.'))
}

/**
 * 转化桩号格式
 * 1234.567 => K1234+567
 * @param {String|Number} stake 桩号
 * @return {String}
 */
export function formatStake(stake: any) {
  if (!stake && stake !== 0) {
    return ''
  }
  const tmpArr = String(stake)
    .replace(/[a-z]+/gi, '')
    .split('.')
  let decimalPart = tmpArr[1] || ''
  if (!decimalPart) {
    return `K${tmpArr[0]}`
  }
  while (decimalPart.length < 3) {
    decimalPart += '0'
  }
  return `K${tmpArr[0]}+${decimalPart}`
}

/**
 * 获取方向显示文本
 * @param {Integer | String} direction 方向
 * @param {Object} road 所属路段
 */
export function getDirectionText(direction: any, road: any) {
  const { upAliasName, downAliasName } = road || {}
  switch (+direction) {
    case 1:
      return upAliasName || '上行'
    case 2:
      return downAliasName || '下行'
    case 3:
      return '双向'
    case 4:
      return '其他'
    default:
      return ''
  }
}
