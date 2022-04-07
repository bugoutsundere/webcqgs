<template>
  <Module
    class="h-1/2"
    :info="msMeta && msMeta['costRate']"
    :loading="globalLoading"
    :error="globalError"
  >
    <template #title>{{ activeCom === 'list' ? '管理费用占比' : '管理费用趋势' }}</template>
    <template #end>
      <span>{{ showDate }}</span>
      <Switcher
        class="ml-2"
        v-if="activeCom === 'list'"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!globalLoading">
      <Ect :options="ectOptions" v-if="activeCom === 'list' && datalist?.length > 0" />
      <Ect :options="comEctOptions" v-else-if="activeCom !== 'list' && comDatalist?.length > 0" />
      <Empty v-else />
      <div
        class="absolute right-0 bottom-0 w-0 h-0 flex items-end justify-end whitespace-nowrap p-2"
        v-if="datalist?.length > 0"
      >
        <span>总计</span>
        <span class="num">{{ formatThousand(sumData) }}</span>
        <span>万</span>
      </div>
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { useGradient } from '@/utils/color'
import { graphic } from 'echarts'

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
      )}&a=2`
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

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0 && activeCom.value === 'list') {
    return list
      .filter((e: any) => e.prgName === '管理费用')
      ?.map((e: any) => ({
        name: e.orgName,
        value: formatFix2(Math.round(e[dateType.value ? 'totalcurval' : 'curval'] / 100) / 100),
      }))
      ?.sort((a: any, b: any) => b.value - a.value)
  }
  return []
})

const sumData = computed(() => {
  const sum = datalist.value
    ?.map((e: any) => Number(e.value))
    .reduce((a: number, b: number) => a + b)
  return formatFix2(sum)
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
    useGradient('blueOrange', 'vertical'),
  ],
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
  radius: ['20%', '50%'],
  roseType: 'area',
  labelLine: {
    length: 10,
    length2: 5,
    smooth: true,
  },
  encode: {
    itemName: 'name',
    value: 'value',
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

const ectOptions = computed(() => ({
  ...staicOptions,
  dataset: {
    source: datalist.value,
    dimensions: ['name', 'value'],
  },
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
  series: [
    decoBg,
    {
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
          return `{label|${e.data.name}}{perc|(${e.percent}%)}\n{value|${formatThousand(
            e.data.value
          )}}{unit|万}`
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
          unit: {
            fontSize: 12,
            color: '#009BFF',
            padding: [0, 3],
          },
        },
      },
      ...staticSeriesOptions,
    },
  ],
}))

// 单个公司
const comParamsStr = computed(() => `?accDate=${showDate.value}&com=${activeCom.value}`)
const { data: comData, loading: comLoading, error: comError, run: comRun } = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/manageAmountList${comParamsStr.value}`),
  {
    manual: true,
  }
)
watch(
  comParamsStr,
  () => {
    if (activeCom.value !== 'list') {
      comRun()
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
      .map(({ accDate, actNums }: any) => ({
        month: accDate.split('-')[1],
        actNums: formatFix2(Math.round(actNums / 100) / 100) || 0,
      }))
      .sort((a: any, b: any) => a.month - b.month)
    return data
  }
})

const comStaticOptions = {
  grid: {
    top: 40,
    left: 45,
    bottom: 30,
    right: 20,
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
  yAxis: [
    {
      name: '管理费用(万元)',
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
  ],
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
}

const comEctOptions = computed(() => ({
  ...comStaticOptions,
  dataset: {
    source: comDatalist.value,
    dimensions: ['month', 'actNums'],
  },
  series: [
    {
      name: '管理费用(万元)',
      type: 'line',
      label: {
        show: true,
        position: 'top',
        textStyle: {
          color: '#fff',
          fontSize: 13,
          fontFamily: 'sans-serif',
        },
      },
      lineStyle: {
        color: useGradient('red3', 'vertical'),
        width: 2,
        shadowColor: 'rgba(0,0,0,.5)',
        shadowBlur: 2,
        shadowOffsetY: 5,
        shadowOffsetX: 2,
      },
      itemStyle: {
        color: useGradient('red3', 'vertical'),
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
      symbolSize: 5,
      symbol: 'circle',
      hoverAnimation: false,
      encode: {
        x: 'month',
        y: 'accVal',
      },
    },
  ],
}))

const globalLoading = computed(() =>
  activeCom.value === 'list' ? loading.value : comLoading.value
)

const globalError = computed(() => (activeCom.value === 'list' ? error.value : comError.value))
</script>

<style lang="postcss" scoped>
.num {
  font-size: 18px;
  line-height: 18px;
  padding: 0 6px;
  color: #f7c522;
}
</style>
