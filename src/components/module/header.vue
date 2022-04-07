<template>
  <div class="module-header">
    <div class="module-header-title">
      <img :src="headerDeco" alt="" />
      <span class="titleText whitespace-nowrap">
        <slot name="title" v-if="$slots.title" />
        <template v-else>{{ title }}</template>
      </span>
      <div class="end" :class="{ hasInfo: hasInfo }" v-if="$slots.end">
        <slot name="end" />
      </div>
    </div>
    <div class="header-bottom-bg"> </div>
  </div>
</template>

<script lang="ts" setup>
import headerDeco from '@/assets/images/module-header-icon1.png';
import haederbg from '@/assets/images/module-header-bg.png';
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    default: ''
  },
  hasInfo: {
    type: Boolean,
    default: false
  }
});
</script>

<style lang="postcss" scoped>
.module-header {
  /* background: linear-gradient(
    to right,
    rgba(172, 145, 107, 1),
    transparent,
    transparent
  ); */
  /* background: url("@/assets/images/module-header-bg.png"); */
  /* height: 25px; */

  @apply relative;

  & img {
    @apply ml-2 mr-1.5 mb-0.5;
    width: 14px;
    height: 14px;
  }
}
.module-header-title {
  @apply flex items-center flex-shrink-0;
}
.titleText {
  background: linear-gradient(
    to right,
    rgba(172, 145, 107, 1),
    transparent,
    transparent
  );
  height: 15px;
  width: calc(100% - 50px);
  line-height: 15px;
  font-style: oblique;
  font-weight: bold;
}
.header-bottom-bg {
  width: 100%;
  height: 10px;
  background: red;
  background: url('@/assets/images/module-header-bg.png');
  background-size: 100% 100%;
}
.titleText {
  text-shadow: 1px 1px 2px #000;
  font-size: 13px;
}

.end {
  /* width: 50px; */
  text-align: right;
  right: 4px;
  font-size: 12px;

  @apply absolute h-full flex items-center;

  &.hasInfo {
    /* right: 20px; */
  }
}
</style>
