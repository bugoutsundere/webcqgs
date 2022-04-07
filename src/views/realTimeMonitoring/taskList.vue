<template>
  <typesList
    :loading="loading"
    :typeList="taskTypeList"
    :count="count"
    :upperTypes="upperTypes"
    v-model:activeUpperType="activeUpperType"
    v-model:activeTypeName="activeTypeName"
    :showList="showList"
  >
    <template #title>任务单</template>
    <template v-slot:listItem="{ data, index }">
      <div class="node">
        <div class="types">
          <span class="index">{{ index }}</span>
          <span class="evtName mr-auto">{{ `${format(data)?.taskTypeName}${getEvtType(data)}` }}</span>
          <span class="status">{{ format(data)?.taskTypeStatusText }}</span>
        </div>
        <div class="infoValue flex flex-wrap">
          <span>{{ getUserName(data) }}</span>
          <span>{{ getSrcText(data) }}</span>
        </div>
        <div class="infoValue date flex flex-wrap">
          <span>{{ getOrg(format(data)) }}</span>
          <span>{{ format(data)?.taskDetail?.directionText }}</span>
          <span>{{ getStake(data) }}</span>
          <span class="ml-auto">{{ format(data)?.taskDetail?.updateDt }}</span>
        </div>
        <NodeList :data="format(data).nodeList || getNewList(data)" />
      </div>
    </template>
  </typesList>
</template>

<script lang="ts" setup>
import typesList from './components/typesList.vue'
import { computed, ref, watch } from 'vue'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { useStore } from 'vuex'
import { key } from '@/store'
import taskTypes from './static/taskTypes'
import { formatStake } from '@/utils/road'
import { comInfo } from '@/store/state'
import NodeList from './components/NodeList.vue'

const store = useStore(key)
const roadBase = computed(() => store.state.road?.roadBase)
const evtSrc = computed(() => store.state.road?.evtSrc)


const { data, loading, error } = useRequest<any>(() => genConfig('/external/event/findIngTask'))

const dataList = computed(() => data.value?.dataList || [])
const count = computed(() => dataList.value?.length)

const upperTypes = computed(() => {
  let ongoingItems = dataList.value?.filter((e: any) => !['待确认', '待接单'].includes(e.taskTypeStatusText)) || []
  let onLength = ongoingItems?.length
  return [
    {
      label: '全部任务',
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

const activeUpperType = ref('全部任务')
const upperList = computed(() => {
  if (dataList.value?.length > 0) {
    if (activeUpperType.value === '处理中') {
      return dataList.value.filter((e: any) => !['待确认', '待接单'].includes(e.taskTypeStatusText))
    } else if (activeUpperType.value === '待确认') {
      return dataList.value.filter((e: any) => ['待确认', '待接单'].includes(e.taskTypeStatusText))
    }
    return dataList.value
  }
  return []
})

const activeTypeName = ref('全部')
const iconMap: any = computed(() => {
  let obj: any = {}
  taskTypes.forEach(e => {
    obj[e.name] = e.icon
  })
  return obj
})

const showList = computed(() => {
  let list
  if (activeTypeName.value === '全部') {
    list = upperList.value
  } else {
    list = upperList.value?.filter((e: any) => e.taskTypeName === activeTypeName.value)
  }
  return list?.map((e: any) => ({ ...e, icon: iconMap.value[e.taskTypeName] }))?.sort((a: any, b: any) => a?.taskDetail?.updateDt < b?.taskDetail?.updateDt ? 1 : -1)
})

const taskTypeList = computed(() => {
  let countObj: any = {}
  taskTypes.forEach(e => {
    countObj[e.name] = 0
  })
  upperList.value.forEach((e: any) => {
    let { taskTypeName } = e
    countObj.hasOwnProperty(taskTypeName) && countObj[taskTypeName]++
  })
  let list = Object.keys(countObj).map(key => {
    return {
      name: key,
      value: countObj[key],
      icon: taskTypes.find((e: any) => e.name === key)?.icon
    }
  })
  return list
})

const format = (data: any) => data

const getStake = (data: any) => {
  const { taskDetail, eventDetail } = data
  if (taskDetail?.stake) {
    return '/' + formatStake(taskDetail.stake)
  }
  if (eventDetail?.stake) {
    return '/' + formatStake(eventDetail.stake)
  }
  return ''
}

const getSrcText = (data: any) => {
  const { eventSource } = data?.eventDetail

  if (evtSrc.value) {
    let target = evtSrc.value?.find(e => e.code === eventSource)
    if (target) {
      return `/${target.name}`
    }
  }
  return '/未注明来源'
}
const getUserName = (data: any) => {
  let { taskDetail } = data
  return taskDetail.updateByText || taskDetail.publishUserName || taskDetail.publishIdText
}

const getOrg = (data: any) => {
  let { roadId } = data?.eventDetail
  let tRoad = roadBase.value?.find((e: any) => e.id === roadId)
  if (tRoad) {
    let org = comInfo.find(e => e.code === tRoad.orgCode)
    if (org) {
      return org.name
    }
  }
  return tRoad?.roadName || ''
}

const getEvtType = (data: any) => {
  const list = []
  data?.taskDetail?.accidentType && list.push(data?.taskDetail?.accidentType)
  data?.taskDetail?.carNumber && list.push(data?.taskDetail?.carNumber)
  return list?.length > 0 ? `/${list.join('/')}` : ''
}

const getNewList = (data: any) => {
  return [
    {
      status: 1,
      name: '已确认',
    },
    {
      status: 1,
      name: '已分派',
    },
    {
      status: data.taskTypeStatusText !== '已分派' ? 1 : 0,
      name: '处理中',
    },
    {
      status: 0,
      name: '已完成',
    },
  ]
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
