<template>
  <Module :info="osMeta && osMeta['typeNum']" :loading="loading" :error="error" class="h-1/3">
    <template #title>事件类型统计</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="dateOptions" v-model="dateType" />
    </template>
    <template v-if="!loading">
      <div class="flex w-full h-full" v-if="haveData">
        <div class="w-full flex flex-col">
          <ul class="list flex-grow">
            <li class="title">
              <i class="el-icon-guide mr-2" />
              <span>交通事故</span>
              <span class="sum" v-if="jtSum">{{ formatThousand(jtSum) }}</span>
            </li>
            <li class="list-item" v-for="jtItem in jtList" :key="jtItem.name">
              <span>{{ jtItem.name }}</span>
              <span v-if="jtSum" class="ml-1">({{ getRate(jtSum, jtItem.value) }})</span>
              <span class="num">{{ formatThousand(jtItem.value) }}</span>
            </li>
          </ul>
          <ul class="list flex-grow">
            <li class="title">
              <i class="el-icon-truck mr-2" />
              <span>故障车</span>
              <span class="sum" v-if="gzSum">{{ formatThousand(gzSum) }}</span>
            </li>
            <li class="list-item" v-for="gzItem in gzList" :key="gzItem.name">
              <span>{{ gzItem.name }}</span>
              <span v-if="gzSum" class="ml-1">({{ getRate(gzSum, gzItem.value) }})</span>
              <span class="num">{{ formatThousand(gzItem.value) }}</span>
            </li>
          </ul>
        </div>
        <ul class="list">
          <li class="title">
            <i class="el-icon-first-aid-kit mr-2" />
            <span>营运事件</span>
            <span class="sum" v-if="sjSum">{{ formatThousand(sjSum) }}</span>
          </li>
          <li class="list-item" v-for="sjItem in sjList" :key="sjItem.name">
            <span>{{ sjItem.name }}</span>
            <span v-if="sjSum" class="ml-1">({{ getRate(sjSum, sjItem.value) }})</span>
            <span class="num">{{ formatThousand(sjItem.value) }}</span>
          </li>
        </ul>
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { genConfig } from '@/utils/request'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'

const jtMap = [
  { name: '人车事故', value: 'jtsgRcsg' },
  { name: '车车事故', value: 'jtsgCcsg' },
  { name: '车辆起火', value: 'jtsgClqh' },
  { name: '设施相关', value: 'jtsgSsxg' },
  { name: '其他', value: 'jtsgQt' },
]

const gzMap = [
  { name: '爆胎', value: 'clgzBt' },
  { name: '抛锚', value: 'clgzPm' },
  { name: '起火', value: 'clgzQh' },
  { name: '其他', value: 'clgzQt' },
]

const sjMap = [
  { name: '自然灾害', value: 'sjZrzh' },
  { name: '交通事故', value: 'sjJtsg' },
  { name: '车辆故障', value: 'sjClgz' },
  { name: '路面状况', value: 'sjLmzk' },
  { name: '道路施工', value: 'sjDlsg' },
  { name: '交通气象', value: 'sjJtqx' },
  { name: '重大事件', value: 'sjZdsj' },
  { name: '交通管制', value: 'sjJtgz' },
  { name: '收费事件', value: 'sjSfsj' },
  { name: '活动', value: 'sjHd' },
  { name: '其他', value: 'sjQt' },
]

const getRate = (sum: number, data: number) => {
  if (!sum) {
    return
  }

  return formatFix2(Math.round((data * 10000) / sum) / 100) + '%'
}

const store = useStore(key)
const appDate = computed(() => store.state.appDate)
const activeCom = computed(() => store.state.activeCom)
const osMeta = computed(() => store.getters.osMeta)

const dateType = ref('year')
const dateOptions = [
  { name: '月', value: 'month' },
  { name: '年', value: 'year' },
]

const showDate = computed(() =>
  dateType.value === 'year' ? appDate.value?.getFullYear() : formatYearMonth(appDate.value)
)

const paramstr = computed(() => {
  const list = [`accDate=${showDate.value}`]
  activeCom.value !== 'list' && list.push(`com=${activeCom.value}`)
  return `?${list.join('&')}`
})

// 交通事故
const { data: jtData, loading: jtLoading, error: jtError, refresh: jtRefresh } = useRequest<any>(
  () => genConfig(`/http-server-yygl/publish/jsc/fineventtypes${paramstr.value}`)
)

const jtList = computed(() => {
  const obj = jtData.value?.msgContent && jtData.value?.msgContent[0]
  return (
    obj &&
    jtMap.map(({ name, value }) => ({
      name,
      value: obj.hasOwnProperty(value) && obj[value],
    }))
  )
})

const jtSum = computed(() =>
  jtList.value
    ?.map(({ value }: any) => (value ? Number(value) : 0))
    .reduce((a: number, b: number) => a + b)
)

// 故障车
const { data: gzData, loading: gzLoading, error: gzError, refresh: gzRefresh } = useRequest<any>(
  () => genConfig(`/http-server-yygl/publish/jsc/veheventnums${paramstr.value}`)
)

const gzList = computed(() => {
  const obj = gzData.value?.msgContent && gzData.value?.msgContent[0]
  return (
    obj &&
    gzMap.map(({ name, value }) => ({
      name,
      value: obj.hasOwnProperty(value) && obj[value],
    }))
  )
})

const gzSum = computed(() =>
  gzList.value
    ?.map(({ value }: any) => (value !== '-' ? Number(value) : 0))
    .reduce((a: number, b: number) => a + b)
)

// 营运事件
const { data: sjData, loading: sjLoading, error: sjError, refresh: sjRefresh } = useRequest<any>(
  () => genConfig(`/http-server-yygl/publish/jsc/fineventdetail${paramstr.value}`)
)

const sjList = computed(() => {
  const obj = sjData.value?.msgContent && sjData.value?.msgContent[0]
  return (
    obj &&
    sjMap.map(({ name, value }) => ({
      name,
      value: obj.hasOwnProperty(value) && obj[value],
    }))
  )
})

const sjSum = computed(() =>
  sjList.value
    ?.map(({ value }: any) => (value !== '-' ? Number(value) : 0))
    .reduce((a: number, b: number) => a + b)
)

const haveData = computed(
  () => jtList.value?.length > 0 || gzList.value?.length > 0 || sjList.value?.length > 0
)

const loading = computed(() => jtLoading.value || gzLoading.value || sjLoading.value)
const error = computed(() => jtError.value || gzError.value || sjError.value)
watch(paramstr, () => {
  jtRefresh()
  gzRefresh()
  sjRefresh()
})
</script>

<style lang="postcss" scoped>
.list {
  border: 1px solid rgba(0, 183, 255, 0.3);

  @apply w-full h-full flex flex-col;

  & li {
    @apply w-full;
  }

  & .title {
    height: 26px;
    padding: 0 10px;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to right, rgba(0, 0, 0, 0.5), transparent);

    @apply flex items-center flex-shrink-0;
  }
}

.list-item {
  font-size: 12px;

  @apply flex items-center flex-grow px-3;

  &:hover {
    background-color: rgba(0, 132, 255, 0.2);
  }

  & .num {
    @apply ml-auto;
  }

  &:nth-child(2n + 1) {
    background: rgba(0, 0, 0, 0.2);
  }
}

.sum {
  font-size: 16px;
  color: #e7b307;

  @apply ml-auto;
}
</style>
