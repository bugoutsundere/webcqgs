import axios from '@/utils/axios'
import Stomp from 'stompjs'
import SockJS from 'sockjs-client'

export interface State {
  activeFeatureId: string
  structList: any[] | null
  redisDataList: any
  redisLoading: boolean
  structLoading: boolean
}

const state: State = {
  activeFeatureId: '',
  structList: null,
  redisDataList: {},
  redisLoading: false,
  structLoading: false,
}

const formatSum = (dKey: string, obj: any) => {
  if (dKey.indexOf('Sum') > -1 || dKey.indexOf('Fee') > -1) {
    return Math.round(Number(obj[dKey]) / 100)
  } else {
    return Math.round(Number(obj[dKey]))
  }
}

const topicHandlers: any = {
  ads_gantry_flow: async (data: any, { state, commit }: any) => {
    if (!state.structList || Object.keys(state.redisDataList).length <= 0) {
      return
    }
    const { gantryId, flowCount } = data
    const gantry = state.structList.find((e: any) => e.gantryCode === gantryId)
    if (!gantry) {
      return
    }
    const { orgCode } = gantry
    commit('changeRedisData', {
      type: 'gantry',
      id: gantryId,
      data: [
        {
          key: 'flowCount',
          value: Number(flowCount),
        },
      ],
      orgCode,
    })
  },
  ads_gantry_trade: async (data: any, { state, commit }: any) => {
    if (!state.structList || Object.keys(state.redisDataList).length <= 0) {
      return
    }
    const { gantryId, tradeSum } = data
    const gantry = state.structList.find((e: any) => e.gantryCode === gantryId)
    if (!gantry) {
      return
    }
    const { orgCode } = gantry
    const list: any = []
    tradeSum.forEach((e: any) => {
      Object.keys(e).forEach((t: any) => {
        if (t !== 'mediaType') {
          list.push({
            key: t + e.mediaType,
            value: formatSum(t, e),
          })
        }
      })
    })

    commit('changeRedisData', {
      type: 'gantry',
      id: gantryId,
      data: list,
      orgCode,
    })
  },
  ads_station_ent: async (data: any, { state, commit }: any) => {
    if (!state.structList || Object.keys(state.redisDataList).length <= 0) {
      return
    }
    const { stationId, entFlowCount } = data
    const station = state.structList.find((e: any) => e.statId === stationId)
    if (!station) {
      return
    }
    const { orgCode } = station
    commit('changeRedisData', {
      type: 'station',
      id: stationId,
      data: [
        {
          key: 'entFlowCount',
          value: Number(entFlowCount),
        },
      ],
      orgCode,
    })
  },
  ads_station_ext: async (data: any, { state, commit }: any) => {
    // console.log(data)
    if (!state.structList || Object.keys(state.redisDataList).length <= 0) {
      return
    }
    const { stationId, tradeSum } = data
    const station = state.structList.find((e: any) => e.statId === stationId)
    if (!station) {
      return
    }
    const { orgCode } = station
    const list: any = []
    tradeSum?.forEach((e: any) => {
      Object.keys(e)?.forEach((t: any) => {
        if (t !== 'mediaType') {
          list.push({
            key: t + e.mediaType,
            value: formatSum(t, e),
          })
        }
      })
    })
    commit('changeRedisData', {
      type: 'station',
      id: stationId,
      data: list,
      orgCode,
    })
  },
}

let wsClient: any = null
let closeTimer: any = null
let reConnTimer: any = null
const handler = function (msg: any, p: any) {
  const data = JSON.parse(msg.body)
  Object.keys(data).forEach((topic: string) => {
    Object.prototype.hasOwnProperty.call(topicHandlers, topic) &&
      topicHandlers[topic](data[topic], p)
  })
}
const actions = {
  async getStructList({ state, commit }: any): Promise<any> {
    if (!state.structList) {
      commit('changeStructLoading', true)
      try {
        const res: any = await axios.get(
          '/http-server-yygl/publish/jsc/gantrybase?com=list'
        )
        if (res.msgState === 'SUCCESS') {
          commit('setStructList', res.msgContent)
          commit('changeStructLoading', false)
        } else {
          throw res.mdgDes
        }
      } catch (error) {
        console.log('获取门架收费站列表失败')
        commit('changeStructLoading', false)
        throw error
      }
    }
  },
  async getRedisData({ state, commit }: any, com: string): Promise<any> {
    try {
      commit('changeRedisLoading', true)
      const res: any = await axios.get(
        `/http-server-charge-management/redis/dayDataOrg${
          com !== 'list' ? `?orgCode=${com}` : ''
        }`
      )
      if (res.msgState === 'SUCCESS') {
        Object.keys(res.msgContent).forEach((orgCode: string) => {
          const data = res.msgContent[orgCode]
          if (Object.keys(data).length > 0) {
            commit('setComRedisData', {
              com: orgCode,
              data: data,
            })
          }
        })
        commit('changeRedisLoading', false)
      } else {
        throw res.msgDes
      }
    } catch (error) {
      commit('changeRedisLoading', false)
      throw error
    }
  },
  connect({ state, commit, dispatch }: any) {
    if (false) {
    // if (!wsClient) {
      const ws = new SockJS('/http-server-charge-management/wsocket', null, {
        timeout: 60000
      })
      wsClient = Stomp.over(ws)
      wsClient.debug = null
    }
    const onConnected = () => {
      console.log('连接成功')
      wsClient.subscribe(`/topic/wsocket`, (msg: any) =>
        handler(msg, { state, commit })
      )
    }
    const onError = () => {
      console.log('连接失败')
      dispatch('initWebsocket')
    }
    wsClient.connect('cmnit', 'cmnitmq#f0z', onConnected, onError, '/')
  },
  disconnect() {
    if (wsClient) {
      closeTimer = setTimeout(() => {
        wsClient.disconnect()
        reConnTimer && clearInterval(reConnTimer)
        wsClient = null
        reConnTimer = null
        closeTimer = null
        console.log('断开连接')
      }, 5000)
    }
  },
  initWebsocket({ state, commit, dispatch }: any) {
    setTimeout(() => {
      closeTimer && clearTimeout(closeTimer)
      dispatch('connect')
    }, 1000)

    // reConnTimer = setInterval(() => {
    //   // 断开重连机制,尝试发送消息,捕获异常发生时重连
    //   try {
    //     wsClient.send('/app/test1', {}, JSON.stringify({ name: 'test1' }))
    //   } catch (err) {
    //     console.log('断线重连')
    //     dispatch('connect')
    //   }
    // }, 5000)
  },
}

const formatRedis = (keys: string[], data: any) => {
  return keys.map((key: string) => {
    const obj = data[key]
    const id = key.split('_')[1]
    const newObj: any = {}
    Object.keys(obj).forEach((dKey) => {
      newObj[dKey] = formatSum(dKey, obj)
    })
    return {
      id,
      ...newObj,
    }
  })
}

// mutations
const mutations = {
  changeActiveFeatureId(state: State, val: string): void {
    state.activeFeatureId = val
  },
  setStructList(state: State, val: any[]) {
    state.structList = val
  },
  changeRedisLoading(state: State, val: boolean) {
    state.redisLoading = val
  },
  changeStructLoading(state: State, val: boolean) {
    state.structLoading = val
  },
  setComRedisData(state: State, { com, data }: any) {
    const keys = Object.keys(data)
    const stationKeys = keys.filter(
      (key: string) => key.indexOf('STATION') === 0
    )
    const gantryKeys = keys.filter((key: string) => key.indexOf('GANTRY') === 0)
    state.redisDataList[com] = {
      station: formatRedis(stationKeys, data),
      gantry: formatRedis(gantryKeys, data),
    }
  },
  changeRedisData(state: State, { type, orgCode, data, id }: any) {
    const target = state.redisDataList[orgCode][type]?.find(
      (e: any) => e.id === id
    )
    const newObj = JSON.parse(JSON.stringify(target || { id }))
    data.forEach((e: any) => {
      newObj[e.key] = e.value
    })
    if (!target) {
      state.redisDataList[orgCode][type].push(newObj)
      return
    }
    state.redisDataList[orgCode][type] = state.redisDataList[orgCode][
      type
    ].filter((e: any) => e.id !== id)
    state.redisDataList[orgCode][type].push(newObj)
  },
}

export const getSum = (comDataList: any) => {
  const gantry: any = {
    flowCount: 0,
    feeSum1: 0,
    payFeeSum1: 0,
    discountFeeSum1: 0,
    feeSum2: 0,
    payFeeSum2: 0,
    discountFeeSum2: 0,
  }
  const station: any = {
    entFlowCount: 0,
    extFlowCount: 0,
    feeSum1: 0,
    payFeeSum1: 0,
    discountFeeSum1: 0,
    feeSum2: 0,
    payFeeSum2: 0,
    discountFeeSum2: 0,
  }
  Object.keys(comDataList).forEach((com: string) => {
    const comData = comDataList[com]
    if (comData) {
      const gantryData = comData.gantry
      const stationData = comData.station
      Object.keys(gantry).forEach((key: string) => {
        gantry[key] += gantryData
          .map((e: any) => e[key] || 0)
          .reduce((a: number, b: number) => a + b)
      })
      Object.keys(station).forEach((key: string) => {
        station[key] += stationData
          .map((e: any) => e[key] || 0)
          .reduce((a: number, b: number) => a + b)
      })
    }
  })
  gantry.totalAmount = gantry.feeSum1 + gantry.feeSum2
  station.totalAmount = station.feeSum1 + station.feeSum2
  return {
    gantry,
    station,
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
