<template>
  <div
    class="videoPanel"
    ref="videoPanel"
    :class="{ hide: toggleState === 0, showAll: toggleState === 2 }"
  >
    <Module class="w-full h-full">
      <div class="panelToggle" @click="togglePanel">
        <i class="el-icon-video-play iconPrefix" />
        <span>监控视频</span>
        <i class="el-icon-s-fold" />
      </div>
      <div class="vPagination" v-if="toggleState !== 0">
        <div
          class="pageItem"
          :class="{ active: activeMenu === 'squre' }"
          @click="activeMenu = 'squre'"
        >
          <svg-icon name="guangchang"> </svg-icon>
          广场
        </div>
        <div
          class="pageItem"
          :class="{ active: activeMenu === 'routes' }"
          @click="activeMenu = 'routes'"
        >
          <svg-icon name="chedao"> </svg-icon>
          车道
        </div>
      </div>
      <ul class="vList">
        <li
          :class="`animate__animated animate__fadeInRightBig vBox h-${
            toggleState === 2 ? '1/2' : 'full'
          }`"
          :style="`animation-delay: ${
            (toggleOld === 1 && index >= 4 ? index - 4 : index) * 150
          }ms;`"
          v-for="(video, index) in activeList"
          :key="video"
        >
          <div class="videoContent">
            <videoItem :id="video" />
          </div>
        </li>
      </ul>
    </Module>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import videoItem from './videoItem.vue'

const videoPanel: any = ref(null)

const pageType = ref(0)

const toggleOld = ref(0)
const toggleState = ref(2)
// const toggleState = ref(0)

const togglePanel = () => {
  let actionMap: any = {
    0: () => {
      toggleOld.value = 0
      toggleState.value = 1
    },
    1: () => {
      if (toggleOld.value === 0) {
        toggleState.value = 2
      } else {
        toggleState.value = 0
      }
      toggleOld.value = 1
    },
    2: () => {
      toggleOld.value = 2
      toggleState.value = 1
    },
  }
  actionMap[toggleState.value]()
}

onMounted(() => {
  setBox()
  window.addEventListener('resize', setBox)
})

const setBox = async () => {
  await nextTick()
  if (!videoPanel.value) {
    return
  }
  const pWidth = videoPanel.value.clientWidth
  const height = `${Math.ceil((pWidth * 9) / 64)}px`
  videoPanel.value.style.setProperty('--container-height', height)
}

const activeMenu = ref('squre')
const optons = [
  { name: '广场', value: 'squre' },
  { name: '车道', value: 'routes' },
]
const activeList = computed(() => {
  if (toggleState.value === 2) {
    return activeMenu.value === 'squre'
      ? videoList.slice(0, 8)
      : videoList.slice(8, 16)
  } else if (toggleState.value === 1) {
    return activeMenu.value === 'squre'
      ? videoList.slice(0, 4)
      : videoList.slice(8, 12)
  }
  return []
})

const videoList = [
  // 广场
  '1010000000001018140000030201020002', // 东区前广场 | 甬台温高速（苍南服务区）|OK
  '1020000000003000183002030201020001', // S1（甬台温高速）宁波交通科技 K8+200 宁波收费站 | 宁波交通科技（宁波东收费站）|OK
  '1070000000017007964801030201020001', // G50（沪渝高速）鄂东大桥K796+480（黄石收费站内广场） |  鄂东大桥（黄石收费站）|OK
  '1040000000012011012450030201020001', // 桂林北站出口广场球机 | 桂林公司（桂林北收费站） |OK
  '1020000000005000079502030201020002', //  宁波交通科技（宁波服务区南广场）
  '1090000000022004353190030201020001', // 亳州南出口广场摄像机  |  亳阜高速（亳州南收费站） |OK
  '10300000000060053850000030201020001', // 瑞昌收费站出口云台 | 九瑞高速（瑞昌收费站） |OK
  '1010000000001017550000030201020001', // 温州南入口内广场 | 甬台温高速（温州南收费站）|OK
  // 车道
  '1010000000001017122000030201020001', //   甬台温高速（乐清北广场）
  '1020000000005000080001030201020001', // 宁波东收费站06车道 | 宁波交通科技（宁波东06车道）|OK
  '1070000000017007964801030201020002', // 黄石出口8道车道摄像机 | 鄂东大桥（黄石08车道） |OK
  '1040000000012011012450030201020002', // 桂林北站出口5车道摄像机 | 桂林公司（桂林北05车道） |OK
  '1020000000005000079502030201020004', // 宁波交通科技（宁波服务区北广场）
  '1090000000022004353190030201020002', // 亳州南出口4道车道摄像机 | 亳阜高速（亳州南04车道）|OK
  '10300000000060053850000030201020002', // 瑞昌收费站103车道 | 九瑞高速（瑞昌103车道）|OK
  '1010000000001017550000030201020002', // 温州南26号车道 | 甬台温高速（温州南26号车道）|OK
]
</script>

<style lang="postcss" scoped>
.videoPanel {
  --container-height: 180px;
  height: var(--container-height);
  left: 0;
  bottom: 0;
  transition: all ease-in-out 0.3s;
  @apply w-full absolute p-1;

  &.hide {
    bottom: calc(-1 * var(--container-height));
    box-shadow: none;
  }

  &.showAll {
    height: calc(2 * var(--container-height));
  }
}

.vList {
  @apply w-full h-full flex flex-wrap p-1;
}

.vBox {
  @apply w-1/4 p-1;
}

.videoContent {
  background: rgba(12, 75, 100, 0.4);
  box-shadow: inset 0 0 80px rgba(16, 111, 133, 0.2);
  @apply w-full h-full relative flex;
}

.panelToggle {
  position: absolute;
  cursor: pointer;
  height: 34px;
  flex-shrink: 0;
  left: -1px;
  border-radius: 2px 2px 0 0;
  background: rgba(0, 46, 83, 1);
  top: -34px;
  box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(0, 183, 255, 0.3);
  border-bottom: none;
  transition: all ease-in-out 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: none;
  & .iconPrefix {
    color: rgb(6, 129, 201);
    padding-left: 10px;
    padding-right: 6px;
  }
  & i {
    padding: 0 10px;
  }
}

.vPagination {
  position: absolute;
  left: 150px;
  top: -36px;
  display: flex;
}

.pageItem {
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0, 46, 83);
  border: 1px solid rgba(0, 183, 255, 0.3);
  padding: 0 12px;
  cursor: pointer;
  transition: ease-in-out 0.1s all;
  text-shadow: none;
  font-size: 12px;
  border-radius: 3px;
  & .svg-icon {
    margin-right: 8px;
  }
  & + .pageItem {
    border-left: 1px solid $borderColor;
  }
  &.active {
    background: rgb(2, 149, 247);
    background: linear-gradient(to top, rgb(4, 88, 145), rgb(3, 109, 180));
    transform: scale(1.2);
    box-shadow: 0 0 30px rgba(2, 149, 247, 0.3);
  }
}
</style>
