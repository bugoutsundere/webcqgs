<template>
  <div class="container">
    <div :id="elId" style="width: 100%; height: 100%"></div>
    <div class="info" v-show="msg">{{ msg }}</div>
    <div class="control" v-show="url && !msg && !loading">
      <i
        :class="pause ? 'el-icon-video-play' : 'el-icon-video-pause'"
        @click="playPause"
      ></i>
      <i class="el-icon-full-screen" @click="fullScreen"></i>
    </div>
    <div class="loading" v-show="loading">
      <span>视频加载中..</span>
    </div>
  </div>
</template>
<script lang="jsx">
let idx = 0;
let errorMsg = {
  '0x12f900003': '仅回放支持该功能',
  '0x12f900004': '普通模式不支持该功能',
  '0x12f900005': '高级模式不支持该功能',
  '0x12f900006': '播放库报错',
  '0x12f900007': 'Decoder.js加载失败',
  '0x12f910000': 'websocket连接失败，请核对取流URL',
  '0x12f910010': '取流失败',
  '0x12f910011': '流中断',
  '0x12f910014': '没有音频数据',
  '0x12f910015': '未找到对应websocket',
  '0x12f910016': 'websocket不在连接状态',
  '0x12f910017': '不支持智能信息展示',
  '0x12f910020': '单帧回放时不能暂停',
  '0x12f910021': '已是最大倍速',
  '0x12f910022': '已是最小倍速',
  '0x12f920000': '储存空间配额失败',
  '0x12f920001': '请求文件系统失败',
  '0x12f920002': '获取文件失败',
  '0x12f920003': '创建writer失败',
  '0x12f920004': '写数据失败',
  '0x12f930000': '内存不足',
  '0x12f950000': '采集音频失败，可能是在非https/localhost域下使用对讲导致',
  '0x12f950001': '对讲不支持这种音频编码格式',
  '0x02200404': '取流失败'
}
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    autoPlay: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      player: null,
      elId: '',
      msg: '',
      pause: true,
    }
  },
  watch: {
    url() {
      this.stopVideo();
      this.createPlayer()
    }
  },
  created() {
    this.elId = `playWnd_${idx++}`;
  },
  mounted() {
    this.createPlayer()
  },
  beforeUnmount() {
    this.stopVideo();
  },
  methods: {
    // 创建实例
    createPlayer() {
      const { elId, autoPlay } = this
      this.player = new window.JSPlugin({
        szId: elId,
        szBasePath: "/",
        iMaxSplit: 4,
        iCurrentSplit: 1,
        openDebug: true,
        oStyle: {
          borderSelect: '#FFCC00',
        }
      })
      // 事件回调绑定
      this.player.JS_SetWindowControlCallback({
        pluginErrorHandler: (iWndIndex, iErrorCode, oError) => {  //插件错误回调
          console.log('pluginError callback: ', iWndIndex, iErrorCode, oError);
          this.msg = errorMsg[iErrorCode]?errorMsg[iErrorCode]:`错误码：${iErrorCode}`
          this.playStop()
        },
      })
      if (autoPlay) {
        this.play()
      }
    },
    // 播放
    play() {
      let { player, url } = this
      if (!url) {
        this.msg = '视频加载失败'
        return
      }
      this.loading = true
      this.player.JS_Play(url, { playURL:url }, 0).then(
        () => { 
          this.pause = false
          this.loading = false 
        },
        e => { 
          console.error(e)
          this.pause = true
          this.loading = false 
        }
      ) 
    },
    // 播放暂停切换
    playPause() {
      if (this.pause) {
        // 播放
        this.play()
      } else {
        // 暂停
        this.playStop()
      }
    },
    // 暂停视频播放
    playStop() {
      if (this.loading) {
        this.loading = false
      }
      if (!this.player) {
        return
      }
      this.player.JS_Stop().then(
        () => { this.pause = true },
        e => { console.error(e) }
      )
    },
    stopVideo() {
      this.playStop()
      this.msg = ''
      this.player = null
    },
    // 全屏
    fullScreen() {
      this.player.JS_FullScreenDisplay(true).then(
        () => { console.log(`wholeFullScreen success`) },
        e => { console.error(e) }
      )
    }
  }
}
  
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;
  .info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .control {
    position: absolute;
    right: 0;
    bottom: 15px;
    font-size: 16px;
    padding: 5px;
    cursor: pointer;
    i {
      padding: 0 5px;
    }
  }
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>