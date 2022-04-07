<template>
  <Module :class="`h-1/${activeCom === 'list' ? 3 : 2}`" :loading="loading" :error="error">
    <template #title>通行交易趋势</template>
    <template #end>
      <Switcher v-if="!activeFeatureId" :options="structOptions" v-model="struct" />
      <span class="featureName" v-else>
        {{
          activeFeature &&
          activeFeature[activeFeature.type === 'gantry' ? 'gantryName' : 'statName']
        }}
      </span>
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
import { formatThousand, formatFix2 } from '@/utils/util'
import { comInfo } from '@/store/state'
import { graphic } from 'echarts'

const time = ref('dayHour')
const timeOptions = [
  { name: '今日', value: 'dayHour' },
  { name: '近15天', value: '15' },
]

const struct = ref('gantry')
const structOptions = [
  { name: '门架', value: 'gantry' },
  { name: '收费站', value: 'station' },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const activeFeatureId = computed(() => store.state.charge?.activeFeatureId)
const activeFeature = computed(() => store.getters.activeFeature)

const params = computed(() => {
  const list = [`timeDimension=${time.value}`]
  if (activeCom.value !== 'list') {
    list.push(`orgCode=${activeCom.value}`)
    if (activeFeatureId.value && activeFeature.value) {
      list.push(`${activeFeature.value.type}id=${activeFeatureId.value}`)
    }
  }
  return list.join('&')
})

const scope = computed(() => {
  if (activeFeatureId.value && activeCom.value !== 'list' && activeFeature.value) {
    return ''
  }
  return activeCom.value === 'list' ? 'All' : 'Org'
})

const basePath = '/http-server-charge-management/publish'
const path = computed(() => {
  if (activeFeatureId.value && activeFeature.value) {
    return `${basePath}/${activeFeature.value.type}/flowTrade${scope.value}?${params.value}`
  }
  return `${basePath}/${struct.value}/flowTrade${scope.value}?${params.value}`
})

const { data, loading, error, refresh } = useRequest<any>(() => genConfig(path.value))

watch(path, refresh)

const ectShowType = computed(() => {
  if (activeFeatureId.value && activeFeature.value) {
    return activeFeature.value.type
  }
  return struct.value
})

const datalist = computed(() => {
  const list = data.value.msgContent
  if (list?.length > 0) {
    const timeList: any = []
    list.forEach((e: any) => !timeList.includes(e.time) && timeList.push(e.time))

    return timeList
      .sort((a: any, b: any) => a - b)
      .map((date: string) => {
        const obj: any = {
          time: time.value === 'dayHour' ? Number(date) : formatDate(date),
        }
        const flow = list.find((e: any) => e.type === 'FLOW' && e.time === date)
        const trade = list.find((e: any) => e.type === 'TRADE' && e.time === date)
        if (ectShowType.value === 'gantry') {
          flow && (obj.inFlow = formatNum(flow.num))
          trade && (obj.trade = formatAmount(trade.num))
        } else {
          if (flow) {
            obj.inFlow = formatNum(flow.entcount)
            obj.outFlow = formatNum(flow.extcount)
          }
          trade && (obj.trade = formatAmount(trade.extcount))
        }
        return obj
      })
  }
  return []
})
const formatNum = (num: number) => {
  return formatFix2(Math.round(num / 100) / 100)
}

const formatAmount = (num: number) => {
  return formatFix2(Math.round(num / 10000) / 100)
}

const formatDate = (date: string) => {
  const month = date.slice(4, 6)
  const day = date.slice(6, 8)
  return Number(month) + '.' + day
}

const staticOptions = {
  grid: {
    top: 40,
    left: 34,
    right: 34,
    bottom: 30,
  },
  legend: {
    top: '4px',
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
    boundaryGap: false,
    interval: 6,
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
      name: '(万元)',
      type: 'value',
      position: 'left',
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
      name: '(万辆)',
      type: 'value',
      splitNumber: 3,
      position: 'right',
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

const tradeSeries = computed(() => ({
  type: 'line',
  yAxisIndex: 0,
  smooth: true,
  name: '交易金额',
  encode: {
    x: 'time',
    y: 'trade',
  },
  label: {
    show: true,
    position: 'top',
    lineHeight: 12,
    fontSize: 12,
    fontFamily: 'sans-serif',
    verticalAlign: 'middle',
    borderRadius: 2,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: [2, 4],
    borderColor: 'rgba(0,0,0,0.8)',
    offset: [0, -20],
    formatter:
      ectShowType.value === 'gantry'
        ? '{trade|{@trade}}\n{inFlow|{@inFlow}}'
        : '{trade|{@trade}}\n{inFlow|{@inFlow}}\n{outFlow|{@outFlow}}',
    rich: {
      trade: {
        color: '#00FF36',
        align: 'right',
      },
      inFlow: {
        color: '#00D8FF',
        align: 'right',
      },
      outFlow: {
        color: '#FFA200',
        align: 'right',
      },
    },
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
}))

const inFlowSeris = computed(() => ({
  type: 'line',
  yAxisIndex: 1,
  smooth: true,
  name: ectShowType.value === 'gantry' ? '车流量' : '入口车流量',
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
  lineStyle: {
    color: useGradient('blue', 'vertical'),
    width: 2,
    shadowColor: 'rgba(0,0,0,.5)',
    shadowBlur: 2,
    shadowOffsetY: 3,
    shadowOffsetX: 2,
  },
  areaStyle: {
    color: new graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: 'rgba(12, 140, 223,0)',
      },
      {
        offset: 1,
        color: 'rgba(12, 140, 223,0.9)',
      },
    ]),
  },

  symbolSize: 5,
  symbol: 'circle',
  encode: {
    x: 'name',
    y: 'inFlow',
  },
}))

const outFlowSeries = {
  type: 'line',
  yAxisIndex: 1,
  smooth: true,
  name: '出口车流量',
  barWidth: '30%',
  itemStyle: {
    color: useGradient('red2', 'vertical'),
    borderColor: '#fff',
    borderWidth: 2,
    shadowColor: 'rgba(0, 0, 0, .8)',
    shadowBlur: 4,
    shadowOffsetY: 1,
    shadowOffsetX: 2,
  },
  lineStyle: {
    color: useGradient('red2', 'vertical'),
    width: 2,
    shadowColor: 'rgba(0,0,0,.5)',
    shadowBlur: 2,
    shadowOffsetY: 3,
    shadowOffsetX: 2,
  },
  areaStyle: {
    color: new graphic.LinearGradient(0, 1, 0, 0, [
      {
        offset: 0,
        color: 'rgba(223, 54, 12,0)',
      },
      {
        offset: 1,
        color: 'rgba(223, 54, 12,0.9)',
      },
    ]),
  },
  symbolSize: 5,
  symbol: 'circle',
  encode: {
    x: 'name',
    y: 'outFlow',
  },
}

const ectOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    dimensions:
      ectShowType.value === 'gantry'
        ? ['time', 'inFlow', 'trade']
        : ['time', 'inFlow', 'outFlow', 'trade'],
    source: datalist.value,
  },
  series:
    ectShowType.value === 'gantry'
      ? [tradeSeries.value, inFlowSeris.value]
      : [tradeSeries.value, inFlowSeris.value, outFlowSeries],
}))
</script>

<style lang="postcss" scoped>
.featureName {
  color: rgb(252, 255, 46);
  margin-right: 4px;
  line-height: 12px;
  max-width: 220px;
}
</style>
