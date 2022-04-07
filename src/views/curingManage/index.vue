<template>
  <div class="w-full h-full flex bussinessbg">
    <div class="flex flex-col flex-shrink-0" :style="{ width: '420px' }">
      <WayFilter />
      <BaseStruct />
      <BaseStructinfo :data="roadData" />
      <LayerContrl />
    </div>
    <div class="flex flex-col" :style="{ width: 'calc(100% - 840px)' }">
      <div class="h-2/3">
        <MapView />
        <!-- <PopupDialog /> -->
      </div>
    </div>
    <div class="flex flex-col" :style="{ width: '420px' }">
      <Tollrevenue :data="roadData" />
      <CuringStat :data="MaintainStaffData" />
      <PersonStat :data="MaintainStaffData" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import WayFilter from './component/wayFilter.vue';
import BaseStruct from './component/baseStruct.vue';
import BaseStructinfo from './component/baseStructinfo.vue';
import LayerContrl from './component/LayerContrl/layercontrl.vue';
import Tollrevenue from './component/tollrevenue.vue';
// import MapView from "./component/mapView.vue";
import MapView from '@/components/MapView.vue';
import CuringStat from './component/curingStat.vue';
import PersonStat from './component/personstat.vue';
import PopupDialog from '@/components/PopupDialog.vue';
import { useRequest } from 'vue-request';
import { computed } from 'vue';
import { getSectionInfo, getMaintainStaffInfo } from '@/api/curingManage';

const roadApiData = useRequest<any>(() => getSectionInfo());
const roadData = computed(() => {
  return roadApiData.data.value?.msgContent;
});
const MaintainStaffApiData = useRequest<any>(() => getMaintainStaffInfo());
const MaintainStaffData = computed(() => {
  return MaintainStaffApiData.data.value?.msgContent;
});
</script>
<style scoped>
.bussinessbg {
  background: url('@/assets/images/app-bg.jpg');
  background-size: 100% 100%;
  padding-top: 50px;
}
</style>
