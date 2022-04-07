<template>
  <Module
    class="w-2/3"
    :loading="loading || comLoading"
    :error="error || comError"
    :info="osMeta && osMeta['projectNum']"
  >
    <template #title>施工中工程项目(数量)</template>
    <template #end>
      <div v-if="activeCom === 'list'" class="mr-4">
        <span>合计:</span>
        <span class="px-2 text-lg" :style="{ color: '#e7b307' }">{{ sumData }}</span>
        <span>项</span>
      </div>
      <span>{{ showDate }}</span>
      <Switcher
        v-if="activeCom === 'list'"
        class="ml-2"
        :options="dateOptions"
        v-model="dateType"
      />
    </template>
    <template v-if="!(loading || comLoading)">
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

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const showDate = computed(() =>
  dateType.value === 'month' || activeCom.value !== 'list'
    ? formatYearMonth(appDate.value)
    : appDate.value?.getFullYear()
)

// 全部公司层级
const paramsStr = computed(() => `?accDate=${showDate.value}&com=list`)
const { data, loading, error, run } = useRequest<any>(
  () => genConfig(`/http-server-yhgl/publish/jsc/maproject${paramsStr.value}`),
  {
    manual: true,
  }
)

watch(
  [paramsStr, activeCom],
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
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const fList = list.filter((e: any) => e.orgCode === code)
      const jd = fList?.find((e: any) => e.majorType === '机电类')
      const tj = fList?.find((e: any) => e.majorType === '土建类')
      return {
        name: name,
        ['机电类']: jd?.countNums || 0,
        ['土建类']: tj?.countNums || 0,
      }
    })
  }
  return list
})

const sumData = computed(() =>
  datalist.value?.map((e: any) => e['机电类'] + e['土建类']).reduce((a: number, b: number) => a + b)
)

const staticOptions = {
  grid: {
    top: 32,
    left: 40,
    bottom: 30,
    right: 20,
  },
  color: [useGradient('yellow3', 'vertical'), useGradient('blue', 'vertical')],
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
    position: 'center',
    itemWidth: 20,
    itemHeight: 10,
    itemGap: 20,
    icon: 'horizontal',
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
    },
    z: 0,
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
      rotate: 15,
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
    source: datalist.value,
    dimensions: ['name', '机电类', '土建类'],
  },
  series: ['机电类', '土建类'].map((e: string) => ({
    name: e,
    encode: {
      x: 'name',
      y: e,
    },
    ...staticSeriesOptions,
  })),
}))

// 单个公司层级
const comParamsStr = computed(() => `?accDate=${showDate.value}&com=${activeCom.value}`)

const { data: comData, loading: comLoading, error: comError, run: comRun } = useRequest<any>(
  () => genConfig(`/http-server-yhgl/publish/jsc/maprojectlist${comParamsStr.value}`),
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

const comEctOptions = computed(() => ({
  ...staticOptions,
  dataset: {
    source: comDataList.value,
    dimensions: ['accDate', 'jdnum', 'tjnum'],
  },
  series: ['jdnum', 'tjnum'].map((e: string) => ({
    name: e === 'jdnum' ? '机电类' : '土建类',
    encode: {
      x: 'name',
      y: e,
    },
    ...staticSeriesOptions,
  })),
}))
</script>
