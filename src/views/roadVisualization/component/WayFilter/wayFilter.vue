<template>
  <div class="way-filter">
    <el-select v-model="waySelected" placeholder="请选择" size="small" :popper-append-to-body="false">
      <el-option
        v-for="item in allRoads"
        :key="item.id"
        :label="item.name"
        :value="item.id">
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
  position: absolute;
  top: 20px;
  left: 20px;
}
::v-deep(.el-input__inner) {
  color: #fff;
  background: rgba(5, 15, 45, 0.5);
  border: 1px solid #00D0FD;
  &:hover {
    border: 1px solid #00D0FD;
  }
}
</style>