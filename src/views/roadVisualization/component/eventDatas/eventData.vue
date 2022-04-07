<template>
  <div class="event-data">
    <mapModule title="事件数据" style="height: 100%">
      <div class="container">
        <eventItem
          eventItem
          v-for="(item, index) in eventList"
          :key="index"
          :data="item"
          :idx="index + 1"
        ></eventItem>
      </div>
    </mapModule>
  </div>
</template>
<script lang="jsx">
import mapModule from '@/components/map-module/index.vue'
import eventItem from './components/eventItem.vue'
export default {
  components: { mapModule, eventItem },
  data() {
    return {
      eventList: [
        {
          name: '交通事故',
          road: 'G93遂渝高速',
          direction: '铜梁站发生交通事故',
          time: '2021-12-11 13:43:09',
          status: '已处理'
        },
        {
          name: '道路施工',
          road: 'S55潼荣高速',
          direction: 'K70+600道路维护施工',
          time: '2021-12-10 15:12:03',
          status: '已处理'
        },
        {
          name: '路面状况',
          road: 'S63秀松高速',
          direction: 'K7+800货车泥沙撒漏',
          time: '2021-12-09 14:21:15',
          status: '已处理'
        },
          {
          name: '收费事件',
          road: 'S75永泸高速',
          direction: 'ETC故障车量拥堵',
          time: '2021-10-06 13:43:09',
          status: '已处理'
        },
        {
          name: '交通管制',
          road: 'S9合安高速',
          direction: '国庆车流量临时管制',
          time: '2021-10-01 09:00:02',
          status: '已处理'
        },
        {
          name: '车辆故障',
          road: 'G5515石黔高速',
          direction: '车辆故障占用应急车道',
          time: '2021-10-01 06:12:16',
          status: '已处理'
        }
      ]
    }
  }
}
  
</script>
<style lang="postcss" scoped>
.event-data {
  flex: 1;
  & .container {
    width: 100%;
    position: absolute;
    top: 34px;
    bottom: 0;
    overflow: auto;
  }
}
</style>