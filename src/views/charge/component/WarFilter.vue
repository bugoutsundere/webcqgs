<template>
  <div class="way-filter">
    <el-select
      v-model="waySelected"
      placeholder="请选择"
      size="mini"
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in allRoads"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>
<script lang="jsx">
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      selectRoadId: (state) => state.road.selectRoadId,
      allRoads: (state) => state.road.allRoads,
    }),
    waySelected: {
      get() {
        return this.selectRoadId
      },
      set(id) {
        this.setSelectRoadId(id)
      }
    }
  },
  methods: {
    ...mapMutations('road', ['setSelectRoadId']),
  },
}
</script>
<style lang="postcss" scoped>
.way-filter {
  margin-top: 15px;
  margin-bottom: 15px;
}
::v-deep(.el-input__inner) {
  color: #fff;
  background: rgba(5, 15, 45, 0.5);
  border: 1px solid #625644;
  &:hover {
    border: 1px solid #89765a;
  }
}
::v-deep(.el-select__popper.el-popper) {
  background: rgba(5, 15, 45, 0.7) !important;
}
</style>