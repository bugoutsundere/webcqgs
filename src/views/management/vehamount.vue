<template>
  <Module class="w-1/3" :info="msMeta && msMeta['passIncome']" :loading="loading" :error="error">
    <template #title>
      {{ activeCom === 'list' ? '单车道每公里通行费收入及养护支出' : '每公里通行费收入' }}
    </template>
    <template #end>
      <span>{{ showDate }}</span>
      <Switcher
        v-if="activeCom === 'list'"
        class="ml-2"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!loading">
      <Ect :options="ectOptions" v-if="activeCom === 'list' && datalist?.length > 0"></Ect>
      <Ect
        :options="comEctOptions"
        v-else-if="activeCom !== 'list' && comDatalist?.length > 0"
      ></Ect>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { state } from '@/store/state'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { graphic } from 'echarts'

const dateType = ref(true)
const dateOptions = [
  { name: '当年累计', value: false },
  { name: '最近年累计', value: true },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const date = computed(() => store.state.appDate.getFullYear())

const paramStr = computed(() => (dateType.value ? `?com=list` : `?com=list&accDate=${date.value}`))

const allParamStr = computed(() => (dateType.value ? `` : `?accDate=${date.value}`))

const showDate = computed(() => {
  return activeCom.value === 'list'
    ? dateType.value
      ? dataTime.value
      : date.value
    : formatYearMonth(store.state.appDate)
})

// 全部公司级别
const { data: vehData, loading: vehLoading, error: vehError, run: vehRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/vehamount${paramStr.value}`),
  {
    manual: true,
  }
)
const { data: pData, loading: pLoading, error: pError, run: pRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/permileamount${paramStr.value}`),
  {
    manual: true,
  }
)
// 招商公路
const {
  data: vehDataAll,
  loading: vehLoadingAll,
  error: vehErrorAll,
  run: vehRefreshAll,
} = useRequest<any>(() => genConfig(`/http-server-kpi/publish/jsc/vehamount${allParamStr.value}`), {
  manual: true,
})
const {
  data: pDataAll,
  loading: pLoadingAll,
  error: pErrorAll,
  run: pRefreshAll,
} = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/permileamount${allParamStr.value}`),
  {
    manual: true,
  }
)

const dataset = computed(
  () =>
    vehData.value?.msgContent ||
    pData.value?.msgContent ||
    vehDataAll.value?.msgContent ||
    pDataAll.value?.msgContent
)

const dataTime = computed(() => dataset.value?.length > 0 && dataset.value[0].accYear)

watch(
  [paramStr, activeCom],
  () => {
    if (activeCom.value === 'list') {
      vehRefresh()
      pRefresh()
      vehRefreshAll()
      pRefreshAll()
    }
  },
  {
    immediate: true,
  }
)

const datalist = computed(() => {
  if (loading.value) {
    return []
  }
  const vehList = [...vehData.value?.msgContent, ...vehDataAll.value?.msgContent]
  const pList = [...pData.value?.msgContent, ...pDataAll.value?.msgContent]
  if (activeCom.value === 'list' && vehList?.length > 0 && pList?.length > 0) {
    const list = [...comInfo, { name: '中铁建', code: '1' }].map(({ name, code }) => {
      const veh = vehList.find((e: any) => e.orgCode === code)
      const p = pList.find((e: any) => e.orgCode === code)
      return {
        name,
        veh: (veh && veh.totalNums) || 0,
        p: (p && p.totalNums) || 0,
      }
    })
    return list
  }
  return []
})

const maxMin = computed(() => {
  if (datalist.value?.length > 0) {
    const list: any = []
    datalist.value.forEach(({ veh, p }) => {
      list.push(veh)
      list.push(p)
    })
    return [Math.max(...list), Math.min(...list)]
  }
  return [0, 0]
})

const staticOptions = {
  color: [useGradient('red3'), useGradient('red2')],
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
      left: '8%',
      top: '15%',
      bottom: '0px',
      containLabel: true,
      width: '31%',
    },
    {
      left: '50%',
      top: '15%',
      bottom: '18px',
      width: '0%',
    },
    {
      right: '10%',
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
    dataset: {
      source: datalist.value,
      dimension: ['name', 'veh', 'p'],
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
        name: `通行费收入(万元) `,
        stack: '1',
        label: {
          show: true,
          position: 'left',
          formatter: function (e: any) {
            return e.data.veh ? dataFormat(e.data.veh) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'veh',
          y: 'name',
        },
        ...seriesStaticOptions,
      },
      {
        name: '养护支出(万元)',
        stack: '2',
        xAxisIndex: 2,
        yAxisIndex: 2,
        label: {
          show: true,
          position: 'right',
          formatter: function (e: any) {
            return e.data.p ? dataFormat(e.data.p) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'p',
          y: 'name',
        },
        ...seriesStaticOptions,
      },
    ],
  }
})

const dataFormat = (num: number) => {
  return formatThousand(formatFix2(num))
}

// 单个公司级别
const comParamsStr = computed(() => `?accDate=${showDate.value}&com=${activeCom.value}`)
const { data: comData, loading: comLoading, error: comError, run: comRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/permileAmountDetail${comParamsStr.value}`),
  {
    manual: true,
  }
)

const loading = computed(() =>
  activeCom.value == 'list'
    ? vehLoading.value || pLoadingAll.value || vehLoadingAll.value || pLoading.value
    : comLoading.value
)
const error = computed(() =>
  activeCom.value == 'list'
    ? vehError.value || pError.value || vehErrorAll.value || pErrorAll.value
    : comError.value
)

watch(
  comParamsStr,
  () => {
    if (activeCom.value !== 'list') {
      comRefresh()
    }
  },
  {
    immediate: true,
  }
)

const comDatalist = computed(() => {
  const list = comData.value?.msgContent
  if (list?.length > 0 && activeCom.value !== 'list') {
    const data = list
      .map(({ accDate, accval, actNums }: any) => ({
        month: accDate.split('-')[1],
        actNums: actNums || 0,
        accval: accval || 0,
      }))
      .sort((a: any, b: any) => a.month - b.month)
    return data
  }
  return []
})

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
      name: '全车道收入(万元)',
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
      name: '单车道收入(万元)',
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

const comSeriesStaticOptions = {}

const comEctOptions = computed(() => ({
  ...comStaticOptions,
  dataset: {
    source: comDatalist.value,
    dimensions: ['month', 'accval', 'actNums'],
  },
  series: [
    {
      name: '全车道收入(万元)',
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
        color: useGradient('red3', 'vertical'),
        borderColor: '#fff',
        borderWidth: 1,
        lineStyle: {
          color: '#3A84FF',
          width: 1,
        },
      },
      encode: {
        x: 'month',
        y: 'accVal',
      },
    },
    {
      name: '单车道收入(万元)',
      type: 'line',
      yAxisIndex: 1,
      lineStyle: {
        color: useGradient('red2', 'vertical'),
        width: 2,
        shadowColor: 'rgba(0,0,0,.5)',
        shadowBlur: 2,
        shadowOffsetY: 5,
        shadowOffsetX: 2,
      },
      itemStyle: {
        color: useGradient('red2'),
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
            color: 'rgba(95, 195, 228,0)',
          },
          {
            offset: 1,
            color: 'rgba(229, 93, 135,0.9)',
          },
        ]),
      },
      smooth: true,
      symbolSize: 5,
      symbol: 'circle',
      encode: {
        x: 'month',
        y: 'actNums',
      },
    },
  ],
}))
</script>
