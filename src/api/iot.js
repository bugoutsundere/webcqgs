// 21年9月改版
import axios from "@/utils/axios";

const basePath = "https://183.64.175.153:446";

//获取监控摄像头列表
export function getCameras(params) {
  return axios.get(`${basePath}/video/getVideoDeviceList`, {
    params,
  });
}

//获取监控摄像头视频流地址
export function getVideoUrl(params) {
  return axios.post(`${basePath}/artemis-web/debug/20`, {
    data: {
      appKey: "29900884",
      appSecret: "osPf2dpzAP9a59VQWGi6",
      cameraIndexCode: "10090842518674360",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

//获取监控摄像头视频流地址
export function stopVideo(params) {
  return axios.get(`${basePath}/video/stopVideo`, {
    params,
  });
}
