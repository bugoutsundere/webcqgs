<template>
  <div class="absolute inset-0" ref="elm"></div>
</template>

<script lang="ts" setup>
import * as echarts from "echarts";
import "echarts/map/js/china";
// import "echarts/map/json/province/chongqing.json";

import {
  defineProps,
  ref,
  watch,
  nextTick,
  onBeforeUnmount,
  defineEmit,
  onMounted,
} from "vue";

interface Ref<T> {
  value: T;
}

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});

const emits = defineEmit();

const elm = ref(null) as Ref<any>;

let ect: any = null;

const resize = () => ect && ect.resize();

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
});

watch(
  () => props.options,
  async () => {
    await nextTick();
    if (!ect && elm.value) {
      ect = echarts.init((elm as Ref<any>).value);
      window.addEventListener("resize", resize);
      ect.on("click", (e: any) => emits("ectCheck", e));
    }
    ect && ect.setOption(props.options, true);
  },
  { immediate: true, deep: true }
);
</script>
