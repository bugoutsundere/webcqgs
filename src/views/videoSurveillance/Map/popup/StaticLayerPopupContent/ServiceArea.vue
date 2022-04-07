<script lang="jsx">
import { formatStake } from "@/utils/road";

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
    const { area_name, server_con, area_mpoin, build_year, route_name } = data;
    return (
      <div>
        <div class="title">{area_name}</div>
        <div class="content">
          <div>{formatStake(area_mpoin)}</div>
          <div>{server_con}</div>
          <div>
            <span>建设时间：{build_year}</span>
          </div>
          <div>
            <span>位置：{route_name}</span>
          </div>
          <div>
            <span>面积：</span>
          </div>
          <div>
            <span>车位数：</span>
          </div>
        </div>
      </div>
    );
  },
};
</script>
