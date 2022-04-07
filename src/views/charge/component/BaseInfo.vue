<template>
  <div
    class="baseinfo-box z-50 flex justify-center items-center">
    <div class="prefix-text">
      清分收入</div>
    <div
      class="num-list ml-8 mr-2">
      <ul
        class="flex just-center items-center">
        <li
          v-for="(item, key) in feeMoneyArr"
          :key="key"
          class="num-list-item">
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="suffix-text">
      <header>万元</header>
      <footer class="date">
        01月01日-{{nowDate}}
      </footer>
    </div>
  </div>
</template>

<script>
import { formatThousandMoney, formatDate } from '@/utils/util';
export default {
  props: {
    stationEuYearData: {
      Type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      nowDate: formatDate(new Date(), 'MM月dd日'),
    };
  },
  computed: {
    feeMoneyArr() {
      let feeMoney = formatThousandMoney(this.stationEuYearData.feeSum, 0);
      let moneyArr = ['￥', ...feeMoney];
      return moneyArr;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import '~/styles/viewport-convert.scss';
.baseinfo-box {
  overflow: hidden;

  // width: 100%;
  height: vh(108);
  // margin: vh(5) vw(50);
  background: url('~/assets/images/chargeManage/center-top.png') no-repeat center/ 100% 100%;
}
.prefix-text {
  font-size: vw(30);
  font-family: 'YouSheBiaoTiHei' !important;
  font-weight: 400;
  color: #ffffff;
}
ul,
li {
  list-style: none;
}
.num-list-item {
  width: vh(55);
  height: vh(55);
  background: rgba(0, 222, 255, 0);

  border: rgba(5, 41, 74) 2px solid;
  box-shadow: 0px 2px 5px 0px #6f8ced, 0px 0px 5px 0px #6f8ced;
  border-radius: 5px;
  margin-right: 20px;

  font-size: vw(40);
  font-family: 'YouSheBiaoTiHei' !important;
  font-weight: 400;
  color: #ffffff;

  line-height: vh(55);
  text-align: center;
}
.suffix-text {
  font-family: 'SourceHanSansCN';
  font-weight: 400;
  color: #65a1d6;
  header {
    font-size: vw(15);
  }
  footer {
    font-size: vw(12);
  }
}
</style>
