<template>
  <!-- 包裹元素 -->
  <div class="tooltip">
    <!-- <el-tooltip :hide-after="9999999" class="tooltip" placement="top">
      <template #content>el-butdd</template>
      <el-button type="primary"> Top center</el-button>
    </el-tooltip> -->
    <div ref="popup" class="popup">
      <div class="popup-dialog">
        <ul class="popup-dialog__list list-none">
          <li
            v-for="(item, index) in popupData"
            :key="index"
            class="popup-dialog__list-item"
          >
            <div class="list-item-name">{{ item.key }}:</div>
            <div class="list-item-value">
              {{ item.value }}
            </div>
          </li>
        </ul>
      </div>
      <div class="popup-dialog__arrow"></div>
    </div>
    <!-- 插入需要弹窗的内容 -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    popupData: {
      Type: Array,
      default() {
        return [
          { key: '隧道编号', value: 'S70000000U001' },
          { key: '隧道名称', value: '卫星湖隧道' },
          { key: '所属路段', value: '永沪高速' },
          { key: '管养单位', value: '永泸公司' },
          { key: '隧道类型', value: '特长隧道' },
          { key: '隧道等级', value: '一级隧道' },
          { key: '隧道方向', value: '下行方向' },
          { key: '建成年份', value: '2020-12-30' },
          { key: '隧道长度', value: '3267米' },
          { key: '隧道宽度', value: '8.65米' },
          { key: '隧道高度', value: '7.15米' },
          { key: '洞身材料', value: '连续配筋混凝土' },
        ];
      },
    },
  },

  data() {
    return {
      isShowPopup: true
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
@import "~/styles/viewport-convert.scss";
// 箭头下标宽高
$arrowW: vw(15);
$arrowH: vw(15);
// 边框渐变色 起点
// $borderColorS: rgba(255, 230, 172, 0.75);
$borderColorS: rgba(255, 176, 74, 0.75);
// 边框宽度
$borderWidth: 1px;
// 圆角角度
$borderDeg: vw(15);
// 弹出框内背景
$contentBg: rgba(39, 34, 26, 0.7);
.popup {
  z-index: 2007;
  position: absolute;
  inset: 0px auto auto 0px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0px;
}
.popup-dialog {
  // background-image: linear-gradient(90deg, $borderColorS, $borderColorE);
  border-radius: $borderDeg;
  border: $borderColorS $borderWidth solid;
  border-bottom: initial;
  background-color: $contentBg;
  // border-image: linear-gradient(90deg, $borderColorS, $borderColorE) 1;
  // // 剪裁圆角边框（边框渐变和边框圆角有冲突）
  // clip-path: inset(0 round $borderDeg);
  position: relative;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: calc(50% - vw(1));
    height: calc(100% - 1px);
    border-bottom: $borderColorS $borderWidth solid;
    border-bottom-left-radius: $borderDeg;
  }
  &:before {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(50% - $arrowW - vw(1));
    height: calc(100% - 1px);
    border-bottom: $borderColorS $borderWidth solid;
    border-bottom-right-radius: $borderDeg;
  }
  .popup-dialog__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: vw(10);
  }
  .popup-dialog__list-item {
    display: flex;
    align-items: center;

    height: vh(20);
    margin: vh(4) vw(10);
    font-size: vw(12);
    .list-item-name {
      margin-right: 5px;
      color: rgba(255, 247, 229, 1);
    }
    .list-item-value {
      color: rgba(255, 255, 255, 1);
    }
  }
}
.popup-dialog__arrow,
.popup-dialog__arrow::before,
.popup-dialog__arrow::after {
  position: absolute;
  width: $arrowW;
  height: $arrowW;
  z-index: -1;
}
.popup-dialog__arrow {
  bottom: vw(-14);
  left: 50%;
  transform: translate(0, -50%);
  &:before {
    content: "";
    right: 0;
    // 旋转盒子并设置背景
    transform: rotate(45deg);
    border-top: transparent $arrowW/2 solid;
    border-left: transparent $arrowW/2 solid;
    border-right: $contentBg $arrowW/2 solid;
    border-bottom: $contentBg $arrowW/2 solid;
    box-sizing: border-box;
  }
  &:after {
    content: "";
    right: 0;
    transform: rotate(45deg);
    border-right: $borderColorS $borderWidth solid;
    border-bottom: $borderColorS $borderWidth solid;
  }
}
</style>
<style>
@keyframes clippath {
  0%,
  100% {
    clip-path: inset(0 0 95% 0);
  }

  25% {
    clip-path: inset(0 95% 0 0);
  }
  50% {
    clip-path: inset(95% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 95%);
  }
}
</style>