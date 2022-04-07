<template>
  <Module class="h-1/3" :loading="loading" :error="error" :info="osMeta && osMeta['recoveryInfo']">
    <template #title>路损追偿情况</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dataOptions" v-model="dataType" />
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOpts" v-if="activeCom === 'list' && dataList?.length > 0" />
      <Ect :options="comEctOpts" v-else-if="activeCom !== 'list' && comData" />
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

const dateType = ref('year')
const dateOptions = [
  { name: '月', value: 'month' },
  { name: '年', value: 'year' },
]

const dataType = ref('amount')
const dataOptions = [
  { name: '数量', value: 'count' },
  { name: '金额(万)', value: 'amount' },
]

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const formatValue = (num: number) => {
  if (dataType.value === 'amount') {
    const number =
      activeCom.value === 'list' ? Math.round(num / 10000) : formatFix2(Math.round(num / 100) / 100)
    return number
  } else {
    return num
  }
}

const showDate = computed(() =>
  dateType.value === 'year' ? appDate.value?.getFullYear() : formatYearMonth(appDate.value)
)

const paramsStr = computed(() => `?com=${activeCom.value}&accDate=${showDate.value}`)

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yygl/publish/jsc/recoverassist${paramsStr.value}`)
)

watch(paramsStr, refresh)

const finKey = computed(() => (dataType.value === 'amount' ? 'reAmount' : 'reNums'))

const totalKey = computed(() => (dataType.value === 'amount' ? 'tolAmount' : 'tolNums'))

const dataList = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    return comInfo.map(({ name, code }: any) => {
      const target = list.find((e: any) => e.orgCode === code)
      return {
        name,
        finNum: (target && formatValue(target[finKey.value])) || 0,
        totalNum: (target && formatValue(target[totalKey.value])) || 0,
      }
    })
  }
  return []
})

const minRate = computed(() => {
  const tolList = dataList.value?.map((e: any) => e.totalNum)
  const finList = dataList.value?.map((e: any) => e.finNum)
  const tolMax = tolList?.length > 0 ? tolList.sort((a: any, b: any) => b - a)[0] : 0
  const finMax = finList?.length > 0 ? finList.sort((a: any, b: any) => b - a)[0] : 0
  return (tolMax > 0 && 70 * (finMax / tolMax)) || 0
})

const staicOptions = {
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
  roseType: 'area',
}

const decoBg = {
  type: 'pie',
  radius: ['5%', '10%'],
  z: 0,
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

const ectOpts = computed(() => ({
  ...staicOptions,
  dataset: {
    source: dataList.value,
    dimensions: ['name', 'finNum', 'totalNum'],
  },
  series: [
    decoBg,
    {
      name: '已完成',
      radius: ['0', minRate.value + '%'],
      z: 20,
      encode: {
        itemName: 'name',
        value: 'finNum',
      },
      label: {
        show: false,
      },
      itemStyle: {
        color: useGradient('green', 'vertical'),
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
      },
      ...staticSeriesOptions,
    },
    {
      name: '全部任务',
      radius: ['0', '70%'],
      z: 10,
      encode: {
        itemName: 'name',
        value: 'totalNum',
      },
      itemStyle: {
        color: useGradient('blue', 'vertical'),
        borderColor: 'rgba(255,255,255,0.8)',
        borderWidth: 1,
      },
      labelLine: {
        length: 2,
        length2: 10,
        smooth: true,
      },
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
          return `{label|${e.data.name}}\n{value|${formatThousand(
            e.data.finNum
          )}} {label|/} {value2|${formatThousand(e.data.totalNum)} }`
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
            color: '#00FF52',
          },
          value2: {
            align: 'center',
            fontSize: 16,
            fontFamily: 'sans-serif',
            color: '#00AAFF',
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

const comData = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    return {
      name: list[0].orgNamw,
      finNum: formatValue(list[0][finKey.value]) || 0,
      totalNum: formatValue(list[0][totalKey.value]) || 0,
    }
  }
  return null
})

const dataArr = computed(() => {
  const data: any = comData.value
  return data && (data.finNum * 100) / data.totalNum
})

const comEctOpts = computed(() => ({
  series: [
    {
      name: '小环',
      type: 'gauge',
      splitNumber: 12,
      radius: '92%',
      center: ['50%', '60%'],
      startAngle: 200,
      endAngle: -20,
      axisLine: {
        show: false,
      },
      itemStyle: {
        shadowColor: 'rgba(0,0,0.0.3)',
        shadowBlur: 4,
        shadowOffsetX: -4,
        shadowOffsetY: 4,
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: useGradient('blue'),
          width: 1,
          shadowBlur: 1,
          shadowColor: '#07A6BB',
        },
        length: 10,
        splitNumber: 3,
      },
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      detail: {
        show: false,
      },
    },
    {
      name: '数值进度条',
      type: 'gauge',
      startAngle: 200,
      center: ['50%', '60%'],
      endAngle: -20,
      radius: '81%',
      splitNumber: 10,
      data: [dataArr.value],
      axisLine: {
        roundCap: true,
        lineStyle: {
          color: [
            [dataArr.value / 100, useGradient('blue')],
            [1, 'transparent'],
          ],
          width: 10,
        },
      },
      itemStyle: {
        shadowColor: 'rgba(0,0,0.0.3)',
        shadowBlur: 4,
        shadowOffsetX: -4,
        shadowOffsetY: 4,
      },
      axisLabel: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      pointer: {
        show: true,
      },
      detail: {
        show: false,
      },
    },
    {
      name: '背景进度条',
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      center: ['50%', '60%'],
      radius: '78%',
      splitNumber: 10,
      itemStyle: {
        shadowColor: 'rgba(0,0,0.0.3)',
        shadowBlur: 4,
        shadowOffsetX: -4,
        shadowOffsetY: 4,
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          color: [
            [dataArr.value / 100, '#07A6BB'],
            [1, '#E9E9E9'],
          ],
          width: 2,
        },
      },
      axisLabel: {
        show: false,
        color: 'transparent',
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      pointer: {
        show: false,
      },
      detail: {
        formatter: function (params: any) {
          return `应追偿:{number| ${comData.value?.totalNum}}\n已追到:{number| ${comData.value?.finNum}}`
        },
        rich: {
          number: {
            color: '#f7c522',
            fontSize: 16,
          },
        },
        color: '#fff',
        offsetCenter: ['0', '50%'],
        backgroundColor: 'rgba(0,0,0,.3)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,.5)',
        lineHeight: 20,
        fontSize: 12,
        padding: [5, 5],
      },
    },
  ],
}))
</script>
