<template>
  <div class="hoverChartPanel">
    <Loading v-if="loading" />
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error || undefined,
    default: undefined,
  },
})
</script>

<style lang="postcss" scoped>
.hoverChartPanel {
  width: 400px;
  height: 300px;
  position: relative;
  display: flex;
}
</style>
