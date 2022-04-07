<template>
  <div class="infoWindow" :class="{ ed: info?.name === '鄂东大桥' }">
    <span class="comName">{{ info?.name }}</span>
    <img class="comBg" :src="info?.name === '鄂东大桥' ? comBgRight : comBg" />
  </div>
</template>

<script lang="ts">
import comBg from '@/assets/images/comBg.png'
import comBgRight from '@/assets/images/comBgRight.png'

export default {
  data() {
    return {
      comBg,
      comBgRight,
      info: { name: '未知' },
    }
  }
}
</script>


<style lang="postcss" scoped>
.infoWindow {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100px;
  &.ed {
    left: -60px;
  }
}

.comBg {
  width: 100px;
  height: 107px;
  flex-shrink: 0;
  pointer-events: none;
}
.comName {
  position: absolute;
  top: 11px;
  white-space: nowrap;
  color: rgb(255, 255, 255);
  font-size: 14px;
  text-shadow: none;
}
</style>