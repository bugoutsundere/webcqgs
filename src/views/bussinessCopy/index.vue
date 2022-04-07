<template>
  <div class="w-full h-full flex bussinessbg">
    <div class="flex flex-col flex-shrink-0" :style="{ width: '420px' }">
      <base-struct />
      <base-struct-list />
      <eqNums />
    </div>
    <div class="flex flex-col" :style="{ width: 'calc(100% - 840px)' }">
      <div class="h-2/3">
        <map-view position="right">
          <base-info v-if="activeCom === 'list'" />
          <template #box>
            <map-left></map-left>
          </template>
        </map-view>
      </div>
      <div class="flex flex-grow h-1/3">
        <tollRevenue />
        <totalTollflow />
        <eqDetails />
      </div>
    </div>
    <div class="flex flex-col" :style="{ width: '420px' }">
      <employee />
      <employeeList />
      <tollEmployee />
    </div>
    <!-- <div class="flex flex-col flex-grow ">  
      <div class="flex" :style="{ flexGrow: 2 }">
        <map-view>
          <base-info v-if="activeCom === 'list'" />
        </map-view>
        <div class="flex flex-col" :style="{ width: '500px' }">
          <employee />
          <employeeList />
          <tollEmployee />
        </div>
      </div>
      <div class="flex flex-grow" :style="{ maxHeight: '280px' }">
        <tollRevenue />
        <eqDetails />
      </div>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import baseStruct from './baseStructNew.vue';
import baseStructList from './baseStructListNew.vue';
// import baseStruct from "./baseStruct.vue";
// import baseStructList from './baseStructList.vue';
import eqNums from './eqNums.vue';
import eqDetails from './eqDetails.vue';
import baseInfo from './baseInfo.vue';
// import mapView from "./mapView.vue";
import mapView from '@/components/MapView.vue';
import employee from './employee.vue';
import tollEmployee from './tollEmployee.vue';
import employeeList from './employeeList.vue';
import tollRevenue from './tollrevenue.vue';
import totalTollflow from './totaltollflow.vue';
import MapLeft from './MapLeft.vue';

import { useFetchMeta } from '@/compositions/meta';
useFetchMeta('bussiness');

import { useStore } from 'vuex';
import { key } from '@/store';
import { computed } from 'vue';

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
</script>
<style scoped>
.bussinessbg {
  background: url('@/assets/images/app-bg.jpg');
  background-size: 100% 100%;
  padding-top: 50px;
}
</style>
