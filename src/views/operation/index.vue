<template>
  <div class="w-full h-full flex">
    <div class="flex flex-col flex-shrink-0 w-1/5" :style="{ minWidth: '400px' }">
      <praybill />
      <praybillSl />
      <contractSum />
    </div>
    <div class="flex flex-col w-3/5">
      <div class="flex flex-shrink-0" :style="{ height: '90px' }">
        <maintaincb />
        <fineventnums />
        <disprojtotal />
      </div>
      <div class="flex h-1/3">
        <supplier />
        <materialOrd />
        <madisease />
      </div>
      <div class="flex h-1/3">
        <maconstructfin />
        <maprojprogress />
      </div>
      <div class="flex h-1/3">
        <maproject />
        <madiseaserate />
      </div>
    </div>
    <div class="flex flex-col flex-shrink-0 w-1/5" :style="{ minWidth: '400px' }">
      <fineventtypes />
      <evtfinrate />
      <recoverassist />
    </div>
  </div>
</template>

<script lang="ts" setup>
import maintaincb from './single/maintaincb.vue'
import disprojtotal from './single/disprojtotal.vue'
import fineventnums from './single/fineventnums.vue'
import praybill from './praybill.vue'
import fineventtypes from './fineventtypes.vue'
import supplier from './supplier.vue'
import materialOrd from './materialOrd.vue'
import madisease from './madisease.vue'
import madiseaserate from './madiseaserate.vue'
import maconstructfin from './maconstructfin.vue'
import maprojprogress from './maprojprogress.vue'
import praybillSl from './praybillSl.vue'
import contractSum from './contractSum.vue'
import maproject from './maproject.vue'
import recoverassist from './recoverassist.vue'
import evtfinrate from './evtfinrate.vue'

import { useFetchMeta } from '@/compositions/meta'
useFetchMeta('operation')
</script>
