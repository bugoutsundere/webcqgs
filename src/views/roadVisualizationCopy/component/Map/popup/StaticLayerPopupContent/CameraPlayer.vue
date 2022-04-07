<template>
  <div class="frame" :class="{ loaded: !!url }">
    <div class="title">{{ data.name }} / {{ data.stakemark }}</div>
    <!-- <video
      v-show="url"
      controls
      controlslist="nodownload noremoteplayback"
      disablePictureInPicture
      ref="video"
    /> -->
    <!-- <Video ref="videoPlayer" :cameraCode="cameraCode" :width="500" :height="300"></Video> -->
    <div class="player" v-if="url">
      <videoPlayer :url="url"></videoPlayer>
    </div>
    <div v-show="!url" class="info">
      <span v-if="loading">视频加载中...</span>
      <span v-else>视频地址获取失败</span>
    </div>
  </div>
</template>

<script lang="jsx">
import flvjs from "flv.js";
import { getVideoUrl } from "@/api/operation";
import videoPlayer from "@/components/videoPlayer.vue"
export default {
  inject: ["getMap"],
  components: { videoPlayer },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      url: null,
    };
  },
  computed: {
    identityCode() {
      let code = this.data && this.data.camera_ind;
      if (code && code[0] === "'") {
        code = code.slice(1);
      }
      return code;
    },
  },
  watch: {
    identityCode: {
      immediate: true,
      handler(newVal, oldVal) {
        this.initFLVUrl(newVal);
      },
    },
  },
  mounted() {
    // this.getMap().then(map => {
    //   map.on('drag', () => {
    //     const {videoPlayer} = this.$refs
    //     if (!videoPlayer) {
    //       return
    //     }
    //     videoPlayer.resizeWindow()
    //   })
    // })
  },
  methods: {
    async initFLVUrl(deviceCode) {
      console.log('摄像头idaaaaaaaaa');
      console.log(deviceCode);
      deviceCode = deviceCode || (this.data && this.data.camera_ind);
      if (!deviceCode) {
        this.url = null;
        return;
      }
      this.loading = true;
      const res = await getVideoUrl(deviceCode);
      this.loading = false;
      if (res && res.success && res.data) {
        this.url = res.data;
      } else {
        this.url = null
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.frame {
  position: relative;
  width: 500px;
  height: 280px;
  overflow: hidden;
  margin: 06px;
  video {
    position: relative;
    width: 100%;
    height: 100%;
  }
  &.loaded {
    width: 640px;
    height: 360px;
  }
  &:hover {
    .title {
      visibility: visible;
    }
  }
  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .title {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    padding: 5px;
    font-size: 16px;
    color: #fff;
    background: rgba(0, 0, 0, 0.8);
    visibility: hidden;
  }
  .player {
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
