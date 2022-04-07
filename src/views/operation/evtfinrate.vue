<template>
  <Module class="h-1/3" :loading="loading" :error="error" :info="osMeta && osMeta['avgEfficiency']">
    <template #title>平均处置效率(分钟)</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dataOptions" v-model="dataType" />
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!loading">
      <Ect :options="vehOptions" v-if="activeCom === 'list' && vehDataList?.length > 0" />
      <Ect :options="ectOptions" v-else-if="activeCom === 'list' && datalist?.length > 0" />
      <Ect :options="comEvtOptions" v-else-if="activeCom !== 'list' && comEvtData?.length > 0" />
      <ul
        v-else-if="activeCom !== 'list' && comVehData?.length > 0"
        class="absolute inset-0 flex items-center justify-around overflow-hidden"
      >
        <li
          v-for="item in comVehData"
          :key="item.name"
          :style="{ top: '20px' }"
          class="relative flex flex-col items-center"
        >
          <span class="mb-3">{{ item.name }}</span>
          <div class="flex whitespace-nowrap items-end">
            <span :style="{ fontSize: '30px', fontWeight: 700, lineHeight: '30px' }">{{
              formatThousand(item.value)
            }}</span>
            <span class="ml-3 w-3 -mr-3">分钟</span>
          </div>
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
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'

import dataBgImg from '@/assets/images/data-bg.png'

const dateType = ref('year')
const dateOptions = [
  { name: '月', value: 'month' },
  { name: '年', value: 'year' },
]

const dataType = ref('opervehrate')
const dataOptions = [
  { name: '交通事故', value: 'evtfinrate' },
  { name: '清障车', value: 'opervehrate' },
]

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const showDate = computed(() =>
  dateType.value === 'year' ? appDate.value?.getFullYear() : formatYearMonth(appDate.value)
)

const paramsStr = computed(() => `?accDate=${showDate.value}&com=${activeCom.value}`)

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yygl/publish/jsc/${dataType.value}${paramsStr.value}`)
)

watch(() => dataType.value + paramsStr.value, refresh)

// 全部公司 所有事件  2021.4.25 全部事件改为交通事故
const datalist = computed(() => {
  const list = data.value?.msgContent
  if (activeCom.value === 'list' && dataType.value === 'evtfinrate' && list?.length > 0) {
    const allEvtList = list.filter((e: any) => e.eventType === '交通事故')
    return comInfo.map(({ name, code }) => {
      const target = allEvtList?.find((e: any) => e.orgCode === code)
      if (target) {
        return {
          name,
          value: target?.finRate || 0,
        }
      }
      return {
        name,
        value: 0,
      }
    })
  }
  return []
})

const staticOptions = {
  color: [useGradient('blue')],
  grid: {
    top: 10,
    left: 90,
    bottom: 10,
    right: 40,
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
    splitNumber: 3,
    splitLine: {
      show: false,
    },
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    inverse: true,
    axisLine: {
      lineStyle: {
        color: '#01A3FFc3',
        width: '1',
      },
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: false,
    },
    axisLabel: {
      textStyle: {
        fontSize: 12,
        fontWeight: '400',
        color: '#fff',
      },
    },
  },
}

const seriesStaticOptions = {
  barWidth: '40%',
  type: 'bar',
  label: {
    show: true,
    position: 'right',
    textStyle: {
      color: '#fff',
      fontSize: 14,
      fontFamily: 'sans-serif',
    },
  },
  itemStyle: {
    shadowColor: 'rgba(0, 0, 0, .2)',
    shadowBlur: 2,
    shadowOffsetY: 0,
    shadowOffsetX: 2,
    borderColor: '#fff',
    borderWidth: 1,
  },
}

const ectOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    source: datalist.value,
    dimensions: ['name', 'value'],
  },
  series: [
    {
      name: '全部事件',
      encode: {
        y: 'name',
        x: 'value',
      },
      ...seriesStaticOptions,
    },
  ],
}))

// 全部公司 清障车
const vehDataList = computed(() => {
  const list = data.value?.msgContent
  if (activeCom.value === 'list' && dataType.value === 'opervehrate' && list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const target: any = list.find((e: any) => e.orgCode === code)
      return {
        name,
        finRate: (target && target.finRate) || 0,
        runRate: (target && target.runRate) || 0,
      }
    })
  }
  return []
})

const vehStaticOptions = {
  color: [useGradient('red3'), useGradient('red2')],
  xAxis: [
    {
      show: false,
      type: 'value',
      inverse: true,
    },
    {
      gridIndex: 1,
      show: false,
    },
    {
      show: false,
      gridIndex: 2,
    },
  ],
  legend: {
    top: 10,
    right: 10,
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 20,
    icon: 'horizontal',
    textStyle: {
      color: '#ffffff',
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
  grid: [
    {
      left: '20%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '16%',
    },
    {
      left: '50%',
      top: '15%',
      bottom: '18px',
      width: '0%',
    },
    {
      right: '14%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '26%',
    },
  ],
}

const vehSeriesStaticOptions = {
  itemStyle: {
    shadowColor: 'rgba(0, 0, 0, .2)',
    shadowBlur: 2,
    shadowOffsetY: 0,
    shadowOffsetX: 2,
    borderColor: '#fff',
    borderWidth: 1,
  },
  animationEasing: 'elasticOut',
  type: 'bar',
  barWidth: '60%',
}

const vehOptions = computed(() => {
  if (
    activeCom.value !== 'list' ||
    dataType.value !== 'opervehrate' ||
    vehDataList.value?.length === 0
  ) {
    return {}
  }
  const nameList = vehDataList.value.map(e => e.name)
  const finRate = vehDataList.value.map(e => e.finRate)
  const runRate = vehDataList.value.map(e => e.runRate)
  return {
    ...vehStaticOptions,
    dataset: {
      source: vehDataList.value,
      dimensions: ['name', 'finRate', 'runRate'],
    },
    yAxis: [
      {
        type: 'category',
        inverse: true,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#01A3FFc3',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: nameList,
      },
      {
        gridIndex: 1,
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#ffffff',
            fontSize: 12,
          },
          align: 'center',
        },
        data: nameList,
      },
      {
        gridIndex: 2,
        type: 'category',
        inverse: true,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#01A3FFc3',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: nameList,
      },
    ],
    series: [
      {
        name: '处置效率',
        stack: '1',
        label: {
          show: true,
          position: 'left',
          formatter: function (e: any) {
            return e.data.finRate ? e.data.finRate : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'finRate',
          y: 'name',
        },
        ...vehSeriesStaticOptions,
      },
      {
        name: '出动效率',
        stack: '2',
        xAxisIndex: 2,
        yAxisIndex: 2,
        label: {
          show: true,
          position: 'right',
          formatter: function (e: any) {
            return e.data.runRate ? e.data.runRate : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'runRate',
          y: 'name',
        },
        ...vehSeriesStaticOptions,
      },
    ],
  }
})

// 公司所有事件
const comEvtData = computed(() => {
  const list = data.value?.msgContent
  if (activeCom.value !== 'list' && dataType.value === 'evtfinrate' && list?.length > 0) {
    return list.filter((e: any) => e.eventType !== '全部事件')
  }
  return []
})

const staicOptions = {
  color: [
    useGradient('blue', 'vertical'),
    useGradient('green', 'vertical'),
    useGradient('yellow', 'vertical'),
    useGradient('red', 'vertical'),
    useGradient('blue2', 'vertical'),
    useGradient('yellow2', 'vertical'),
    useGradient('purple', 'vertical'),
    useGradient('red2', 'vertical'),
    '#00FF1F',
    '#1200FF',
    '#C400FF',
    useGradient('blueOrange', 'vertical'),
  ],
  tooltip: {
    trigger: 'item',
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
  polar: {},
  angleAxis: {
    interval: 1,
    type: 'category',
    data: [],
    z: 10,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#0B4A6B',
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      interval: 0,
      show: true,
      color: '#0B4A6B',
      margin: 8,
      fontSize: 16,
    },
  },
  radiusAxis: {
    min: 40,
    max: 120,
    interval: 20,
    axisLine: {
      show: false,
      lineStyle: {
        color: '#0B3E5E',
        width: 1,
        type: 'solid',
      },
    },
    axisLabel: {
      formatter: '{value} %',
      show: false,
      padding: [0, 0, 20, 0],
      color: '#0B3E5E',
      fontSize: 16,
    },
    splitLine: {
      lineStyle: {
        color: '#0B3E5E',
        width: 2,
        type: 'solid',
      },
    },
  },
}

const staticSeriesOptions = {
  type: 'pie',
  radius: ['20%', '60%'],
  roseType: 'area',
  labelLine: {
    length: 20,
    length2: 30,
    smooth: true,
  },

  itemStyle: {
    borderColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
  },
}

const decoBg = {
  type: 'pie',
  radius: ['5%', '10%'],
  silent: true,
  label: {
    show: false,
  },
  labelLine: {
    show: false,
  },
  data: [
    {
      name: '',
      value: 0,
      itemStyle: {
        color: '#0B4A6B',
      },
    },
  ],
}

const comEvtOptions = computed(() => ({
  ...staicOptions,
  dataset: {
    source: comEvtData.value,
    dimensions: ['eventType', 'finRate'],
  },
  encode: {
    itemName: 'eventType',
    value: 'finRate',
  },
  series: [
    decoBg,
    {
      name: '事件类型',
      label: {
        show: true,
        position: 'outside',
        verticalAlign: 'middle',
        backgroundColor: 'rgba(0,0,0,.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.5)',
        lineHeight: 16,
        fontSize: 14,
        padding: [5, 10],
        color: '#fff',
        formatter: function (e: any) {
          return `{label|${e.data.eventType}}\n{value|${formatThousand(e.data.finRate)} }`
        },
        rich: {
          label: {
            align: 'center',
            lineHeight: 20,
            color: '#009BFF',
          },
          value: {
            align: 'center',
            fontSize: 16,
            fontFamily: 'sans-serif',
            color: '#f7c522',
          },
          perc: {
            align: 'center',
            fontSize: 12,
            fontFamily: 'sans-serif',
            color: '#009BFF',
          },
        },
      },
      ...staticSeriesOptions,
    },
  ],
}))

// 公司清障车数据
const comVehData = computed(() => {
  const list = data.value?.msgContent
  if (activeCom.value !== 'list' && dataType.value === 'opervehrate' && list?.length > 0) {
    return [
      {
        name: '处置效率',
        value: list[0]?.finRate || 0,
      },
      {
        name: '出动效率',
        value: list[0]?.runRate || 0,
      },
    ]
  }
  return []
})
</script>
