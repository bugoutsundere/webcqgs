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
    <Video ref="videoPlayer" :cameraCode="cameraCode" :width="500" :height="300"></Video>
    <div v-show="!cameraCode" class="info">
      <span v-if="loading">视频加载中...</span>
      <span v-else>视频加载失败，请联系管理员</span>
    </div>
  </div>
</template>

<script lang="jsx">
import flvjs from "flv.js";
import { stopVideo } from "@api/iot";
import { getVideoUrl, getVideo } from "@/api/operation";
import Video from "@/components/Video/index.vue"
export default {
  inject: ["getMap"],
  components: { Video },
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
      cameraCode: ''
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
        this.stopVideo(oldVal);
        this.initFLVUrl(newVal);
      },
    },
    url(newVal) {
      this.initVideo();
    },
  },
  beforeUnmount() {
    this.stopVideo();
  },
  mounted() {
    this.getMap().then(map => {
      map.on('drag', () => {
        const {videoPlayer} = this.$refs
        if (!videoPlayer) {
          return
        }
        videoPlayer.resizeWindow()
      })
    })
  },
  methods: {
    async initFLVUrl(deviceCode) {
      deviceCode = deviceCode || (this.data && this.data.camera_ind);
      if (!deviceCode) {
        this.url = null;
        return;
      }
      this.cameraCode = deviceCode
      // this.loading = true;
      // console.log(deviceCode)
      // const res = await getVideoUrl(deviceCode);
      // this.loading = false;
      // if (res && res.success && res.data) {
      //   this.url = res.data;
      //   this.url = deviceCode
      // }
    },
    initVideo() {
      const { url } = this;
      if (!url) {
        return;
      }
      try {
        const flvPlayer = flvjs.createPlayer({
          type: "flv",
          url,
        });
        flvPlayer.attachMediaElement(this.$refs.video);
        flvPlayer.load();
        flvPlayer.play();
        this.player = flvPlayer;
      } catch (err) {
        console.log(err);
      }
    },
    stopVideo(deviceCode) {
      //   deviceCode = deviceCode || (this.data && this.data.identityco);
      //   if (!deviceCode) {
      //     return;
      //   }
      //   this.url = null;
      //   if (this.player) {
      //     this.player.destroy();
      //   }
      //   stopVideo({ deviceCode });
    },
  },
};
</script>

<style lang="scss" scoped>
.frame {
  position: relative;
  width: 500px;
  height: 300px;
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
}
</style>
