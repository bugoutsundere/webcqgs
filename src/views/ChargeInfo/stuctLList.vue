<template>
  <Module
    class="h-1/3"
    :style="{ minHeight: '310px' }"
    :loading="structLoading"
    @mouseup="grabStop"
    @mouseout="grabStop"
  >
    <template #title>
      门架/收费站-通行收费信息
      <span class="featureName" v-if="activeFeature">
        {{
          activeFeature &&
          activeFeature[activeFeature.type === 'gantry' ? 'gantryName' : 'statName']
        }}
      </span>
    </template>
    <template #end v-if="sectionList?.length > 0">
      <span class="mr-4 opacity-70">使用鼠标拖拽或滚轮移动</span>
      <Switcher :options="sectionList" v-model="section" />
    </template>
    <template v-if="!structLoading">
      <div class="absolute inset-0 overflow-hidden" v-if="sectionStructList?.length > 0">
        <div class="arr left" v-waves @click="toLeft">
          <svg-icon name="arLeft" />
        </div>
        <div class="arr right" v-waves @click="toRight">
          <svg-icon name="arRight" />
        </div>
        <div
          class="structBox"
          :class="{ dragging }"
          @mousedown="grabStart"
          @mousemove="grabing"
          @mouseup="grabStop"
          @mousewheel="mousewheel"
        >
          <div class="struct">
            <div class="road"></div>
            <div class="infoListBox" ref="infoListBox">
              <ul class="infoList" :style="infoListStyles" ref="infoList1">
                <div class="roadDash"></div>
                <li v-for="(item, index) in topList" :key="`top${index}`">
                  <div class="stationBox" v-if="item.statId && item.statName !== '路段入口站'">
                    <img :src="stationImg" alt="" draggable="false" />
                    <span
                      class="statName top left"
                      :class="{ active: activeFeatureId === item.statId }"
                      @click="setActiveFeature(item.statId)"
                    >
                      {{ item.statName }}
                    </span>
                    <div
                      class="statInfoBoard left top"
                      :class="{ active: activeFeatureId === item.statId }"
                    >
                      <div class="tri"></div>
                      <statInfo :id="item.statId" />
                    </div>
                  </div>
                  <div
                    class="structName top"
                    :class="{ active: activeFeatureId === item.gantryCode }"
                    @click="setActiveFeature(item.gantryCode)"
                  >
                    <span>{{ item.gantryName }}</span>
                  </div>
                  <div
                    class="infoBoard top"
                    :class="{ active: activeFeatureId === item.gantryCode }"
                  >
                    <div class="tri"></div>
                    <gantryInfo :id="item.gantryCode" />
                  </div>
                  <img class="gImg" :src="gTop" alt="" draggable="false" />
                  <div
                    class="stationBox right"
                    v-if="item.statId && item.statName === '路段入口站'"
                  >
                    <img :src="stationImg" alt="" draggable="false" />
                    <span
                      class="statName top right"
                      :class="{ active: activeFeatureId === item.statId }"
                      @click="setActiveFeature(item.statId)"
                    >
                      {{ item.statName }}
                    </span>
                    <div
                      class="statInfoBoard right top"
                      :class="{ active: activeFeatureId === item.statId }"
                    >
                      <div class="tri"></div>
                      <statInfo :id="item.statId" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            <i class="el-icon-back diIcon" style="right: -100px" />
          </div>
          <div class="struct">
            <i class="el-icon-right diIcon" style="left: -100px" />
            <div class="road"></div>
            <div class="infoListBox">
              <ul class="infoList" :style="infoListStyles" ref="infoList2">
                <div class="roadDash"></div>
                <li v-for="(item, index) in bottomList" :key="`top${index}`">
                  <div class="stationBox" v-if="item.statId && item.statName === '路段入口站'">
                    <span
                      class="statName bottom"
                      :class="{ active: activeFeatureId === item.statId }"
                      @click="setActiveFeature(item.statId)"
                    >
                      {{ item.statName }}
                    </span>
                    <img :src="stationImg" alt="" draggable="false" />
                    <div
                      class="statInfoBoard left bottom"
                      :class="{ active: activeFeatureId === item.statId }"
                    >
                      <div class="tri"></div>
                      <statInfo :id="item.statId" />
                    </div>
                  </div>
                  <div
                    class="structName bottom"
                    :class="{ active: activeFeatureId === item.gantryCode }"
                    @click="setActiveFeature(item.gantryCode)"
                  >
                    <span>{{ item.gantryName }}</span>
                  </div>
                  <div
                    class="infoBoard bottom"
                    :class="{ active: activeFeatureId === item.gantryCode }"
                  >
                    <div class="tri"></div>
                    <gantryInfo :id="item.gantryCode" />
                  </div>
                  <img class="gImg" :src="gBottom" alt="" draggable="false" />
                  <div
                    class="stationBox right"
                    v-if="item.statId && item.statName !== '路段入口站'"
                  >
                    <img :src="stationImg" alt="" draggable="false" />
                    <span
                      class="statName bottom"
                      :class="{ active: activeFeatureId === item.statId }"
                      @click="setActiveFeature(item.statId)"
                    >
                      {{ item.statName }}
                    </span>
                    <div
                      class="statInfoBoard right bottom"
                      :class="{ active: activeFeatureId === item.statId }"
                    >
                      <div class="tri"></div>
                      <statInfo :id="item.statId" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref, watch, onMounted, nextTick, onUnmounted } from 'vue'
import gantryInfo from './infoBoard/gantry.vue'
import statInfo from './infoBoard/station.vue'
import gTop from '@/assets/images/gTop.png'
import gBottom from '@/assets/images/gBottom.png'
import stationImg from '@/assets/images/station.png'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const structLoading = computed(() => store.state.charge?.structLoading)
const comStructList = computed(() => store.getters.comStructList)
const comChargeData = computed(() => store.getters.comChargeData)
const activeFeatureId = computed(() => store.state.charge?.activeFeatureId)
const activeFeature = computed(() => store.getters.activeFeature)
const section = ref('')

const setActiveFeature = (id: string) => {
  if (id === activeFeatureId.value) {
    store.commit('charge/changeActiveFeatureId', '')
  } else {
    store.commit('charge/changeActiveFeatureId', id)
  }
}

const infoListBox: any = ref(null)
const infoList1: any = ref(null)
const infoList2: any = ref(null)
const infoListBoxWidth: any = ref(0)
const infoListWidth: any = ref(0)

onMounted(() => {
  setWidth()
  window.addEventListener('resize', setWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', setWidth)
})

const setWidth = async () => {
  await nextTick()
  if (infoListBox.value && infoList1.value && infoList2.value) {
    infoListBoxWidth.value = infoListBox.value.clientWidth
    infoListWidth.value =
      infoList1.value.clientWidth > infoList2.value.clientWidth
        ? infoList1.value.clientWidth
        : infoList2.value.clientWidth
  }
}

const sectionList = computed(() => {
  if (comStructList.value?.length > 0) {
    const list: any = []
    comStructList.value?.forEach(
      (e: any) =>
        !list.find((t: any) => t.value === e.sectionCode) &&
        list.push({
          name: e.sectionCode,
          value: e.sectionCode,
        })
    )
    return list
  }
  return []
})

watch(
  sectionList,
  () => {
    if (sectionList.value?.length > 0) {
      section.value = sectionList.value[0].value
    }
  },
  {
    immediate: true,
  }
)

const sectionStructList = computed(() => {
  if (section.value && sectionList.value?.length > 0) {
    return comStructList.value.filter((e: any) => e.sectionCode === section.value)
  }
  return []
})

const topList = computed(() => {
  if (sectionStructList.value?.length > 0) {
    return sectionStructList.value
      .filter((e: any) => e.upDown === '2')
      ?.sort((a: any, b: any) => {
        return a.gantryOrder - b.gantryOrder
      })
  }
  return []
})

const bottomList = computed(() => {
  if (sectionStructList.value?.length > 0) {
    return sectionStructList.value
      .filter((e: any) => e.upDown === '1')
      ?.sort((a: any, b: any) => {
        return a.gantryOrder - b.gantryOrder
      })
  }
  return []
})

let dragBase = 0
const dragDist = ref(0)
let startPos: any = null
let endPos: any = null
const dragging = ref(false)
watch([section, activeCom], () => {
  dragDist.value = 0
  dragBase = 0
  dragging.value = false
  setWidth()
  store.commit('charge/changeActiveFeatureId', '')
})
const grabStart = (e: any) => {
  clearInterval(toLeftInterval)
  clearInterval(toRightInterval)
  if (structLoading.value || sectionStructList.value?.length <= 0) {
    return
  }
  if (e.button === 0) {
    dragBase = dragDist.value
    dragging.value = true
    startPos = e.pageX
  }
}

const distRight = computed(() => {
  if (infoListBoxWidth.value && infoListWidth.value) {
    return infoListWidth.value - infoListBoxWidth.value
  }
  return 0
})
const grabing = (e: any) => {
  if (structLoading.value || sectionStructList.value?.length <= 0 || !dragging.value) {
    return
  }
  const onDragDist = dragBase + e.pageX - startPos
  if (onDragDist > 0) {
    dragDist.value = 0
    return
  }
  if (onDragDist + distRight.value < 0) {
    dragDist.value = -distRight.value
    return
  }
  if (onDragDist <= 0 && onDragDist + distRight.value >= 0) {
    dragDist.value = onDragDist
  }
}
const grabStop = (e: any) => {
  dragging.value = false
}

const mousewheel = (e: any) => {
  let dist = dragDist.value
  if (e.wheelDelta > 0) {
    dist += 50
  } else {
    dist -= 50
  }
  if (dist > 0) {
    dragDist.value = 0
    return
  }
  if (dist + distRight.value < 0) {
    dragDist.value = -distRight.value
    return
  }
  if (dist <= 0 && dist + distRight.value >= 0) {
    dragDist.value = dist
  }
}

const infoListStyles = computed(() => {
  const list: any = [`left:${dragDist.value}px`]
  return list.join(';')
})

let toLeftInterval: any = null
let toRightInterval: any = null

const toLeft = () => {
  clearInterval(toLeftInterval)
  clearInterval(toRightInterval)
  toLeftInterval = setInterval(() => {
    if (dragDist.value >= 0) {
      dragDist.value = 0
      clearInterval(toLeftInterval)
    } else {
      dragDist.value += 5
    }
  }, 5)
}
const toRight = () => {
  clearInterval(toLeftInterval)
  clearInterval(toRightInterval)
  toRightInterval = setInterval(() => {
    if (dragDist.value <= -distRight.value) {
      dragDist.value = -distRight.value
      clearInterval(toRightInterval)
    } else {
      dragDist.value -= 5
    }
  }, 5)
}
</script>

<style lang="postcss" scoped>
.structBox {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 60px;
  right: 60px;
  padding: 0 100px;
  z-index: 999;
  cursor: grab;

  @apply flex flex-col items-center justify-center overflow-hidden;

  &.dragging {
    cursor: grabbing;
  }
}
.arr {
  position: absolute !important;
  z-index: 1000;
  height: 100%;
  cursor: pointer;
  width: 60px;
  top: 0;
  background: rgba(236, 250, 255, 0.1);
  background: linear-gradient(to left, rgba(0, 183, 255, 0.1), rgba(236, 250, 255, 0));
  z-index: 1000;

  @apply h-full flex items-center justify-center;

  &.right {
    right: 0;
  }
  &.left {
    left: 0;
    transform: scaleX(-1);
  }

  &:hover {
    opacity: 1;
  }
  & .svg-icon {
    width: 60px;
    height: 92px;
    color: rgb(255, 255, 255);
  }
}

.struct {
  height: 36px;
  margin-top: 30px;

  @apply w-full relative flex items-center;

  &:first-child {
    right: 30px;
    & .road {
      transform: skewX(-50deg);
      border-right: 3px solid #025b96;
      border-top-right-radius: 2px;
      border-bottom: 3px solid #025b96;
      border-bottom-left-radius: 2px;
    }
  }

  &:nth-child(2) {
    left: 30px;
    & .road {
      transform: skewX(50deg);
      border-right: 3px solid #025b96;
      border-top-right-radius: 2px;
      border-bottom: 3px solid #025b96;
      border-bottom-left-radius: 2px;
    }
  }
}

.road {
  background: #5e6977;

  @apply w-full h-full relative;
}

.roadDash {
  position: absolute;
  height: 2px;
  margin-top: -1px;
  top: 50%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0.3),
    rgba(255, 255, 255, 0.3) 50px,
    transparent 30px,
    transparent
  );
  min-width: 100%;
  background-size: 100px 100%;
}

.diIcon {
  font-size: 30px;
  color: rgb(212, 216, 3);
  position: absolute;
}

.infoListBox {
  position: absolute;
  width: 100%;
  height: 100%;
}

.infoList {
  position: absolute;
  padding: 0 100px;
  @apply inline-flex justify-start h-full min-w-full;

  & li {
    min-width: 400px;
    height: 100%;

    @apply flex justify-center items-center relative flex-grow;
  }
}

.gImg {
  position: absolute;
  bottom: 0px;
}

.infoBoard {
  width: 160px;
  height: 60px;
  position: absolute;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgb(0, 122, 204);
  border-radius: 2px;

  &.active {
    border: 1px solid rgb(252, 255, 46);
    &.top {
      & .tri {
        border-top: 10px solid rgb(252, 255, 46);
      }
    }
    &.bottom {
      & .tri {
        border-bottom: 10px solid rgb(252, 255, 46);
      }
    }
  }

  &.top {
    bottom: 70px;
    & .tri {
      position: absolute;
      height: 0;
      width: 0;
      bottom: -10px;
      left: 40%;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid rgb(0, 122, 204);
    }
  }

  &.bottom {
    top: 44px;
    /* left: 40px; */
    & .tri {
      position: absolute;
      height: 0;
      width: 0;
      top: -10px;
      left: 40%;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid rgb(2, 91, 151);
    }
  }
}

.structName {
  position: relative;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.6);
  background: linear-gradient(to left, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.6));
  padding: 2px 6px;
  cursor: pointer;
  box-shadow: 0 0 20 #000;
  text-shadow: 0 0 10px rgb(0, 0, 0);
  border: 1px solid rgb(2, 91, 151);
  font-size: 14px;
  line-height: 14px;
  color: rgb(86, 215, 255);
  max-width: 150px;
  &.top {
    transform: skewX(-12deg);
  }

  &.bottom {
    transform: skewX(12deg);
  }

  &:hover {
    color: rgb(252, 255, 46);
    text-shadow: 0 0 20px rgb(252, 255, 46);
  }

  &.active {
    color: rgb(252, 255, 46);
    text-shadow: 0 0 20px rgb(252, 255, 46);
  }
}

.stationBox {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 20%;

  &.right {
    /* justify-content: flex-end; */
    left: auto;
    right: 20%;
  }
}

.statInfoBoard {
  width: 160px;
  height: 80px;
  position: absolute;
  z-index: 1001;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgb(0, 204, 78);
  border-radius: 2px;

  &.active {
    border: 1px solid rgb(252, 255, 46);
    &.left {
      & .tri {
        border-left: 10px solid rgb(252, 255, 46);
      }
    }

    &.right {
      & .tri {
        border-right: 10px solid rgb(252, 255, 46);
      }
    }
  }

  & .tri {
    position: absolute;
    height: 0;
    width: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
  }

  &.left {
    left: -175px;
    & .tri {
      right: -10px;
      border-left: 10px solid rgb(0, 204, 78);
    }
  }

  &.right {
    right: -170px;
    & .tri {
      left: -10px;
      border-right: 10px solid rgb(0, 204, 78);
    }
  }

  &.top {
    top: -48px;

    & .tri {
      bottom: 10%;
    }
  }

  &.bottom {
    bottom: -45px;
    & .tri {
      top: 10%;
    }
  }
}

.statName {
  position: absolute;
  background: rgba(0, 0, 0, 0.6);
  background: linear-gradient(to left, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.4));
  padding: 1px 6px;
  box-shadow: 0 0 20 #000;
  text-shadow: 0 0 10px rgb(0, 0, 0);
  font-size: 14px;
  line-height: 14px;
  color: rgb(0, 250, 0);
  border: 1px solid rgb(1, 121, 1);
  white-space: nowrap;
  cursor: pointer;
  top: -28px;

  &:hover {
    color: rgb(252, 255, 46);
    text-shadow: 0 0 20px rgb(252, 255, 46);
  }

  &.active {
    color: rgb(252, 255, 46);
    text-shadow: 0 0 20px rgb(252, 255, 46);
  }

  &.top {
    transform: skewX(-12deg);

    &.left {
      margin-right: -34px;
    }
  }

  &.bottom {
    transform: skewX(12deg);
  }
}

.featureName {
  color: rgb(252, 255, 46);
  margin-left: 4px;
  line-height: 12px;
}
</style>
