import { State } from './state'
import { getSum } from './modules/charge'

export default {
  bsMeta: (state: State) => state.meta?.bussiness,
  osMeta: (state: State) => state.meta?.operation,
  msMeta: (state: State) => state.meta?.management,
  idxMeta: (state: State) => state.meta?.idxdesc,
  comChargeData: (state: State) => {
    const activeCom = state.activeCom
    if (activeCom === 'list') {
      return getSum(state.charge?.redisDataList)
    } else {
      const comData = state.charge?.redisDataList[activeCom]
      return (comData && getSum([comData])) || null
    }
  },
  comStructList: (state: State) => {
    const activeCom = state.activeCom
    if (activeCom === 'list') {
      return []
    }
    return state.charge?.structList?.filter((e: any) => e.orgCode === activeCom) || []
  },
  activeFeature: (state: State) => {
    const id = state.charge?.activeFeatureId
    const list = state.charge?.structList
    if (id && list) {
      let target = list.find((e: any) => e.gantryCode === id)
      if (target) {
        return {
          ...target,
          type: 'gantry',
          id: target.gantryCode
        }
      } else {
        target = list.find((e: any) => e.statId === id)
        if (target) {
          return {
            ...target,
            type: 'station',
            id: target.statId
          }
        }
      }
    }
    return null
  },
  roadCode: (state: State) => {
    const arr = state.road?.allRoads,
          id = state.road?.selectRoadId
    const roadCode =  arr?.filter(item => item.id === id)
    return roadCode[0].code || ''
  },
  roadNo: (state: State) => {
    const arr = state.road?.allRoads,
          id = state.road?.selectRoadId
    const road =  arr?.filter(item => item.id === id)
    return road[0].roadNo || ''
  },
}
