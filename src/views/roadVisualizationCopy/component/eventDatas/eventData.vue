<template>
  <div class="event-data">
    <Module :loading="loading" :error="error" :info="bsMeta && bsMeta['utilities']">
      <template #title>事件数据</template>
      <div class="container">
        <eventItem eventItem v-for="(item, index) in event" :key="index" :data="item" :idx="index + 1"></eventItem>
      </div>
      {{now}}
    </Module>
  </div>
</template>
<script lang="jsx">
import mapModule from '@/components/map-module/index.vue'
import eventItem from './components/eventItem.vue'
import { getEventData } from '@/api/roadVisualizationCopy.js'
export default {
  components: { mapModule, eventItem },
  data() {
    return {
      eventList: []
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let { msgContent } = await getEventData();
      this.eventList = msgContent;
    }
  },
  computed: {
    event: function () {
      this.eventList.forEach((i) => {
        if (i.nstatus === 0) {
          i.nstatus= '未处理';
        }
         if (i.nstatus === 1) {
           i.nstatus= '处理中';
        } else {
          i.nstatus= '已处理';
        }
      })
      return this.eventList;
    }
  }
}
  
</script>
<style lang="postcss" scoped>
.event-data {
  flex: 1;
  & .container {
    width: 100%;
    overflow: auto;
  }
}
</style>