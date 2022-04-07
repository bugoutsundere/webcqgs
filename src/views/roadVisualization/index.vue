<template>
  <div class="driver w-full h-full flex">
    <Map></Map>
    <Equipment></Equipment>
    <IndustryDevelopment></IndustryDevelopment>
    <StaticStatistics></StaticStatistics>
    <WayFilter></WayFilter>
    <LayerContrl></LayerContrl>
    <EquipmentInfo></EquipmentInfo>
    <!-- <CameraIcon></CameraIcon> -->
  </div>
</template>
<script>
import Equipment from "./component/Equipment/equipment.vue";
import StaticStatistics from "./component/staticStatistics/staticStatistic.vue";
import VideoDatas from "./component/videoDatas/videoData.vue";
import IndustryDevelopment from "./component/IndustryDevelopment/industryDevelopment.vue";
import WayFilter from "./component/WayFilter/wayFilter.vue";
import Map from "./component/Map/index.vue";
import LayerContrl from "./component/LayerContrl/layercontrl.vue";
import EquipmentInfo from "./component/equipmentInfo/index.vue"
import CameraIcon from "./component/cameraIcon/cameraIcon.vue"

export default {
  components: {
    IndustryDevelopment,
    VideoDatas,
    Equipment,
    StaticStatistics,
    WayFilter,
    Map,
    LayerContrl,
    EquipmentInfo,
    CameraIcon,
  },
};
</script>
<style lang="postcss" scoped>
.driver {
  position: relative;
  text-shadow: none;
}
::v-deep(.el-select-dropdown__item) {
  color: #fff;
  &:hover {
    background: #1f659d;
  }
  &.selected {
    color: #409EFF;
  }
}
::v-deep(.el-dialog__header) {
  background: #213355;
}
::v-deep(.el-dialog__title) {
  color: #aaeaf1;
}
::v-deep(.el-dialog__body) {
  color: #fff;
  background: #0C1D3C;
}
::v-deep(.el-loading-spinner){
  width: 40px;
  left: 0;
  right: 0;
  margin: auto;
}
::v-deep(.el-loading-mask) {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}
::v-deep(.el-pager li) {
	background-color: transparent !important;
	color: #07ffed;
}
::v-deep(.el-pager li.active) {
	color: #fff;
  border: 1px solid #07ffed;
}
::v-deep(.el-pagination__jump) {
	color: #07ffed;
}
::v-deep(.el-pagination .btn-prev) {
	background-color: transparent !important;
	color: #07ffed;
}
::v-deep(.el-pagination .btn-next) {
	background-color: transparent !important;
	color: #07ffed;
}
::v-deep(.el-pagination__total) {
  color: #07ffed;
}
</style>
