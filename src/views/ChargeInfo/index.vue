<template>
  <div class="w-full h-full flex flex-col">
    <div :class="`h-${activeCom === 'list' ? 'full' : '2/3'} flex`">
      <div class="flex flex-col flex-shrink-0" :style="{ width: '450px' }">
        <rtCharts v-if="activeCom !== 'list'" />
        <passTrend />
        <comlist v-if="activeCom === 'list'" />
      </div>
      <div class="flex flex-col flex-grow">
        <Module :class="`h-${activeCom === 'list' ? '2/3' : 'full'}`">
          <div class="absolute inset-0 overflow-hidden">
            <mapView class="z-30" />
            <rtPanels class="z-40" />
            <stationInfoPanel class="z-50" v-if="activeCom !== 'list'" />
          </div>
        </Module>
        <inout v-if="activeCom === 'list'" />
      </div>
      <div class="flex flex-col flex-shrink-0" :style="{ width: '480px' }">
        <ranklist v-if="activeCom === 'list'" />
        <vehicletype />
        <vehicleclass />
      </div>
    </div>
    <stuctLList v-if="activeCom !== 'list'" />
  </div>
</template>

<script lang="ts" setup>
import vehicleclass from "./vehicleclass.vue";
import vehicletype from "./vehicletype.vue";
import ranklist from "./ranklist.vue";
import inout from "./inout.vue";
import comlist from "./comlist.vue";
import passTrend from "./passTrend.vue";
// import rtPanels from './rtPanels.vue'
import rtCharts from "./rtCharts.vue";
import stuctLList from "./stuctLList.vue";
import stationInfoPanel from "./stationInfoPanel.vue";
import mapView from "./mapView.vue";

import { useStore } from "vuex";
import { key } from "@/store";
import { computed, watch, onMounted, onUnmounted, nextTick } from "vue";

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);

onMounted(async () => {
  await nextTick();
  store.dispatch("charge/getStructList");
  // store.dispatch('charge/initWebsocket', activeCom.value)
});

watch(
  activeCom,
  () => {
    store.dispatch("charge/getRedisData", activeCom.value);
  },
  {
    immediate: true,
  }
);

onUnmounted(() => {
  store.dispatch("charge/disconnect");
});
</script>
