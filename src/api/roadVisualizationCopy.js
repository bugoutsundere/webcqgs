//  token 未设置
// import axios from '@/utils/axios';
import axios from '@/utils/axiosCrossDomain';

const hostName = 'http://183.64.175.153:32345';
const baseUrl = '/http-server-base/publish/quota-v1';
const api = `${hostName}${baseUrl}`;
// const api = '/http-server-base/publish/quota-v1';
/**
 * 事件信息列表
 * @returns 
 */
export function getEventData() {
  return axios.get(
    `${api}/eventdata`
  );
}