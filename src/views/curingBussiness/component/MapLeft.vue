<template>
  <div class="macl-map-view">
    <div class="macl-box">
      <SummaryList :list="mapBoxList"></SummaryList>
    </div>
  </div>
</template>

<script>
import { formatThousandMoney } from '@/utils/util';
import pic3 from '@/assets/images/chargeManage/traffic-flow.png';
import SummaryList from '@/components/baseModule/SummaryList.vue';
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
          icon: pic3,
          title: '管养里程',
          unit: '（km）',
          // data: formatThousandMoney(this.stationEuYearData.feeDayAvg)
        },
        {
          icon: pic3,
          title: '单公里养护成本',
          unit: '（元）',
          // data: this.stationEuYearData.flowDayAvg
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
