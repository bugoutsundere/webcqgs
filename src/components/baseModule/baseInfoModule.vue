<template>
  <Module :loading="loading" :error="error">
    <template #title>{{title}}</template>
    <div class="base-info-list">
      <div class="list-item-box" v-for="item in moduleList" :key="item.code">
        <ModuleItem :module="item" :v-bind="$attrs">
        </ModuleItem>
      </div>
    </div>
  </Module>
</template>
<script lang="ts">
export default {
  // 取消继承到根组件Attribute
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import ModuleItem from '@/components/baseModule/BaseInfoItem.vue';
import { computed, defineProps, watch, reactive } from 'vue';

const props = defineProps({
  title: [String],
  // 展示模块列表(格式:[{name:'模块名'},{code:'模块唯一标记'},{key:'data的Key值'}])
  moduleList: {
    type: Array,
    default() {
      return [];
    },
  },
});
</script>

<style lang="postcss" scoped>
.base-info-list {
  @apply w-full h-full flex flex-wrap p-0.5;
}

.list-item-box {
  @apply p-0.5 w-1/3;
  &.single {
  }
}
</style>
