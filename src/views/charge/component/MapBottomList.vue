<template>
  <div class="bottom-box flex justify-between items-center overflow-hidden">
    <div v-for="(item, key) in bottomList" class="item" :key="key">
      <div class="data">{{ item.data }}</div>
      <div class="describe">{{ item.describe }}</div>
    </div>
  </div>
</template>

<script>
import { getYearCliqueToll, getSummarybyvehtype } from '@/api/tollManage.js';
import * as util from '@/utils/util';
let thisYear = new Date().getFullYear();
let vehTypeToll = 0;
export default {
  data() {
    return {
      bottomList: [],
    };
  },
  mounted() {
    this.getToVehTypeData();
    this.getYearCliqueTollData();
  },
  methods: {
    async getToVehTypeData() {
      let { msgContent } = await getSummarybyvehtype('1', thisYear, '1');
      msgContent.forEach((i) => {
        vehTypeToll += i.flowCount;
      });
    },
    async getYearCliqueTollData() {
      let { msgContent } = await getYearCliqueToll(thisYear - 1, thisYear);
      msgContent.forEach((i) => {
        this.bottomList.push(
          { data: vehTypeToll, describe: '年度货车通行量' },
          { data: util.formatMoney(i.feeSum, 0), describe: '当前通行费' },
          { data: i.specialNum, describe: '当日特情车辆数' },
          { data: i.etcNum, describe: '年度ETC通行量' },
          { data: i.flowCount, describe: '年度通行量' }
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/styles/viewport-convert.scss';
.bottom-box {
  // position: absolute;
  // bottom: vh(120);
  margin: vh(5) vw(50);
  width: 100%;
  .item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    margin-right: vw(60);
    .data {
      font-size: vw(32);
      font-family: 'MyriadPro' !important;
      font-weight: 400;
      color: #ffffff;
    }
    .describe {
      position: relative;
      overflow: hidden;
      width: vw(130);
      height: vh(18);

      font-size: vw(12);
      font-family: 'YouSheBiaoTiHei' !important;
      font-weight: 400;
      color: #ecf8ff;
      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: vw(110);
        height: vh(14);
        background: linear-gradient(to right, transparent, rgba(0, 134, 255, 0.5), transparent);
      }
      text-align: center;
    }
  }
}
</style>