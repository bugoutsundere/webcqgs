<template>
  <div class="panel" @click="check" :class="{ active: activeFeatureId === item.statId }">
    <div class="title">{{ item.statName }}</div>
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

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const store = useStore(key)
const structList = computed(() => store.state.charge?.structList)
const activeFeatureId = computed(() => store.state.charge?.activeFeatureId)
const redisDataList = computed(() => store.state.charge?.redisDataList)

const check = () => {
  if (props.item.statId === activeFeatureId.value) {
    store.commit('charge/changeActiveFeatureId', '')
  } else {
    store.commit('charge/changeActiveFeatureId', props.item.statId)
  }
}

const redisData = computed(() => {
  const { orgCode, statId } = props.item
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
})
</script>

<style lang="postcss" scoped>
.panel {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 250, 0, 0.2);
  cursor: pointer;
  transition: all ease-in-out 0.3s;

  &:hover {
    border: 1px solid rgb(0, 250, 0);
  }

  &.active {
    border: 1px solid rgb(250, 246, 0);
  }
}

.title {
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.4);
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0) 60%);
}
.infoLine {
  @apply w-full flex items-center px-3;

  & + .infoLine {
    margin-top: 2px;
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
