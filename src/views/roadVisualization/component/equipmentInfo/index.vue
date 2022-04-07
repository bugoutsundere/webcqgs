<template>
  <div class="equipmentInfo">
    <Module :config="protalConfig" :data="dataset"></Module>
    <Module :config="tollStationConfig" :data="dataset"></Module>
  </div>
</template>
<script lang="jsx">
import Module from './component/module.vue'
import { getChargeBoard } from "@/api/operation";
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
  mounted() {
    this.getData()
  },
  methods: {
    async getData() {
      const date = new Date().toLocaleDateString();
      const ndate = date.replace(/\//g, "-");
      const res = await getChargeBoard(ndate);
      if(res.success && res.data) {
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
  top: 0;
  right: 349px;
}
</style>