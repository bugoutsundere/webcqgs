import axios from "@/utils/axios";

// const basePath = `${process.env.VUE_APP_GIS_SERVICE_BASE}`
const basePath = "http://hope.cmet1965.com:29080";

let mapConfigFileName = "sjgtmap_tjyl";

// 通过应用渠道获取地图配置
export function getMapConfig(params) {
  return axios.get(`${basePath}/img/${mapConfigFileName}.json`, { params });
}

// 通过经纬度获取桩号
export function getPosByLonLat(params) {
  return axios.get(`${basePath}/util/getZH02`, { params });
}

// 通过桩号获取经纬度
export function getLonLatByPos(params) {
  return axios.get(`${basePath}/util/getGPS02`, { params });
}

export const getVideoByCode = params => axios.get('video/movie/getCamera', params)