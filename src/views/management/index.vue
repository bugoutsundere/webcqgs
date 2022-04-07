<template>
  <div class="w-full h-full flex flex-col">
    <div class="flex" :style="{ flexGrow: 2 }">
      <div class="flex-shrink-0 flex flex-col" :style="{ width: '430px' }">
        <employeeCostRate />
        <mngRate />
      </div>
      <div class="flex-grow flex flex-col">
        <div class="flex flex-shrink-0" :style="{ height: '90px' }">
          <monthlyBlocks />
        </div>
        <monthlyTable v-if="activeCom === 'list'" />
        <anlz v-else />
      </div>
      <div class="flex-shrink-0 flex flex-col" :style="{ width: '430px' }">
        <vehflowamount />
        <comvehflow />
      </div>
    </div>
    <div class="flex flex-grow">
      <profitCost />
      <vehamount />
      <tollEmployee />
    </div>
  </div>
</template>

<script lang="ts" setup>
import monthlyBlocks from './monthlyBlocks.vue'
import monthlyTable from './monthlyTable.vue'
import comvehflow from './comvehflow.vue'
import mngRate from './mngRate.vue'
import tollEmployee from './tollEmployee.vue'
import vehamount from './vehamount.vue'
import profitCost from './profitCost.vue'
import employeeCostRate from './employeeCostRate.vue'
import vehflowamount from './vehflowamount.vue'
import anlz from './anlz.vue'
import { computed } from 'vue'

import { useStore } from 'vuex'
import { key } from '@/store'
const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
import { useFetchMeta } from '@/compositions/meta'
useFetchMeta('management')
</script>
