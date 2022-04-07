<template>
  <Module class="w-1/2" :loading="loading" :error="error" :info="osMeta && osMeta['contractInfo']">
    <template #title>日常养护合同完成情况(金额:万元)</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!loading">
      <div
        class="absolute inset-0 p-0.5 flex flex-wrap"
        v-if="activeCom === 'list' && datalist?.length > 0"
      >
        <div class="w-1/3 h-1/3 p-0.5" v-for="item in datalist" :key="item.name">
          <comFinBlock :data="item" />
        </div>
      </div>
      <ul
        class="absolute inset-0 flex items-center justify-around overflow-hidden"
        v-else-if="activeCom !== 'list' && comData?.length > 0"
      >
        <li
          v-for="item in comData"
          :key="item.name"
          :style="{ top: '20px' }"
          class="relative flex flex-col items-center"
        >
          <span class="mb-3">{{ item.name }}</span>
          <span :style="{ fontSize: '30px', fontWeight: 700 }">
            {{ formatThousand(item.value) }}
          </span>
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
import comFinBlock from './components/comFinBlock.vue'
import dataBgImg from '@/assets/images/data-bg.png'

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
  dateType.value === 'year' ? appDate.value?.getFullYear() : formatYearMonth(appDate.value)
)

const paramsStr = computed(() => `?accDate=${showDate.value}&com=${activeCom.value}`)

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yhgl/publish/jsc/maprojprogress${paramsStr.value}`)
)

watch(paramsStr, refresh)

const datalist = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const target = list.find((e: any) => e.orgCode === code)
      return {
        finNums: (target && formatAmount(target.paiedAmount)) || 0,
        totalNums: (target && formatAmount(target.amount)) || 0,
        name,
      }
    })
  }
  return []
})

const formatAmount = (num: number) => {
  const number =
    activeCom.value === 'list' ? Math.round(num / 10000) : formatFix2(Math.round(num / 100) / 100)
  return number
}

const comDataMap = [
  { name: '已支付', key: 'paiedAmount' },
  { name: '总金额', key: 'amount' },
]

const comData = computed(() => {
  const list = data.value?.msgContent
  if (list?.length > 0) {
    const data = list[0]
    return comDataMap.map((e: any) => ({
      ...e,
      value: data[e.key] ? formatAmount(data[e.key]) : 0,
    }))
  }
  return []
})
</script>
