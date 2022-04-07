<template>
  <Module class="h-1/2" :info="msMeta && msMeta['traflow']" :loading="loading" :error="error">
    <template #title>拆分收入及折算全程收费流量</template>
    <template #end>
      <span class="mr-2">{{ dateType ? date : date - 1 }}</span>
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOptions" v-if="datalist?.length > 0" />
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { useGradient } from '@/utils/color'
import { formatThousand, formatFix2 } from '@/utils/util'
import { graphic } from 'echarts'

const dateType = ref(true)
const dateOptions = [
  { name: '去年', value: false },
  { name: '本年', value: true },
]

const formatValue = (num: number) => Math.round(num / 100) / 100

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const date = computed(() => store.state.appDate.getFullYear())

const paramsStr = computed(() => {
  const list = [`accDate=${date.value}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return `?${list.join('&')}`
})

const {
  data: vehData,
  loading: vehLoading,
  error: vehError,
  refresh: vehRefresh,
} = useRequest<any>(() => genConfig(`/http-server-kpi/publish/jsc/comvehflow${paramsStr.value}`))
const { data: tsData, loading: tsLoading, error: tsError, refresh: tsRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/transamount${paramsStr.value}`)
)

const loading = computed(() => vehLoading.value || tsLoading.value)
const error = computed(() => vehError.value || tsError.value)

watch(paramsStr, () => {
  vehRefresh()
  tsRefresh()
})

const monthList = computed(() => {
  const list: any = []
  for (let i = 1; i <= 12; i++) {
    i < 10 ? list.push(`0${i}`) : list.push(i + '')
  }
  return list
})

const datalist = computed(() => {
  let key = dateType.value ? 'bnlj' : 'qnlj'
  const vehList = vehData.value?.msgContent
  const tsList = tsData.value?.msgContent
  if (vehList?.length > 0 && tsList?.length > 0) {
    return monthList.value.map((month: string) => {
      const ts = tsList.find((e: any) => e.month === month)
      const veh = vehList.find((e: any) => e.month === month)
      const obj: any = {
        month: Number(month),
      }
      ts && (obj.amount = (ts[key] && formatValue(ts[key])) || '-')
      veh && (obj.flow = veh[key] || '-')
      return obj
    })
  }
  return []
})

const staticOptions = {
  grid: {
    top: 40,
    left: 60,
    bottom: 30,
    right: 55,
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
  legend: {
    top: 10,
    position: 'center',
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 10,
    icon: 'horizontal',
    textStyle: {
      color: '#ffffff',
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
      textStyle: {
        fontSize: 12,
        fontWeight: '400',
      },
    },
  },
  yAxis: [
    {
      name: '拆分收入(万)',
      type: 'value',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
      min: 0,
      splitLine: {
        show: true,
        lineStyle: {
          color: 'rgba(0, 154, 248,.5)',
          width: '1',
        },
      },
      axisLabel: {
        fontSize: 10,
      },
      axisLine: {
        lineStyle: {
          color: '#009EFF',
        },
      },
    },
    {
      name: '折算全程收费车流量',
      type: 'value',
      position: 'right',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
      // min: 'dataMin',
      axisLabel: {
        fontSize: 10,
      },
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
    },
  ],
}

const ectOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    source: datalist.value,
    dimensions: ['month', 'amount', 'flow'],
  },
  series: [
    {
      name: '拆分收入',
      type: 'bar',
      lineStyle: {
        normal: {
          color: '#52c1ee',
          width: 1.5,
          shadowColor: 'rgba(0,0,0,.5)',
          shadowBlur: 2,
          shadowOffsetY: 5,
          shadowOffsetX: 2,
        },
      },
      barWidth: 14,
      itemStyle: {
        normal: {
          color: useGradient('yellow2', 'vertical'),
          borderColor: '#fff',
          borderWidth: 1,
          lineStyle: {
            color: '#3A84FF',
            width: 1,
          },
        },
      },
      symbolSize: 5,
      symbol: 'circle',
      hoverAnimation: false,
      encode: {
        x: 'month',
        y: 'amount',
      },
    },
    {
      name: '折算全程收费车流量',
      type: 'line',
      yAxisIndex: 1,
      lineStyle: {
        normal: {
          color: '#52c1ee',
          width: 2,
          shadowColor: 'rgba(0,0,0,.5)',
          shadowBlur: 2,
          shadowOffsetY: 5,
          shadowOffsetX: 2,
        },
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
      symbolSize: 5,
      symbol: 'circle',
      hoverAnimation: false,
      encode: {
        x: 'month',
        y: 'flow',
      },
    },
  ],
}))
</script>
