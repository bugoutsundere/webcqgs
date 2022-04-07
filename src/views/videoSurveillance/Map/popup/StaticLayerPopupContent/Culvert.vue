<script lang="jsx">
import { formatStake } from "@/utils/road";

// 涵洞
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  render() {
    const { data } = this;
    if (!data) {
      return null;
    }
    const { culvert_na, culvert_mp, param_cu_1, route_name } = data;
    return (
      <div>
        <div class="title">{culvert_na}</div>
        <div class="content">
          <span>{formatStake(culvert_mp)}</span>
          <div>
            <span>类型：{param_cu_1}</span>
          </div>
          <div>
            <span>位置：{route_name}</span>
          </div>
          <div>
            <span>面积：</span>
          </div>
        </div>
      </div>
    );
  },
};
</script>
