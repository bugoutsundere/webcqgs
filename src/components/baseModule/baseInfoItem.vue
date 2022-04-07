<template>
  <div class="list-item" @click="itemClick" :class="{ active: activeModule === module.code }" v-waves>
    {{data}}
    <div class="item-icon">
      <img v-if="activeModule === module.code" :src="imgList[module.code] + 'Act'" />
      <img v-else :src="imgList[module.code]" />
    </div>
    <template v-if="!childData[module.key]">
      <span class="item-title">{{ module.name }}</span>
      <span class="item-value">{{
              data1 ? (data1[module.key] || 0) : "-"
            }}</span>
    </template>
    <template v-else>
      <span class="item-title">{{ module.name }}</span>
      <span class="item-value">{{
              data ? (data[module.key] || 0) : "-"
            }}</span>
      <ul class="item-subtypes">
        <li class="item-subtype" v-for="subItem in childData[module.key]" :key="subItem.key">
          <span class="sub-name">{{ subItem.type }}</span>
          <span class="sub-point" v-if="subItem.type&&subItem.type.length < 4">
            <span v-for="i in 4" :key="i" class="in_po"></span>
          </span>
          <span class="sub-num">{{(subItem.count)}}</span>
        </li>
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
export default {
  // 取消继承到根组件Attribute
  inheritAttrs: false,
};
</script>
<script script lang="ts" setup>
import { defineProps, defineEmit, computed } from 'vue';
const props = defineProps({
  // 当前点击的模块
  activeModule: {
    type: Object,
    default() {
      return {};
    },
  },
  // 模块
  module: {
    type: Object,
    default() {
      return {};
    },
  },
  // 图片列表
  imgList: {
    type: Object,
    default() {
      return {};
    },
  },
  // 数据对象列表
  data: {
    type: Object,
    default() {
      return {};
    },
  },
  // 子项数据对象列表
  // 格式 { property: [dataArr] }
  childData: {
    type: Object,
    default() {
      return {};
    },
  },
});
const emit = defineEmit();
const itemClick = () => {
  emit('changeModule', props.module);
};
const data1 = computed(() => {
  console.log(props.data)
  return props.data;
});
</script>
<style lang="postcss" scoped>
.base-struct-list {
  @apply w-full h-full flex flex-wrap p-0.5;
}

.list-item-box {
  @apply p-0.5 w-1/3;
}

.active .item-title {
  background: linear-gradient(to right, transparent, rgba(255, 192, 0, 0.45), transparent);
  color: rgba(255, 206, 90, 1);
}
.item-title {
  font-weight: bold;
  letter-spacing: 1px;
  width: 60%;
  height: 15px;
  line-height: 15px;
  margin: auto;
  margin-top: 0;
  margin-bottom: 0.1rem;
  text-align: center;
  color: #badeff;
  font-size: 13px;
  background: linear-gradient(to right, transparent, rgba(0, 72, 137, 1), transparent);
}

.item-value {
  font-size: 20px;
}

.item-subtypes {
  @apply flex flex-col flex-shrink-0 w-full flex-grow px-6 py-1;
}

.item-subtype {
  @apply flex justify-between items-center;
}
.sub-point {
  @apply flex justify-between;
  width: 20px;
  /* width: 43px; */
}
.in_po {
  display: inline-block;
  width: 1px;
  height: 1px;
  border-radius: 1px;
  background: #00b4ff;
}
.sub-name {
  font-size: 13px;
  color: #badeff;
}

.sub-num {
  font-size: 14px;
  color: #60b3ff;
}

.icon {
  position: absolute;
  font-size: 60px;
  top: 0;
  height: 100%;
  color: rgba(255, 255, 255, 0.12);
}
.item-icon {
  width: 50px;
  height: 41px;
  /* margin: auto; */
  margin: 5px;
  /* background: red; */
}
.item-icon img {
  width: 100%;
  height: 100%;
}
</style>
