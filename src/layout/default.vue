<template>
  <AppHeader class="z-50" />
  <main class="app-main relative flex z-0">
    <Loading v-if="!dataInited && needDate" />
    <router-view v-slot="{ Component }" v-else>
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <AppFooter class="z-50" />
</template>

<script lang="ts" setup>
import AppHeader from "@/components/app/header.vue";
import AppFooter from "@/components/app/footer.vue";
import { useStore } from "vuex";
import { key } from "@/store";
import { computed, watch, ref } from "vue";
import { useRequest } from "vue-request";
import { genConfig } from "@/utils/request";
import { useRoute } from "vue-router";

const store = useStore(key);
const activeCom = computed(() => store.state.activeCom);

const { data, loading, error, run } = useRequest<any>(
  () =>
    genConfig(
      `/http-server-kpi/publish/jsc/lastestamountdate${
        (activeCom.value !== "list" && `?com=${activeCom.value}`) || ""
      }`
    ),
  {
    manual: true,
  }
);

const dataInited = ref(false);

watch(data, () => {
  if (data.value?.msgContent?.length > 0) {
    const time = data.value?.msgContent[0]?.cyear;
    if (time) {
      const date = new Date(time);
      if (date) {
        store.commit("changeDate", date);
      }

      dataInited.value = true;
    }
  }
});

const route = useRoute();

const needDate = computed(() => {
  const routeName: string = route.name as string;
  return [
    "bussiness",
    "operation",
    "management",
    "warning",
    // 'realTimeMonitoring',
  ].includes(routeName);
});

watch(
  [activeCom, needDate],
  () => {
    if (needDate.value) {
      run();
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="postcss">
.app-main {
  @apply h-full w-screen;
}
</style>
