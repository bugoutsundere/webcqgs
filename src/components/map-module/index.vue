<template>
  <div class="map-module">
    <div class="map-module-header flex justify-between items-center">
      <div class="flex items-center">
        <div class="bone mr-1.5"></div>
        <span>{{ title }}</span>
      </div>
      <slot name="custom" />
    </div>
    <slot></slot>
    <div class="module-loading-model" :class="{ show: loading }">
      <Loading v-if="loading" />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
defineProps({
  title: {
    type: String,
    default: () => "标题",
  },
  loading: {
    type: Boolean,
    default: () => false,
  },
});
</script>

<style lang="postcss" scoped>
.map-module {
  @apply p-0.5 relative;
  & .map-module-header {
    @apply w-full p-1.5 font-semibold flex items-center;
    transform: skewX(-10deg);
    height: 30px;
    color: #d5fbff;
    background: linear-gradient(
      -90deg,
      rgba(0, 26, 49, 0),
      rgba(0, 211, 255, 0.1)
    );
    /* text-shadow: 1px 1px 2px #000; */
    font-size: 13px;
    & .bone {
      width: 8px;
      height: 14px;
      background: linear-gradient(180deg, #f7ffff, #00d3ff);
    }
  }
  & .module-loading-model {
    @apply absolute z-50 inset-0 bg-black bg-opacity-0 flex transition-all duration-300 pointer-events-none;
    top: 30px;

    &.show {
      @apply bg-opacity-100 pointer-events-auto;
    }
  }
}
</style>
