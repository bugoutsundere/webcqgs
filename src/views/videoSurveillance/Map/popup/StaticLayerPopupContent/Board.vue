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
    const { rp_name, stake_no, rp_status } = data;
    return (
      <div>
        <div class="title">{rp_name}</div>
        <div class="content">
          <span>{formatStake(stake_no)}</span>
          <div>
            <span>状态：{ rp_status }</span>
          </div>
        </div>
      </div>
    );
  },
};
</script>
