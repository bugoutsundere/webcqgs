<template>
  <Module
    class="w-full"
    :title="title"
    :info="osMeta && osMeta[info]"
    :loading="loading"
    :error="error"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <template v-if="!loading">
      <Empty v-if="empty" />
      <div class="flex items-end" v-else>
        <span class="num align-bottom"><slot name="num" /></span>
        <span class="ml-3 w-3 -mr-3"><slot name="unit" /></span>
      </div>
    </template>
  </Module>
  <teleport to="body" v-if="showPanel && $slots.mount">
    <div class="mountPoint" :style="mountStyle">
      <div class="hoverPanel">
        <div class="triDeco"></div>
        <slot name="mount" />
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref } from 'vue'

defineProps({
  title: {
    type: String,
    default: '',
  },
  info: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  empty: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Error || undefined,
    default: undefined,
  },
})

import { useStore } from 'vuex'
import { key } from '@/store'

const store = useStore(key)
const osMeta = computed(() => store.getters.osMeta)

const mountStyle = ref('')
const showPanel = ref(false)
let timer: any = null

const mouseenter = (e: any) => {
  timer && clearTimeout(timer)
  timer = setTimeout(() => {
    const bounding = e.target.getBoundingClientRect()
    if (bounding) {
      const { left, bottom } = bounding
      const dist = 10
      mountStyle.value = `left:${left}px;top:${bottom + dist}px;`
    }
    bounding && (showPanel.value = true)
  }, 200)
}

const mouseleave = () => {
  timer && clearTimeout(timer)
  showPanel.value = false
}
</script>

<style lang="postcss" scoped>
.num {
  font-size: 26px;
  line-height: 26px;
  letter-spacing: 1px;
}

.mountPoint {
  z-index: 1000;

  @apply fixed w-0 h-0 flex items-start justify-items-start overflow-visible;
}

.hoverPanel {
  background: rgba(0, 0, 0, 0.9);
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.3), -2px 2px 20px rgba(0, 0, 0, 0.3);
  animation: fadeIn 0.1s ease-in-out both;

  @apply relative rounded;
}

.triDeco {
  position: absolute;
  top: -10px;
  left: 10px;
  height: 0;
  width: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 10px solid #000;
}
</style>
