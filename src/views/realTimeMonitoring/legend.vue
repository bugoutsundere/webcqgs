<template>
  <div class="legendPanel">
    <div class="panel flex flex-col">
      <template v-for="(layer, index) in list" :key="layer.code">
        <div
          class="layerItem animate__animated animate__rotateInDownRight"
          :style="`animation-delay: ${Number(index) * 100}ms;`"
          :class="{
            active: checkedLayers.includes(layer.code),
            loading: false,
          }"
          @click.stop.prevent="check(layer.code)"
        >
          <i :class="`icon el-icon-${loadings[layer.code] ? 'loading' : 'check'}`" />
          <span>{{ layer.layerName }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { key } from '@/store'

const store = useStore(key)
const checkedLayers: any = computed({
  get: () => store.state.road?.checkedLayers,
  set: (val: any) => store.commit('road/setCheckedLayers', val)
})
const loadings: any = computed(() => store.state.road?.loadings)

const list = [
  { layerName: '服务区', code: 'SERVICE_AREA' },
  { layerName: '收费站', code: 'TOLL_STATION' },
  { layerName: '桥梁', code: 'BRIDGE_CLUSTER' },
  { layerName: '隧道', code: 'TUNNEL_CLUSTER' },
  { layerName: '车辆', code: 'VEHICLE_REALTIME_TRACE_POINT' },
  { layerName: '事件', code: 'EVENT_POINT' },
  { layerName: '门架', code: 'GANTRY_POINT' },
  { layerName: '视频', code: 'CAMERA_POINT' },
  { layerName: '情报板', code: 'INFOMATION_BOARD_POINT' },
  { layerName: '桩号', code: 'STAKE' },
]

const check = (code: string) => {
  if (checkedLayers.value.includes(code)) {
    checkedLayers.value = checkedLayers.value.filter((e: any) => e !== code)
  } else {
    checkedLayers.value.push(code)
  }
}
</script>


<style lang="postcss" scoped>
.legendPanel {
  position: absolute;
  bottom: -4px;
  right: 4px;
  width: 0;
  height: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.panel {
  flex-shrink: 0;
  padding-right: 2px;
}

.layerItem {
  position: relative;
  z-index: 100;
  width: 90px;
  height: 30px;
  flex-shrink: 0;
  background: rgba(2, 84, 102, 0.7);
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  border: 1px solid;
  border-image: linear-gradient(-90deg, #00ccff8e, #0054ff8e) 1 1;
  animation-duration: 1s;
  & + .layerItem {
    margin-top: 6px;
  }

  &:hover,
  &.active {
    border-image: linear-gradient(-90deg, #00ccff, #0054ff) 1 1;
  }
  &.loading {
    pointer-events: none;
  }
  &.active {
    & .icon {
      opacity: 1;
      color: #fff;
    }
  }
  & .icon {
    margin-right: 8px;
    color: transparent;
    opacity: 0;
  }
  &.hide {
    pointer-events: none;
    animation-duration: 300ms !important;
    display: none;
    margin: 0;
    padding: 0;
    height: 0 !important;
    overflow: hidden;
    transition-property: height;
    transition-delay: 1s;
  }
}
</style>