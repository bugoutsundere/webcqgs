<template>
  <Module class="flex-grow" :info="bsMeta && bsMeta['emplCalc']" :loading="loading" :error="error">
    <template #title>项目公司总人员统计</template>
    <template #end>
      <span class="mr-2">{{ showDate }}</span>
      <Switcher :options="options" v-model="latest" />
    </template>

    <div class="absolute inset-0 flex flex-col" v-if="employeeData?.length > 0">
      <div class="flex flex-grow">
        <div class="icon-box">
          <svg-icon class="icon" name="employee"></svg-icon>
          <span class="sum">{{ employeeData?.length > 0 ? formatThousand(sum) : '-' }}</span>
        </div>
        <ul class="w-full flex flex-col px-4 pt-4 justify-evenly">
          <li class="flex items-center" v-for="(item, index) in employeeData" :key="index">
            <div class="deco-block" :style="`background:${useStyleGradient(item.color)}`"></div>
            <span>{{ item.prgName }}</span>
            <span class="ml-auto"> {{ formatThousand(item.accval) }}</span>
          </li>
        </ul>
      </div>
      <div class="rate-bar-box flex-shrink-0f flex items-center justify-center">
        <div class="rate-bar">
          <template v-for="(item, index) in rateList" :key="index">
            <div
              v-if="item.accval"
              :title="`${item.rate}%`"
              class="rate-item"
              :style="`background:${useStyleGradient(item.color)};width:${item.rate}%;`"
            >
              <div class="rateLabel" :class="{ hide: item.rate && item.rate < 10 }">
                {{ item.rate }}%
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <Empty v-else-if="!loading" />
  </Module>
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import { state, employeeInfo } from '@/store/state'
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { formatThousand, formatYearMonth } from '@/utils/util'
import { useStyleGradient } from '@/utils/color'

const latest = ref(true)
const options = [
  { name: '最新', value: true },
  { name: '月', value: false },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const appDate = computed(() => formatYearMonth(store.state.appDate))
const bsMeta = computed(() => store.getters.bsMeta)

const showDate = computed(() => {
  return latest.value
    ? employeeData.value?.length > 0
      ? employeeData.value[0].accDate
      : ''
    : appDate.value
})

const paramsStr = computed(() => {
  const list = []
  if (activeCom.value !== 'list') {
    list.push(`com=${activeCom.value}`)
  }

  if (!latest.value) {
    list.push(`accDate=${appDate.value}`)
  }
  return list.length > 0 ? `?${list.join('&')}` : ''
})

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-kpi/publish/jsc/employeenew${paramsStr.value}`)
)

watch(paramsStr, refresh)

const employeeData = computed(() => {
  const msg = data.value?.msgContent
  const list: any[] = []
  employeeInfo.forEach(({ label, ref, color }) => {
    let target = msg?.find(({ prgName }: any) => prgName?.indexOf(ref) === 0)
    target &&
      list.push({
        prgName: label,
        accval: target.accval,
        accDate: target.accDate,
        color,
      })
  })
  return list
})

const sum = computed(() =>
  employeeData.value?.map((e: any) => Number(e.accval))?.reduce((a: number, b: number) => a + b)
)

const rateList = computed(() => {
  return employeeData.value?.map(e => {
    return {
      ...e,
      rate: getRate(e.accval),
    }
  })
})

const getRate = (val: number | string) => Math.round((Number(val) * 1000) / sum.value) / 10
</script>

<style lang="postcss" scoped>
.icon-box {
  width: 136px;

  @apply flex flex-col items-center justify-center flex-shrink-0;
}

.icon {
  font-size: 80px;
  color: rgba(255, 255, 255, 0.3);
}

.sum {
  font-size: 22px;
}

.deco-block {
  height: 60%;
  width: 10px;
  margin-right: 10px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 5px 10px 2px #000;
}

.rate-bar-box {
  height: 40px;
  padding: 0 10px;
}

.rate-bar {
  height: 12px;
  width: 100%;
  display: flex;
  border: 1px solid rgb(212, 212, 212);
  box-shadow: 0 2px 10px 2px #000;
}

.rate-item {
  display: flex;
  align-items: center;
  justify-content: center;

  & + .rate-item {
    border-left: 1px solid rgb(212, 212, 212);
  }
}

.rateLabel {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px;
  font-size: 10px;
  line-height: 10px;

  &.hide {
    display: none;
  }
}
</style>
