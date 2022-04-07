<template>
  <Module class="flex-grow" style="height: 33%" :loading="loading" :error="error">
    <template #title>门架数据上传状态</template>
    <template v-if="!loading">
      <div class="right-top w-full">
        <ul class="right-top__list w-full">
          <li class="right-top__list-title">
            <div>序号</div>
            <div>门架</div>
            <div>状态</div>
          </li>
          <li v-for="(item,index) in uploadStatusList" :key="item.routeId" class="right-top__list-item">
            <div>
              {{ index+1 }}
            </div>
            <div>
              {{ item.gantryName }}
            </div>
            <div class="flex items-center justify-center">
              <div class="icon-box mr-2">
                <img :src="item.uploadStatus === '正常' ? icons.normal : icons.warning" />
              </div>
              {{ item.uploadStatus }}
            </div>
          </li>
        </ul>
      </div>
    </template>
  </Module>
</template>
<script>
import normal from '@/assets/images/chargeManage/status_normal.png';
import warning from '@/assets/images/chargeManage/status_warning.png';
import { getGantryStatus } from '@/api/tollManage.js';
export default {
  data() {
    return {
      ectOpts: {},
      error: '',
      loading: false,
      latest: true,
      uploadStatusList: [],
      icons: { normal, warning },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData() {
      let { msgContent } = await getGantryStatus('', '');
      this.uploadStatusList = msgContent;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~/styles/viewport-convert.scss';
ul,
li {
  list-style: none;
}
.right-top__list {
  .right-top__list-title,
  .right-top__list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: 'SourceHanSansCN';
    font-weight: 400;

    height: vh(25);
    line-height: vh(25);

    text-align: center;
    & > div:nth-child(1) {
      width: 15%;
    }
    & > div:nth-child(2) {
      width: 50%;
    }
    & > div:nth-child(3) {
      width: 25%;
    }
  }
  .right-top__list-title {
    background: rgba(0, 132, 251, 0.2);
    border: 1px solid rgba(0, 0, 0, 0.4);

    font-size: vw(11);
    font-weight: 400;
    color: #badeff;
  }
  .right-top__list-item {
    position: relative;

    color: rgba(101, 161, 214, 1);
    font-size: vw(10);

    & > div:nth-child(1) {
      color: rgba(186, 222, 255, 1);
    }
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: rgba(0, 132, 251, 0.2);
    }
  }
  .icon-box {
    width: vh(12);
    height: vh(12);
  }
}
</style>
