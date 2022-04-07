<template>
  <router-link class="logo" to="/" ondragstart="return false">
    <div class="logo-bg">
      <img :src="logo" alt="" draggable="false" />
    </div>

    <!-- <img :src="title" alt="" draggable="false" /> -->
  </router-link>
</template>

<script lang="ts" setup>
// import logo from '@/assets/images/logo.png'
// import title from '@/assets/images/title.png'
import logo from "@/assets/images/logo.png";
</script>

<style lang="postcss" scoped>
.logo-bg {
  width: 500px;
  height: 55px;
  background: url("@/assets/images/logo-bg.png");
  background-size: 100% 100%;
}
.logo {
  @apply relative left-0 px-8 flex;

  & img {
    height: 30px;
    @apply relative left-10 top-2;
    & + img {
      margin-left: 8px;
    }
  }
}
</style>
