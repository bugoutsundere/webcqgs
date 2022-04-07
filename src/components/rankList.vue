<template>
  <div class="absolute inset-0 overflow-x-hidden overscroll-y-auto">
    <ul class="p-1">
      <li
        class="flex items-center"
        :class="{
          notToggleActive: !toggleActive,
          active: toggleActive && modelValue === item.id,
        }"
        v-for="(item, index) in sortedList"
        :key="`${item.name}${index}${item.unit || ''}`"
        :tabindex="index"
        @click="checkOption(item.id)"
      >
        <div class="index">{{ index + 1 }}</div>
        <span class="name" :style="{ width: `${nameWidthRate}%` }">{{ item.name }}</span>
        <div class="barWarp">
          <div class="rateBar" :style="{ width: `${getRate(max, item.value)}%` }">
            <div class="rateBarContent"></div>
          </div>
        </div>
        <span
          class="ml-auto text-right flex-shrink-0"
          :style="{
            width: `${textLength}px`,
          }"
          >{{ formatThousand(item.value) }}</span
        >
        <span v-if="item.unit" class="text-xs ml-1 text-gray-300">
          {{ item.unit }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmit, computed } from 'vue'
import { formatThousand } from '@/utils/util'

const props = defineProps({
  datalist: {
    type: Array,
    required: true,
  },
  nameWidthRate: {
    type: Number,
    default: 50,
  },
  toggleActive: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
})

const sortedList = computed(() =>
  props.datalist.length > 0
    ? (props.datalist as any[]).sort((a: any, b: any) => b.value - a.value)
    : []
)

const max = computed(() => (sortedList.value?.length > 0 ? sortedList.value[0].value : 0))

const textLength = computed(() => {
  const str = max.value + ''
  return str.length * 10 + 6
})

const getRate = (max: number, value: number) => {
  if (value === 0) {
    return 0
  }
  const min = 2
  const rate = (value * 100) / max
  return rate > min ? rate : min
}

const emit = defineEmit()
const checkOption = (val: any) => {
  if (props.toggleActive) {
    emit('update:modelValue', val === props.modelValue ? '' : val)
  }
}
</script>

<style lang="postcss" scoped>
.name {
  flex-shrink: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

li {
  @apply p-1;

  &:focus,
  &:hover {
    outline: none;

    & .name {
      white-space: normal;
      overflow: auto;
    }
  }

  &.notToggleActive {
    &:focus {
      background-color: rgba(0, 132, 255, 0.2);
      outline: none;
    }
  }

  &.active {
    background-color: rgba(0, 132, 255, 0.3) !important;
  }
}

li:hover {
  background-color: rgba(0, 132, 255, 0.2) !important;
  outline: none;
}

li:nth-child(2n) {
  background: rgba(0, 0, 0, 0.2);
}

.index {
  width: 20px;
  height: 20px;
  font-size: 12px;
  line-height: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background: #0583bd;
  border: 1px solid hsla(0, 0%, 100%, 0.5);
  border-radius: 4px;
}

li:nth-child(1) .index {
  background: #f02c1e;
}

li:nth-child(2) .index {
  background: #f88604;
}

li:nth-child(3) .index {
  background: #f8cc0a;
}

.barWarp {
  height: 20px;

  @apply flex items-center justify-end w-full ml-auto pl-2;
}

.rateBar {
  height: 6px;

  @apply flex justify-end;
}

.rateBarContent {
  background: linear-gradient(270deg, #3959ff, #2ec8cf);
  box-shadow: 0 2px 10px #000;
  border-radius: 2px;
  animation: barAnimation 1s both ease-in-out;
  height: 100%;
}
</style>
