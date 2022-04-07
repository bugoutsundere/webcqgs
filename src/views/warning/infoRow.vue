<template>
  <li class="flex py-4 px-6">
    <div class="flex flex-col" :style="{ width: '170px' }">
      <span class="text-gray-400 mb-1">{{ data.label }}</span>
      <span class="idxValue" :class="data?.theme">
        {{ Number(data?.idxValue) ? formatThousand(formatFix2(data?.idxValue)) + '%' : '-' }}
      </span>
    </div>
    <div class="seg" :class="data?.theme"></div>
    <ul class="flex flex-col flex-grow justify-around">
      <li v-for="(item, index) in data.list" class="flex justify-between" :key="index">
        <span class="text-gray-400">{{ item.name }}</span>
        <span v-if="item.type === 'amount'">
          {{ Number(item.value) ? formatThousand(formatFix2(item.value)) : '-' }}
        </span>
        <span v-else-if="item.type === 'rate'">
          {{ Number(item.value) ? formatThousand(formatFix2(item.value)) + '%' : '-' }}
        </span>
        <span v-else-if="item.type === 'count'">
          {{ Number(item.value) ? formatThousand(item.value) : '-' }}
        </span>
      </li>
    </ul>
  </li>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { formatThousand, formatYearMonth, formatFix2 } from '@/utils/util'

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style lang="postcss" scoped>
.idxValue {
  font-size: 30px;
  font-weight: 600;

  &.default {
    color: rgb(47, 129, 177);
  }

  &.YELLOW {
    color: #e9ec33d5;
  }

  &.RED {
    color: #ff4040d5;
  }
}

.seg {
  width: 2px;
  height: 60px;
  background: rgba(7, 152, 236, 0.4);
  border-radius: 50% 0 0 50%;

  @apply my-auto mr-4;

  &.default {
    background: rgba(7, 152, 236, 0.4);
  }

  &.YELLOW {
    background: #e9ec3354;
  }

  &.RED {
    background: #ff404062;
  }
}
</style>
