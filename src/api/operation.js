import axios from "@/utils/axios";
const basePath = "/user";

// 获取视频路径
export function getVideoUrl(code) {
  return axios.get(`${basePath}/movie/getCamera?cameraIndexCode=${code}`);
}
// 批量获取视频
export function getCameraList(code) {
  return axios.get(`${basePath}/movie/getCameraList?cameraIndexCode=${code}`);
}
// 获取三个视频
export function getCamerasPage() {
  return axios.get(`${basePath}/movie/getCamerasPage`);
}
// 获取设备状态
export function getEquipmentStatus(code) {
  return axios.get(`${basePath}/device/getDeviceStatusCount?code=${code}`);
}

export const getRoadVideoListByCode = params => axios.post(`${basePath}/movie/page`, params)

// 获取实时数据
export function getChargeBoard(date) {
  return axios.get(`${basePath}/charge/getChargeBoard?date=${date}`);
}
// 获取设备信息
export function equipmentInfo(params) {
  return axios.post(`${basePath}/device/page`, params)
}

// 获取监控列表
export function monitors(params) {
  return axios.post(`${basePath}/movie/page`, params)
}

// 获取tokenKEY
export function generateKey(params) {
  return axios.post(`${basePath}/portal/generateKey`, params)
}

// 获取菜单
export function getMenu(params) {
  return axios.get(`${basePath}/permission/menuList`, params)
}