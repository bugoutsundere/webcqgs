// import axios from '@/utils/axios';
import axios from '@/utils/axiosCrossDomain';

const hostName = 'http://183.64.175.153:32345';
const baseUrl = '/http-server-base/publish/quota-v1';
const api = `${hostName}${baseUrl}`;
// const api = '/http-server-base/publish/quota-v1';
/**
 * 病害平均处理天数
 */
export function diseaseHandle() {
  return axios.get(`${api}/diseaseHandle`);
}
/**
 * 病害数量/按类型
 */
export function diseaseCountType() {
  return axios.get(`${api}/diseaseCountType`);
}
/**
 * 病害数量
 * @param {string|Number} level  组织级别
 */
export function diseaseCount(level) {
  return axios.get(`${api}/diseaseCount?level=${level}`);
}
/**
 * 日常巡检个数
 */
export function dailyInspectCount() {
  return axios.get(`${api}/dailyInspectCount`);
}
/**
 * 定期/经常检查个数
 */
export function regularInspectCount() {
  return axios.get(`${api}/regularInspectCount`);
}
/**
 * 养护工单数量
 */
export function worktableCount() {
  return axios.get(`${api}/worktableCount`);
}
/**
 * 养护支付金额
 * @param {string|Number} level 级别
 */
export function payedAmount(level) {
  return axios.get(`${api}/payedAmount?level=${level}`);
}
/**
 * 集团-养护预算
 */
export function budgetEu() {
  return axios.get(`${api}/budgetEu`);
}

/**
 * 工单任务执行情况
 */
export function taskStatusCount() {
  return axios.get(`${api}/taskStatusCount`);
}

