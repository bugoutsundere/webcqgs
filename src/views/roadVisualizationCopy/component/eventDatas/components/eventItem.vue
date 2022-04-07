<template>
  <div class="event-item">
    <!-- <div class="idx">{{ idx }}</div> -->
    <div class="content">
      <div class="top">
        <!-- <div class="title">{{ data.name }}</div> -->
        <div class="info">{{ data.sectionName }}</div>
        <div class="info2">{{ data.nstatus }}</div>
      </div>
      <div class="botm">
        <div class="info3">{{ data.smemo }}</div>
        <div class="info4">
          {{ data.ddatetime.substring(0,4)+'-'+data.ddatetime.substring(4,6)+'-'+data.ddatetime.substring(6,8)+' '+data.ddatetime.substring(8,10)+':'+data.ddatetime.substring(10,12)+':'+data.ddatetime.substring(12,14) }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="jsx">
export default {
  props: {
    idx: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  }
}
</script>
<style lang="postcss" scoped>
.event-item {
  display: flex;
  /* margin: 40px 8px;
  padding-bottom: 10px; */
  margin-top: 15px;
  background: rgba(0, 37, 76, 0.7);
  border: 1px solid #0d4686;
  box-shadow: 0 0 10px 1px #0d4686 inset;
  border-radius: 4px;
  /* overflow: hidden; */
  box-sizing: border-box;
  & .idx {
    width: 16px;
    height: 16px;
    background: linear-gradient(180deg, #1ec6b5 0%, #8ce2db 99%);
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
  }
  & .content {
    width: 100%;
    padding: 12px 10px;
    & .top {
      display: flex;
      justify-content: space-between;
    }
    & .botm {
      display: flex;
      justify-content: space-between;
      margin-top: 15px;
    }
    & .info {
      font-size: 13px;
    }
    & .info2 {
      width: 70px;
      height: 22px;
      font-size: 12px;
      text-align: center;
      line-height: 22px;
      color: #f5f5f5;
      background: url('@/assets/images/roadVisualization/clz-icon.png');
      background-size: 100% 100%;
    }
    & .info3 {
      font-size: 12px;
      color: #6483a3;
      width: 150px;
      /* overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis; */
    }
    /* & .info3:hover {
      text-overflow: inherit;
      overflow: visible;
      white-space: pre-line;
    } */
    & .info4 {
      font-size: 11px;
      color: #f5f5f5;
    }
  }
}
</style>