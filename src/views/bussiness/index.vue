<template>
  <div class="w-full h-full flex">
    <div class="flex flex-col flex-shrink-0" :style="{ width: '420px' }">
      <base-struct />
      <base-struct-list />
    </div>
    <div class="flex flex-col flex-grow">
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
        <eqNums />
        <eqDetails />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import baseStruct from './baseStruct.vue'
import baseStructList from './baseStructList.vue'
import eqNums from './eqNums.vue'
import eqDetails from './eqDetails.vue'
import baseInfo from './baseInfo.vue'
import mapView from './mapView.vue'
import employee from './employee.vue'
import tollEmployee from './tollEmployee.vue'
import employeeList from './employeeList.vue'

import { useFetchMeta } from '@/compositions/meta'
useFetchMeta('bussiness')

import { useStore } from 'vuex'
import { key } from '@/store'
import { computed } from 'vue'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
</script>
