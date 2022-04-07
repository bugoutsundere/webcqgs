<template>
  <div ref="playWnd" :id="elId"></div>
</template>
<script lang="jsx">
let idx = 0;
const initParams = {
  appkey: "29900884",
  secret: "osPf2dpzAP9a59VQWGi6",
  ip: "183.64.175.153",
  port: 446,
  enableHTTPS: 1,
  language: "zh_CN",
  layout: "1x1",
  playMode: 0,
  reconnectDuration: 5,
  reconnectTimes: 5,
  showSmart: 0,
  showToolbar: 1,
  buttonIDs: '0',
  toolBarButtonIDs:
    "2048,2049,2050,2304,2306,2305,2307,2308,2309,4608,4097,4099,4098,4609,4100",
  snapDir: "D:/snap",
  videoDir: "D:/video",
};
const previewParams = {
  cameraIndexCode: null, // 监控点编号，json 中必填
  streamMode: 0, // 主子码流标识:0-主码流，1-子码流，json 中选填
  transMode: 1, // 传输协议:0-UDP，1-TCP，json 中选填
  gpuMode: 0, // 是否启用 GPU 硬解，0-不启用，1-启用，json 中选填
  wndId: -1, // 播放窗口序号(在 2x2 以上布局下可指定播放窗口)，json 中选填
};
export default {
  inject: ["getMap"],
  props: {
    cameraCode: {
      default: "",
    },
    width: {
      type: Number,
      default: 320,
    },
    height: {
      type: Number,
      default: 180,
    },
    hide: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {
      elId: "",
    };
  },
  watch: {
    hide () {
      this.resizeWindow()
    },
    cameraCode() {
      this.startPreview()
    }
  },
  created() {
    this.elId = `playWnd_${idx++}`;
  },
  mounted() {
    this.createIns();
  },
  beforeUnmount() {
    this.destroy();
  },
  methods: {
    createIns() {
      this.wcIns = new WebControl({
        szPluginContainer: this.elId,
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        szClassId: "23BF3B0A-2C56-4D97-9C03-0CB103AA8F11", // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => {
          console.log("createIns success");
          this.startService();
        },
        cbConnectError: (err) => {
          // 创建 WebControl 实例失败
          console.log("createIns error", err);
        },
        cbConnectClose: (bNormalClose) => {
          // 异常断开：bNormalClose = false
          // JS_Disconnect正常断开：bNormalClose = true
          console.log("connectClose", bNormalClose);
          this.wcIns = null;
        },
      });
    },
    startService() {
      if (!this.wcIns) {
        return;
      }
      this.wcIns
        .JS_StartService("window", {
          dllPath: "./VideoPluginConnect.dll",
        })
        .then(
          () => {
            console.log("startService success");
            this.createWindow();
          },
          (err) => {
            console.log("startService error", err);
          }
        );
    },
    setWindowControlCallback() {
      if (!this.wcIns) {
        return;
      }
      oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack(data) {
          console.log("cbIntegrationCallBack", data);
        },
      });
    },
    createWindow() {
      if (!this.wcIns) {
        return;
      }
      console.log(this.elId, this.width, this.height);
      this.wcIns.JS_CreateWnd(this.elId, this.width, this.height).then(
        () => {
          console.log("createWindow success");
          this.initPlugin();
        },
        (err) => {
          console.log("createWindow error", err);
        }
      );
    },
    resizeWindow() {
      if (!this.wcIns) {
        return;
      }
      this.wcIns.JS_Resize(this.width, this.height);
      if(this.hide) {
        this.wcIns.JS_HideWnd()
      } else {
        this.wcIns.JS_ShowWnd()
      }
    },
    initPlugin() {
      if (!this.wcIns) {
        return;
      }
      this.wcIns
        .JS_RequestInterface({
          funcName: "init",
          argument: JSON.stringify(initParams),
        })
        .then(
          (data) => {
            console.log("initPlugin success ", data);
            this.resizeWindow();
            this.startPreview();
          },
          (err) => {
            console.log("initPlugin error ", err);
          }
        );
    },
    startPreview() {
      if (!this.wcIns || !this.cameraCode) {
        return;
      }
      this.wcIns
        .JS_RequestInterface({
          funcName: "startPreview",
          argument: JSON.stringify({
            ...previewParams,
            cameraIndexCode: this.cameraCode,
          }),
        })
        .then(
          (data) => {
            console.log("startPreview success ", data);
          },
          (err) => {
            console.log("startPreview error ", err);
          }
        );
    },
    destroy() {
      if (!this.wcIns) {
        return;
      }
      this.wcIns.JS_HideWnd(); // 先让窗口隐藏，规避插件窗口滞后于浏览器消失问题
      this.wcIns.JS_Disconnect().then(
        () => {
          // 断开与插件服务连接成功
          console.log("Disconnect success");
        },
        (err) => {
          // 断开与插件服务连接失败
          console.log("Disconnect error", err);
        }
      );
      this.wcIns = null;
    },
    updateWin() {
      if (!this.wcIns) {
        return;
      }
      if(this.hide) {
        this.wcIns.JS_HideWnd()
      } else {
        this.wcIns.JS_ShowWnd()
      }
    }
  },
};
</script>
