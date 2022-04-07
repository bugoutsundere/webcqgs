<template>
  <Module class="flex-grow" :loading="loading" :error="error" style="height: 33%">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>当日通行费/量排名</template>
    <template v-if="!loading">
      <div class="toll-ranking w-full">
        <header class="toll-ranking__title flex justify-between items-center">
          <div>排名</div>
          <div>收费站/路段</div>
          <div>金额(万元)</div>
          <div>数量(辆)</div>
        </header>
        <main class="overflow-hidden">
          <ul>
            <li
              v-for="(item, index) in currentDayTollData"
              :key="index"
              class="toll-ranking__main-list-item flex justify-between items-center"
            >
              <div>
                {{ item.ranking }}
              </div>
              <div>
                {{ item.sectionName }}
              </div>
              <div>
                {{ item.feeSum }}
              </div>
              <div>
                {{ item.flowCount }}
              </div>
            </li>
          </ul>
        </main>
      </div>
    </template>
  </Module>
</template>
<script>
export default {
  props: {
    currentDayTollData: {
      Type: String,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false
    };
  },
  created() {
    // this.getData();
  },
  methods: {
    compare(properties) {
      return function (m, n) {
        var a = m[properties];
        var b = n[properties];
        return b - a; //降序
      };
    },
    async getData() {
      // this.tollRankingData =  [
      //   { ranking: 1, road: "永沪路", money: "15.23", number: 15630 },
      //   { ranking: 2, road: "石黔路", money: "14.20", number: 14263 },
      //   { ranking: 3, road: "合安路", money: "14.12", number: 14130 },
      //   { ranking: 4, road: "渝遂路", money: "13.58", number: 10236 },
      //   { ranking: 5, road: "秀松路", money: "12.36", number: 10156 },
      //   { ranking: 6, road: "潼荣路", money: "11.25", number: 10023 },
      // ];
    }
  }
};
</script>
<style lang="scss" scoped>
/** 上面部分类使用tailwindcss */
@import '~/styles/viewport-convert.scss';
.flex-grow {
  height: auto;
}
.toll-ranking__title,
.toll-ranking__main-list-item {
  & > div {
    overflow: hidden;
    height: vh(25);
    line-height: vh(25);

    font-family: 'SourceHanSansCN';
    text-align: center;
  }
  & > div:nth-child(1) {
    width: 15%;
  }
  & > div:nth-child(n + 2) {
    width: 25%;
  }
}
.toll-ranking__title {
  background: rgba(0, 132, 251, 0.2);
  border: 1px solid rgba(0, 0, 0, 0.4);

  font-size: vw(11);
  font-weight: 400;
  color: #badeff;
}
.toll-ranking__main-list-item {
  position: relative;

  font-size: vw(10);
  font-weight: 400;
  color: #65a1d6;
  &:nth-child(1) > div:nth-child(1),
  &:nth-child(2) > div:nth-child(1),
  &:nth-child(3) > div:nth-child(1) {
    color: rgb(187, 166, 135);
  }
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: rgba(0, 132, 251, 0.2);
  }
}
</style>
