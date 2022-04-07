import { get } from './cookie'
import axios from './axios'

type ObjectService = {
  body?: string
  method?: string
}

export function genConfig(url: string, config?: ObjectService): any {

  // console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"+url)
  // let defaultConfig = {
  //   method: 'GET',
  //   url: url,
  //   headers: new Headers({
  //     'Content-Type': 'application/json',
  //     scope: 'web',
  //     token: get('token') || '',
  //   }),
  // }
  // config && Object.assign(defaultConfig, config)
  // return defaultConfig

  return axios.get(url)
}
