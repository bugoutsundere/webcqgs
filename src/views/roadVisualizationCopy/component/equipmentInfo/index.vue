<template>
  <div class="equipmentInfo">
    <Module style="width: 300px">
      <template #title>门架(月)</template>
      <div class="modelcont">
        <div class="bsi-inner">
          <div class="value1">{{ formatMoney(dataset.gateAmount) || '-' }}</div>
          <div class="unit1">金额（元）</div>
        </div>
        <div class="bsi-inner">
          <div class="value1">{{ dataset.gateCount || '-' }}</div>
          <div class="unit1">车流量（万）</div>
        </div>
      </div>
    </Module>
    <Module style="width: 450px">
      <template #title>收费站(月)</template>
      <div class="modelcont">
        <div class="bsi-inner">
          <div class="value">{{ formatMoney(dataset.stationAmount) || '-' }}</div>
          <div class="unit">出口金额（元）</div>
        </div>
        <div class="bsi-inner">
          <div class="value">{{ dataset.entryCount || '-' }}</div>
          <div class="unit">入口车流量（辆）</div>
        </div>
        <div class="bsi-inner">
          <div class="value">{{ dataset.exitCount || '-' }}</div>
          <div class="unit">出口车流量（辆）</div>
        </div>
      </div>
    </Module>
    <!-- <Module :config="protalConfig" :data="dataset"></Module>
    <Module :config="tollStationConfig" :data="dataset"></Module> -->
  </div>
</template>
<script lang="jsx">
import Module from './component/module.vue'
import { getChargeBoard } from "@/api/operation";
import { formatMoney } from '@/utils/util.ts'
export default {
  components: { Module },
  data() {
    return {
      dataset: {},
      protalConfig: {
        title: '门架（月）',
        content: [
          {
            code: 'gateAmount',
            name: '金额（元）',
          },
          {
            code: 'gateCount',
            name: '车流量（万）',
          }
        ]
      },
      tollStationConfig: {
        title: '收费站（月）',
        content: [
          {
            code: 'stationAmount',
            name: '出口金额（元）',
          },
          {
            code: 'entryCount',
            name: '入口车流量（辆）',
          },
          {
            code: 'exitCount',
            name: '出口车流量（辆）',
          },
        ]
      }
    }
  },
  computed: {
    // formate() {
    //   return (val, code) => {
    //     if (!val) {
    //       return '-'
    //     }
    //     if (code === 'gateAmount') {
    //       return val / (10 * 10)
    //     } else {
    //       return val
    //     }
    //   }
    // }
  },
  mounted() {
    // this.dataset = {
    //   diseaseDoneCount: 0,
    //   diseaseExistCount: 0,
    //   diseaseRepairCount: 0,
    //   elecExistCount: 0,
    //   elecFaultCount: 0,
    //   elecRepairCount: 0,
    //   entryCount: 33558,
    //   exitCount: 33488,
    //   gateAmount: "102142952.0000",
    //   gateCount: 82039,
    //   stationAmount: "1563355.7000"
    // }
    this.getData()
  },
  methods: {
    formatMoney(val){
      return formatMoney(val);
    },
    async getData() {
      const date = new Date().toLocaleDateString();
      const ndate = date.replace(/\//g, "-");
      const res = await getChargeBoard(ndate);
      if(res.success && res.data) {
        console.log('啦啦啦啦');
        this.dataset = res.data
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.equipmentInfo {
  display: flex;
  position: absolute;
  top: 50px;
  left: 500px;
}
.modelcont {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.value {
  font-size: 30px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  text-shadow: 2px 2px 15px rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
  letter-spacing: 1px;
}
.value1 {
  font-size: 30px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  color: #00ccff;
  text-shadow: 2px 2px 15px rgba(0, 204, 255, 0.7);
  margin-bottom: 5px;
  letter-spacing: 1px;
}
.unit {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  width: 120px;
  height: 15px;
  line-height: 15px;
  margin: auto;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(0, 134, 255, 1),
    transparent
  );
  font-style: oblique;
}
.unit1 {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  width: 110px;
  height: 18px;
  line-height: 18px;
  margin: auto;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(
    to right,
    rgba(0, 210, 255, 1),
    rgba(0, 84, 255, 1)
  );
  font-style: oblique;
}
</style>
