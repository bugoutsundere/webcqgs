<template>
  <div>
    <el-dialog
      title="监控列表"
      v-model="monitorVisible"
      width="650px"
      :before-close="handleClose"
    >
      <div class="container" v-loading="loading">
        <div class="iptdiv">
          <el-input
            v-model="text"
            size="small"
            placeholder="请输入监控名称"
            style="width: 180px; margin-right: 20px"
          ></el-input>
          <el-button type="primary" size="small" @click="handleSerch"
            >搜索</el-button
          >
        </div>
        <div class="flex justify-between">
          <div style="width: 200px; position: relative; top: 10px">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              default-expand-all
              style="background: none; color: #fff"
            ></el-tree>
          </div>
          <div>
            <div
              class="equipment"
              v-if="monitorList.length > 0"
              style="width: 400px"
            >
              <div
                class="item"
                v-for="(item, index) in monitorList"
                :key="index"
              >
                <div
                  class="item-name"
                  @click="handleShowVideo(item.cameraIndexCode, item.name)"
                >
                  {{ item.name }}
                </div>
              </div>
              <div class="page">
                <el-pagination
                  @size-change="pageChange"
                  @current-change="pageChange"
                  :page-size="pageSize"
                  layout="total, prev, pager, next"
                  :total="total"
                >
                </el-pagination>
              </div>
            </div>
            <div class="noData" v-if="!loading && monitorList.length <= 0">
              暂无监控
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog :title="videoname" v-model="videoVisible" width="540px">
      <div>
        <div class="player" v-if="url">
          <videoPlayer :url="url"></videoPlayer>
        </div>
        <!-- <div v-show="!url" class="info">
      <span v-if="loading">视频加载中...</span>
      <span v-else>视频地址获取失败</span>
    </div> -->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { monitors, getVideoUrl } from "@/api/operation";
import videoPlayer from "./videoPlayer.vue";
export default {
  data() {
    return {
      monitorVisible: false,
      videoVisible: false,
      loading: false,
      monitorList: [],
      total: 0,
      pageNo: 1,
      pageSize: 10,
      url: "",
      text: "",
      videoname: "",
      treeData: [
        {
          label: "铁建高速",
          children: [
            {
              label: "重庆市",
              children: [
                {
                  label: "遂渝高速",
                },
                {
                  label: "潼荣高速",
                },
                {
                  label: "秀松高速",
                },
                {
                  label: "永泸高速",
                },
                {
                  label: "合安高速",
                },
                {
                  label: "石黔高速",
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  components: { videoPlayer },
  computed: {
    ...mapState({
      selectRoadId: (state) => state.road.selectRoadId,
      allRoads: (state) => state.road.allRoads,
    }),
    selectedRoadRoadNo() {
      const { selectRoadId, allRoads } = this;
      let road = allRoads.filter((item) => item.id === selectRoadId)[0];
      if (road && road.roadNo) {
        return road.roadNo;
      }
      return "";
    },
  },
  mounted() {
    // this.init();
  },
  methods: {
    handleClose() {
      this.monitorVisible = false;
    },
    init() {
      this.monitorVisible = true;
      this.getData();
    },
    async getData() {
      const { selectedRoadRoadNo, pageNo, pageSize, text } = this;
      let params = {
        pageNo: pageNo,
        pageSize: pageSize,
        t: {
          content: text,
        },
      };
      //    t: {
      //       content: '',
      //       roadCode: selectedRoadRoadNo,
      //     },
      this.loading = true;
      let res = await monitors(params);
      this.loading = false;
      if (res.searchCount && res.records) {
        this.monitorList = res.records;
        this.total = res.total;
      }
    },
    pageChange(val) {
      this.pageNo = val;
      this.getData();
    },
    handleSerch() {
      this.pageNo = 1;
      this.getData();
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
    // handleShowVideo() {

    //   this.videoVisible = true;
    // },
  },
};
</script>
<style>
.iptdiv input {
  background-color: #0c1d3c !important;
}
.el-tree-node__content:hover {
  background-color: #0c1d3c !important;
}
.el-tree-node:focus > .el-tree-node__content {
  background-color: #0c1d3c !important;
}
</style>
<style lang="postcss" scoped>
.container {
  position: relative;
  width: 100%;
  min-height: 200px;
  max-height: 500px;
  overflow: auto;
}
.item {
  margin-bottom: 20px;
}
.item-name {
  font-size: 16px;
  color: #84dde7;
  line-height: 22px;
  margin: 10px;
  cursor: pointer;
}
.item-content {
  margin: 15px 20px;
  font-size: 12px;
  & > div {
    margin: 10px;
  }
  & .name {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 20px;
  }
  & .val {
    display: inline-block;
    text-align: left;
  }
}
.noData {
  text-align: center;
}
.page {
  text-align: right;
  margin-top: 10px;
}
</style>