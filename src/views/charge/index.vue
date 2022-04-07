<template>
  <div
    class="w-full h-full flex bussinessbg">
    <div
      class="flex flex-col flex-shrink-0"
      :style="{ width: '460px' }">
      <WayFilter />
      <CurrentTollRanking
        :currentDayTollData="currentDayTollData" />
      <CurrentDayTollCompare
        :currentDayTollData="currentDayTollData" />
      <CurrentMonthTollCompare
        :currentMonthChartData="currentMonthChartData" />
    </div>
    <div
      class="flex flex-col relative"
      :style="{ width: 'calc(100% - 920px)' }">
      <div class="h-3/4">
        <map-view>
          <template #box>
            <map-left-list
              :stationEuYearData="stationEuYearData" />
          </template>
          <base-info
            :stationEuYearData="stationEuYearData" />
        </map-view>
      </div>
      <div
        class="flex flex-grow overflow-hidden h-1/4">
        <MapBottomList />
      </div>
    </div>
    <div class="flex flex-col"
      :style="{ width: '460px' }">
      <GantryDataUploadStatus />
      <CurrentDayPayMCompare />
      <CurrentMonthTollRoundCompare
        :MonthCompareChartData="MonthCompareChartData" />
    </div>
  </div>
</template>
<script>
// 过滤
import WayFilter from './component/WarFilter.vue';
// 当日通行费排名
import CurrentTollRanking from './component/CurrentDayTollRanking.vue';
// 当日路段通行量对比（辆）
import CurrentDayTollCompare from './component/CurrentDayTollCompare.vue';
// 月通行量对比
import CurrentMonthTollCompare from './component/CurrentMonthTollCompare.vue';
// 门架数据上传状态
import GantryDataUploadStatus from './component/GantryDataUploadStatus.vue';
// 当日支付方式通行量对比
import CurrentDayPayMCompare from './component/CurrentDayPayMCompare.vue';
// 月通行量环比
import CurrentMonthTollRoundCompare from './component/CurrentMonthTollRoundCompare.vue';
// import MapView from "./component/MapView.vue";
import MapView from '@/components/MapView.vue';
import BaseInfo from './component/BaseInfo.vue';
import MapBottomList from './component/MapBottomList.vue';
import MapLeftList from './component/MapLeftList.vue';
import * as tollApi from '@/api/tollManage.js';
import * as util from '@/utils/util';
export default {
  components: {
    WayFilter,
    CurrentTollRanking,
    CurrentDayTollCompare,
    CurrentMonthTollCompare,
    GantryDataUploadStatus,
    CurrentDayPayMCompare,
    CurrentMonthTollRoundCompare,
    MapView,
    BaseInfo,
    MapBottomList,
    MapLeftList,
  },
  data() {
    return {
      currentDayTollInitData: [], // 当日通行费数据
      currentMonthTollData: [], // 当月通行费数据
      lastMonthTollData: [], // 上月通行费数据
      lastYearMonthData: [], // 去年的这个月通行费数据
      currentMonthChartData: {}, // 月通行量对比echart数据（今年，去年）
      MonthCompareChartData: {}, // 月通行量环比echart数据 （今月，去月）
      stationEuYearData: [], // 年-通行费集合数据
    };
  },
  created() {
    this.initAllData();
  },
  computed: {
    // 当日通行数据处理
    currentDayTollData() {
      let currentDayTollData = [];
      // 降序排序数据
      this.currentDayTollInitData.sort(this.compare('feeSum'));
      this.currentDayTollInitData.forEach((item, index) => {
        let feeSum = util.formatThousandMoney(item.feeSum);
        let ranking = index + 1;
        let { sectionName, flowCount } = item;
        currentDayTollData.push({ ranking, sectionName, feeSum, flowCount });
      });
      return currentDayTollData;
    },
  },
  methods: {
    initAllData() {
      this.getToDayTollData();
      this.getAllMonthTollData();
      this.getStationEuYear();
    },
    // 获取当日通行数据
    async getToDayTollData() {
      let orgCode = '';
      let startDate = util.formatDate(this.getDay(-1), 'yyyyMMdd');
      let endDate = util.formatDate(this.getDay(0), 'yyyyMMdd');
      let { msgContent } = await tollApi.getDaySectionToll(orgCode, startDate, endDate);
      this.currentDayTollInitData = msgContent;
    },
    /** 获取当月通行数据
     * @param {string} startMonth 开始月
     * @param {string} endMonth 结束月
     *  */
    async getMonthTollData(startMonth, endMonth) {
      let orgCode = '';
      let sectionCode = '';
      let { msgContent } = await tollApi.getMonthSectionToll(
        orgCode,
        sectionCode,
        startMonth,
        endMonth
      );
      return msgContent;
    },
    // 获取所有需要的月份通行量数据
    async getAllMonthTollData() {
      let nowTime = new Date();
      // 上一个月(Date格式)
      let lastMonthDate = this.getLastMonth(new Date());
      let currentMonth = util.formatDate(nowTime, 'yyyyMM');
      let lastMonth = util.formatDate(lastMonthDate, 'yyyyMM');
      let lastTwoMonth = util.formatDate(this.getLastMonth(lastMonthDate), 'yyyyMM');
      let lastYearMonth = util.formatDate(
        new Date(`${nowTime.getFullYear() - 1}-${nowTime.getMonth() + 1}`),
        'yyyyMM'
      );
      let lastYearLastMonth = util.formatDate(
        new Date(`${lastMonthDate.getFullYear() - 1}-${lastMonthDate.getMonth() + 1}`),
        'yyyyMM'
      );
      // 本月通行费数据
      this.currentMonthTollData = await this.getMonthTollData(lastMonth, currentMonth);
      // 上月通行费数据
      this.lastMonthTollData = await this.getMonthTollData(lastTwoMonth, lastMonth);
      // 去年今月通行费数据
      this.lastYearMonthData = await this.getMonthTollData(lastYearLastMonth, lastYearMonth);
      this.currentMonthChartData = {
        本年: this.currentMonthTollData,
        去年: this.lastYearMonthData,
      };
      this.MonthCompareChartData = {
        本月: this.currentMonthTollData,
        上月: this.lastMonthTollData,
      };
    },
    // 获取集团-年份数据
    async getStationEuYear() {
      let thisYear = new Date().getFullYear();
      let { msgContent } = await tollApi.getYearCliqueToll(thisYear - 1, thisYear);
      this.stationEuYearData = msgContent && msgContent[0];
    },
    /** 将数组内的某个属性的值降序排序
     * @param {string} properties 属性名
     *  */
    compare(properties) {
      return function (m, n) {
        var a = m[properties];
        var b = n[properties];
        return b - a; //降序
      };
    },
    /** 获取日期（跟据当天计算）
     * @param {number} num 正数表示当天的后几天;负数表示当天的前几天
     *  */
    getDay(num) {
      var date = new Date();
      var nowTime = date.getTime();
      var ms = 24 * 3600 * 1000 * num;
      date.setTime(parseInt(nowTime + ms));
      return date;
    },
    /** 获取指定日期上一个月
     * @param {string} date 指定日期
     *  */
    getLastMonth(selectDate) {
      let date = new Date(selectDate);
      var year = date.getFullYear(); //当前年：四位数字
      var month = date.getMonth(); //当前月：0-11

      if (month == 0) {
        //如果是0，则说明是1月份，上一个月就是去年的12月
        year -= 1;
        month = 12;
      }

      month = month < 10 ? '0' + month : month; //月份格式化：月份小于10则追加个0

      let lastYearMonth = new Date(year + '-' + month);

      return lastYearMonth;
    },
  },
};
</script>
<style lang="scss" scoped>
.bussinessbg {
  background: url('@/assets/images/app-bg.jpg');
  background-size: 100% 100%;
  padding-top: 50px;
}
</style>
