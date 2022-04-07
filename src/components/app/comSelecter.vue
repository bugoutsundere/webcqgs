<template>
  <button class="com-selector" @focus="buttonFocus" v-waves ref="slcBtn">
    <span>{{ activeComName }}</span>
    <svg-icon class="ml-2" name="comTri"></svg-icon>
  </button>
  <div
    class="com-selector-model"
    :class="{ hide: !isFocus }"
    @click="isFocus = false"
  ></div>
  <ul class="com-list-mount" :style="mountStyle" :class="{ hide: !isFocus }">
    <li
      class="comItem"
      :style="`animation-delay: ${index * (isFocus ? 50 : 10)}ms;`"
      v-for="(com, index) in comList"
      :key="com.code"
      :class="{
        active: com.code === activeCom,
        uninited: !inited,
        in: isFocus,
        out: !isFocus && inited,
        left: com.type === 'company',
        right: com.type === 'road',
      }"
      @click="changeCom(com.code)"
    >
      {{ com.name }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useStore } from "vuex";
import { key } from "@/store";
import { computed, ref, watch, nextTick } from "vue";

import { comInfo } from "@/store/state";

const comList = [{ name: "全部", code: "list", type: "road" }].concat(
  comInfo
);

const store = useStore(key);
const globalLoading = computed(() => store.state.globalLoading);

const activeCom = computed({
  get() {
    return store.state.activeCom;
  },
  set(code: string) {
    store.commit("charge/changeActiveFeatureId", "");
    // 在改变公司前强制先执行一些操作
    store.commit("changeCom", code);
  },
});

const changeCom = (code: string) => {
  if (code === activeCom.value) {
    return;
  }
  store.commit("changeCom", code);
  isFocus.value = false;
};

const activeComName = computed(() => {
  if (activeCom.value === "list") {
    return "全部";
  }
  let item = comList.find((e) => e.code === activeCom.value);
  return item?.name;
});

const isFocus = ref(false);
const inited = ref(false);
const buttonFocus = () => {
  isFocus.value = true;
  inited.value = true;
};

const slcBtn = ref(null);

const mountStyle = ref("");

const setListPos = (Ele: any) => {
  const bound = Ele.value.getBoundingClientRect();
  const top = bound.bottom + 10;
  const left = bound.left + bound.width / 2;
  mountStyle.value = `top:${top}px;left:${left}px;`;
};

watch(
  [activeCom, isFocus],
  async () => {
    await nextTick();
    slcBtn.value && setListPos(slcBtn);
  },
  { immediate: true }
);
</script>

<style lang="postcss" scoped>
.com-selector {
  background: rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 2px #000;
  letter-spacing: 1px;
  font-size: 14px;

  @apply relative z-50 flex items-center border border-transparent pl-3 pr-2 py-1 transition-all duration-300 outline-none rounded-sm;

  &:hover {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid #000;
  }

  &:focus {
    background: rgb(var(--primary));
    border: 1px solid #000;
  }
}

.com-selector-model {
  background: rgba(0, 0, 0, 0.6);
  transition-duration: 600ms !important;

  @apply fixed inset-0 z-40 transition-all;

  &.hide {
    background: rgba(0, 0, 0, 0);

    @apply pointer-events-none;
  }
}

.com-list-mount {
  height: 0;
  width: 0;

  @apply fixed z-50 flex flex-col items-center justify-start;

  &.hide {
    /* opacity: 0; */
    pointer-events: none;
  }
}

.comItem {
  font-size: 15px;
  background: rgba(0, 98, 163, 0.8);
  animation-duration: 300ms;
  animation-fill-mode: both;

  &.uninited {
    display: none;
  }

  &.in {
    &.left {
      animation-name: myFadeInLeft;
    }

    &.right {
      animation-name: myFadeInRight;
    }
  }

  &.out {
    &.left {
      animation-name: myFadeOutLeft;
    }

    &.right {
      animation-name: myFadeOutRight;
    }
  }

  @apply flex-shrink-0 whitespace-nowrap cursor-pointer px-6 py-1;

  & + .comItem {
    margin-top: 8px;
  }

  &.active {
    background: rgb(6, 135, 221) !important;

    @apply cursor-not-allowed;
  }

  &:hover {
    background: rgb(1, 115, 190);

    @apply transition-all duration-100;
  }
}
</style>

<style>
@keyframes myFadeInLeft {
  0% {
    opacity: 0;
    transform: translate3d(-100%, 100%, 0) skewX(0);
  }

  100% {
    opacity: 1;
    transform: translate3d(-5%, 0, 0) skewX(-6deg);
  }
}

@keyframes myFadeInRight {
  0% {
    opacity: 0;
    transform: translate3d(100%, 100%, 0) skewX(0);
  }

  100% {
    opacity: 1;
    transform: translate3d(5%, 0, 0) skewX(6deg);
  }
}

@keyframes myFadeOutLeft {
  100% {
    opacity: 0;
    transform: translate3d(-100%, 100%, 0) skewX(0);
  }

  0% {
    opacity: 1;
    transform: translate3d(-5%, 0, 0) skewX(-6deg);
  }
}

@keyframes myFadeOutRight {
  100% {
    opacity: 0;
    transform: translate3d(100%, 100%, 0) skewX(0);
  }

  0% {
    opacity: 1;
    transform: translate3d(5%, 0, 0) skewX(6deg);
  }
}
</style>
