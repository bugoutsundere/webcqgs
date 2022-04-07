<template>
  <Module class="h-2/3" :loading="loading" :error="error">
    <template #title>公司门架车流量及交易金额统计</template>
    <template #end>
      <Switcher :options="timeOptions" v-model="time" />
    </template>
    <template v-if="!loading">
      <ul class="comList" v-if="datalist?.length > 0">
        <li class="comItem" v-for="com in datalist" :key="com.code">
          <div class="comName">{{ com.name }}</div>
          <div class="barBox">
            <div class="flex -mt-3 w-full">
              <div class="w-1/2 flex justify-center">
                <div
                  v-if="com.flow"
                  class="flex items-center justify-end"
                  :style="{ width: '80px' }"
                >
                  <span>{{ formatThousand(com.flow) }}</span>
                  <span class="text-xs mx-2">辆</span>
                </div>
                <span v-else>-</span>
              </div>
              <div class="w-1/2 flex justify-center">
                <div
                  v-if="com.trade"
                  class="flex items-center justify-end"
                  :style="{ width: '80px' }"
                >
                  <span>{{ formatThousand(com.trade) }}</span>
                  <span class="text-xs mx-2">元</span>
                </div>
                <span v-else>-</span>
              </div>
            </div>
            <div class="barBg">
              <div class="w-1/2 h-full flex justify-end">
                <div class="bar flex justify-end" :style="{ width: getBarRate(com.flow, flowMax) }">
                  <div class="barContent flow"></div>
                </div>
              </div>
              <div class="barSeg"></div>
              <div class="w-1/2 h-full flex justify-start">
                <div
                  class="bar flex justify-start"
                  :style="{ width: getBarRate(com.trade, tradeMax) }"
                >
                  <div class="barContent trade"></div>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
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
import { comInfo } from '@/store/state'
import { formatThousand, formatFix2 } from '@/utils/util'

const time = ref('day')
const timeOptions = [
  { name: '今日', value: 'day' },
  { name: '最新', value: 'lastHour' },
]

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)

const params = computed(() => `timeDimension=${time.value}&orgCode=NULL`)

const basePath = '/http-server-charge-management/publish'
const path = computed(() => `${basePath}/gantry/flowTradeOrg?${params.value}`)

const { data, loading, error, run } = useRequest<any>(() => genConfig(path.value), {
  manual: true,
})

watch(
  [path, activeCom],
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
      const flow = list.find((e: any) => e.type === 'FLOW' && e.orgCode === code)
      const trade = list.find((e: any) => e.type === 'TRADE' && e.orgCode === code)
      return {
        name,
        code,
        flow: flow?.num || 0,
        trade: (trade && Math.round(trade?.num / 100)) || 0,
      }
    })
  }
  return []
})

const flowMax = computed(
  () =>
    datalist.value?.length > 0 &&
    datalist.value?.map((e: any) => e.flow)?.sort((a: number, b: number) => b - a)[0]
)
const tradeMax = computed(
  () =>
    datalist.value?.length > 0 &&
    datalist.value?.map((e: any) => e.trade)?.sort((a: number, b: number) => b - a)[0]
)

const getBarRate = (num: number, max: number) => {
  return (num * 100) / max + '%'
}
</script>

<style lang="postcss" scoped>
.comList {
  @apply w-full flex flex-col p-1 absolute inset-0 overflow-hidden;
}

.comItem {
  display: flex;
  background: linear-gradient(
    to right,
    rgba(var(--active), 0.2),
    rgba(var(--active), 0.1),
    rgba(var(--active), 0.05)
  );
  border: 1px solid rgba(7, 133, 196, 0.4);

  @apply flex-grow;

  /* @apply; */

  & + .comItem {
    margin-top: 4px;
  }
}

.comName {
  position: relative;
  width: 100px;
  height: 100%;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);

  @apply flex items-center px-2 py-4 justify-center;
}

.comName::after {
  content: ' ';
  position: absolute;
  right: -1px;
  flex-shrink: 0;
  height: 30px;
  width: 1px;
  background: rgba(255, 255, 255, 0.15);
}

.barBox {
  padding: 0 20px;

  @apply w-full h-full flex flex-col items-center justify-center;
}

.barBg {
  background: rgba(90, 97, 100, 0.4);
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.25)
  );
  height: 6px;
  margin-top: 4px;
  border-radius: 2px;

  @apply flex items-center w-full;
}

.barSeg {
  height: 12px;
  width: 2px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgb(0, 0, 0);
}

.bar {
  height: 100%;
}

.barContent {
  box-shadow: 0 2px 6px #000;
  animation: barAnimation 1s both ease-in-out;

  @apply h-full w-full;

  &.flow {
    border-radius: 2px 0 0 2px;
    background: #3959ff;
    background: linear-gradient(270deg, #02306c, #0382ed);
  }

  &.trade {
    border-radius: 0 2px 2px 0;
    background: #3959ff;
    background: linear-gradient(270deg, #5cca66, #02306c);
  }
}
</style>
