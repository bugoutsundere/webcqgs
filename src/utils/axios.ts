import axios from 'axios'
import { get } from './cookie'

const service = axios.create({
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 60 * 1000 , // request timeout
})

service.interceptors.request.use(
  config => {
    config.headers['content-type'] = 'application/json'
    config.headers['scope'] = 'web'
    config.headers['token'] = get('token')
    config.headers['X-Ca-Key'] = '29900884'
    config.headers['X-Ca-Signature'] = 'osPf2dpzAP9a59VQWGi6'
    config.headers['X-Ca-Signature-Headers'] = 'header-a,header-b,x-ca-key,x-ca-timestamp'
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const { config, data: res } = response
    return res
  },
  err => {
    return Promise.reject(err)
  }
)

export default service
