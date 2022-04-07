import axios from '@/utils/axios'
import { get, set, remove } from '@/utils/cookie'
import { comInfo } from '../state'

export interface State {
  // userName: string
  token: string
  userInfo: any
  userOrg: string
}

const { VITE_LOGIN_URL, VITE_AUTH } = import.meta.env

const state: State = {
  // userName: '',
  token: '',
  userInfo: null,
  userOrg: 'list',
}

const actions = {
  logout({ commit }: any): void {
    commit('reset')
    window.location.href = VITE_LOGIN_URL as string
  },
  async getToken({ state, commit }: any, tokenKey: string) {
    console.log(tokenKey)
    try {
      const res = await axios.post('/user/portal/validateKey', {
        key: tokenKey,
      })
      console.log(res)
      if (res?.data && (res as any)?.success) {
        commit('setToken', res.data)
      }
    } catch (error) {
      console.log('获取token失败:' + error)
    }
  },
  async getUserInfo({ state, commit }: any) {
    try {
      const res = await axios.get('/user/user/getCurrentUserInfo')
      if ((res as any)?.success) {
        commit('setUserInfo', res.data)
      }
    } catch (error) {
      console.log('获取用户信息失败')
    }
  },
}

// mutations
const mutations = {
  reset(state: State): void {
    remove('tokenKey')
    remove('token')
  },
  setToken: (state: State, token: string) => {
    state.token = token
    set('token', token)
  },
  setUserInfo: (state: State, userInfo: any) => {
    state.userInfo = userInfo
    const comList = comInfo.map(({ code }) => code)
    const {orgCode} = userInfo
    if(comList.includes(orgCode)) {
      state.userOrg  = orgCode
    } else {
      state.userOrg = 'list'
    }
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
