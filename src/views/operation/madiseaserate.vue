<template>
  <Module class="w-1/3" :info="osMeta && osMeta['diseaseEffi']" :loading="loading" :error="error">
    <template #title>病害平均处理效率(天数)</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!loading">
      <rankList
        v-if="datalist?.length > 0 && activeCom === 'list'"
        :datalist="datalist"
        :nameWidthRate="30"
      />
      <div
        class="relative flex flex-col items-center"
        :style="{ top: '20px' }"
        v-else-if="activeCom !== 'list'"
      >
        <div class="flex whitespace-nowrap items-end">
          <span :style="{ fontSize: '30px', fontWeight: 700, lineHeight: '30px' }">
            {{ singleComData }}
          </span>
          <span class="ml-3 w-3 -mr-3">天</span>
        </div>
        <img
          :style="{ width: '126px', height: 'auto', top: '-40px' }"
          :src="dataBgImg"
          class="relative pointer-events-none"
        />
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { comInfo } from '@/store/state'

import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'

import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'
import rankList from '@/components/rankList.vue'
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
  genConfig(`/http-server-yhgl/publish/jsc/madiseaserate${paramsStr.value}`)
)

watch(paramsStr, refresh)

const datalist = computed(() => {
  const list = data.value?.msgContent?.map(({ orgName, ratio, orgCode }: any) => {
    return {
      name: orgName,
      value: formatNum(ratio),
      orgCode,
    }
  })
  if (list?.length > 0) {
    return comInfo.map(({ name, code }) => {
      const target = list.find(({ orgCode }: any) => orgCode === code)
      return (
        target || {
          name: name,
          value: 0,
        }
      )
    })
  }
  return []
})

const singleComData = computed(() => {
  if (activeCom.value !== 'list' && data.value?.msgContent?.length > 0) {
    const target = data.value?.msgContent?.find(({ orgCode }: any) => orgCode === activeCom.value)
    if (target) {
      return formatNum(target.ratio)
    }
    return 0
  }
  return 0
})

const formatNum = (num: string) => {
  return Number(num.replace('天', ''))
}
</script>
