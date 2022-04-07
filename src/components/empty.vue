<template>
  <div class="empty absolute inset-0 flex flex-col items-center justify-center">
    <svg-icon name="empty"></svg-icon>
    <span class="mt-2">暂无数据</span>
  </div>
</template>

<style lang="postcss" scoped>
.empty {
  color: rgba(255, 255, 255, 0.4);
  text-shadow: none;

  & .svg-icon {
    font-size: 46px;
  }
}
</style>
