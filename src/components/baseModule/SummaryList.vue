<template>
  <ul>
    <li
      v-for="(item, index) in list"
      :key="index"
      class="flex items-center mb-6"
    >
      <div class="icon">
        <img :src="item.icon" draggable="false" />
      </div>
      <div>
        <header class="title">
          <div>
            {{ item.title }}
          </div>
          <div class="unit">
            {{ item.unit }}
          </div>
        </header>
        <footer class="data">
          {{ item.data }}
        </footer>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    // 格式:[{icon:string,title:string,unit:string,data:string}]
    list: {
      Type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '~/styles/viewport-convert.scss';
ul{
  .icon {
    width: vh(38);
    height: vh(38);

    margin-right: vw(14);
  }
  .title {
    display: flex;
    // overflow: hidden;
    height: vh(13);
    line-height: vh(13);
    margin-bottom: vh(10);

    font-size: vh(12);
    font-family: 'SourceHanSansCN';
    font-weight: 400;
    color: #ffffff;
  }
  .unit {
    color: rgba(1, 133, 248, 1);
  }
  .data {
    height: vh(18);
    // overflow: hidden;

    font-size: vh(24);
    font-family: 'SourceHanSansCN';
    font-weight: 500;
    color: #0185f8;
    line-height: vh(18);
  }
}
</style>
