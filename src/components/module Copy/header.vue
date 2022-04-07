<template>
  <div class="module-header">
    <img :src="headerDeco" alt="" />
    <span class="titleText whitespace-nowrap">
      <slot name="title" v-if="$slots.title" />
      <template v-else>{{ title }}</template>
    </span>
    <div class="end" :class="{ hasInfo: hasInfo }" v-if="$slots.end">
      <slot name="end" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import headerDeco from "@/assets/images/module-header-deco.png";
import { defineProps } from "vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  hasInfo: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="postcss" scoped>
.module-header {
  background: linear-gradient(
    to right,
    rgba(var(--active), 0.3),
    rgba(var(--active), 0.05)
  );
  height: 30px;

  @apply relative flex items-center flex-shrink-0 overflow-hidden;

  & img {
    @apply ml-2 mr-1.5 mb-0.5;
  }
}

.titleText {
  text-shadow: 1px 1px 2px #000;
  font-size: 13px;
}

.end {
  right: 4px;
  font-size: 12px;

  @apply absolute h-full flex items-center;

  &.hasInfo {
    right: 20px;
  }
}
</style>
