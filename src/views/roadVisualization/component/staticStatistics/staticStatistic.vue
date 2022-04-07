<template>
  <div class="static-data p-2">
    <map-module title="静态统计数据">
      <div class="p-2.5 flex flex-wrap justify-between">
        <!-- <div class="w-1/2 py-2">
          <div class="label">公里数</div>
          <div class="mt-2 label2">
            {{ formatThousand(10581) }}
            <span class="label3">公里</span>
          </div>
        </div> -->
        <div class="w-1/2 py-2">
          <div class="label">收费站</div>
          <div class="mt-2 label2">
            {{ formatThousand(msgData.tollStatNums) }}
            <span class="label3">个</span>
          </div>
        </div>
        <div class="w-1/2 py-2">
          <div class="label">服务区</div>
          <div class="mt-2 label2">
            {{ formatThousand(msgData.serviceStatNums) }}
            <span class="label3">个</span>
          </div>
        </div>
        <div class="w-1/2 py-2">
          <div class="label">门架</div>
          <div class="mt-2 label2">
            {{ formatThousand(msgData.gantry) }}
            <span class="label3">个</span>
          </div>
        </div>
        <div class="w-1/2 py-2">
          <div class="label">桥梁</div>
          <div class="mt-2 label2">
            {{ formatThousand(msgData.bridgeNums) }}
            <span class="label3">个</span>
          </div>
        </div>
        <div class="w-1/2 py-2">
          <div class="label">隧道</div>
          <div class="mt-2 label2">
            {{ formatThousand(msgData.chunnelNums) }}
            <span class="label3">个</span>
          </div>
        </div>
        <!-- <div class="w-1/2 py-2">
          <div class="label">车道</div>
          <div class="mt-2 label2">
            {{ formatThousand(msgData.tollStatNums) }}
            <span class="label3">个</span>
          </div>
        </div> -->
      </div>
    </map-module>
    <event-datas></event-datas>
  </div>
</template>
<script lang='ts' setup>
import mapModule from "@/components/map-module/index.vue";
import { formatThousand } from "@/utils/util";
import { eventDatas } from "../eventDatas";
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";

const store = useStore(key);
const roadCode = computed(() => store.getters.roadCode);
const selectRoadId = computed(() => store.state.road?.selectRoadId);

const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(`/http-server-yygl/publish/jsc/baseStruct?com=${roadCode.value}`)
);

const msgData = computed(() => {
  const msgContent = data.value?.msgContent;
  const result = msgContent && (msgContent as Array<any>)[0];
  return result || {};
});
watch(selectRoadId, refresh);
</script>
<style lang="postcss" scoped>
.static-data {
  background: rgba(5, 15, 45, 0.5);
  position: absolute;
  top: 0;
  right: 0;
  width: 349px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.map-model {
  @apply p-0.5;
}
.label {
  @apply font-normal;
  font-size: 12px;
  color: #07ffed;
}
.label2 {
  font-size: 16px;
  color: rgba(213, 251, 255, 1);
}
.label3 {
  font-size: 13px;
}
</style>