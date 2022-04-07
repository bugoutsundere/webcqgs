<template>
  <button v-bind="$attrs" class="switch-button" ref="swButton" @click="clickBtn">
    <svg-icon
      class="mr-1.5 pointer-events-none"
      v-if="activeOption?.svg"
      :name="activeOption?.svg"
    />
    <span class="pointer-events-none">{{ activeOption?.name }}</span>
    <i class="el-icon-sort ml-1.5 pointer-events-none" />
  </button>
  <teleport to="body">
    <div class="swBtnList" :style="mountStyle">
      <ul class="option-list" v-if="showOptions">
        <div class="tri"></div>
        <li
          class="option-item"
          :class="{ active: option.value === modelValue }"
          v-for="option in options"
          :key="option.value"
          @click="checkOption(option.value)"
        >
          <span>{{ option.name }}</span>
          <svg-icon v-if="option.svg" :name="option.svg" />
        </li>
      </ul>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import {
  computed,
  defineEmit,
  defineProps,
  ref,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount,
} from 'vue'

const emit = defineEmit()
const props = defineProps({
  modelValue: [Boolean, String],
  options: Array,
})

const activeOption: any = computed(() =>
  props?.options?.find((e: any) => e.value === props.modelValue)
)

const showOptions = ref(false)
const clickBtn = () => {
  showOptions.value = !showOptions.value
  if (showOptions.value) {
    openList(swButton)
  }
}

const checkOption = (val: any) => {
  emit('update:modelValue', val)
  showOptions.value = false
}

const swButton = ref(null)
const mountStyle = ref('')

const openList = (Ele: any) => {
  const bound = Ele.value.getBoundingClientRect()
  const top = bound.bottom + 10
  const left = bound.left + bound.width
  mountStyle.value = `top:${top}px;left:${left}px;`
}

const checkOutside = (elm: any): boolean | undefined => {
  if (elm.className === 'swBtnList') {
    return false
  } else if (elm && elm.parentElement) {
    return checkOutside(elm.parentElement)
  }
  return true
}

const closeList = (e: any) => {
  // 点击到了外面
  if (showOptions.value && e.target !== swButton.value && checkOutside(e.target)) {
    showOptions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeList)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', closeList)
})
</script>

<style lang="postcss" scoped>
.switch-button {
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

.option-list {
  background: rgba(0, 40, 77, 0.7);
  min-width: 150px;
  padding: 3px 0;

  @apply flex flex-col relative rounded;
}

.option-item {
  padding: 3px 10px;

  @apply whitespace-nowrap text-right cursor-pointer flex justify-end items-center;

  &:hover {
    background: rgba(0, 112, 216, 0.6);
  }

  &.active {
    background: rgba(0, 112, 216, 0.95);
  }

  & .svg-icon {
    margin-left: 6px;
  }
}

.swBtnList {
  width: 0;
  height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  position: fixed;
  z-index: 1000;
}

.tri {
  position: absolute;
  right: 10px;
  top: -5px;
  width: 0;
  height: 0;
  border-bottom: 5px solid rgba(0, 40, 77, 0.7);
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
}
</style>
