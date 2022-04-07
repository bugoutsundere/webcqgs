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
    const { brg_name, brg_mpoint, start_stak, end_stake_, build_year, length } = data;
    return (
      <div>
        <div class="title">{brg_name}</div>
        <div class="content">
          <div>{formatStake(brg_mpoint)}</div>
          <div>
            <span>
              {formatStake(start_stak)}~{formatStake(end_stake_)}
            </span>
          </div>
          <div>
            <span>建设时间：{ build_year }</span>
          </div>
          <div>
            <span>长度：{ length }米</span> 
          </div>
        </div>
      </div>
    );
  },
};
</script>
