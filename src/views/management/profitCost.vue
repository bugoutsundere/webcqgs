<template>
  <Module
    class="w-1/3"
    :info="msMeta && msMeta['profitCostCompare']"
    :loading="gloablLoading"
    :error="gloablError"
  >
    <template #title>利润成本对比</template>
    <template #end>
      <span>{{ showDate }}</span>
      <Switcher
        class="ml-2"
        v-if="activeCom === 'list'"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!gloablLoading">
      <Ect :options="ectOptions" v-if="activeCom === 'list' && datalist?.length > 0" />
      <Ect :options="comEctOptions" v-else-if="activeCom !== 'list' && comDataList?.length > 0" />
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { graphic } from 'echarts'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'

const dateType = ref(true)
const dateOptions = [
  { name: '当月', value: false },
  { name: '年累计', value: true },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const appDate = computed(() => store.state.appDate)

const showDate = computed(() =>
  activeCom.value === 'list' && dateType.value
    ? appDate.value.getFullYear()
    : formatYearMonth(appDate.value)
)
// 全部公司级别
const { data, loading, error, run } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-kpi/publish/jsc/monthlynew?com=list&accDate=${formatYearMonth(
        appDate.value
      )}&a=3`
    ),
  {
    manual: true,
  }
)

watch(
  [appDate, activeCom],
  () => {
    if (activeCom.value === 'list') {
      run()
    }
  },
  {
    immediate: true,
  }
)

const valueKey = computed(() => (dateType.value ? 'totalcurval' : 'curval'))

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (activeCom.value === 'list' && list?.length > 0) {
    const costList = list.filter((e: any) => e.prgName === '付现成本')
    const profitList = list.filter((e: any) => e.prgName === '利润总额')
    if (costList?.length > 0 && profitList?.length > 0) {
      return comInfo.map(({ name, code }: any) => {
        const cost = costList.find((e: any) => e.orgCode === code)
        const profit = profitList.find((e: any) => e.orgCode === code)
        return {
          name,
          cost: (cost && cost[valueKey.value]) || 0,
          profit: (profit && profit[valueKey.value]) || 0,
        }
      })
    }
  }
  return []
})

const maxMin = computed(() => {
  if (datalist.value?.length > 0) {
    const list: any = []
    datalist.value.forEach(({ cost, profit }) => {
      list.push(cost)
      list.push(profit)
    })
    return [Math.max(...list), Math.min(...list)]
  }
  return [0, 0]
})

const staticOptions = {
  color: [useGradient('green3'), useGradient('red')],
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
      left: '4%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '31%',
    },
    {
      left: '46%',
      top: '15%',
      bottom: '18px',
      width: '0%',
    },
    {
      right: '15%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '30%',
    },
  ],
}

const seriesStaticOptions = {
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

const ectOptions = computed(() => {
  if (datalist.value?.length === 0) {
    return {}
  }
  const nameList = datalist.value.map(e => e.name)
  return {
    ...staticOptions,
    xAxis: [
      {
        show: false,
        type: 'value',
        max: maxMin.value[0],
        min: maxMin.value[1],
        inverse: true,
      },
      {
        gridIndex: 1,
        show: false,
      },
      {
        show: false,
        max: maxMin.value[0],
        min: maxMin.value[1],
        gridIndex: 2,
      },
    ],
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
    dataset: {
      source: datalist.value,
      dimensions: ['name', 'cost', 'profit'],
    },
    series: [
      {
        name: `付现成本(万元)`,
        stack: '1',
        label: {
          show: true,
          position: 'left',
          formatter: function (e: any) {
            return e.data.cost ? dataFormat(e.data.cost) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'cost',
          y: 'name',
        },
        ...seriesStaticOptions,
      },
      {
        name: '利润总额(万元))',
        stack: '2',
        xAxisIndex: 2,
        yAxisIndex: 2,
        label: {
          show: true,
          position: 'right',
          formatter: function (e: any) {
            return e.data.profit ? dataFormat(e.data.profit) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'profit',
          y: 'name',
        },
        ...seriesStaticOptions,
      },
    ],
  }
})

const dataFormat = (num: number) => {
  return formatThousand(formatFix2(Math.round(num / 100) / 100))
}

// 单个公司下
const paramsStr = computed(() => `?com=${activeCom.value}&accDate=${showDate.value}`)

const { data: comDate, loading: comLoading, error: comError, run: comRun } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/monthlylist${paramsStr.value}`),
  {
    manual: true,
  }
)

watch(
  paramsStr,
  () => {
    if (activeCom.value !== 'list') {
      comRun()
    }
  },
  {
    immediate: true,
  }
)

const comDataList = computed(() => {
  const list = comDate.value?.msgContent
  if (activeCom.value !== 'list' && list?.length > 0) {
    const data = list
      .map(({ accDate, cbAct, lrAct }: any) => ({
        month: accDate.split('-')[1],
        cost: formatValue(cbAct) || 0,
        profit: formatValue(lrAct) || 0,
      }))
      .sort((a: any, b: any) => a.month - b.month)
    return data
  }
  return []
})

const formatValue = (num: number) => {
  return Math.round(num / 100) / 100
}

const comStaticOptions = {
  grid: {
    top: 40,
    left: 48,
    bottom: 30,
    right: 45,
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
    top: '10px',
    position: 'center',
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 20,
    icon: 'horizontal',
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
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
      name: '付现成本(万元)',
      type: 'value',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
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
    {
      name: '利润总额(万元)',
      type: 'value',
      position: 'right',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
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

const comEctOptions = computed(() => {
  return {
    ...comStaticOptions,
    dataset: {
      source: comDataList.value,
      dimensions: ['month', 'cost', 'profit'],
    },
    series: [
      {
        name: '付现成本(万元)',
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
          color: useGradient('green3', 'vertical'),
          borderColor: '#fff',
          borderWidth: 1,
          lineStyle: {
            color: '#3A84FF',
            width: 1,
          },
        },
        encode: {
          x: 'month',
          y: 'cost',
        },
      },
      {
        name: '利润总额(万元)',
        type: 'line',
        yAxisIndex: 1,
        lineStyle: {
          color: useGradient('red', 'vertical'),
          width: 2,
          shadowColor: 'rgba(0,0,0,.5)',
          shadowBlur: 2,
          shadowOffsetY: 5,
          shadowOffsetX: 2,
        },
        itemStyle: {
          color: useGradient('red'),
          borderColor: '#fff',
          borderWidth: 2,
          shadowColor: 'rgba(0, 0, 0, .8)',
          shadowBlur: 2,
          shadowOffsetY: 1,
          shadowOffsetX: 2,
        },
        areaStyle: {
          color: new graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgba(255, 160, 122,0)',
            },
            {
              offset: 1,
              color: 'rgba(195, 20, 50,0.9)',
            },
          ]),
        },
        smooth: true,
        symbolSize: 5,
        symbol: 'circle',
        encode: {
          x: 'month',
          y: 'profit',
        },
      },
    ],
  }
})

const gloablLoading = computed(() =>
  activeCom.value === 'list' ? loading.value : comLoading.value
)

const gloablError = computed(() => (activeCom.value === 'list' ? error.value : comError.value))
</script>
