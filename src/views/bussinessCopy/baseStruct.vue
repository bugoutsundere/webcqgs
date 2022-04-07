<template>
  <Module
    class="h-1/3"
    :loading="loading"
    :error="error"
    :info="bsMeta && bsMeta['utilities']"
  >
    <template #title>基础设施统计(数量)</template>
    <div class="base-struct-list" v-if="arr">
      <div
        class="list-item-box"
        :class="{ single: !item.children }"
        v-for="item in baseStructInfo"
        :key="item.code"
      >
        <div
          class="list-item"
          @click="activeBaseStruct = item.code"
          :class="{ active: activeBaseStruct === item.code }"
          v-waves
        >
          <div class="item-icon">
            <img
              v-if="activeBaseStruct === item.code"
              :src="imgslist.value[item.code + 'Act']"
            />
            <!-- <img v-else :src="`~@/src/assets/images/${item.code}.png`" /> -->
            <img v-else :src="imgslist.value[item.code]" />
          </div>
          <!-- <svg-icon class="icon pointer-events-none" :name="'eq-' +item.code" /> -->
          <template v-if="!item.children">
            <span class="item-title">{{ item.name }}</span>
            <span class="item-value">{{
              arr ? formatThousand(arr[item.key] || 0) : "-"
            }}</span>
          </template>
          <template v-else>
            <span class="item-title">{{ item.name }}</span>
            <span class="item-value">{{
              arr ? formatThousand(arr[item.key] || 0) : "-"
            }}</span>
            <ul class="item-subtypes">
              <li
                class="item-subtype"
                v-for="subItem in item.children"
                :key="subItem.key"
              >
                <span class="sub-name">{{ subItem.name }}</span>
                <span class="sub-point" v-if="subItem.name != '混合车道'">
                  <span v-for="i in 4" :key="i" class="in_po"></span
                ></span>
                <span class="sub-num">{{
                  arr ? formatThousand(arr[subItem.key] || 0) : "-"
                }}</span>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
    <Empty v-else-if="!loading" />
  </Module>
</template>

<script lang="ts" setup>
import { genConfig } from "@/utils/request";
import { useRequest } from "vue-request";
import { computed, defineProps, watch, reactive } from "vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { baseStructInfo } from "@/store/state";
import { formatThousand } from "@/utils/util";
import stat from "@/assets/images/baseStruct/stat.png";
import statAct from "@/assets/images/baseStruct/stat-active.png";
import area from "@/assets/images/baseStruct/area.png";
import areaAct from "@/assets/images/baseStruct/area-active.png";
import gantry from "@/assets/images/baseStruct/gantry.png";
import gantryAct from "@/assets/images/baseStruct/gantry-active.png";
import brg from "@/assets/images/baseStruct/brg.png";
import brgAct from "@/assets/images/baseStruct/brg-active.png";
import tunnel from "@/assets/images/baseStruct/tunnel.png";
import tunnelAct from "@/assets/images/baseStruct/tunnel-active.png";
import route from "@/assets/images/baseStruct/route.png";
import routeAct from "@/assets/images/baseStruct/route-active.png";
// import img4 from '@/assets/4.png'

const imgslist = reactive({
  value: {
    stat: stat,
    statAct: statAct,
    area: area,
    areaAct: areaAct,
    gantry: gantry,
    gantryAct: gantryAct,
    brg: brg,
    brgAct: brgAct,
    tunnel: tunnel,
    tunnelAct: tunnelAct,
    route: route,
    routeAct: routeAct,
  },
});

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);
const bsMeta = computed(() => store.getters.bsMeta);

const activeBaseStruct = computed({
  get: () => store.state.activeBaseStruct,
  set(val: string) {
    store.commit("changeBaseStruct", val);
  },
});
const { data, loading, error, refresh } = useRequest<any>(() =>
  genConfig(
    `/http-server-yygl/publish/jsc/baseStruct${
      activeCom.value !== "list" ? "?com=" + activeCom.value : ""
    }`
  )
);

watch(activeCom, refresh);

const arr = computed(() => {
  const msgContent = data.value?.msgContent;
  const result = msgContent && (msgContent as Array<any>)[0];
  return result;
});

const getSum = (dataObj: any, list: any) =>
  list
    .map((e: any) => Number(dataObj[e.key]))
    .reduce((a: number, b: number) => a + b);
</script>

<style lang="postcss" scoped>
.base-struct-list {
  @apply w-full h-full flex flex-wrap p-0.5;
}

.list-item-box {
  height: 62%;

  @apply p-0.5 w-1/3;

  &.single {
    height: 38%;
  }
}

.list-item {
  @apply relative w-full h-full cursor-pointer rounded-sm flex flex-col items-center justify-center transition-all duration-300;

  &.active {
    /* border: 1px solid rgba(7, 133, 196, 1);
    background: linear-gradient(
      to left top,
      rgba(0, 59, 88, 0.3),
      rgb(7, 133, 196)
    ); */
  }
}
.active .item-title {
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 192, 0, 0.45),
    transparent
  );
  color: rgba(255, 206, 90, 1);
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
  font-size: 20px;
}

.item-subtypes {
  @apply flex flex-col flex-shrink-0 w-full flex-grow px-6 py-1;
}

.item-subtype {
  @apply flex justify-between items-center;
}
.sub-point {
  @apply flex justify-between px-2;
  width: 43px;
}
.in_po {
  display: inline-block;
  width: 2px;
  height: 2px;
  border-radius: 1px;
  background: #00b4ff;
}
.sub-name {
  font-size: 13px;
  color: #badeff;
}

.sub-num {
  font-size: 14px;
  color: #60b3ff;
}

.icon {
  position: absolute;
  font-size: 60px;
  top: 0;
  height: 100%;
  color: rgba(255, 255, 255, 0.12);
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
</style>
