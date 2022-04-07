<template>
  <div class="baseinfo-box z-50 flex justify-between items-center">
    <div class="bsi-inner">
      <div class="value">{{ arr ? formatThousandMoney(arr.budgetTotal) : "-" }}</div>
      <div class="unit">年度预算金额(万元)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? formatThousandMoney(arr.budgetUsed) : "-" }}</div>
      <div class="unit">已使用预算总额(万元)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? formatThousandMoney(arr.dailymtCharge) : "-" }}</div>
      <div class="unit">日常养护项目计费金额(万元)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? formatThousandMoney(arr.spacialmtCharge) : "-" }}</div>
      <div class="unit">专项养护项目计费金额(万元)</div>
    </div>
    <div class="bsi-inner">
      <div class="value">{{ arr ? formatThousandMoney(arr.rescuemtCharge) : "-" }}</div>
      <div class="unit">抢险养护项目计费金额(万元)</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";
import { computed, defineProps, ref } from "vue";
import { formatThousand,formatThousandMoney } from "@/utils/util";

import { useStore } from "vuex";
import { key } from "@/store";
import { budgetEu } from '@/api/curingBusiness';

const budgetEuData = useRequest<any>(() => budgetEu());
const arr = computed(() => {
  let data = budgetEuData.data && budgetEuData.data.value?.msgContent;
  return data&&(data as Array<any>)[0];
});

defineProps({
  info: {
    type: String,
    default: "",
  },
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
  padding: 0 50px;
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
  background: linear-gradient(
    to right,
    transparent,
    rgba(0, 134, 255, 1),
    transparent
  );
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
  background: linear-gradient(
    to right,
    rgba(0, 210, 255, 1),
    rgba(0, 84, 255, 1)
  );
  font-style: oblique;
}
</style>
