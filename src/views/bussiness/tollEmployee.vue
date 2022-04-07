<template>
  <Module class="flex-grow" :info="bsMeta && bsMeta['emplRanK']" :loading="loading" :error="error">
    <template #title>每收费车道人员配置</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="options" v-model="latest" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOpts" v-if="activeCom === 'list' && dataList?.length > 0" />
      <ul
        class="absolute inset-0 flex items-center justify-around overflow-hidden"
        v-else-if="comData?.length > 0"
      >
        <li
          v-for="item in comData"
          :key="item.roadName"
          :style="{ top: '20px' }"
          class="relative flex flex-col items-center"
        >
          <!-- <span class="mb-3">{{ item.roadName }}</span> -->
          <span :style="{ fontSize: '30px', fontWeight: 700 }">
            <!-- {{ item.actualCurrentNumber }} -->
            0
          </span>
          <img
            :style="{ width: '126px', height: 'auto', top: '-40px' }"
            :src="dataBgImg"
            class="relative pointer-events-none"
          />
        </li>
      </ul>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { defineProps, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { comInfo } from '@/store/state'
import { key } from '@/store'
import { formatYearMonth } from '@/utils/util'
import { useGradient } from '@/utils/color'
import { graphic } from 'echarts'

import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'

import dataBgImg from '@/assets/images/data-bg.png'

defineProps({
  info: {
    type: String,
    default: '',
  },
})

const latest = ref(true)
const options = [
  { name: '最新', value: true },
  { name: '月', value: false },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const appDate = computed(() => formatYearMonth(store.state.appDate))
const bsMeta = computed(() => store.getters.bsMeta)

const showDate = computed(() => {
  return latest.value
    ? employeeData.value?.length > 0
      ? employeeData.value[0]?.accDate
      : ''
    : appDate.value
})

const paramStr = computed(() => {
  const list: any = []
  if (activeCom.value !== 'list') {
    list.push(`com=${activeCom.value}`)
  }
  if (!latest.value) {
    list.push(`accDate=${appDate.value}`)
  }
  return list.length > 0 ? `?${list.join('&')}` : ''
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-kpi/publish/jsc/tollEmployee${paramStr.value}`)
)

watch(paramStr, refresh)

const employeeData = computed(() => data.value?.msgContent)

const comData = computed(() =>
  activeCom.value !== 'list' && !loading.value ? employeeData.value : []
)

// const dataList = computed(() => {
//   let list: any = []
//   if (activeCom.value === 'list' && !loading.value && employeeData.value?.length > 0) {
//     comInfo.forEach(({ code, name }) => {
//       const searchList = employeeData.value.filter(({ orgCode }: any) => orgCode === code)
//       list = [...list, ...searchList]
//     })
//   }
//   return list
// })

const dataList = computed(() => {
  let list = [{
    roadName: '遂渝高速',
    actualCurrentNumber: 0
  }, {
    roadName: '潼荣高速',
    actualCurrentNumber: 0
  }, {
    roadName: '秀松高速',
    actualCurrentNumber: 0
  }, {
    roadName: '永泸高速',
    actualCurrentNumber: 0
  }, {
    roadName: '合安高速',
    actualCurrentNumber: 0
  }, {
    roadName: '石黔高速',
    actualCurrentNumber: 0
  }]
  return list
})

const staticOptions = {
  grid: {
    top: 20,
    left: 40,
    bottom: 50,
    right: 10,
  },
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
      rotate: 30,
      fontSize: 12,
      fontWeight: '400',
    },
  },
}

const staicSeriesOptions = {
  name: '每收费车道人员配置',
  type: 'line',
  label: {
    show: true,
    position: 'top',
    offset: [0, -6],
    verticalAlign: 'middle',
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: [2, 4],
    color: '#fff',
    lineHeight: 12,
    fontSize: 12,
    fontFamily: 'sans-serif',
  },
  lineStyle: {
    color: '#52c1ee',
    width: 1.5,
    shadowColor: 'rgba(0,0,0,.5)',
    shadowBlur: 1,
    shadowOffsetY: 5,
    shadowOffsetX: 2,
  },
  itemStyle: {
    color: '#009EFF',
    borderColor: '#fff',
    borderWidth: 2,
    shadowColor: 'rgba(0, 0, 0, .8)',
    shadowBlur: 2,
    shadowOffsetY: 1,
    shadowOffsetX: 2,
    lineStyle: {
      color: '#3A84FF',
      width: 1,
    },
  },
  areaStyle: {
    color: new graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: 'rgba(58,132,255,0)',
      },
      {
        offset: 1,
        color: 'rgba(58,132,255,0.9)',
      },
    ]),
  },
  smooth: true,
  symbolSize: 6,
  symbol: 'circle',
  encode: {
    x: 'roadName',
    y: 'actualCurrentNumber',
  },
}

const ectOpts = computed(() => ({
  dataset: {
    source: dataList.value,
    dimensions: ['roadName', 'actualCurrentNumber'],
  },
  series: [
    {
      ...staicSeriesOptions,
    },
  ],
  ...staticOptions,
}))
</script>
