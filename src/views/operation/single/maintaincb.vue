<template>
  <singleItem
    title="日常养护项目计费金额"
    info="dailyNum"
    :loading="loading"
    :error="error"
    :empty="!dataMap"
  >
    <template #num>{{ dataMap ? dataMap['日常养护'] : '-' }}</template>
    <template #unit>万</template>
    <template #mount v-if="activeCom === 'list'">
      <barChart :loading="winLoading" :data="winTypeData['日常养护']" :error="winError" />
    </template>
  </singleItem>
  <singleItem
    title="专项养护项目计费金额"
    info="spProjNum"
    :loading="loading"
    :error="error"
    :empty="!dataMap"
  >
    <template #num>{{ dataMap ? dataMap['专项养护'] : '-' }}</template>
    <template #unit>万</template>
    <template #mount v-if="activeCom === 'list'">
      <barChart :loading="winLoading" :data="winTypeData['专项养护']" :error="winError" />
    </template>
  </singleItem>
  <singleItem
    title="抢险养护项目计费金额"
    info="emergencyNum"
    :loading="loading"
    :error="error"
    :empty="!dataMap"
  >
    <template #num>{{ dataMap ? dataMap['抢险养护'] : '-' }}</template>
    <template #unit>万</template>
    <template #mount v-if="activeCom === 'list'">
      <barChart :loading="winLoading" :data="winTypeData['抢险养护']" :error="winError" />
    </template>
  </singleItem>
</template>

<script lang="ts" setup>
import singleItem from './singleItem.vue'

import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { formatThousand, formatFix2 } from '@/utils/util'

import barChart from './hoverCharts/barChart.vue'

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)

const paramsStr = computed(() => {
  const list = [`accDate=${appDate.value.getFullYear()}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return '?' + list.join('&')
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-kpi/publish/jsc/maintaincb${paramsStr.value}`)
)

watch(paramsStr, refresh)

const dataMap = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    const obj: any = {}
    const key = activeCom.value === 'list' ? 'amount' : 'totalNums'
    list.forEach((e: any) => (obj[e.prgName] = dataFormat(e[key])))
    return obj
  }
  return null
})

const dataFormat = (num: number) => {
  const number =
    activeCom.value === 'list' ? Math.round(num / 10000) : formatFix2(Math.round(num / 100) / 100)
  return formatThousand(number)
}

// 窗口数据
const yearData = computed(() => appDate.value?.getFullYear())

const wnParamsStr = computed(() => `?accDate=${yearData.value}&com=list`)

const {
  data: winData,
  loading: winLoading,
  error: winError,
  refresh: winRefresh,
} = useRequest<any>(
  () => genConfig(`/http-server-kpi/publish/jsc/maintaincb${wnParamsStr.value}`),
  {
    ready: computed(() => activeCom.value === 'list'),
  }
)

const winTypeData = computed(() => {
  const list = winData.value?.msgContent
  if (list?.length > 0) {
    return {
      ['日常养护']: list.filter(({ prgName }: any) => prgName === '日常养护') || [],
      ['专项养护']: list.filter(({ prgName }: any) => prgName === '专项养护') || [],
      ['抢险养护']: list.filter(({ prgName }: any) => prgName === '抢险养护') || [],
    }
  }
  return {
    ['日常养护']: [],
    ['专项养护']: [],
    ['抢险养护']: [],
  }
})

watch(yearData, () => {
  if (activeCom.value === 'list') {
    winRefresh()
  }
})
</script>
