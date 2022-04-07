<template>
  <Module class="h-1/2" :loading="loading">
    <template #title>
      <slot name="title" />
    </template>
    <template v-if="count" #end>
      <span class="count">{{ count }}</span>
    </template>
    <template v-if="!loading">
      <div class="absolute inset-0 flex overflow-hidden" :class="{ hide }">
        <div class="leftPanel" :class="{ hide }">
          <div class="panelToggle" @click="hide = !hide" :class="{ hide }">
            <i class="el-icon-close" v-if="!hide" />
            <i class="el-icon-s-fold" v-else />
          </div>
          <ul class="upperList" :class="{ hide: upperHide, loading }" v-if="upperTypes.length > 0">
            <li
              class="upperItem"
              :class="{ active: item.label === upType }"
              v-for="item in upperTypesList"
              @mouseenter.stop.prevent="e => hoverEnter(e, item.label)"
              @mouseleave.stop.prevent="hoverLeave"
              @click="upType = item.label"
              :key="item.label"
            >
              <svg-icon v-if="item.icon" class="evtIcon" :name="item.icon"></svg-icon>
              <span class="label">{{ item.label }}</span>
              <span v-if="!hide">{{ item.value }}</span>
              <svg-icon class="evtIcon toright" v-if="hide" :name="item.icon"></svg-icon>
            </li>
          </ul>
          <div
            v-if="upperTypes.length > 0"
            class="upperShowToggle"
            :class="{ hide, upperHide }"
            @click="upperHide = !upperHide"
          >
            <i class="el-icon-arrow-up" :class="{ hide: upperHide }" />
          </div>
          <div class="calcListContainer" :class="{ loading }">
            <div class="calcList" :class="{ hide }">
              <div
                class="typeBox"
                :class="{ active: activeTypeName === item.name }"
                @mouseenter.stop.prevent="e => hoverEnter(e, item.name)"
                @mouseleave.stop.prevent="hoverLeave"
                @click="activateType(item.name)"
                v-for="(item, index) in typeValueList"
                :key="index"
              >
                <svg-icon class="evtIcon" :name="item.icon"></svg-icon>
                <span class="label">{{ item.name }}</span>
                <span v-if="!hide">{{ item.value }}</span>
                <svg-icon class="evtIcon toright" v-if="hide" :name="item.icon"></svg-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="content" @mousewheel="listWheel">
          <ul class="list" v-if="showDataList?.length > 0" ref="listNode">
            <li
              class="listItem"
              v-for="(item,index) in lazyList"
              :key="`${upType}${typeName}${index}`"
            >
              <slot name="listItem" :data="item" :index="getIndex(index)" />
              <svg-icon class="itemIcon" :name="item.icon"></svg-icon>
            </li>
            <div class="lazyBanner" v-if="lazyCurrent < lazyPageNum">
              <LoadingNew />
            </div>
          </ul>
          <Empty v-else />
          <div class="lazyLoadingWarp" v-if="lazyLoading">
            <Loading />
          </div>
        </div>
      </div>
    </template>
  </Module>
  <teleport to="body">
    <div
      class="hoverInfoMount"
      :style="hoverInfoMountStyle"
      v-if="hoverText && showHover && hide && hoverTargetRect"
    >
      <div class="hoverLabel">{{ hoverText }}</div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import LoadingNew from '@/components/LoadingNew.vue'
import { computed, defineProps, ref, defineEmit, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  typeList: {
    type: Array,
    default: () => []
  },
  upperTypes: {
    type: Array,
    default: () => []
  },
  showList: {
    type: Array,
    default: () => []
  },
  activeUpperType: {
    type: String,
    default: ''
  },
  activeTypeName: {
    type: String,
    default: ''
  },
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmit()

const hide = ref(true)
const upperHide = ref(false)
const upType = computed({
  get: () => props.activeUpperType,
  set: (val: string) => emit('update:activeUpperType', val)
})
const typeName = computed({
  get: () => props.activeTypeName,
  set: (val: string) => emit('update:activeTypeName', val)
})

const upperTypesList = computed(() => props.upperTypes as Array<any>)
const showDataList = computed(() => props.showList as Array<any>)
const typeValueList = computed(() => props.typeList?.sort((a: any, b: any) => {
  return b.value - a.value
}) as Array<any>)
const activateType = (name: string) => {
  if (props.loading) {
    return
  }
  if (typeName.value === name) {
    typeName.value = '全部'
  } else {
    typeName.value = name
  }
}

const getIndex = (index: any) => {
  const length = showDataList.value?.length
  if (index <= length - 1) {
    return index + 1
  }
  return (index + 1) % length
}

let hoverTimer: any = null
const showHover = ref(false)
const hoverText = ref('')
const hoverTargetRect: any = ref(null)
const hoverInfoMountStyle = computed(() => {
  return (
    (hoverTargetRect.value &&
      `top:${hoverTargetRect.value.y}px;left:${hoverTargetRect.value.x +
      hoverTargetRect.value.width +
      8}px`) ||
    ''
  )
})

const hoverEnter = (e: any, name: string) => {
  let { path } = e
  let target = path.find((e: any) => e && e.className.indexOf('typeBox') > -1 || e.className.indexOf('upperItem') > -1)
  if (target) {
    hoverTimer && clearTimeout(hoverTimer)
    hoverText.value = name
    showHover.value = true
    let rect = target.getBoundingClientRect()
    hoverTargetRect.value = rect
  }
}
const hoverLeave = () => {
  hoverTimer = setTimeout(() => {
    showHover.value = false
    hoverText.value = ''
    hoverTargetRect.value = null
  }, 10)
}


const listNode: any = ref(null)
// 懒加载
const lazyLoading = ref(false) // 加载
const lazyList: any = ref([]) // 展示的列表
const lazyCurrent = ref(1) // 当前页
const lazyPage = 6 // 懒加载每页的数量
const lazyPageNum = computed(() => { // 页数
  let listLength = showDataList.value?.length
  return Math.ceil(listLength / lazyPage)
})
// 初始化
watch(showDataList, () => {
  lazyList.value = []
  lazyCurrent.value = 1
  lazyList.value = showDataList.value?.slice(0, lazyPage)
}, { immediate: true })
// 数据重置 滚动回顶上
watch([upType, typeName], () => {
  listNode.value && (listNode.value.scrollTop = 0)
})

const position = ref(0) // 滚动的位置
let resetScrollTimer: any = null // 重置滚动位置
let backTimer: any = null
let scrollTimer: any = null

let oneHeight = 0 // 一份数据的高度
let scrollLength = 0
const autoScroll = () => {
  // 自动滚动
  if (!(showDataList.value?.length >= 6) || !listNode.value) {
    return
  }

  scrollTimer = setInterval(() => {
    const { scrollTop, clientHeight, scrollHeight } = listNode.value
    if (scrollTop > 10 && Math.abs(scrollTop - oneHeight) < 5) {
      listNode.value.scrollTop = 0
      position.value = 0
    }
    // 没有滚到底部
    if (scrollTop < scrollHeight - clientHeight) {
      clearTimeout(backTimer)
      position.value++
      if (position.value >= scrollHeight - clientHeight) {
        listNode.value.scrollTop = scrollHeight - clientHeight
      } else {
        listNode.value.scrollTop = position.value
      }
    }
    // 滚动到了底部
    if (scrollTop + clientHeight + 10 >= scrollHeight) {
      // 全部数据已经加载完了
      if (lazyCurrent.value === lazyPageNum.value) {
        if (!scrollLength) {
          scrollLength = scrollTop
          oneHeight = scrollHeight // 一份数据的高度
          lazyList.value = [...lazyList.value, ...lazyList.value] // 接上前面的
        }
      } else if (!backTimer) {
        // 回到顶部
        backTimer = setTimeout(() => {
          listNode.value.scrollTop = 0
          position.value = 0
        }, 1500)
      }
    }
    listWheel()
  }, 50)
}
const wheelDoing = ref(false)
const listWheel = (e?: any) => {
  if (e) {
    resetScrollTimer = clearTimeout(resetScrollTimer)
    scrollTimer = clearTimeout(scrollTimer)
    backTimer = clearTimeout(backTimer)
    resetScrollTimer = setTimeout(() => {
      if (listNode.value) {
        position.value = listNode.value.scrollTop
      }
      autoScroll()
    }, 1000)
  }
  if (wheelDoing.value) {
    return
  }
  wheelDoing.value = true
  // 防抖200ms判断一次
  setTimeout(() => {
    wheelDoing.value = false
    if (lazyLoading.value || wheelDoing.value || lazyPageNum.value === lazyCurrent.value) {
      // 如果正在加载或者全部数据已经加载完成
      return
    }
    if (!listNode.value) {
      return
    }

    const { scrollTop, clientHeight, scrollHeight } = listNode.value

    // 避免没有数据的时候 重复执行 scrollHeight > clientHeight  20缓冲距离
    if (scrollHeight > clientHeight && scrollTop + clientHeight + 20 >= scrollHeight) {
      lazyLoading.value = true
      // 缓冲时间
      setTimeout(() => {
        loadmore()
        lazyLoading.value = false
      }, 500)
    }
  }, 200);
}

const loadmore = () => {
  if (lazyCurrent.value >= lazyPageNum.value) {
    return
  }
  let addData =
    showDataList.value?.slice(
      lazyCurrent.value * lazyPage,
      (lazyCurrent.value + 1) * lazyPage
    )
  lazyCurrent.value++
  lazyList.value = [...lazyList.value, ...addData]
}

watch(() => props.loading, async () => {
  await nextTick()
  if (props.loading) {
    scrollTimer && clearInterval(scrollTimer)
  } else {
    autoScroll()
  }
}, {
  immediate: true
})

onBeforeUnmount(() => {
  hoverTimer && clearTimeout(hoverTimer)
  scrollTimer && clearInterval(scrollTimer)
  backTimer && clearTimeout(backTimer)
  resetScrollTimer && clearTimeout(resetScrollTimer)
})
</script>

<style lang="postcss" scoped>
.leftPanel {
  position: relative;
  z-index: 100;
  top: 0;
  left: 0;
  flex-shrink: 0;
  width: 140px;
  height: 100%;
  border-right: 1px solid rgba(0, 183, 255, 0.2);
  background: rgba(0, 46, 83, 0.98);
  transition: all ease-in-out 0.3s;
  box-shadow: 5px 0 20px -5px #000000a4;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.hide {
    box-shadow: none;
    margin-left: -110px;
  }
}

.panelToggle {
  height: 26px;
  border-top: 1px solid rgba(3, 124, 155, 0.425);
  border-bottom: 1px solid rgba(3, 124, 155, 0.425);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgb(0, 39, 66);
  padding: 0 7px;
  transition: all ease-in-out 0.2s;
  &:hover {
    box-shadow: inset 0 0 10px rgb(1, 62, 105);
  }
  &.hide {
    justify-content: flex-end;
  }
  & i {
    transition: all ease-in-out 0.2s;
    &.hide {
      transform: rotate(180deg);
    }
  }
}

.upperList {
  position: relative;
  display: flex;
  flex-direction: column;
  &.hide {
    height: 0;
    overflow: hidden;
  }
  & .upperItem {
    width: 100%;
    height: 32px;
    flex-shrink: 0;
    padding: 0px 10px 0 4px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    & .label {
      white-space: nowrap;
      color: rgb(222, 239, 247);
      margin-right: auto;
    }
    &.active {
      background: rgba(0, 183, 255, 0.3) !important;
    }
    &:hover {
      background: rgba(0, 183, 255, 0.2);
    }
  }
}

.evtIcon {
  font-size: 16px;
  margin: 0 4px;
  &.toright {
    margin-right: -5px;
  }
}

.upperShowToggle {
  height: 26px;
  border-top: 1px solid rgba(3, 124, 155, 0.425);
  border-bottom: 1px solid rgba(3, 124, 155, 0.425);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgb(0, 39, 66);
  padding: 0 7px;
  transition: all ease-in-out 0.2s;
  &:hover {
    box-shadow: inset 0 0 10px rgb(1, 62, 105);
  }
  &.hide {
    justify-content: flex-end;
  }
  &.upperHide {
    border-top-width: 0;
  }
  & i {
    transition: all ease-in-out 0.2s;
    &.hide {
      transform: rotate(180deg);
    }
  }
}

.calcListContainer {
  position: relative;
  flex-grow: 1;
}
.calcList {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  &.hide {
    &::-webkit-scrollbar {
      width: 1px;
      height: 6px;
      background: transparent;
    }
  }
}
.typeBox {
  width: 100%;
  height: 32px;
  flex-shrink: 0;
  padding: 0px 10px 0 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all ease-in-out 0.1s;
  font-size: 13px;

  & .label {
    white-space: nowrap;
    color: rgb(222, 239, 247);
    margin-right: auto;
    margin-left: 2px;
  }
  &.active {
    background: rgba(0, 183, 255, 0.3) !important;
  }
  &:hover {
    background: rgba(0, 183, 255, 0.2);
  }
}

.count {
  font-size: 12px;
  color: rgba(24, 231, 86, 0.6);
  padding: 3px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  margin-right: 4px;
}

.content {
  flex-grow: 1;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2px;
  z-index: 99;
  display: flex;
}

.list {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 6px;
}
.listItem {
  position: relative;
  width: 100%;
  padding: 8px;
  flex-shrink: 0;
  background: rgba(0, 46, 83, 0.98);
  border: 1px solid rgba(0, 120, 255, 0.2);
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  transition: all ease-in-out 0.2s;
  animation-duration: 1s;
  &:hover {
    border: 1px solid rgba(0, 120, 255, 0.4);
  }
  & + .listItem {
    margin-top: 10px;
  }
}

.itemIcon {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.15);
  position: absolute;
  right: 5px;
  top: 24px;
  z-index: 99;
}

.hoverInfoMount {
  position: fixed;
  width: 0;
  height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 10000;
  &::before {
    content: " ";
    position: relative;
    top: 8px;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 10px solid #000;
  }
}

.hoverLabel {
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 6px;
  font-size: 12px;
  background: #000;
  white-space: nowrap;
}

.loading {
  cursor: wait !important;
}

.lazyLoadingWarp {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.lazyBanner {
  width: 100%;
  height: 60px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.3;
}
</style>
