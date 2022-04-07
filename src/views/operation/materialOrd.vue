<template>
  <Module class="w-1/3" :loading="loading" :error="error" :info="osMeta && osMeta['resRank']">
    <template #title>物料采购排行</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dataOptions" v-model="dataType" />
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <rankList v-if="datalist?.length > 0 && !loading" :datalist="datalist" :nameWidthRate="30" />
    <Empty v-else-if="!loading" />
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, ref } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'

import rankList from '@/components/rankList.vue'

const dataType = ref('amount')
const dataOptions = [
  { name: '合同数', value: 'count' },
  { name: '金额(万)', value: 'amount' },
]

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

const paramsStr = computed(() => {
  const list = [`accDate=${showDate.value}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return '?' + list.join('&')
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yonyu/publish/jsc/materialOrd${paramsStr.value}`)
)

const datalist = computed(() =>
  data.value?.msgContent?.map(({ mateName, mateAmount, orderNums }: any) => {
    const value = dataType.value === 'amount' ? formatAmount(mateAmount) : orderNums
    return {
      name: mateName,
      value,
    }
  })
)

watch(paramsStr, refresh)

const formatAmount = (num: number) => {
  const number =
    activeCom.value === 'list' ? Math.round(num / 10000) : formatFix2(Math.round(num / 100) / 100)
  return number
}
</script>
