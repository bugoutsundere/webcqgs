<template>
  <Module
    v-for="item in datalist"
    :loading="loading"
    :error="error"
    :key="item.name"
    class="w-1/5"
    :info="msMeta && msMeta[item.meta]"
  >
    <template #title>{{ item.name }}</template>
    <template #end v-if="!loading">
      <span class="opacity-60">{{ date ? `截至${date}` : '' }}</span>
    </template>
    <template v-if="!loading">
      <div class="whitespace-nowrap mb-2">
        <span class="value">{{ item.value }}</span>
        <span class="ml-3 w-3 -mr-3 text-xs">万</span>
      </div>
      <div
        v-if="item.rate"
        class="absolute right-0 bottom-0 w-0 h-0 flex items-end justify-end whitespace-nowrap px-2"
        :class="{
          'text-red-400': item.rate[0] !== '-',
          'text-green-400': item.rate[0] === '-',
        }"
      >
        {{ `${item.rate[0] !== '-' ? '+' : ''}${item.rate}` }}万
        <i
          class="text-lg mb-1"
          :class="`el-icon-caret-${item.rate[0] !== '-' ? 'top' : 'bottom'}`"
        />
      </div>
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref, getTransitionRawChildren } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { comInfo } from '@/store/state'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const msMeta = computed(() => store.getters.msMeta)
const appDate = computed(() => store.state.appDate)

const paramsStr = computed(() => {
  const list = []
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  // const now = new Date()
  // if (now.getFullYear() !== appDate.value.getFullYear()) {
  //   list.push(`accDate=${formatYearMonth(appDate.value)}`)
  // }
  list.push(`accDate=${formatYearMonth(appDate.value)}`)
  return list.length > 0 ? `?${list.join('&')}` : ''
})

const itemList = [
  { name: '营业收入', meta: 'income' },
  { name: '拆分收入', meta: 'departIncome' },
  { name: '利润总额', meta: 'profit' },
  { name: '管理费用', meta: 'mngCost' },
  { name: '付现成本', meta: 'payCost' },
]

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-kpi/publish/jsc/monthlynew${paramsStr.value}`)
)

watch(paramsStr, refresh)

const date = computed(() =>
  data.value?.msgContent?.length > 0 ? data.value?.msgContent[0].accYear : ''
)

const datalist = computed(() => {
  const list = data.value?.msgContent
  return itemList.map(({ name, meta }) => {
    const target = list?.find((e: any) => e.prgName === name)
    return {
      name,
      meta,
      value: (target && formatValue(target.totalcurval)) || '-',
      rate: target && formatValue(target.totalcurval - target.totalbefval),
    }
  })
})

const formatValue = (num: number) => {
  return formatThousand(formatFix2(Math.round(num / 100) / 100))
}
</script>

<style lang="postcss" scoped>
.value {
  font-size: 22px;
}
</style>
