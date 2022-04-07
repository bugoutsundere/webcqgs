//  token 未设置
// import axios from '@/utils/axios';
import axios from '@/utils/axiosCrossDomain';

const hostName = 'http://183.64.175.153:32345';
const baseUrl = '/http-server-base/publish/quota-v1';
const api = `${hostName}${baseUrl}`;
// const api = '/http-server-base/publish/quota-v1';
/**
 * 涵洞数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 * @param {string|Number} type 是否加类别统计 0-否,1-是
 */
export function getCulvertCount(level, type) {
  return axios.get(`${api}/culvertCount?level=${level}&type=${type}`);
}

/**
 * 沿线设施数量
 */
export function getRoadsideCount() {
  return axios.get(`${api}/roadsideCount`);
}
/**
 * 边坡数量
 * @param {string|Number} level 组织级别 0-集团,1-公司,2-路段
 * @param {string|Number} riskType 是否加类别统计 0-否,1-是
 */
export function getSideslopeCount(level, type) {
  return axios.get(`${api}/sideslopeCount?level=${level}&riskType=${type}`);
}
/**
 * 沿路设施信息
 */
export function getRoadsideInfo() {
  return axios.get(`${api}/roadsideInfo`);
}
/**
 * 边坡信息
 */
export function getSideslopeInfo() {
  return axios.get(`${api}/sideslopeInfo`);
}
/**
 * 隧道信息
 */
export function getTunnelInfo() {
  return axios.get(`${api}/tunnelInfo`);
}
/**
 * 桥梁信息
 */
export function getBridgeInfo(countType) {
  return axios.get(`${api}/bridgeInfo`);
}
/**
 * 路段信息
 */
export function getSectionInfo() {
  return axios.get(`${api}/sectionInfo`);
}
/**
 * 养护设施&人员
 */
export function getMaintainStaffInfo() {
  return axios.get(`${api}/maintainStaffInfo`);
}