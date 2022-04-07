<template>
  <Module class="h-1/3" :loading="loading" :error="error">
    <template #title>车流量/交易金额TOP10</template>
    <template #end>
      <Switcher :options="structOptions" v-model="struct" />
      <Switcher :options="typeOptions" v-model="type" />
      <Switcher :options="timeOptions" v-model="time" />
    </template>
    <template v-if="!loading">
      <rankList
        v-model="activeFeatureId"
        :toggleActive="true"
        :nameWidthRate="40"
        :datalist="datalist"
        v-if="datalist?.length > 0"
      />
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref, watch } from 'vue'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { useGradient } from '@/utils/color'
import { formatThousand } from '@/utils/util'
import { comInfo } from '@/store/state'
import rankList from '@/components/rankList.vue'

const type = ref('FLOW')
const typeOptions = [
  { name: '车流量', value: 'FLOW' },
  { name: '交易金额', value: 'TRADE' },
]

const struct = ref('gantry')
const structOptions = [
  { name: '门架', value: 'gantry' },
  { name: '收费站', value: 'station' },
]

const time = ref('day')
const timeOptions = [
  { name: '今日', value: 'day' },
  { name: '最新', value: 'lastHour' },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const activeFeatureId = computed({
  get: () => store.state.charge?.activeFeatureId,
  set: val => store.commit('charge/changeActiveFeatureId', val),
})

const params = computed(() => `timeDimension=${time.value}&orgCode=NULL&${struct.value}id=NULL`)

const basePath = '/http-server-charge-management/publish'
const path = computed(() => `${basePath}/${struct.value}/flowTrade?${params.value}`)

const { data, loading, error, refresh } = useRequest<any>(() => genConfig(path.value))

watch(path, () => {
  if (activeCom.value === 'list') {
    refresh()
  }
})

const datalist = computed(() =>
  data.value?.msgContent
    ?.filter((e: any) => e.type === type.value)
    ?.map((e: any) => ({
      name: e[`${struct.value === 'gantry' ? 'gantry' : 'stat'}Name`],
      value: formatNum(struct.value === 'gantry' ? e.num : e.extcount + e.entcount),
      com: e.orgCode,
      unit: type.value === 'FLOW' ? '辆' : '元',
      id: e[`${struct.value}id`],
      type: struct.value,
    }))
    ?.sort((a: any, b: any) => b.value - a.value)
)

const formatNum = (num: number) => (type.value === 'FLOW' ? num : Math.round(num / 100))
</script>
