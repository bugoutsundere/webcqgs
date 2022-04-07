<template>
  <div class="comFinBlock" v-waves>
    <span class="text-base h-1/2">{{ data.name }}</span>
    <div class="flex justify-between items-center text-base h-1/2">
      <span>{{ formatThousand(data.finNums) }}</span>
      <span>{{ formatThousand(data.totalNums) }}</span>
    </div>
    <div class="rateBarBox">
      <div class="bgBar">
        <div class="h-full" :style="`width:${rate}`">
          <div class="barContent"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { formatThousand } from '@/utils/util'

type Item = {
  name: string
  finNums: number
  totalNums: number
}

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})

const rate = computed(() => {
  const { finNums, totalNums } = props.data
  if (totalNums === 0) {
    return '0%'
  }
  if (finNums >= totalNums) {
    return '100%'
  }
  return (finNums * 100) / totalNums + '%'
})
</script>

<style lang="postcss" scoped>
.comFinBlock {
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 0.2), rgba(var(--active), 0.1) 30%);
  border: 1px solid rgba(3, 109, 170, 0.4);
  font-size: 12px;

  @apply w-full h-full flex flex-col rounded-sm p-2 transition-all duration-300;

  &:hover {
    background: linear-gradient(to right bottom, rgba(0, 0, 0, 0.2), rgba(var(--active), 0.3) 20%);
  }
}

.rateBarBox {
  @apply flex items-end mt-1;
}

.bgBar {
  height: 6px;
  background: rgba(90, 97, 100, 0.4);

  @apply w-full rounded-sm;
}

.barContent {
  background: #3959ff;
  background: linear-gradient(270deg, #3959ff, #2ec8cf);
  box-shadow: 0 2px 6px #000;
  animation: barAnimation 1s both ease-in-out;

  @apply h-full w-full  rounded-sm;
}
</style>
