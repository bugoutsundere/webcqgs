//  token 未设置
import axios from '@/utils/axios';
// import axios from '@/utils/axiosCrossDomain';

// const hostName = 'http://183.64.175.153:32345';
// const baseUrl = '/http-server-base/publish/quota-v1';
// const api = `${hostName}${baseUrl}`;
const api = '/http-server-base/publish/quota-v1';
/**
 * 服务区数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 */
export function getServiceAreaCount(level) {
  return axios.get(`${api}/serviceAreaCount?level=${level}`);
}

/**
 * 收费站数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 */
export function getStationCount(level) {
  return axios.get(`${api}/stationCount?level=${level}`);
}
/**
 * 隧道数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 * @param {string|Number} type 是否加类别统计 0-否,1-是
 */
export function getTunnelCount(level, type) {
  return axios.get(`${api}/tunnelCount?level=${level}&type=${type}`);
}
/**
 * 桥梁数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 * @param {string|Number} type 是否加类别统计 0-否,1-是
 */
export function getBridgeCount(level, type) {
  return axios.get(`${api}/bridgeCount?level=${level}&type=${type}`);
}
/**
 * 门架&车道数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 */
export function getSummarygateorlane(level) {
  return axios.get(`${api}/summarygateorlane?level=${level}`);
}
/**
 * 机电设备数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 */
export function getDeviceCount(level) {
  return axios.get(`${api}/deviceCount?level=${level}`);
}
/**
 * 管控项目&路段数
 */
export function getControlProSecCount() {
  return axios.get(`${api}/controlProSecCount`);
}
/**
 * 投资/管理省市个数
 * @param {string|Number} countType  0-投资,1-管理
 */
export function getMngPrivinceCount(countType) {
  return axios.get(`${api}/mngPrivinceCount?countType=${countType}`);
}
/**
 * 投资经营里程
 */
export function getInvestMileage() {
  return axios.get(`${api}/investMileage`);
}
/**
 * 管理里程
 * @param {string|Number} level 统计类型 0-集团,1-公司
 */
export function getMngSectionLen(level) {
  return axios.get(`${api}/mngSectionLen?level=${level}`);
}


/**
 * 项目公司人员统计
 */
 export function staffCount() {
  return axios.get(`${api}/staffCount`);
}


/**
 * 项目公司人员统计（临）||占比；配置
 */
 export function staffCountTmp() {
  return axios.get(`${api}/staffCountTmp`);
}

