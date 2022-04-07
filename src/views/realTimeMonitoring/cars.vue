<template>
  <Module class="h-1/3 overflow-hidden" :loading="loading" :error="error">
    <template #title>巡查车辆</template>
    <template #end>
      <span class="count" v-if="count">{{ count }}</span>
    </template>
    <template v-if="!loading">
      <div class="absolute inset-0" v-if="datalist?.length > 0">
        <ul class="flex flex-wrap p-0.5 w-full" :class="{'h-full': currentPage.length === 12}">
          <li
            class="w-1/3 h-1/4 flex-shrink-0 p-0.5"
            v-for="(item, index) in currentPage"
            :key="`${current}${index}`"
          >
            <div
              class="item animate__animated"
              :class="{
                animate__fadeOutBottomLeft: isLeave,
                animate__fadeInTopRight: !isLeave,
              }"
              :style="`animation-delay: ${Number(index) * delay
              }s; animation-duration: ${duration}s;`"
            >
              <svg-icon :class="`typeIcon car${item.type}`" :name="`car-${item.type}`"></svg-icon>
              <div class="carName max-w-full" :style="{ color: 'rgb(7, 176, 255)' }">{{ item.carNo }}</div>
              <span>{{ orgNames[item.orgId] }}</span>
            </div>
          </li>
        </ul>
      </div>
      <Empty v-else />
    </template>
  </Module>
</template>

<script lang="ts" setup>
import { genConfig } from '@/utils/request'
import { useRequest } from 'vue-request'
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { comInfo } from '@/store/state'

const { data, loading, error } = useRequest<any>(() =>
  genConfig('/sys/keyVehicle/findAllByPage?page=1&pageSize=1000')
)

const datalist = computed(() => {
  const list = data.value?.data?.result
  if (list?.length > 0) {
    return list?.filter((e: any) => (e.runStatus === '任务中' && e.orgId)) || []
  }
  return []
})

const current = ref(0)

const pages = computed(() => Math.ceil(datalist.value?.length / 12) || 0)
const currentPage = computed(() => {
  if (pages.value > 0 && current.value <= pages.value - 1) {
    return datalist.value.slice(current.value * 12, (current.value + 1) * 12)
  }
  return []
})

const orgNames = computed(() => {
  let obj: any = {}
  comInfo.forEach((e: any) => {
    obj[e.code] = e.name
  })
  return obj
})

const count = computed(() => {
  return datalist.value?.length
})

const isLeave = ref(false)

const delay = ref(0.1) // s
const duration = ref(0.5) //s
let timer: any = null

watch(
  datalist,
  () => {
    if (datalist.value?.length <= 0) {
      return
    }
    current.value === 0
    timer && clearInterval(timer)
    timer = setInterval(() => {
      isLeave.value = false
      if (current.value === pages.value - 1) {
        current.value = 0
      } else {
        current.value++
      }
      setTimeout(() => {
        isLeave.value = true
      }, (duration.value + 12 * delay.value) * 1000 + 200)
    }, (duration.value + 12 * delay.value) * 2000 + 200)
  },
  {
    immediate: true,
  }
)

onBeforeUnmount(() => {
  timer && clearInterval(timer)
  timer = null
})
</script>

<style lang="postcss" scoped>
.count {
  font-size: 12px;
  color: rgba(24, 231, 86, 0.6);
  padding: 3px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-radius: 50%;
  margin-right: 4px;
}

.item {
  background: rgba(0, 46, 83, 0.98);
  border: 1px solid rgba(0, 120, 255, 0.2);
  border-radius: 1px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
  transition: all ease-in-out 0.2s;
  padding: 8px;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: flex-start;

  @apply w-full h-full;
  &:hover {
    border: 1px solid rgba(0, 119, 255, 0.4);
  }
}

.typeIcon {
  font-size: 40px;
  color: rgba(255, 255, 255, 0.2);
  position: absolute;
  bottom: 4px;
  right: 4px;
  &.car1 {
    color: rgba(69, 236, 77, 0.5);
  }
  &.car2 {
    color: rgba(10, 200, 247, 0.5);
  }
}

.carName{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
