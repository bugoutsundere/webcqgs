<template>
  <div class="macl-map-view">
    <div class="macl-box">
      <SummaryList :list="mapBoxList"></SummaryList>
    </div>
  </div>
</template>

<script>
import SummaryList from '@/components/baseModule/SummaryList.vue';
import { formatThousandMoney } from '@/utils/util';
import pic1 from '@/assets/images/chargeManage/average-daily-income.png';
import pic2 from '@/assets/images/chargeManage/traffic-flow.png';
import pic3 from '@/assets/images/chargeManage/kilometer-income.png';
export default {
  components: {
    SummaryList,
  },
  props: {
    stationEuYearData: {
      Type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    mapBoxList() {
      let mapBoxList = [
        {
          icon: pic1,
          title: '日均收入',
          unit: '（万元）',
          data: formatThousandMoney(this.stationEuYearData.feeDayAvg),
        },
        {
          icon: pic2,
          title: '日均车流量',
          unit: '（辆）',
          data: this.stationEuYearData.flowDayAvg,
        },
        {
          icon: pic3,
          title: '日均每公里收入',
          unit: '（万元）',
          data: formatThousandMoney(this.stationEuYearData.feeDayKmAvg),
        },
      ];
      return mapBoxList;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/styles/viewport-convert.scss';
.macl-map-view {
  width: 100%;
  position: absolute;
  left: 1%;
  top: 0;
}
.macl-box {
  position: absolute;
  top: 3.5vh;
}
</style>
