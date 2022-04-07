<template>
  <countTo
    class="rollNum"
    :class="{ isChanging: isChanging }"
    v-if="modelValue || modelValue === 0"
    :decimals="decimals"
    :end-val="endValue"
    :start-val="startValue"
    :duration="duration"
  />
  <span v-else>-</span>
</template>

<script lang="ts" setup>
import countTo from './vue-count-to/vue-countTo.vue'
import { defineProps, ref, watch } from 'vue'

const props = defineProps({
  decimals: {
    type: Number,
    default: 0,
  },
  modelValue: {
    type: Number,
    default: 0,
  },
})

const startValue = ref(0)
const endValue = ref(0)
const duration = ref(1000)
const isChanging = ref(false)
let timer: any = null

watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    timer && clearTimeout(timer)
    startValue.value = oldVal || 0
    endValue.value = newVal || 0
    isChanging.value = true
    timer = setTimeout(() => {
      isChanging.value = false
    }, 800)
  },
  {
    immediate: true,
  }
)
</script>

<style lang="postcss" scoped>
.isChanging {
  color: rgb(64, 255, 239) !important;
  text-shadow: 0 0 30px rgba(64, 255, 239, 0.9) !important;
  transition: all ease-in-out 0.2s;
  animation: mypulse 0.2s ease-in-out infinite;
}
.yellow {
  &.isChanging {
    color: rgb(241, 245, 4) !important;
    text-shadow: 0 0 30px rgba(241, 245, 4, 0.9) !important;
  }
}
.rollNum {
  transition: all ease-in-out 0.1s;
  display: inline-block;
}
</style>

<style>
@keyframes mypulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>
