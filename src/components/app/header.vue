<template>
  <div>
    <!-- 老版登录页 -->
    <header class="app-header app-header-old" v-if="$route.name == 'bussiness' || $route.name == 'operationOverview1'">
      <div class="absolute left-0 flex items-center">
        <Logo />
        <!-- <ComSelecter
        v-if="route.name !== 'realTimeMonitoring' && userOrg === 'list'"
      /> -->
      </div>
      <!-- <Menu /> -->
      <div class="app-options">
        <div class="app-option app-option-date" v-if="
            route.name !== 'chargeInfo' && route.name !== 'realTimeMonitoring'
          ">
          <!-- <img :src="haederdate" /> -->
          <el-date-picker v-model="appDate" type="month" size="small" :clearable="false"></el-date-picker>
        </div>
        <div class="app-option" :title="fullscreen ? '退出全屏' : '全屏'">
          <svg-icon :name="fullscreen ? 'fullscreen_r' : 'fullscreen'" @click="toggleFs"></svg-icon>
        </div>
        <div class="app-option">
          <a rel="noreferrer" title="视频云瞰平台" style="font-size: 18px" @click="
              tonewPath(
                'https://183.64.175.153:446/ctm01freeportal-web/auth/validateLogin'
              )
            ">
            <i class="el-icon-video-camera"></i>
          </a>
        </div>
        <div class="app-option">
          <button class="userInfo" @click="logout" title="退出">
            <div class="flex flex-col justify-start" v-if="userInfo">
              <span class="userInfoText">{{ userInfo?.deptName }}</span>
              <span class="userInfoText">{{ userInfo?.name }}</span>
            </div>
            <span v-else>未知用户</span>
            <svg-icon class="ml-2" name="logout"></svg-icon>
          </button>
        </div>
      </div>
    </header>
    <header class="app-header app-header-pos" v-else>
      <div class="absolute left-0 flex items-center">
        <Logo />
      </div>
      <div class="app-options">
        <div class="app-option app-option-date" v-if="
            route.name !== 'chargeInfo' && route.name !== 'realTimeMonitoring'
          ">
          <el-date-picker v-model="appDate" type="month" size="small" :clearable="false" popper-class="n_date__popper"></el-date-picker>
        </div>
        <div class="app-option">
          <img :src="haedertempe" />
          <span>-9°</span>
        </div>
        <div class="app-option">
          <img :src="haedertime" />
          <span>{{nowTime}}</span>
        </div>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import Logo from './logo.vue';
import Menu from './menu.vue';
import ComSelecter from './comSelecter.vue';
import { generateKey } from '@/api/operation';

import { useStore } from 'vuex';
import { key } from '@/store';

import screenfull from 'screenfull';

import haedertempe from '@/assets/images/header-tempe.png';
import haedertime from '@/assets/images/header-time.png';
import { onMounted, onBeforeUnmount, ref, computed, watch, reactive } from 'vue';

import { useRoute } from 'vue-router';
import { formatDate } from '@/utils/util';
const route = useRoute();
let timeOut: any = undefined;
let nowTime: any = ref(formatDate(new Date(), 'hh:mm:ss'));
const createdEvent = () => {
  setTimeout(() => {
    nowTime.value = formatDate(new Date(), 'hh:mm:ss');
    timeOut = setTimeout(getTime, 1000);
  }, 1000);
};
createdEvent();
const getTime = () => {
  if (timeOut) clearTimeout(timeOut);
  nowTime.value = formatDate(new Date(), 'hh:mm:ss');
  timeOut = setTimeout(getTime, 1000);
};
const fullscreen = ref(false);

const handleFsChange = () => {
  if (screenfull.isEnabled) {
    fullscreen.value = screenfull.isFullscreen;
  }
};

const toggleFs = () => {
  console.log(screenfull.isEnabled);
  if (screenfull.isEnabled) {
    if (fullscreen.value) {
      screenfull.exit();
    } else {
      screenfull.request();
    }
  }
};

onMounted(() => {
  getTokenkey();
  if (screenfull.isEnabled) {
    screenfull.on('change', handleFsChange);
  }
});

onBeforeUnmount(() => {
  if (screenfull.isEnabled) {
    screenfull.off('change', handleFsChange);
  }
});
const dataset = reactive({
  value: '',
});
const tonewPath = async (val: any) => {
  await getTokenkey();
  window.open(val + '?tokenKey=' + dataset.value);
};
const getTokenkey = () => {
  generateKey().then((res) => {
    dataset.value = res.data;
  });
};

const store = useStore(key);
const userInfo = computed(() => store.state.auth?.userInfo);
const userOrg = computed(() => store.state.auth?.userOrg);
const appDate = computed({
  get: () => store.state.appDate,
  set: (date: Date) => store.commit('changeDate', date),
});

watch(
  userOrg,
  () => {
    store.commit('changeCom', userOrg.value);
  },
  {
    immediate: true,
  }
);

const logout = () => store.dispatch('auth/logout');
</script>

<style>
.n_date__popper {
  background-color: rgba(49, 120, 150, 0.9) !important;
}
.app-option-date {
  position: relative;
  top: 2px;
}
.app-option .el-icon-date {
  background: url('@/assets/images/header-date.png') center center no-repeat;
  background-size: 25px;
  position: relative;
  top: -2px;
}
.app-option .el-icon-date:before {
  content: '';
  font-size: 16px;
  visibility: hidden;
}
.el-input__inner {
  font-size: 16px;
}
</style>
<style lang="postcss" scoped>
.app-header {
  height: 50px;

  @apply w-screen flex items-center flex-shrink-0;
}
.app-header-old {
  background-color: rgb(var(--primary));
}
.app-header-pos {
  position: absolute;
  left: 0;
  top: 0;
}
.app-options {
  width: 400px;
  position: absolute;
  background: url('@/assets/images/headerrig-bg.png') no-repeat;
  background-size: contain;
  background-position: 0 40px;
  right: 0;
  height: 100%;
  flex-shrink: 0;
  margin: 0 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    height: 25px;
  }
}

.app-option {
  display: flex;
  cursor: pointer;
  color: #fff;
  letter-spacing: 2px;
  font-size: 16px;
  & .svg-icon {
    font-size: 16px;
  }
  & + .app-option {
    margin-left: 25px;
  }
}

.userInfo {
  background: rgba(0, 0, 0, 0.2);
  text-shadow: 1px 1px 2px #000;
  letter-spacing: 1px;
  font-size: 14px;

  @apply relative flex items-center border border-transparent pl-3 pr-2 py-1 transition-all duration-300 outline-none rounded-sm;

  &:hover,
  &:focus {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid #000;
    color: rgb(8, 181, 250);
  }
}

::v-deep(.el-input) {
  width: 100px;
}

::v-deep(.el-input__inner) {
  text-shadow: none;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
  border-radius: 2px;
  padding-right: 0;
  border-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
}

.userInfoText {
  font-size: 14px;
  line-height: 14px;
}
</style>
