// token 未设置
// import axios from '@/utils/axios';
import axios from '@/utils/axiosCrossDomain';

const hostName = 'http://183.64.175.153:32345';
const baseUrl = '/http-server-base/publish/quota-v1';
const api = `${hostName}${baseUrl}`;
// const api = '/http-server-base/publish/quota-v1'

/**
 * 月-集团-收费站统计
 * @param {string} year 格式:yyyy
 */
export function stationEuMonth(year) {
  return axios.get(
    `${api}/stationEuMonth?year=${year}`
  );
}
/**
 * 年-集团-收费站统计
 * @param {string} startYear 格式:yyyy
 * @param {string} endYear 格式:yyyy
 * @return {string} 响应体 promise
 */
export function getYearCliqueToll(startYear, endYear) {
  return axios.get(
    `${api}/stationEuYear?startYear=${startYear}&endYear=${endYear}`
  );
}
/**
 * 年-路段-收费站统计
 * @param {string} orgCode 公司编码
 * @param {string} sectionCode 路段编码
 * @param {string} startYear 格式:yyyy
 * @param {string} endYear 格式:yyyy
 * @return {string} 响应体 promise
 */
export function getYearSectionToll(orgCode, sectionCode, startYear, endYear) {
  return axios.get(
    `${api}/stationSectionYear?orgCode=${orgCode}&sectionCode=${sectionCode}&startYear=${startYear}&endYear=${endYear}`
  );
}
/**
 * 月-路段-收费站统计
 * @param {string} orgCode 公司编码
 * @param {string} sectionCode 路段编码
 * @param {string} startMonth 格式:yyyyMM
 * @param {string} endMonth 格式:yyyyMM
 * @return {string} 响应体 promise
 */
export function getMonthSectionToll(
  orgCode,
  sectionCode,
  startMonth,
  endMonth
) {
  return axios.get(
    `${api}/stationSectionMonth?orgCode=${orgCode}&sectionCode=${sectionCode}&startMonth=${startMonth}&endMonth=${endMonth}`
  );
}
/**
 * 日-路段-收费站统计
 * @param {string} orgCode 公司名称
 * @param {string} startDate 格式:yyyyMMdd
 * @param {string} endDate 格式:yyyyMMdd
 * @return {string} 响应体 promise
 */
export function getDaySectionToll(orgCode, startDate, endDate) {
  return axios.get(
    `${api}/stationSectionDay?orgCode=${orgCode}&startDate=${startDate}&endDate=${endDate}`
  );
}
/**
 * 时-路段-收费站统计
 * @param {string} date 格式:yyyyMMdd
 * @param {string} orgCode 公司编码
 * @param {string} sectionCode 路段编码
 * @return {string} 响应体 promise
 */
export function getHourSectionToll(date, orgCode, sectionCode) {
  return axios.get(
    `${api}/stationSectionHour?date=${date}&orgCode=${orgCode}&sectionCode=${sectionCode}`
  );
}
/**
 * 月-公司-收费站通行统计
 * @param {string} startMonth 格式:yyyyMM
 * @param {string} endMonth 格式:yyyyMM
 * @return {string} 响应体 promise
 */
export function getMonthCompanyToll(startMonth, endMonth) {
  return axios.get(
    `${api}/stationCompanyMonth?startMonth=${startMonth}&endMonth=${endMonth}`
  );
}
/**
 * 时-公司-收费站通行统计
 * @param {string} day 格式:yyyyMMdd
 * @return {string} 响应体 promise
 */
export function getHourCompanyToll(day) {
  return axios.get(`${api}/stationCompanyHour?day=${day}`);
}
/**
 * 日-公司-收费站通行统计
 * @param {string} startDate 格式:yyyyMMdd
 * @param {string} endDate 格式:yyyyMMdd
 * @return {string} 响应体 promise
 */
export function getDayCompanyToll(startDate, endDate) {
  return axios.get(`${api}/stationCompanyDay?
  startDate=${startDate}
  &endDate=${endDate}`);
}
/**
 * 当日支付方式通行量对比
 */
export function getSummarypaytype() {
  return axios.get(`${api}/summarypaytype`);
}

/**
 * 门架数据上传状态
 * @param {string} orgCode 公司编码
 * @param {string} sectionId 路段ID
 * @returns 
 */
export function getGantryStatus(orgCode,sectionId) {
  return axios.get(`${api}/gantryStatus?orgCode=${orgCode}&sectionId=${sectionId}`);
}

/**
 * 年度-路段-按车型统计
 * @param {string} type 0-全部,1-货车,2-客车
 * @param {string} year 年份
 * @param {string} summary 0-不统计，1-统计
 * @returns 
 */
export function getSummarybyvehtype(type,year,summary) {
  return axios.get(`${api}/summarybyvehtype?type=${type}&year=${year}&summary=${summary}`);
}
