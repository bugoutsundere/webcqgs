<template>
  <div class="w-full h-full flex bussinessbg">
    <div class="flex flex-col flex-shrink-0" :style="{ width: '420px' }">
      <WayFilter />
      <PatrolInspection :data="dailyInspectData" />
      <DailyPatrolinspection :data="dailyInspectData" />
      <RegularInspection />
    </div>
    <div class="flex flex-col" :style="{ width: 'calc(100% - 840px)' }">
      <div class="h-2/3">
        <map-view>
          <base-info></base-info>
          <template #box>
            <MapLeft />
          </template>
        </map-view>
      </div>
      <div class="flex flex-grow h-1/3">
        <DiseasesNumber />
        <DiseaseTreatment />
        <DiseaseType />
      </div>
    </div>
    <div class="flex flex-col" :style="{ width: '420px' }">
      <CuringOrder />
      <TaskSituation />
      <CuringAmount />
    </div>
  </div>
</template>

<script>
import WayFilter from './component/wayFilter.vue';
import PatrolInspection from './component/patrolInspection.vue';
import DailyPatrolinspection from './component/dailyPatrolinspection.vue';
import RegularInspection from './component/regularInspection.vue';
// import MapView from "./component/mapView.vue";
import MapView from '@/components/MapView.vue';
import DiseasesNumber from './component/diseasesNumber.vue';
import DiseaseTreatment from './component/diseaseTreatment.vue';
import DiseaseType from './component/diseaseType.vue';
import CuringOrder from './component/curingOrder.vue';
import TaskSituation from './component/taskSituation.vue';
import CuringAmount from './component/curingAmount.vue';
import baseInfo from './component/baseInfo.vue';
import MapLeft from './component/MapLeft.vue'
import { dailyInspectCount } from '@/api/curingBusiness';
export default {
  components: {
    WayFilter,
    PatrolInspection,
    DailyPatrolinspection,
    RegularInspection,
    MapView,
    DiseasesNumber,
    DiseaseTreatment,
    DiseaseType,
    CuringOrder,
    TaskSituation,
    CuringAmount,
    baseInfo,
    MapLeft
  },
  data() {
    return {
      dailyInspectData: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      // 日常巡检数据
      let dailyInspectData = await dailyInspectCount();
      this.dailyInspectData = dailyInspectData?.msgContent;
    }
  }
};
</script>
<style scoped>
.bussinessbg {
  background: url('@/assets/images/app-bg.jpg');
  background-size: 100% 100%;
  padding-top: 50px;
}
</style>
