<template>
  <div class="absolute top-0 left-0 p-0.5" :style="{ width: '650px' }">
    <ul class="listRow">
      <li
        class="dataItem w-1/3"
        :class="{
          'w-2/3': item.children,
        }"
        v-for="item in gantryDatalist"
        :key="item.title"
      >
        <div class="itemBlock">
          <Module class="h-full w-full" :title="item.title" :loading="redisLoading">
            <template v-if="!redisLoading">
              <div class="flex">
                <div :style="item.children ? 'width: 180px' : ''">
                  <div class="whitespace-nowrap" v-if="item.value">
                    <countTo class="bigValue" v-model="item.value" />
                    <span class="ml-3 w-3 -mr-3">{{ item.unit }}</span>
                  </div>
                  <span class="bigValue" v-else>-</span>
                </div>
                <ul class="ml-10" v-if="item.children">
                  <li
                    class="whitespace-nowrap flex"
                    v-for="child in item.children"
                    :key="child.title"
                  >
                    <span class="w-10">{{ child.title }}:</span>
                    <template v-if="child.value">
                      <countTo class="w-20 text-right" v-model="child.value" />
                      <span class="ml-3 w-3 -mr-3">{{ child.unit }}</span>
                    </template>
                    <span v-else>-</span>
                  </li>
                </ul>
              </div>
            </template>
          </Module>
        </div>
      </li>
    </ul>
    <ul class="listRow">
      <li class="dataItem w-1/3" v-for="item in inoutDataList" :key="item.title">
        <div class="itemBlock">
          <Module class="h-full w-full" :title="item.title" :loading="redisLoading">
            <template v-if="!redisLoading">
              <div class="whitespace-nowrap" v-if="item.value">
                <countTo class="bigValue yellow" v-model="item.value" />
                <span class="ml-3 w-3 -mr-3">{{ item.unit }}</span>
              </div>
              <span class="bigValue" v-else>-</span>
            </template>
          </Module>
        </div>
      </li>
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
  height: 100px;

  @apply flex;
}

.dataItem {
  @apply h-full p-0.5;
}

.itemBlock {
  @apply h-full w-full relative;
}

.bigValue {
  font-size: 28px;
  font-weight: 600;
  white-space: nowrap;
}
</style>
