<template>
  <typesList
    :loading="loading"
    :typeList="evtTypeList"
    :upperTypes="upperTypes"
    :showList="showList"
    :count="count"
    v-model:activeUpperType="activeUpperType"
    v-model:activeTypeName="activeTypeName"
  >
    <template #title>当前事件列表</template>
    <template v-slot:listItem="{ data, index }">
      <div class="node">
        <div class="types">
          <span class="index">{{ index }}</span>
          <span
            class="evtName mr-auto"
          >{{ `${format(data)?.eventOneTypeText}/${format(data)?.eventTwoTypeText}` }}</span>
          <span class="status">{{ getStatus(format(data)?.status) }}</span>
        </div>
        <div class="infoValue flex flex-wrap">
          <span>{{ `${format(data)?.updateByText}` }}</span>
          <span>{{ getSrcText(format(data)?.eventSource) }}</span>
        </div>
        <div class="infoValue date flex flex-wrap">
          <span>{{ `${(roadBase && getOrg(format(data)) + '/') || ''}${format(data)?.directionText}/${formatStake(format(data)?.stake)}` }}</span>
          <span class="ml-auto">{{ format(data)?.updateDt }}</span>
        </div>
      </div>
    </template>
  </typesList>
</template>

<script lang="ts" setup>
import typesList from './components/typesList.vue'
import { computed, ref, watch } from 'vue'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import evtTypes from './static/evtTypes'
import { comInfo } from '@/store/state'
import { useStore } from 'vuex'
import { key } from '@/store'
import { formatStake } from '@/utils/road'

const store = useStore(key)
const roadBase = computed(() => store.state.road?.roadBase)
const evtSrc = computed(() => store.state.road?.evtSrc)

const { data, loading, error } = useRequest<any>(() => genConfig('/external/event/cockpit-event-list?pageNo=1&pageSize=1000'))

const dataList = computed(() => data.value?.data?.result || [])
const count = computed(() => dataList.value?.length)

const upperTypes = computed(() => {
  let ongoingItems = dataList.value?.filter((e: any) => e.status > 1) || []
  let onLength = ongoingItems?.length
  return [
    {
      label: '全部事件',
      icon: 'upper-quanbu',
      value: count.value || '-',
    },
    {
      label: '处理中',
      icon: 'upper-ongoing',
      value: onLength || '-',
    },
    {
      label: '待确认',
      icon: 'upper-unconfirm',
      value: count.value >= onLength ? count.value - onLength : '-',
    },
  ]
})

const activeUpperType = ref('全部事件')
const upperList = computed(() => {
  if (dataList.value?.length > 0) {
    if (activeUpperType.value === '处理中') {
      return dataList.value.filter((e: any) => e.status > 1)
    } else if (activeUpperType.value === '待确认') {
      return dataList.value.filter((e: any) => e.status === 1)
    }
    return dataList.value
  }
  return []
})

const activeTypeName = ref('全部')
const iconMap: any = computed(() => {
  let obj: any = {}
  evtTypes.forEach(e => {
    obj[e.name] = e.icon
  })
  return obj
})
const showList = computed(() => {
  let list
  if (activeTypeName.value === '全部') {
    list = upperList.value
  } else {
    list = upperList.value?.filter((e: any) => e.eventOneTypeText === activeTypeName.value)
  }
  return list?.map((e: any) => ({ ...e, icon: iconMap.value[e.eventOneTypeText] }))?.sort((a: any, b: any) => a.updateDt < b.updateDt ? 1 : -1)
})

const evtTypeList = computed(() => {
  let countObj: any = {}
  evtTypes.forEach(e => {
    countObj[e.name] = 0
  })
  upperList.value.forEach((e: any) => {
    let { eventOneTypeText } = e
    countObj.hasOwnProperty(eventOneTypeText) && countObj[eventOneTypeText]++
  })
  let list = Object.keys(countObj).map(key => {
    return {
      name: key,
      value: countObj[key],
      icon: evtTypes.find((e: any) => e.name === key)?.icon
    }
  })
  return list
})

const getStatus = (status: any) => {
  let map: any = {
    1: '待确认',
    2: '待分派',
    3: '处理中',
  }
  return map[status]
}

const format = (data: any) => data

const getOrg = (data: any) => {
  let { roadId } = data
  let tRoad = roadBase.value?.find((e: any) => e.id === roadId)
  if (tRoad) {
    let org = comInfo.find(e => e.code === tRoad.orgCode)
    if (org) {
      return org.name
    }
  }
  return tRoad?.roadName || ''
}

const getSrcText = (src: any) => {
  if (!evtSrc.value || !src) {
    return ''
  }
  let target = evtSrc.value?.find((e: any) => e.code === src)
  if (target) {
    return `/${target.name}`
  }
  return '/未注明来源'
}
</script>

<style lang="postcss" scoped>
.node {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 100;
}

.typeIcon {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.15);
  position: absolute;
  right: 5px;
  bottom: 5px;
  z-index: 99;
}

.types {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.evtName {
  font-size: 14px;
  color: rgb(7, 176, 255);
}
.status {
  color: #fcb83b;
  font-size: 12px;
  white-space: nowrap;
  text-shadow: none;
}
.infoValue {
  font-size: 12px;
  margin-top: 6px;
}
.date {
  color: rgba(255, 255, 255, 0.8);
}

.index {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.6);
  width: 18px;
  height: 18px;
  font-size: 12px;
  line-height: 12px;
  border-radius: 50%;
  margin-left: -2px;
  
  @apply flex items-center justify-center mr-2;
}
</style>