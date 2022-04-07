<template>
  <singleItem title="病害总数" info="diseaseNum" :loading="loading" :error="error">
    <template #num>{{ disprojtotal + '' ? formatThousand(disprojtotal) : '-' }}</template>
    <template #unit>个</template>
    <template #mount v-if="activeCom === 'list'">
      <pieChart :loading="winLoading" :data="winData" :error="winError" key-name="bhNum" />
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
import { formatThousand } from '@/utils/util'

import pieChart from './hoverCharts/pieChart.vue'

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)

const paramsStr = computed(() => {
  const list = [`accDate=${appDate.value.getFullYear()}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return '?' + list.join('&')
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yhgl/publish/jsc/disprojtotal${paramsStr.value}`)
)

watch(paramsStr, refresh)

const datalist = computed(() => data.value?.msgContent)

const disprojtotal = computed(() => {
  return datalist.value?.length > 0 ? datalist.value[0].bhNum : ''
})

// 窗口数据
const yearData = computed(() => appDate.value?.getFullYear())

const wnParamsStr = computed(() => `?accDate=${yearData.value}&com=list`)

const {
  data: winData,
  loading: winLoading,
  error: winError,
  refresh: winRefresh,
} = useRequest<any>(
  () => genConfig(`/http-server-yhgl/publish/jsc/disprojtotal${wnParamsStr.value}`),
  {
    ready: computed(() => activeCom.value === 'list'),
  }
)

watch(yearData, () => {
  if (activeCom.value === 'list') {
    winRefresh()
  }
})
</script>

<style lang="postcss" scoped>
.hoverChartPanel {
  width: 400px;
  height: 300px;
  position: relative;
}
</style>
