import axios from 'axios'
import { get } from './cookie'
import {ElMessage} from 'element-plus'
const service = axios.create({
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000, // request timeouttimeout: 100, // request timeout
})
service.interceptors.request.use(
  config => {
    // config.headers['content-type'] = 'application/json'
    // config.headers['scope'] = 'web'
    // config.headers['t'] = 'sss'
    // config.headers['X-Ca-Key'] = '29900884'
    // config.headers['X-Ca-Signature'] = 'osPf2dpzAP9a59VQWGi6'
    // config.headers['X-Ca-Signature-Headers'] = 'header-a,header-b,x-ca-key,x-ca-timestamp'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const { data: res } = response
    return res
  },
  err => {
    // ElMessage.error("发生错误"+err)
    return Promise.reject(err)
  }
)

export default service
