<template>
  <!-- <div class="module">
      <div class="module-header">{{ config.title }}</div> 
      <div class="module-content">
        <div class="module-item" v-for="(item, index) in config.content" :key="index">
          <span>{{formate(data[item.code], item.code)}}</span>
          <span class="type">{{ item.name }}</span>
        </div>
      </div>
  </div> -->
  <div class="module-box">
    <div class="module">
      <div class="module-title">
        <div class="module-title-icon"></div>
        <div class="module-title-text">
          <slot name="title" />
        </div>
      </div>
      <div class="module-content">
        <slot />
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
.module-box {
  padding: 0.8rem;
}
.module-title {
  display: flex;
  align-items: center;
}
.module-title-icon {
  width: 11px;
  height: 11px;
  background: url("@/assets/images/module-header-icon4.png");
  background-size: 100% 100%;
  margin-right: 5px;
}
.module-content {
  padding: 10px;
}
</style>