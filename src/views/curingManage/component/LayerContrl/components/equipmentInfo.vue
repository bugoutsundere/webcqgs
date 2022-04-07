<template>
  <el-dialog
    :title="equipmentData.name"
    v-model="equipmentInfoVisible"
    width="540px"
    :before-close="handleClose"
  >
    <div class="container"  v-loading="loading">
      <div class="equipment" v-if="equipmentList.length > 0">
        <div class="item" v-for="(item, index) in equipmentList" :key="index">
          <div class="item-name">{{ item.deviceName }}</div>
          <div class="item-content">
            <el-row>
              <el-col :span="12">
                <span class="name">设备ID：</span>
                <span class="val">{{ item.deviceId }}</span>
              </el-col>
              <el-col :span="12">
                <span class="name">设备类型：</span>
                <span class="val">{{ item.deviceType }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <span class="name">设备状态：</span>
                <span class="val">{{ item.deviceStatus }}</span>
              </el-col>
              <el-col :span="12">
                <span class="name">设备方向：</span>
                <span class="val"> {{ item.direction }}</span>
              </el-col>
            </el-row>
            <!-- <div>
              <span class="name">设备ID：</span>
              <span class="val">{{ item.deviceId }}</span>
            </div>
            <div>
              <span class="name">设备类型：</span>
              <span class="val">{{ item.deviceType }}</span>
            </div>
            <div>
              <span class="name">设备状态：</span>
              <span class="val">{{ item.deviceStatus }}</span>
            </div>
            <div>
              <span class="name">设备方向：</span>
              <span class="val"> {{ item.direction }}</span>
            </div> -->
          </div>
        </div>
        <div class="page">
          <el-pagination
            @size-change="pageChange"
            @current-change="pageChange"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </div>
      <div class="noData" v-if="!loading && equipmentList.length <= 0">暂无设备</div>
    </div>  
  </el-dialog>
</template>
<script>
import { mapState } from "vuex";
import { equipmentInfo } from "@/api/operation";
export default {
  props: {
    equipmentInfoVisible: {
      type: Boolean,
      default: false,
    },
    equipmentData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      loading: false,
      equipmentList: [],
      total: 0,
      pageNo: 1,
      pageSize: 3,
    }
  },
  computed: {
    ...mapState({
      selectRoadId: (state) => state.road.selectRoadId,
      allRoads: (state) => state.road.allRoads,
    }),
    selectedRoadRoadNo() {
      const { selectRoadId, allRoads } = this
      let road = allRoads.filter(item => item.id === selectRoadId)[0]
      if(road && road.roadNo) {
        return road.roadNo
      }
      return ''
    },
  },
  mounted() {
    this.getData()
  },
  methods: {
    handleClose() {
      this.$emit('equipmentInfoClose')
    },
    async getData() {
      const { equipmentData, selectedRoadRoadNo, pageNo, pageSize } = this
      let params = {
        pageNo: pageNo,
        pageSize: pageSize,
        t: {
          deviceType: equipmentData.deviceType,
          roadCode: selectedRoadRoadNo
        }
      }
      this.loading = true
      let res = await equipmentInfo(params)
      this.loading = false
      if(res.searchCount && res.records) {
        this.equipmentList = res.records
        this.total = res.total
      }
    },
    pageChange(val) {
      this.pageNo = val
      this.getData()
    },
  }
}
</script>
<style lang="postcss" scoped>
  .container{
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
  }
  .item-content {
    margin: 15px 20px;
    font-size: 12px;
    & >div {
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