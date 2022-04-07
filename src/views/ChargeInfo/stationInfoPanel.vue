<template>
  <div class="stationInfoPanel" :class="{ hide }" v-if="stationList?.length > 0">
    <button class="hideButton showButton" @click="hide = false" v-if="hide === true">
      收费站列表
      <i class="el-icon-back ml-2" />
    </button>
    <Module class="w-full h-full">
      <template #title>收费站列表</template>
      <template #end>
        <button class="hideButton" @click="hide = true">
          收起
          <i class="el-icon-right ml-2" />
        </button>
      </template>
      <div class="absolute inset-0 overflow-x-hidden overscroll-y-auto">
        <ul class="w-full flex flex-col p-2">
          <li class="statItem" v-for="item in stationList" :key="item.statId">
            <stationItem :item="item" />
          </li>
        </ul>
      </div>
    </Module>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex'
import { key } from '@/store'
import { computed, ref } from 'vue'
import stationItem from './infoBoard/stationItem.vue'

const store = useStore(key)
const activeCom = computed(() => store.state.activeCom)
const comStructList = computed(() => store.getters.comStructList)

const hide = ref(false)

const stationList = computed(() => {
  const list: any = []
  comStructList.value.forEach((e: any) => {
    if (e.statId) {
      list.push(e)
    }
  })
  return list
})
</script>

<style lang="postcss" scoped>
.stationInfoPanel {
  width: 260px;
  top: 4px;
  bottom: 4px;
  right: 4px;
  @apply absolute transition-all;

  &.hide {
    right: -264px;
  }
}

.hideButton {
  border: 1px solid rgba(23, 207, 240, 0.342);
  font-size: 12px;
  line-height: 14px;
  text-shadow: none;
  background: rgba(35, 174, 255, 0.8);
  padding: 4px 6px;

  @apply outline-none transition-all duration-300 rounded-sm flex items-center;

  &:hover {
    background: #0494e7;
  }
}

.showButton {
  position: absolute;
  top: 0;
  left: -100px;
}

.statItem + .statItem {
  margin-top: 4px;
}
</style>
