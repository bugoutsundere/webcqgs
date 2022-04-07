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
    const { tunnel_nam, tunnel_mpo, start_stak, end_stake_, tunnel_len, build_year } = data;
    return (
      <div>
        <div class="title">{tunnel_nam}</div>
        <div class="content">
          <div>{formatStake(tunnel_mpo)}</div>
          <div>
            <span>
              ({formatStake(start_stak)}~{formatStake(end_stake_)})
            </span>
          </div>
          <div>
            <span>建设时间：{ build_year }</span>
          </div>
          <div>
            <span>长度：{tunnel_len}米</span>
          </div>
        </div>
      </div>
    );
  },
};
</script>
