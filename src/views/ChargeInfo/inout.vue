<template>
  <Module class="h-1/3" :loading="loading" :error="error">
    <template #title>出入口统计</template>
    <template #end>
      <Switcher :options="timeOptions" v-model="time" />
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
import { computed, ref, watch } from 'vue'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { useGradient } from '@/utils/color'
import { formatThousand } from '@/utils/util'
import { comInfo } from '@/store/state'
import { graphic } from 'echarts'

const time = ref('day')
const timeOptions = [
  { name: '今日', value: 'day' },
  { name: '最新', value: 'lastHour' },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)

const params = computed(
  () =>
    `timeDimension=${time.value}&orgCode=${activeCom.value === 'list' ? 'NULL' : activeCom.value}`
)

const basePath = '/http-server-charge-management/publish'
const path = computed(() => `${basePath}/station/flowTradeOrg?${params.value}`)

const { data, loading, error, refresh } = useRequest<any>(() => genConfig(path.value))

watch(path, () => {
  if (activeCom.value === 'list') {
    refresh()
  }
})

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const comTrade = list.find(({ orgCode, type }: any) => orgCode === code && type === 'TRADE')
      const comFlow = list.find(({ orgCode, type }: any) => orgCode === code && type === 'FLOW')
      const obj: any = { name }
      if (comTrade) {
        obj.trade = Math.round(comTrade.extcount / 100)
      }
      if (comFlow) {
        obj.inFlow = comFlow.entcount
        obj.outFlow = comFlow.extcount
      }
      return obj
    })
  }
  return []
})

const staticOptions = {
  grid: {
    top: 40,
    bottom: 40,
    left: 60,
    right: 60,
  },
  legend: {
    top: '10px',
    icon: 'diamond',
    itemWidth: 12,
    itemHeight: 12,
    padding: [6, 10],
    itemGap: 20,
    textStyle: {
      color: '#fff',
      fontSize: 12,
    },
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
      fontSize: 12,
      fontWeight: 400,
    },
  },
  yAxis: [
    {
      name: '车流量(辆)',
      type: 'value',
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
    {
      name: '出口交易金额(元)',
      type: 'value',
      position: 'right',
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
  ],
}

const ectOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    source: datalist.value,
    dimensions: ['name', 'trade', 'inFlow', 'outFlow'],
  },
  series: [
    {
      type: 'bar',
      name: '出口车流量',
      barWidth: '30%',
      itemStyle: {
        color: useGradient('blue', 'vertical'),
        borderColor: '#fff',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, .8)',
        shadowBlur: 4,
        shadowOffsetY: 1,
        shadowOffsetX: 2,
      },
      label: {
        show: true,
        position: 'top',
        color: '#00D8FF',
        lineHeight: 12,
        fontSize: 12,
        fontFamily: 'sans-serif',
        verticalAlign: 'middle',
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: [2, 4],
        borderColor: 'rgba(0,0,0,0.8)',
        offset: [0, -5],
      },
      encode: {
        x: 'name',
        y: 'outFlow',
      },
    },
    {
      type: 'bar',
      name: '入口车流量',
      barWidth: '30%',
      itemStyle: {
        color: useGradient('red2', 'vertical'),
        borderColor: '#fff',
        borderWidth: 1,
        shadowColor: 'rgba(0, 0, 0, .8)',
        shadowBlur: 4,
        shadowOffsetY: 1,
        shadowOffsetX: 2,
      },
      label: {
        show: true,
        position: 'top',
        color: '#FFA200',
        lineHeight: 12,
        fontSize: 12,
        fontFamily: 'sans-serif',
        verticalAlign: 'middle',
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: [2, 4],
        borderColor: 'rgba(0,0,0,0.8)',
        offset: [0, -5],
      },
      encode: {
        x: 'name',
        y: 'inFlow',
      },
    },
    {
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      name: '出口交易金额',
      encode: {
        x: 'name',
        y: 'trade',
      },
      label: {
        show: true,
        position: 'top',
        color: '#00FF36',
        lineHeight: 12,
        fontSize: 12,
        fontFamily: 'sans-serif',
        verticalAlign: 'middle',
        borderRadius: 2,
        borderWidth: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: [2, 4],
        borderColor: 'rgba(0,0,0,0.8)',
        offset: [0, -5],
      },
      lineStyle: {
        color: useGradient('green', 'vertical'),
        width: 2,
        shadowColor: 'rgba(0,0,0,.5)',
        shadowBlur: 2,
        shadowOffsetY: 3,
        shadowOffsetX: 2,
      },
      itemStyle: {
        color: useGradient('green'),
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
            color: 'rgba(29, 151, 108,0)',
          },
          {
            offset: 1,
            color: 'rgba(29, 151, 108,0.9)',
          },
        ]),
      },
      symbolSize: 5,
      symbol: 'circle',
    },
  ],
}))
</script>
