<template>
  <div class="event-item">
    <div class="idx">{{ idx }}</div>
    <div class="content">
      <div class="left">
        <div class="title">{{ data.name }}</div>
        <div class="info">{{ data.road }}</div>
        <div class="info">{{ data.direction }}</div>
      </div>
      <div class="right">
        <div class="status">{{ data.status }}</div>
        <div>{{ data.time }}</div>
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
  margin: 40px 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid #103f66;
  box-sizing: border-box;
  & .idx {
    width: 16px;
    height: 16px;
    background: linear-gradient(180deg, #1EC6B5 0%, #8CE2DB 99%);
    border-radius: 50%;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
  }
  & .content {
    flex: 1;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    & .title {
      color: #00E3EB;
      font-weight: 400;
      margin-bottom: 10px;
    }
    & .info {
      padding: 5px 0;
    }
    & .right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
      & .status {
        color: #D79534;
      }
    }
  }
}
</style>