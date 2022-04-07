
<template>
  <div class="loadingWarp">
    <div class="loadingBar" v-for="i in 5" :key="i" :style="`animation-delay:${(i - 1) * 100}ms`"></div>
  </div>
</template>

<style lang="postcss" scoped>
.loadingWarp {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loadingBar {
  height: 10px;
  width: 2px;
  background: rgb(24, 168, 235);
  animation: loading 1s ease-in-out infinite;
  & + .loadingBar {
    margin-left: 5px;
  }
}
</style>
  