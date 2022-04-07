<template>
  <div class="comListContainer">
    <img class="scaleImg" :src="scaleImg" alt="" />
    <div class="comlist">
      <div
        class="comItem animate__animated animate__rotateInDownLeft"
        :style="`animation-delay: ${Number(index) * 300}ms;`"
        v-for="(comItem, index) in comList"
        :key="comItem.code"
      >
        <span
          class="comLabel"
          :class="{ active: activeCom === comItem.code }"
          @click="changeCom(comItem.code)"
        >
          {{ comItem.name }}
        </span>
      </div>
    </div>
    <div class="decoLine">
      <div
        class="decoBlock"
        :style="`transform:translateY(${Number(activeIndex) * 100}%)`"
      >
        <img class="arrComImg" :src="arrComImg" alt="" />
      </div>
    </div>
    <div class="autoChangeWarp">
      <div class="iconRow">
        <svg-icon
          :class="{ active: autoPlay }"
          class="playIcon"
          name="com-auto-10"
          @click="play(true)"
        ></svg-icon>
        <svg-icon
          :class="{ active: !autoPlay }"
          class="playIcon"
          name="com-static"
          @click="play(false)"
        ></svg-icon>
      </div>
      <div class="interval">
        <span
          class="type"
          :class="{ active: playInterval === 2 }"
          @click="playInterval = 2"
        >
          2s
        </span>
        <span
          class="type"
          :class="{ active: playInterval === 5 }"
          @click="playInterval = 5"
        >
          5s
        </span>
        <span
          class="type"
          :class="{ active: playInterval === 10 }"
          @click="playInterval = 10"
        >
          10s
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import scaleImg from '@/assets/images/scaleImg.png'
import arrComImg from '@/assets/images/arrCom.png'
import { comInfo } from '@/store/state'
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref, onBeforeUnmount, watch } from 'vue'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const redisLoading = computed(() => store.state.charge?.redisLoading)

const changeCom = (code: string) => {
  autoPlay.value = false
  timer && clearInterval(timer)
  timer = null
  store.commit('changeCom', code)
}

const comList = computed(() => [{ name: '招商公路', code: 'list' }, ...comInfo])

const activeIndex = computed(() => {
  return comList.value?.map((e: any) => e.code).indexOf(activeCom.value)
})

const autoPlay = ref(false)
const playInterval = ref(5)

let timer: any = null

const play = (type: boolean) => {
  autoPlay.value = type
}

onBeforeUnmount(() => {
  timer && clearInterval(timer)
  timer = null
})

const comCodeSeq = computed(() => comList.value?.map((e: any) => e.code))

watch([autoPlay, playInterval], () => {
  timer && clearInterval(timer)
  timer = null
  if (!autoPlay.value) {
    return
  }
  timer = setInterval(() => {
    if (!redisLoading.value) {
      // 等该公司数据更新完成后
      if (activeIndex.value === comCodeSeq.value.length - 1) {
        store.commit('changeCom', 'list')
      } else {
        let nextId = comCodeSeq.value[activeIndex.value + 1]
        store.commit('changeCom', nextId)
      }
    }
  }, playInterval.value * 1000)
})
</script>

<style lang="postcss" scoped>
.comListContainer {
  position: absolute;
  z-index: 998;
  left: 20px;
  top: 100px;
  height: 400px;
  display: flex;
  align-items: center;
}
.comlist {
  height: 100%;
  width: 120px;
  display: flex;
  flex-direction: column;
}
.comItem {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  animation-duration: 1s;
  &:hover {
    & .comLabel {
      transform: scale(1.2);
    }
  }
}
.comLabel {
  text-shadow: 2px 3px 1px #000;
  font-size: 12px;
  cursor: pointer;
  transition-property: transform, color;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
  font-weight: 600;
  &.active {
    color: rgb(223, 120, 2);
    transform: scale(1.4) !important;
  }
}
.scaleImg {
  width: 17px;
  height: 360px;
  flex-shrink: 0;
}
.decoLine {
  height: 100%;
  width: 14px;
  pointer-events: none;
  & .decoBlock {
    height: 40px;
    width: 100%;
    display: flex;
    align-items: center;
    transition: transform ease-in-out 0.2s;
    & .arrComImg {
      height: 10px;
      width: 14px;
      margin-top: 2px;
    }
  }
}

.autoChangeWarp {
  position: absolute;
  top: 10px;
  right: -100px;
  & .iconRow {
    height: 26px;
    display: flex;
    align-items: center;
  }
  & .playIcon {
    font-size: 26px;
    color: rgb(3, 153, 223);
    cursor: pointer;
    transition: all ease-in-out 0.2s;
    & + .playIcon {
      margin-left: 10px;
    }
    &.active {
      color: rgb(223, 120, 2);
      transform: scale(1.4) !important;
    }
    &:hover {
      transform: scale(1.2);
    }
  }
}

.interval {
  display: flex;
  align-items: flex-start;
  margin-top: 8px;
  & .type {
    cursor: pointer;
    font-size: 12px;
    transition: all ease-in-out 0.2s;
    font-weight: 600;
    font-style: italic;
    &.active {
      color: rgb(223, 120, 2);
      transform: scale(1.4) !important;
    }
    &:hover {
      transform: scale(1.2);
    }
    & + .type {
      margin-left: 10px;
    }
  }
}
</style>
