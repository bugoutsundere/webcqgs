<template>
  <div class="module">
      <div class="module-header">{{ config.title }}</div> 
      <div class="module-content">
        <div class="module-item" v-for="(item, index) in config.content" :key="index">
          <span>{{formate(data[item.code], item.code)}}</span>
          <span class="type">{{ item.name }}</span>
        </div>
      </div>
    </div>
</template>
<script lang="jsx">
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      default: {}
    }
  },
  computed: {
    formate() {
      return (val, code) => {
        if (!val) {
          return '-'
        }
        if (code === 'gateAmount') {
          return val / (10 * 10)
        } else {
          return val
        }
      }
    }
  },
}
</script>

<style lang="postcss" scoped>
.module {
  margin: 10px;
  background: rgba(0, 7, 28, 0.75);
  border: 1px solid;
  border-image: linear-gradient(-22deg, rgba(0, 208, 253, 0.48), rgba(7, 255, 237, 0.48)) 1 1;
}
.module-header {
  transform: skewX(-10deg);
  height: 30px;
  color: #d5fbff;
  background: linear-gradient(
    -90deg,
    rgba(0, 26, 49, 0),
    rgba(0, 211, 255, 0.1)
  );
  font-size: 12px;
  line-height: 30px;
  padding-left: 10px;
}
.module-content {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}
.module-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
  margin: 0 10px;
  & .type {
    color: #778FA4;
    font-size: 12px
  }
}
</style>