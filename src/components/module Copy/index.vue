<template>
  <div class="module-box">
    <div class="module" :class="theme">
      <!-- <div class="message" v-if="info" :title="info">
        <svg-icon name="info" />
      </div> -->
      <ModuleHeader
        class="z-20"
        v-if="title?.length > 0 || $slots.title"
        :hasInfo="!!info"
        :title="title"
      >
        <template v-if="$slots.title" #title>
          <slot name="title" />
        </template>
        <template v-if="$slots.end" #end>
          <slot name="end" />
        </template>
      </ModuleHeader>
      <div class="module-content">
        <slot />
      </div>
      <div class="module-loading-model" :class="{ show: loading }">
        <Loading v-if="loading" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
import ModuleHeader from "./header.vue";

defineProps({
  title: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error || undefined,
    default: undefined,
  },
  info: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    default: "default",
  },
});
</script>

<style lang="postcss" scoped>
.module-box {
  @apply relative p-0.5;
}

.module-loading-model {
  @apply absolute z-50 inset-0 bg-black bg-opacity-0 flex transition-all duration-300 pointer-events-none;

  &.show {
    @apply bg-opacity-50 pointer-events-auto;
  }
}

.module {
  @apply relative w-full h-full flex flex-col rounded-sm transition-all duration-300;

  &.default {
    /* background: rgba(var(--primary), 0.8);
    border: 1px solid rgba(0, 183, 255, 0.3);
    box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.3); */

    &:hover {
      /* border: 1px solid rgba(0, 183, 255, 0.5);
      box-shadow: inset -10px 10px 100px rgba(0, 0, 0, 0.3),
        0 0 4px rgba(255, 255, 255, 0.2); */
    }
  }
}

.module-content {
  @apply relative z-30 w-full h-full flex items-center justify-center;
}

.message {
  position: absolute;
  z-index: 3000;
  width: 15px;
  height: 20px;
  top: 0;
  right: 0;
  border-radius: 0 0 0 50%;
  background: rgba(0, 183, 255, 0.5);
  transition: background 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 183, 255, 0.8);
  }

  & .svg-icon {
    font-size: 10px;
    margin-left: 2px;
    pointer-events: none;
  }
}
</style>
