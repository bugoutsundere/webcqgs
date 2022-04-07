<template>
  <div class="driver w-full h-full flex">
    <Map></Map>
    <dropDown />
    <LayerContrl></LayerContrl>
    <videoList />
    <!-- <PopupDialog>
      <template v-slot>
        <div class="absolute w-1/2 h-1/2" @mouseenter="mouseenter"></div>
      </template>
    </PopupDialog> -->
    <!-- <CameraIcon></CameraIcon> -->
  </div>
</template>
<script>
import Map from './Map/index.vue';
import dropDown from './dropdown.vue';
import videoList from './videolist.vue';
import LayerContrl from './LayerContrl/layercontrl.vue';
// import PopupDialog from '@/components/PopupDialog/index1.vue';
import PopupDialog from '@/components/PopupDialog.vue';
export default {
  components: {
    Map,
    dropDown,
    LayerContrl,
    videoList,
    PopupDialog,
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
    color: #409eff;
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
  background: #0c1d3c;
}
::v-deep(.el-loading-spinner) {
  width: 40px;
  left: 0;
  right: 0;
  margin: auto;
}
::v-deep(.el-loading-mask) {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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
