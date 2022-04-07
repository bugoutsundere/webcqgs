<template>
  <div class="w-full h-full flex">
    <div class="flex flex-col flex-shrink-0" :style="{ width: '360px' }">
      <evtlist />
      <taskList />
    </div>
    <Module class="h-full flex-grow">
      <div class="absolute inset-0 overflow-hidden">
        <mapView class="z-30" />
        <rtPanels class="z-40">
          <legendPanel />
        </rtPanels>
        <comlist class="z-40" />
        <videoPanel class="z-50" />
      </div>
    </Module>
    <div class="flex flex-col flex-shrink-0" :style="{ width: '380px' }">
      <cars />
      <onWayCarsType />
      <onWayCars />
    </div>
  </div>
</template>

<script lang="ts" setup>
import onWayCars from './onWayCars.vue'
import onWayCarsType from './onWayCarsType.vue'
import mapView from './mapView.vue'
import rtPanels from './rtPanels.vue'
import videoPanel from './videoPanel.vue'
import comlist from './comlist.vue'
import cars from './cars.vue'
import evtlist from './evtlist.vue'
import taskList from './taskList.vue'
import legendPanel from './legend.vue'

import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)

onMounted(async () => {
  await nextTick()
  store.dispatch('charge/getStructList')
  store.dispatch('charge/initWebsocket', activeCom.value)
  store.dispatch('road/getRoadBase')
  store.dispatch('road/getEvtSrc')
})

watch(
  activeCom,
  () => {
    store.dispatch('charge/getRedisData', activeCom.value)
  },
  {
    immediate: true,
  }
)

onUnmounted(() => {
  store.dispatch('charge/disconnect')
})
</script>
