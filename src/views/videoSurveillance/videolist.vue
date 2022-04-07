<template>
  <Module
    class="vio-contrl-mod"
    :loading="loading"
    :error="error"
    :info="bsMeta && bsMeta['utilities']"
  >
    <template #title>我关注的视频</template>
    <div class="videocont">
      <div
        class="gridBox"
        v-for="(item, index) in monitorList"
        :key="index"
        @click="handleShowVideo(item.cameraIndexCode, item.name)"
      >
        <img :src="imgList[index]" style="width: 100%; height: 100%" />
        <!-- <videoPlayer :url="item.url"></videoPlayer> -->
        <div class="tips">
          <span />
          <span>{{ item.name }}</span>
          <i
            class="el-icon-star-on"
            style="color: #fd9a10; font-size: 24px"
          ></i>
        </div>
      </div>
      <el-dialog :title="videoname" v-model="videoVisible" width="740px">
        <div>
          <div class="player" v-if="url">
            <videoPlayer :url="url"></videoPlayer>
          </div>
        </div>
      </el-dialog>
    </div>
  </Module>
</template>
<script lang="jsx">
import { getRoadVideoListByCode } from '@/api/operation';
import { monitors, getVideoUrl } from "@/api/operation";
import videoPlayer from "./LayerContrl/components/videoPlayer.vue";
export default {
  components: { videoPlayer },
  data() {
    return {
      pageNo: 1,
      pageSize: 8,
      url: "",
      text: "",
      monitorList: [],
      videoVisible: false,
      videoname: '',
      url: '',
      imgList: ['https://img0.baidu.com/it/u=1041184852,2616579513&fm=253&fmt=auto&app=120&f=JPEG?w=1061&h=800',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi1.go2yd.com%2Fimage.php%3Furl%3DV_0VWuhSBNEI&refer=http%3A%2F%2Fi1.go2yd.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648002529&t=af8d4e00a5c8e6063b3fe39a6ada7ea5',
      'https://img0.baidu.com/it/u=2799278549,3824009361&fm=253&fmt=auto&app=138&f=JPEG?w=934&h=457',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn10113%2F513%2Fw1920h993%2F20190218%2F71aa-htfpvyz5902402.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648002586&t=75e7a8bf0d887e0e3070ea7f9fc148e4',
      'https://img1.baidu.com/it/u=3656276616,142357800&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=375',
      'https://img0.baidu.com/it/u=3490058560,42254856&fm=26&fmt=auto',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsem.g3img.com%2Fg3img%2Fwlxasixing%2Fc2_20180621140906_27630.jpg&refer=http%3A%2F%2Fsem.g3img.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648002662&t=a25257ac5202ba87a54fc8646189d473',
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fwx3.sinaimg.cn%2Forj480%2F006CjUu5ly1gg3exe032yj30no0dck3i.jpg&refer=http%3A%2F%2Fwx3.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648002808&t=edc271b7f6de68be4cfb9cbd8d13abb6'
      ]
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    // async getData() {
    //   const params = {
    //     pageNo: 1,
    //     pageSize: 8,
    //     t: {}
    //   };
    //   console.log(await getRoadVideoListByCode(params));
    // }
     async getData() {
      const { selectedRoadRoadNo, pageNo, pageSize, text } = this;
      let params = {
        pageNo: pageNo,
        pageSize: pageSize,
        t: {
          content: text,
        },
      };
      this.loading = true;
      let res = await monitors(params);
      this.loading = false;
      if (res.searchCount && res.records) {
        this.monitorList = res.records;
      }
      this.getUrl()
    },
    async handleShowVideo(deviceCode, name) {
      this.loading = true;
      this.videoname = name;
      const res = await getVideoUrl(deviceCode);
      this.loading = false;
      if (res && res.success && res.data) {
        this.url = res.data;
      } else {
        this.url = null;
      }
      this.videoVisible = true;
    },
  }
};
</script>
<style lang="postcss" scoped>
.vio-contrl-mod {
  width: 600px;
  position: absolute;
  top: 60px;
  right: 20px;
}
.videocont {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
.gridBox {
  width: 275px;
  height: 200px;
  margin-left: 20px;
  position: relative;
  /* background: rgba(0, 0, 0, 0.3); */
  background: #05121a;
  margin-top: 20px;
}
.tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 15px 10px;
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
}
</style>
