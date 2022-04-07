<template>
  <Module
    class="w-1/2"
    :loading="loading || comLoading"
    :error="error || comError"
    :info="osMeta && osMeta['taskInfo']"
  >
    <template #title>养护任务单据(数量)</template>
    <template #end>
      <span>{{ showDate }}</span>
      <Switcher
        v-if="activeCom === 'list'"
        class="ml-2"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!(loading || comLoading)">
      <div
        class="absolute inset-0 p-0.5 flex flex-wrap"
        v-if="activeCom === 'list' && datalist?.length > 0"
      >
        <div class="w-1/3 h-1/3 p-0.5" v-for="item in datalist" :key="item.name">
          <comFinBlock :data="item" />
        </div>
      </div>
      <Ect :options="ectOptions" v-else-if="activeCom !== 'list' && comDataList?.length > 0" />
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
import comFinBlock from './components/comFinBlock.vue'

const dateType = ref('year')
const dateOptions = [
  { name: '月', value: 'month' },
  { name: '年', value: 'year' },
]

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const showDate = computed(() =>
  dateType.value === 'month' || activeCom.value !== 'list'
    ? formatYearMonth(appDate.value)
    : appDate.value?.getFullYear()
)

const paramsStr = computed(() => `?accDate=${showDate.value}&com=list`)

const { data, loading, error, refresh } = useRequest<any>(
  () => genConfig(`/http-server-yhgl/publish/jsc/maconstructfin${paramsStr.value}`),
  {
    ready: computed(() => activeCom.value === 'list'),
  }
)

watch(paramsStr, () => {
  if (activeCom.value === 'list') {
    refresh()
  }
})

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const target = list.find((e: any) => e.orgCode === code)
      return {
        finNums: (target && target.finNums) || 0,
        totalNums: (target && target.totalNums) || 0,
        name,
      }
    })
  }
  return []
})

// 公司级别

const comParamsStr = computed(() => `?accDate=${showDate.value}&com=${activeCom.value}`)

const { data: comData, loading: comLoading, error: comError, run: comRun } = useRequest<any>(
  () => genConfig(`/http-server-yhgl/publish/jsc/maconlist${comParamsStr.value}`),
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

const comDataList = computed(() => comData.value?.msgContent)

const staticOptions = {
  grid: {
    top: 32,
    left: 40,
    bottom: 30,
    right: 20,
  },
  color: [useGradient('green', 'vertical'), useGradient('red', 'vertical')],
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
    top: 4,
    right: 20,
    z: 0,
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
      //   rotate: 15,
      fontSize: 12,
      fontWeight: '400',
    },
  },
}

const staticSeriesOptions = {
  itemStyle: {
    shadowColor: 'rgba(0, 0, 0, .2)',
    shadowBlur: 2,
    shadowOffsetY: 0,
    shadowOffsetX: 2,
    borderColor: '#fff',
    borderWidth: 1,
  },
  label: {
    show: true,
    position: 'top',
    offset: [0, -10],
    color: '#fff',
    fontSize: 16,
    fontFamily: 'sans-serif',
    verticalAlign: 'middle',
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0 ,0.3)',
    padding: [3, 4],
  },
  type: 'bar',
  barWidth: 14,
}

const ectOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    source: comDataList.value,
    dimensions: ['accDate', 'finNums', 'totalNums'],
  },
  series: [
    {
      name: '已完成',
      encode: {
        x: 'accDate',
        y: 'finNums',
      },
      ...staticSeriesOptions,
    },
    {
      name: '总数',
      encode: {
        x: 'accDate',
        y: 'totalNums',
      },
      ...staticSeriesOptions,
    },
  ],
}))
</script>
