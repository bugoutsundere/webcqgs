<template>
  <div class="absolute top-0 left-0 p-0.5" :style="{ width: '100%' }">
    <ul class="listRow">
      <li class="dataItem w-1/5" v-for="item in inoutDataList" :key="item.title">
        <div class="itemBlock">
          <Module class="h-full w-full" :title="item.title" :loading="redisLoading">
            <template v-if="!redisLoading">
              <div class="whitespace-nowrap" v-if="item.value">
                <countTo class="bigValue" v-model="item.value" />
                <span class="ml-3 w-3 -mr-3">{{ item.unit }}</span>
              </div>
              <span class="bigValue" v-else>-</span>
            </template>
          </Module>
        </div>
      </li>
      <slot />
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, onMounted } from 'vue'
import { formatThousand } from '@/utils/util'
import countTo from '@/components/countTo.vue'

const store = useStore(key)
const allSumData = computed(() => store.getters.comChargeData)
const redisLoading = computed(() => store.state.charge?.redisLoading)

const gantryDatalist = computed(() => {
  return [
    {
      title: '实时门架计费金额',
      value: allSumData.value?.gantry?.totalAmount,
      unit: '元',
      children: [
        {
          title: 'ETC',
          value: allSumData.value?.gantry?.feeSum1,
          unit: '元',
        },
        {
          title: '其他',
          value: allSumData.value?.gantry?.feeSum2,
          unit: '元',
        },
      ],
    },
    {
      title: '实时门架车流量',
      value: allSumData.value?.gantry?.flowCount,
      unit: '辆',
    },
  ]
})

const inoutDataList = computed(() => {
  return [
    {
      title: '实时门架计费金额',
      value: allSumData.value?.gantry?.totalAmount,
      unit: '元',
    },
    {
      title: '实时门架车流量',
      value: allSumData.value?.gantry?.flowCount,
      unit: '辆',
    },
    {
      title: '实时入口车流量',
      value: allSumData.value?.station?.entFlowCount,
      unit: '辆',
    },
    {
      title: '实时出口车流量',
      value: allSumData.value?.station?.extFlowCount,
      unit: '辆',
    },
    {
      title: '实时出口交易金额',
      value: allSumData.value?.station?.totalAmount,
      unit: '元',
    },
  ]
})
</script>

<style lang="postcss" scoped>
.listRow {
  @apply flex flex-wrap justify-end relative;
}

.dataItem {
  height: 90px;
  min-width: 200px;
  max-width: 300px;
  @apply p-0.5 flex-shrink-0;
}

.itemBlock {
  @apply h-full w-full relative;
}

.bigValue {
  font-size: 30px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
