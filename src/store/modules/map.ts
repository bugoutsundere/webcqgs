import { getMapConfig } from '@/api/gis'

export interface State {
    config: any
    layers: Array<any>
    selectedLayers: Array<any>
}
  
const initialState: State = {
  config: null, // 地图配置
  layers: [], // 地图静态图层配置
  selectedLayers: ['MILESTONE_KM'], // 选中地图图层code
}

const state: State = JSON.parse(JSON.stringify(initialState))

const mutations = {
  RESET(state: any) {
    Object.assign(state, JSON.parse(JSON.stringify(initialState)))
  },
  SET_STATE: (state: any, payload: any) => {
    state[payload.key] = payload.value
  },
}

const actions = {
  reset({ commit }: any) {
    commit('RESET')
  },

  async getMapConfig({ commit }: any) {
    const res = await getMapConfig()
    if (res && res.data) {
      const { map, layers } = res.data
      commit('SET_STATE', { key: 'config', value: Object.freeze(map) })
      commit('SET_STATE', { key: 'layers', value: Object.freeze(layers) })
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
