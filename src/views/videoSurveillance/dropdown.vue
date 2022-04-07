<template>
  <div class="h-2/3 w-1/3 dropdiv">
    <div class="dropdivin">
      <div class="container">
        <div class="iptdiv">
          <el-input
            v-model="text"
            size="small"
            placeholder="请输入监控名称"
            style="width: 200px; margin-right: 20px"
          ></el-input>
          <el-button type="primary" size="small" @click="handleSerch"
            >搜索</el-button
          >
        </div>
        <!-- <div class="movelist" v-for="(item, index) in monitorList" :key="index">
          <div
            class="item-name"
            @click="handleShowVideo(item.cameraIndexCode, item.name)"
          >
            {{ item.name }}
          </div>
        </div> -->
        <el-tree
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          style="background: none; color: #fff"
        ></el-tree>
      </div>
      <!-- <div class="page">
        <el-pagination
          @size-change="pageChange"
          @current-change="pageChange"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
import { monitors } from "@/api/operation";
export default {
  data() {
    return {
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
      pageNo: 1,
      pageSize: 13,
      url: "",
      text: "",
      monitorList: []
    };
  },
  mounted() {
    // this.getData()
  },
  methods: {
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
<style scoped>
.dropdiv {
  width: 380px;
  padding: 40px 10px;
  z-index: 99;
  margin-top: 30px;
  /* background: url("@/assets/images/module-header-bg.png"); */
}
.dropdivin {
  width: 100%;
  height: 100%;
  background: url("/src/assets/images/videoSurveillance/dropbg.png");
  background-size: 100% 100%;
}
.container {
  width: 100%;
  height: calc(100% - 100px);
  padding: 30px 15px;
}
.iptdiv {
  margin-bottom: 15px;
}
.movelist {
  padding: 12px;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
.movelist:hover {
  color: #00ccff;
}
.page {
  padding-left: 15px;
}
</style>
