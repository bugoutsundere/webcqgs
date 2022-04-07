<template>
  <div class="w-full h-full flex flex-col justify-center">
    <div class="infoLine">
      <div class="name">入口流量</div>
      <countTo class="value yellow" v-if="redisData" v-model="redisData.inCount" />
      <div class="unit">辆</div>
    </div>
    <div class="infoLine">
      <div class="name">出口流量</div>
      <countTo class="value yellow" v-if="redisData" v-model="redisData.outCount" />
      <div class="unit">辆</div>
    </div>
    <div class="infoLine">
      <div class="name">出口金额</div>
      <countTo class="value yellow" v-if="redisData" v-model="redisData.amount" />
      <div class="unit">元</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'
import countTo from '@/components/countTo.vue'

const store = useStore(key)
const structList = computed(() => store.state.charge?.structList)
const redisDataList = computed(() => store.state.charge?.redisDataList)

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const activeStruct = computed(
  () => structList.value?.find((e: any) => e.statId === props.id) || null
)

const redisData = computed(() => {
  if (activeStruct.value) {
    const { orgCode, statId } = activeStruct.value
    const target = redisDataList.value[orgCode]?.station.find((e: any) => e.id === statId)
    if (target) {
      return {
        inCount: target.entFlowCount,
        outCount: target.extFlowCount,
        amount: (target.feeSum1 || 0) + (target.feeSum2 || 0),
      }
    }
    return {
      inCount: 0,
      outCount: 0,
      amount: 0,
    }
  }
  return null
})
</script>

<style lang="postcss" scoped>
.infoLine {
  @apply w-full flex items-center px-2;

  & + .infoLine {
    margin-top: 3px;
  }
}

.name {
  width: 56px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);

  @apply text-right px-1;
}

.value {
  font-size: 15px;
  font-weight: 500;
  @apply ml-auto;
}

.unit {
  font-size: 12px;
  width: 10px;
  margin-left: 10px;
  color: rgba(255, 255, 255, 0.7);
}
</style>
