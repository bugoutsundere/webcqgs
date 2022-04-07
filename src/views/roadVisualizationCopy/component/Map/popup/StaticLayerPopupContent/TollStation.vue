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
    const { stat_name, stat_mpoin, build_year, zip_code, stat_type } = data;
    return (
      <div>
        <div class="title">{stat_name}</div>
        <div class="content">
          <span>{formatStake(stat_mpoin)}</span>
          <div>
            <span>建设时间：{build_year}</span>
          </div>
          <div>
            <span>区域：{zip_code}</span>
          </div>
          <div>
            <span>类型：{stat_type}</span>
          </div>
          <div>
            <span>面积：</span>
          </div>
          <div>
            <span>车道数：</span>
          </div>
        </div>
      </div>
    );
  },
};
</script>
