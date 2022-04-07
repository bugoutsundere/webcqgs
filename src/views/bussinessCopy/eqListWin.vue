<template>
  <div class="eq-list-win animate__animated" :class="{
      animate__zoomOut: hide,
      animate__zoomIn: !hide,
    }">
    <Module class="module w-ful h-full" theme="none" :info="bsMeta && bsMeta['machineSubtype']" :loading="loading" :error="error">
      <template #title>机电设备详情</template>
      <template #end>
        <switchButton v-model="typeCode" :options="typeOptions" />
        <switchButton v-if="activeCom === 'list'" class="ml-2" v-model="com" :options="comOptions" />
      </template>
      <div class="absolute inset-0 flex" v-if="dataList?.length > 0 && !loading">
        <div class="w-full relative flex">
          <el-table size="small" class="flex-grow" :data="dataList" height="100%">
            <el-table-column align="center" prop="systemType" label="设备类型"></el-table-column>
            <el-table-column align="center" prop="orgName" label="设备名称"></el-table-column>
            <el-table-column align="center" label="设备数量">
              <template #default="scope">
                <span :style="{ fontSize: '14px', fontWeight: 500 }">{{ scope.row.deviceCount }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <Empty v-else-if="!loading" />
    </Module>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, watch, watchEffect } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
import { eqInfo, comInfo } from '@/store/state';
import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';
import switchButton from '@/components/switchButton.vue';

import { getDeviceCount } from '@/api/businessOverview';

const props = defineProps({
  hide: {
    type: Boolean,
    default: true,
  },
});

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);
const activeEq = computed(() => store.state.activeEq);
// 设备类型选项
const typeCode = ref(store.state.activeEq);
watchEffect(() => {
  typeCode.value = activeEq.value;
});

const typeOptions = eqInfo.map(({ name, code, key }) => ({
  name,
  value: code,
  svg: key,
}));
// 公司选项
const com = ref(store.state.activeCom);
watchEffect(() => {
  com.value = activeCom.value;
});
const comOptions = (() => {
  const list = comInfo.map(({ name, code }) => ({
    name,
    value: code,
  }));
  return [{ name: '全部公司', value: 'list' }, ...list];
})();
// 重新打开后重置
watch(
  () => props.hide,
  () => {
    if (!props.hide) {
      typeCode.value = activeEq.value;
      com.value = activeCom.value;
    }
  }
);

const paramStr = computed(() => {
  const params: any = [`typeCode=${typeCode.value}`];
  com.value !== 'list' && params.push(`com=${com.value}`);
  return `?${params.join('&')}`;
});

const { data: deviceCount } = useRequest<any>(() => getDeviceCount(1));
const dataList = computed(() => deviceCount.value?.msgContent);

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yonyu/publish/jsc/eqNums2${paramStr.value}`)
);

const dataList1 = computed(() => data.value?.msgContent);

watch(paramStr, () => {
  if (!props.hide) {
    refresh();
  }
});
</script>

<style lang="postcss" scoped>
.eq-list-win {
  width: 600px;
  height: 500px;
  background: linear-gradient(to left top, rgba(0, 98, 163, 0.7), #0062a3);
  border: 1px solid #0062a3cc;
  border-radius: 4px;
  box-shadow: 0 3px 20px rgb(0 0 0 / 56%), inset 0 0 20px rgb(0 0 0 / 30%);
  animation-duration: 500ms;

  @apply relative flex-shrink-0 overflow-hidden;
}

.module {
  padding: 0 !important;
}

.el-table {
  color: #fff;
  background: transparent;
  text-shadow: none;
  font-size: 12px;

  & ::v-deep(thead) {
    color: #fff;
    font-weight: 500;
  }

  & ::v-deep(table) {
    border-color: transparent;
  }

  & ::v-deep(tr),
  & ::v-deep(th) {
    background-color: transparent;

    & .is-leaf {
      border-bottom: none;
    }
  }

  & ::v-deep(td) {
    background-color: transparent;
    border-bottom: none;
  }

  & ::v-deep(.el-table__body) tr:hover > td {
    background-color: rgba(0, 59, 88, 0.8);
  }

  & ::v-deep(.el-table__header-wrapper) {
    background: linear-gradient(to right, rgba(var(--active), 0.3), rgba(var(--active), 0.05));
  }

  &::before {
    height: 0;
  }
}
</style>
