<template>
  <footer class="app-footer">
    <Menu />
  </footer>
</template>

<script lang="ts" setup>
import Menu from "./menu3.vue";
</script>
<style lang="postcss" scoped>
.app-footer {
  /* background-color: rgb(var(--primary)); */
  height: 45px;
  position: absolute;
  left: 0;
  bottom: 0;
  @apply w-screen flex items-center flex-shrink-0 items-center;
}
</style>
