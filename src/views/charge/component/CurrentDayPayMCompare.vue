<template>
  <Module class="flex-grow" style="height: 33%" :loading="loading" :error="error">
    <!-- :info="bsMeta && bsMeta['emplRate']" -->
    <template #title>当日支付方式通行量对比</template>
    <template v-if="!loading">
      <Ect :options="ectOpts" />
    </template>
  </Module>
</template>
<script>
import { getSummarypaytype } from '@/api/tollManage.js';
export default {
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false,
      latest: true,
      data: [],
    };
  },
  computed: {
    // total() {
    //   let total = this.data.reduce((item1, item2) => {
    //     return (typeof item1 === "number" ? item1 : item1.num) + item2.num;
    //   });
    //   return total;
    // },
  },
  created() {
    this.getData();
  },
  mounted() {
    // this.initEchart();
  },
  methods: {
    initEchart() {
      // this.data = [
      //   { name: "钱包支付", num: 13210 },
      //   { name: "现金支付", num: 42111 },
      //   { name: "记账支付", num: 81711 },
      //   { name: "移动支付", num: 121700 },
      // ];
      // this.data.forEach((item) => {
      //   item.percent = ((item.num / this.total) * 100).toFixed(1);
      // });
      let color = [
        'rgba(255, 135, 0, 1)',
        'rgba(255, 195, 0, 1)',
        'rgba(0, 228, 115, 1)',
        'rgba(0, 157, 255, 1)',
      ].reverse();
      let pieSeries = [];
      let lineYAxis = [];
      this.data.forEach((item, index) => {
        let iname = item.name;
        let inum = item.num;
        pieSeries.push({
          name: iname,
          type: 'pie',
          radius: [65 - 15 * index + '%', 57 - 15 * index + '%'],
          // 关闭悬停动画
          hoverAnimation: false,
          // 是否顺时针旋转
          clockwise: false,
          center: ['35%', '50%'],
          label: {
            show: false,
          },
          data: [
            {
              // 只设置3/4的值，以用于3/4环形图
              value: inum * 0.75,
              name: iname,
              tooltip: {
                formatter: (item) => {
                  return `<div style="display:flex;font-size:12px;">
                        <div style="color:${item.color};margin-right:10px;">●</div>
                        <div>
                          <div>${item.seriesName}：${item.value} 辆</div>
                          <div>占比：${(item.percent / 0.75).toFixed(1) + '%'}</div>
                        </div>
                      </div>
                      `;
                },
              },
            },
            {
              // 这里的值+上面的值为总和，但是只占比75%
              value: (this.total - inum) * 0.75,
              itemStyle: {
                color: 'rgba(0, 132, 251, 0.2)',
              },
              tooltip: {
                show: false,
              },
            },
            {
              // 弃用25%的环形图不做显示
              value: this.total * 0.25,
              itemStyle: {
                color: 'rgba(0,0,0,0)',
              },
              tooltip: {
                show: false,
              },
            },
          ],
        });
        lineYAxis.push({
          value: index,
          textStyle: {
            rich: {
              circle: {
                color: color[index],
                padding: [0, 5],
              },
            },
          },
        });
      });
      this.ectOpts = {
        tooltip: {
          trigger: 'item',
        },
        color,
        grid: {
          top: '15%',
          bottom: '54%',
          left: '35%',
          containLabel: false,
        },
        // 有yAxis必须有xAxis
        xAxis: [{ show: false }],
        yAxis: [
          {
            type: 'category',
            // 反向坐标轴
            inverse: true,
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              formatter: (params) => {
                let item = this.data[params];
                return `{line|----------}{circle|●}{name|${item.name}：}{value|${item.num}辆，}{percent|占${item.percent}%}`;
              },
              interval: 0,
              inside: true,
              rich: {
                line: {
                  // width: 50,
                  // height: 1,
                  color: 'rgba(236, 236, 236, 1)',
                  // 当前echart版本不支持borderType用------代替
                  // borderType: "dashed",
                  // borderColor: "#D9DFEB",
                  // borderWidth: 1,
                },
              },
              textStyle: {
                color: '#fff',
                fontSize: 12,
              },
              show: true,
            },
            data: lineYAxis,
          },
        ],
        series: pieSeries,
      };
    },
    total(data) {
      let num = 0;
      data.map((item) => {
        num += Number.parseInt(item.count);
      });
      this.total = num;
      return num;
    },
    getData() {
      let arr = [];
      let _that = this;
      getSummarypaytype().then((res) => {
        const total = this.total(res.msgContent);
        res.msgContent.forEach((ele) => {
          arr.push({
            name: ele.category,
            num: Number.parseInt(ele.count),
            percent: ((ele.count / total) * 100).toFixed(1),
          });
        });
        _that.data = arr;
        _that.initEchart();
      });
    },
  },
};
</script>
