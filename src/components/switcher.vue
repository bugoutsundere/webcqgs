<template>
  <div class="switcher-box">
    <button
      class="switcher-button"
      :class="{ active: item.value === modelValue }"
      v-for="item in list"
      :key="`option ${item.value}`"
      @click="$emit('update:modelValue', item.value)"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed } from "vue";

type Option = {
  name: string;
  value: any;
};

const props = defineProps({
  modelValue: [Boolean, String],
  options: {
    type: Array,
    required: true,
  },
});

const list = computed(() => props.options as Option[]);
</script>

<style lang="postcss" scoped>
.switcher-box {
  /* border: 1px solid rgba(23, 207, 240, 0.342); */

  @apply flex items-center rounded-sm;

  & + .switcher-box {
    margin-left: 4px;
  }
}

.switcher-button {
  height: 20px;
  /* background: rgba(1, 65, 102, 0.8); */
  font-size: 14px;
  line-height: 12px;
  vertical-align: middle;
  color: #94ccff;


  @apply focus:outline-none flex items-center justify-center px-2;

  &.active {
    /* background: rgb(var(--active)) !important; */
    color: #0086ff;
  }

  & + .switcher-button {
    /* border-left: 1px solid rgba(var(--active), 0.6); */
  }

  &:hover {
    /* background: #0494e785; */
    text-shadow: 3px 3px 15px rgb(255 255 255 / 80%);
  }
}
</style>
