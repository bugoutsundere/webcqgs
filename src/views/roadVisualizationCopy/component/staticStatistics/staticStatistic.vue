<template>
  <div class="static-data p-2">
    <Module
      :loading="loading"
      :error="error"
      :info="bsMeta && bsMeta['utilities']"
    >
      <template #title>静态统计数据</template>
      <div class="p-2.5 flex flex-wrap">
        <!-- <div class="w-1/2 py-2">
          <div class="label">公里数</div>
          <div class="mt-2 label2">
            {{ formatThousand(10581) }}
            <span class="label3">公里</span>
          </div>
        </div> -->
        <div class="list-item">
          <div class="item-icon">
            <img :src="imgslist.value.stat" />
          </div>
          <div class="item-title">收费站</div>
          <div class="item-value">
            {{ formatThousand(msgData.tollStatNums) }}
          </div>
        </div>

        <div class="list-item">
          <div class="item-icon">
            <img :src="imgslist.value.area" />
          </div>
          <div class="item-title">服务区</div>
          <div class="item-value">
            {{ formatThousand(msgData.serviceStatNums) }}
          </div>
        </div>

        <div class="list-item">
          <div class="item-icon">
            <img :src="imgslist.value.gantry" />
          </div>
          <div class="item-title">门架</div>
          <div class="item-value">
            {{ formatThousand(msgData.gantry) }}
          </div>
        </div>

        <div class="list-item">
          <div class="item-icon">
            <img :src="imgslist.value.brg" />
          </div>
          <div class="item-title">桥梁</div>
          <div class="item-value">
            {{ formatThousand(msgData.bridgeNums) }}
          </div>
        </div>
        <div class="list-item">
          <div class="item-icon">
            <img :src="imgslist.value.tunnel" />
          </div>
          <div class="item-title">隧道</div>
          <div class="item-value">
            {{ formatThousand(msgData.chunnelNums) }}
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
    </Module>
    <event-datas></event-datas>
  </div>
</template>
<script lang='ts' setup>
import mapModule from "@/components/map-module/index.vue";
import { formatThousand } from "@/utils/util";
import { eventDatas } from "../eventDatas";
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";
import { computed, watch, reactive } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import stat from "@/assets/images/baseStruct/stat.png";
import area from "@/assets/images/baseStruct/area.png";
import gantry from "@/assets/images/baseStruct/gantry.png";
import brg from "@/assets/images/baseStruct/brg.png";
import tunnel from "@/assets/images/baseStruct/tunnel.png";

const imgslist = reactive({
  value: {
    stat: stat,
    area: area,
    gantry: gantry,
    brg: brg,
    tunnel: tunnel,
  },
});

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
.list-item {
  width: 33%;
}
.item-icon {
  width: 50px;
  height: 41px;
  margin: auto;
  /* background: red; */
}
.item-icon img {
  width: 100%;
  height: 100%;
}
.item-title {
  font-weight: bold;
  letter-spacing: 1px;
  width: 60%;
  height: 15px;
  line-height: 15px;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0.1rem;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(0, 72, 137, 1),
    transparent
  );
}

.item-value {
  width: 100%;
  text-align: center;
  font-size: 20px;
}
.static-data {
  /* background: rgba(5, 15, 45, 0.5); */
  position: absolute;
  top: 50px;
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