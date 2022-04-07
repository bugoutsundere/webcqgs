<template>
  <Module class="w-1/3" :info="msMeta && msMeta['tollCalc']" :loading="loading" :error="error">
    <template #title>{{ activeCom === 'list' ? '收费站人员效率' : '收费站统计' }}</template>
    <template #end>
      <span class="mr-2">{{ date }}</span>
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
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'
import { useGradient } from '@/utils/color'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { graphic } from 'echarts'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const date = computed(() =>
  activeCom.value === 'list'
    ? store.state.appDate.getFullYear()
    : formatYearMonth(store.state.appDate)
)

const paramsStr = computed(() => `?accDate=${date.value}&com=list`)

const { data: vehData, loading: vehLoading, error: vehError, run: vehRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/personveh${paramsStr.value}`),
  {
    manual: true,
  }
)
const { data: amData, loading: amLoading, error: amError, run: amRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/personamount${paramsStr.value}`),
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
} = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/personveh?accDate=${date.value}`),
  {
    manual: true,
  }
)
const {
  data: amDataAll,
  loading: amLoadingAll,
  error: amErrorAll,
  run: amRefreshAll,
} = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/personamount?accDate=${date.value}`),
  {
    manual: true,
  }
)

watch(
  [paramsStr, activeCom],
  () => {
    if (activeCom.value === 'list') {
      vehRefresh()
      amRefresh()
      vehRefreshAll()
      amRefreshAll()
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
  const amList = [...amData.value?.msgContent, ...amDataAll.value?.msgContent]
  if (activeCom.value === 'list' && vehList?.length > 0 && amList?.length > 0) {
    const list = [...comInfo, { name: '中铁建', code: '1' }].map(({ name, code }) => {
      const veh = vehList.find((e: any) => e.orgCode === code)
      const am = amList.find((e: any) => e.orgCode === code)
      return {
        name,
        veh: (veh && veh.accval) || 0,
        am: (am && am.accval) || 0,
      }
    })
    return list
  }
  return []
})

const staticOptions = {
  color: [useGradient('blue2'), useGradient('blue')],
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
    dataset: {
      source: datalist.value,
      dimension: ['name', 'veh', 'am'],
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
        name: `人均接车数(万辆)`,
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
        name: '人均收费额(万元)',
        stack: '2',
        xAxisIndex: 2,
        yAxisIndex: 2,
        label: {
          show: true,
          position: 'right',
          formatter: function (e: any) {
            return e.data.am ? dataFormat(e.data.am) : ''
          },
          textStyle: {
            color: '#fff',
            fontSize: 14,
            fontFamily: 'sans-serif',
          },
        },
        encode: {
          x: 'am',
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

const comParams = computed(() => `?accDate=${date.value}&com=${activeCom.value}`)

// 公司
const { data: comData, loading: comLoading, error: comError, run: comRefresh } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/perVehAmountDetail${comParams.value}`),
  {
    manual: true,
  }
)

const loading = computed(() =>
  activeCom.value === 'list'
    ? vehLoading.value || amLoading.value || vehLoadingAll.value || amLoadingAll.value
    : comLoading.value
)
const error = computed(() =>
  activeCom.value === 'list'
    ? vehError.value || amError.value || vehErrorAll.value || amErrorAll.value
    : comError.value
)

watch(
  comParams,
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
    return list
      .map(({ accDate, amountper, vehper }: any) => ({
        month: accDate.split('-')[1],
        am: (amountper && formatValue(amountper)) || 0,
        vehper: (vehper && formatValue(vehper)) || 0,
      }))
      .sort((a: any, b: any) => a.month - b.month)
  }
  return []
})

const formatValue = (num: number) => Math.round(num / 100) / 100

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
      name: '人均收费额(万元)',
      type: 'value',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
      // min: 'dataMin',
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
      name: '人均接车数(万辆)',
      type: 'value',
      position: 'right',
      boundaryGap: [0, '100%'],
      max: 'dataMax',
      // min: 'dataMin',
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
    dimensions: ['month', 'am', 'veh'],
  },
  series: [
    {
      name: '人均接车数(万辆)',
      type: 'line',
      yAxisIndex: 1,
      lineStyle: {
        color: useGradient('blue2', 'vertical'),
        width: 2,
        shadowColor: 'rgba(0,0,0,.5)',
        shadowBlur: 2,
        shadowOffsetY: 5,
        shadowOffsetX: 2,
      },
      itemStyle: {
        color: useGradient('blue2'),
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
      encode: {
        x: 'month',
        y: 'vehper',
      },
    },
    {
      name: '人均收费额(万元)',
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
        color: useGradient('blue', 'vertical'),
        borderColor: '#fff',
        borderWidth: 1,
        lineStyle: {
          color: '#3A84FF',
          width: 1,
        },
      },
      encode: {
        x: 'month',
        y: 'amountper',
      },
    },
  ],
}))
</script>
