<template>
  <div class="baseinfo-box z-50 flex justify-between items-center">
    <div class="bsi-inner">
      <div class="value1">
        {{ arr ? formatThousand(arr.tzjylc || 0) : "-" }}
      </div>
      <div class="unit1">投资经营(km)</div>
    </div>
    <div class="bsi-inner">
      <div class="value1">
        {{ arr ? formatThousand(arr.jygllc || 0) : "-" }}
      </div>
      <div class="unit1">管理里程(km)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? formatThousand(arr.tzjyss || 0) : "-" }}</div>
      <div class="unit">投资省市(个)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? arr.glxmss || 0 : "-" }}</div>
      <div class="unit">管理项目省市(个)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? arr.gkxm || 0 : "-" }}</div>
      <div class="unit">管理项目(个)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? arr.gkld || 0 : "-" }}</div>
      <div class="unit">管理路段(个)</div>
    </div>
    <div class="bsi-inner">
      <div class="value1">15.3</div>
      <div class="unit1">剩余收费年限</div>
    </div>
    <!-- <div class="bsi-inner">
      <div class="value"></div>
      <div class="unit"></div>
    </div> -->
    <!-- <div class="basinfo-row">
      <Module
        title="投资经营里程"
        class="w-1/2"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['tzjy']"
      >
        <span class="value">
          {{ arr ? formatThousand(arr.tzjylc || 0) : "-" }}
        </span>
        <span class="unit">公里</span>
      </Module>
      <Module
        title="管理里程"
        class="w-1/2"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['jylc']"
      >
        <span class="value">
          {{ arr ? formatThousand(arr.jygllc || 0) : "-" }}
        </span>
        <span class="unit">公里</span>
      </Module>
    </div>
    <div class="basinfo-row">
      <Module
        title="投资经营省市"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['tzss']"
      >
        <span class="value">
          {{ arr ? formatThousand(arr.tzjyss || 0) : "-" }}
        </span>
        <span class="unit">个</span>
      </Module>
      <Module
        title="管理项目省市"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['glss']"
      >
        <span class="value">{{ arr ? arr.glxmss || 0 : "-" }}</span>
        <span class="unit">个</span>
      </Module>
      <Module
        title="管理项目"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['gkxm']"
      >
        <span class="value">{{ arr ? arr.gkxm || 0 : "-" }}</span>
        <span class="unit">个</span>
      </Module>
      <Module
        title="管理路段"
        class="w-1/4"
        :loading="loading"
        :error="error"
        :info="bsMeta && bsMeta['gkld']"
      >
        <span class="value">{{ arr ? arr.gkld || 0 : "-" }}</span>
        <span class="unit">个</span>
      </Module>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { genConfig } from '@/utils/request';
import { useRequest } from 'vue-request';
import { computed, defineProps, ref } from 'vue';
import { formatThousand } from '@/utils/util';

import { useStore } from 'vuex';
import { key } from '@/store';
import * as businessApi from '@/api/businessOverview';

defineProps({
  info: {
    type: String,
    default: '',
  },
});
const controlProSecCount = useRequest<any>(() => businessApi.getControlProSecCount());
const mngPrivinceCountInPay = useRequest<any>(() => businessApi.getMngPrivinceCount(0));
const mngPrivinceCountManage = useRequest<any>(() => businessApi.getMngPrivinceCount(1));
const investMileage = useRequest<any>(() => businessApi.getInvestMileage());
const mngSectionLen = useRequest<any>(() => businessApi.getMngSectionLen(0));

const arr = computed(() => {
  const controlProSecCountData = controlProSecCount.data.value?.msgContent;
  const mngPrivinceCountInPayData = mngPrivinceCountInPay.data.value?.msgContent;
  const mngPrivinceCountManageData = mngPrivinceCountManage.data.value?.msgContent;
  const investMileageData = investMileage.data.value?.msgContent;
  const mngSectionLenData = mngSectionLen.data.value?.msgContent;
  const result = {
    gkxm: controlProSecCountData && controlProSecCountData[0]?.projectCount,
    gkld: controlProSecCountData && controlProSecCountData[0]?.sectionCount,
    tzjyss:
      mngPrivinceCountInPayData &&
      mngPrivinceCountInPayData[0] &&
      mngPrivinceCountInPayData[0]['count(distinct province)'],
    glxmss:
      mngPrivinceCountManageData &&
      mngPrivinceCountManageData[0] &&
      mngPrivinceCountManageData[0]['count(distinct province)'],
    tzjylc: investMileageData && investMileageData[0]?.sectionLength,
    jygllc: mngSectionLenData && mngSectionLenData[0]?.mngSectionLen,
  };
  // console.log(result);
  return result;
});
// const { data, loading, error, refresh } = useRequest<any>(() =>
//   genConfig("/http-server-kpi/publish/jsc/baseInfo")
// );

// const arr = computed(() => data.value?.msgContent[0]);

const store = useStore(key);

const bsMeta = computed(() => store.getters.bsMeta);
</script>

<style lang="postcss" scoped>
.baseinfo-box {
  top: 4px;
  left: 4px;
  width: 100%;

  @apply flex;
}

.basinfo-row {
  height: 80px;

  @apply flex;
}
.bsi-inner {
  width: 14%;
}
.value {
  font-size: 30px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  text-shadow: 2px 2px 15px rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
  letter-spacing: 1px;
}
.value1 {
  font-size: 30px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  color: #00ccff;
  text-shadow: 2px 2px 15px rgba(0, 204, 255, 0.7);
  margin-bottom: 10px;
  letter-spacing: 1px;
}
.unit {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  width: 120px;
  height: 15px;
  line-height: 15px;
  margin: auto;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(to right, transparent, rgba(0, 134, 255, 1), transparent);
  font-style: oblique;
}
.unit1 {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  width: 110px;
  height: 18px;
  line-height: 18px;
  margin: auto;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(to right, rgba(0, 210, 255, 1), rgba(0, 84, 255, 1));
  font-style: oblique;
}
</style>
