<template>
  <Module style="height: 250px" :loading="loading" :error="error" :info="bsMeta && bsMeta['utilities']">
    <template #title>基础设施明细</template>
    <div class="basetable">
      <div class="bt-head">
        <div>编号</div>
        <div>名称</div>
        <div>起始点</div>
        <div>终点</div>
        <div>长度(km)</div>
      </div>
      <div class="bt-item" v-for="item in roadData" :key="item">
        <div>{{item.sectionCode}}</div>
        <div>{{item.sectionName}}</div>
        <div>{{item.startPoint}}</div>
        <div>{{item.endPoint}}</div>
        <div>{{item.sectionLength}}</div>
      </div>
    </div>
  </Module>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  },
});
const roadData = computed(() => {
  const data = props.data;
  return data;
});
</script>

<style lang="postcss" scoped>
.basetable {
  width: 100%;
  height: 200px;
  padding: 8px 12px;
}
.bt-head {
  padding: 3px;
  & div {
    width: 25%;
    text-align: center;
    font-size: 12px;
    color: #badeff;
  }
  background: rgba(101, 161, 214, 0.4);
  @apply flex justify-between;
}
.bt-item {
  margin-top: 5px;
  padding: 3px;
  column-gap: 5px;
  & div {
    width: 20%;
    text-align: center;
    font-size: 12px;
    color: #badeff;
  }
  border-bottom: 1px solid rgba(0, 132, 251, 0.4);
  @apply flex justify-between;
}
</style>