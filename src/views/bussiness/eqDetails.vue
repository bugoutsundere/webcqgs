<template>
  <Module
    class="w-2/3"
    :info="bsMeta && bsMeta['machineDetail']"
    :loading="loading || comLoading"
    :error="error || comError"
  >
    <template #title>
      {{ `高速设备情况(数量) - ${activeEqObj?.name}` }}
    </template>
    <!-- {{ dataList }} -->
    <Ect :options="ectOpts" v-if="activeCom === 'list' && dataList?.length > 0" />
    <div class="eq-list-container" v-else-if="activeCom !== 'list' && eqSubNums?.length > 0">
      <ul class="eq-list">
        <li
          class="eq-item-box"
          v-for="(item, index) in eqSubNums"
          :key="`${activeCom}${activeEq}${index}`"
        >
          <div class="eq-item">
            <svg-icon class="icon" :name="activeEqObj?.key || ''"></svg-icon>
            <span class="ml-2">{{ item.eqName }}</span>
            <span class="ml-auto">{{ formatThousand(item.eqNums) }}</span>
          </div>
        </li>
      </ul>
    </div>
    <Empty v-else-if="!(loading || comLoading)" />
  </Module>
</template>

<script lang="ts" setup>
import { defineProps, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { eqInfo, comInfo } from '@/store/state'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'

import { useGradient } from '@/utils/color'
import { formatThousand } from '@/utils/util'

defineProps({
  info: {
    type: String,
    default: '',
  },
})

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const activeEq = computed(() => store.state.activeEq)
const bsMeta = computed(() => store.getters.bsMeta)

const activeEqObj = computed(() => eqInfo.find(e => e.code === activeEq.value))

// 各个公司某一类设备
const { data, loading, error, run } = useRequest<any>(
  () => genConfig(`/http-server-yonyu/publish/jsc/eqNums?com=list&typeCode=${activeEq.value}`),
  {
    manual: true,
  }
)

// 全部公司下，设备类型改变
watch(
  [activeCom, activeEq],
  () => {
    if (activeCom.value === 'list') {
      run()
    }
  },
  { immediate: true }
)

const dataList = computed(() => {
  // const list: any = []
  // if (!loading.value) {
  //   comInfo.forEach(({ name, code }) => {
  //     const comData = data.value?.msgContent?.find(({ orgCode }: any) => orgCode === code)
  //     comData && list.push(comData)
  //   })
  // }
  const list = [
    {
    "eqNums": 0,
    "orgCode": "108",
    "orgName": "遂渝高速",
    "typeCode": "0301",
    "typeName": "收费系统"
  },
  
  {
    "eqNums": 0,
    "orgCode": "102",
    "orgName": "潼荣高速",
    "typeCode": "0301",
    "typeName": "收费系统"
  },
  {
    "eqNums": 0,
    "orgCode": "109",
    "orgName": "秀松高速",
    "typeCode": "0301",
    "typeName": "收费系统"
  },
   {
    "eqNums": 0,
    "orgCode": "110",
    "orgName": "永沪高速",
    "typeCode": "0301",
    "typeName": "收费系统"
  },
  {
    "eqNums": 0,
    "orgCode": "106",
    "orgName": "合安高速",
    "typeCode": "0301",
    "typeName": "收费系统"
  },
 
  {
    "eqNums": 0,
    "orgCode": "101",
    "orgName": "石黔高速",
    "typeCode": "0301",
    "typeName": "收费系统"
  }
]
  return list
})

const staticOptions = {
  grid: {
    top: 26,
    left: 50,
    bottom: 40,
    right: 20,
  },
  color: [useGradient('blue', 'vertical')],
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: '#000',
    axisPointer: {
      type: 'shadow',
    },
    textStyle: {
      fontSize: 12,
      color: '#fff',
    },
  },
  yAxis: {
    splitNumber: 3,
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 154, 248,.5)',
        width: '1',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#009EFF',
      },
    },
    axisLabel: {
      show: true,
      fontSize: 10,
    },
  },
  xAxis: {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: '#01A3FF',
        width: '1',
      },
    },
    axisTick: {
      alignWithLabel: true,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: 'rgba(0, 154, 248,.5)',
        width: '1',
      },
    },
    axisLabel: {
      rotate: 15,
      fontSize: 12,
      fontWeight: '400',
    },
  },
}

const ectOpts = computed(() => {
  const options = {
    dataset: {
      source: dataList.value,
      dimensions: ['orgName', 'eqNums'],
    },
    series: [
      {
        name: activeEqObj.value?.name,
        type: 'bar',
        barWidth: '45%',
        label: {
          show: true,
          position: 'top',
          offset: [0, -10],
          color: '#fff',
          fontSize: 16,
          fontFamily: 'sans-serif',
          verticalAlign: 'middle',
          borderRadius: 2,
          backgroundColor: 'rgba(0,0,0 ,0.3)',
          padding: [3, 4],
          formatter: (params: any) => formatThousand(params?.value?.eqNums),
        },
        itemStyle: {
          shadowColor: 'rgba(0, 0, 0, .2)',
          shadowBlur: 2,
          shadowOffsetY: 0,
          shadowOffsetX: 6,
          borderColor: '#fff',
          borderWidth: 1,
        },
        encode: {
          x: 'orgName',
          y: 'eqNums',
        },
      },
    ],
    ...staticOptions,
  }
  return options
})

// 单个公司的设备列表
const { data: comData, loading: comLoading, error: comError, run: comRun } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-yonyu/publish/jsc/eqSubNums?com=${activeCom.value}&typeCode=${activeEq.value}`
    ),
  {
    manual: true,
  }
)

watch(
  [activeCom, activeEq],
  () => {
    if (activeCom.value !== 'list') {
      comRun()
    }
  },
  {
    immediate: true,
  }
)

const eqSubNums = computed(() => comData.value?.msgContent)
</script>

<style lang="postcss" scoped>
.eq-list-container {
  @apply absolute inset-0 overflow-x-hidden overscroll-y-auto;
}

.eq-list {
  @apply w-full flex flex-wrap p-0.5;
}

.eq-item-box {
  @apply p-0.5 w-1/2 lg:w-1/3 2xl:w-1/4 h-auto;
}

.eq-item {
  background: linear-gradient(to left top, rgba(0, 59, 88, 0.3), rgba(0, 70, 105, 1));
  border: 1px solid rgba(7, 133, 196, 0.4);

  @apply relative w-full rounded-sm flex items-center px-2 py-2;
}

.icon {
  font-size: 25px;
  color: rgba(255, 255, 255, 0.5);
}
</style>
