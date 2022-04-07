<template>
	<div class="video-data">
		<map-module title="视频数据" :loading="loading" style="min-height: 600px">
			<template #custom>
				<div class="cursor-pointer"  style="display:flex;align-items:center">
					<SvgIcon
						name="screening"
						style="
							width: 20px;
							height: 20px;
							display: block;
							transform: skewX(10deg);
						"
            @click="show=true"
					/>
          <i class="el-icon-video-camera" style="margin-left: 5px;font-size:16px" @click="jump"></i>
				</div>
			</template>
			<div class="pt-4 pr-0.5 pl-4 overflow-auto" style="max-height: 770px">
				<template v-if="selectedVideoUrl.length > 0">
					<div
						class="mb-4 relative"
						v-for="(item, index) in selectedVideoUrl"
						:key="index"
            style="width: 300px;height:200px;"
					>
						<!-- <span class="absolute inset-x-1 text-sm z-50">{{ item.name }}</span> -->
            <!-- <Video :cameraCode="item.cameraIndexCode" :hide="show"></Video> -->
						<!-- <video controls style="width: 320px; height: 200px">
							<source :src="item.url" type="rstp/mp4" />
						</video> -->
            <span class="pt-2">{{ item.name }}</span>
            <div style="width: 100%;height: 170px">
              <videoPlayer :url="item.url"></videoPlayer>
            </div>
					</div>
				</template>
				<div v-else class="w-full h-full">
          <div v-if="videoListSouce.length > 0" class="noSelected">未选择视频</div>
          <empty  v-else style="top: 30px" />
				</div>
			</div>
		</map-module>
		<el-drawer v-model="show" :with-header="false" size="500px" @close="drawerClose">
			<div class="drawer-content">
				<div class="drawer-header">
					<span class="drawer-header-title">行业发展规模图</span>

					<div
						@click="show = false"
						class="
							flex
							items-center
							justify-center
							w-6
							h-6
							rounded-full
							cursor-pointer
						"
					>
						<SvgIcon name="close" style="width: 15px; height: 15px; color: #a3afbc" />
					</div>
				</div>
				<div class="p-4 content">
					<el-input v-model="searchContent" placeholder="请输入内容" @change="search"></el-input>
					<div class="py-4 space-x-3 space-y-2">
						<el-tag
							v-for="(item, index) in activeVideoList"
							closable
							:key="index"
              type="success"
							@close="handleChecked(item.cameraIndexCode, item)"
						>
							{{ item.name }}
						</el-tag>
					</div>
					<div class="">
						<div class="flex justify-between items-center my-4 title">
							<span style="color: #d5fbff">视频信息</span>
							<span style="color: rgba(213, 251, 255, 0.3); font-size: 12px"
								>最多只能添加三个视频</span
							>
						</div>
						<ul class="w-full">
							<li
								v-for="item in videoListSouce"
								:key="item.cameraIndexCode"
								@click="handleChecked(item.cameraIndexCode, item)"
								:class="{
									'video-text-item-active': selectedVideo.includes(
										item.cameraIndexCode
									),
								}"
								class="video-text-item rounded mb-4 cursor-pointer"
							>
								{{ item.name }}
							</li>
						</ul>
						<div
							class="absolute bottom-2 flex items-center justify-center w-full"
						>
							<el-pagination
								small
								:page-size="pageSize"
								:current-page="pageNum"
								layout="prev, pager, next, jumper, ->"
								:total="total"
								@current-change="handlePageChange"
								@size-change="handlePageChange"
							></el-pagination>
						</div>
					</div>
				</div>
			</div>
		</el-drawer>
	</div>
</template>
<script>
import {
	defineComponent,
	reactive,
	toRefs,
	ref,
	computed,
	onMounted,
	watch,
} from 'vue'
import { getRoadVideoListByCode, getCameraList } from '@/api/operation'
import { useStore } from 'vuex'
import { key } from '@/store'
import mapModule from '@/components/map-module/index.vue'
import gis1 from './images/gis1.png'
import gis2 from './images/gis2.png'
import gis3 from './images/gis3.png'
import { ElMessage } from 'element-plus'
import empty from '@/components/empty.vue'
import videoPlayer from "@/components/videoPlayer.vue"

// steup没有name属性，为了导出组件方便管理，故使用defineComponent

export default defineComponent({
	name: 'videoDatas',
	components: { mapModule, empty, videoPlayer },
	setup(props) {
        /**
		 * 源数据
		 */
		const dataSource = reactive({
			show: false,
			pageNum: 1,
			pageSize: 10,
			loading: true,
			searchVal: '',
			flag: true,
			total: 0,
			videoListSouce: [],
			selectedVideo: [],
			selectedVideoUrl: [],
      activeVideoList: [],
			searchContent: '曾家山k126',
		})

		// vueX实例
		const store = useStore(key)
		// 道路code
		const roadNo = computed(() => store.getters.roadNo)

		// 路段ID
		const selectRoadId = computed(() => store.state.road?.selectRoadId)

    // 选中路段变化 更新视频数据
		watch(
			() => selectRoadId.value,
			(oldVal, newVal) => {
				initData()
			},
		)

		onMounted(async () => {
			await initData()
		})

		/**
		 * 选择视频
		 * @param { number } index 当前点击
		 * @param { Boolean } isActive 判断点击是不是本身
		 */
		const handleChecked = (code, data) => {
			let idx = dataSource.selectedVideo.findIndex((item) => item === code)
      let index = dataSource.activeVideoList.findIndex((item) => item.cameraIndexCode === code)
			if (idx === -1) {
				if (dataSource.selectedVideo.length >= 3) {
					ElMessage.error('最多只能选三个视频')
					return
				}
				dataSource.selectedVideo.push(code)
        dataSource.activeVideoList.push(data)
			} else {
				dataSource.selectedVideo.splice(idx, 1)
        dataSource.activeVideoList.splice(index, 1)
			}
		}
		/**
		 * 分页获取视频列表
		 * @param { Number } pageNo
		 * @param { Number } pageSize
		 * @param { object } t: roadCode 查全部为''
		 */
		const getData = async () => {
			dataSource.loading = true
			const params = {
				pageNo: dataSource.pageNum,
				pageSize: dataSource.pageSize,
				t: {
					roadCode: roadNo.value,
          content: dataSource.searchContent
				},
			}
			const res = await getRoadVideoListByCode(params)
      if (res && res.success) {
        const { records, total } = res
        dataSource.total = total
        dataSource.videoListSouce = records
        dataSource.flag = false
      } else {
        ElMessage.error(res.msg || '系统异常')
      }
      dataSource.loading = false
		}
    const initData = async () => {
      dataSource.pageNum = 1
      dataSource.selectedVideo = []
      dataSource.activeVideoList = []
      await getData()
      const arr = [110430924286744360,110430924284164360,110430924285024360]
      dataSource.videoListSouce.map((item, index) => {
					// 这里对数据做了下处理，默认选中前三条视频
					if (dataSource.selectedVideo.length<3 && arr.includes(Number(item.cameraIndexCode))) {
						dataSource.selectedVideo.push(item.cameraIndexCode)
            dataSource.activeVideoList.push(item)
					}
				})
      getVidelListUrl()
    }
    // 页码变化
    const handlePageChange = (page) => {
      dataSource.pageNum = page
			getData()
    }

    // 获取视频地址
		const getVidelListUrl = async () => {
      dataSource.selectedVideoUrl = []
      if (dataSource.selectedVideo.length === 0) {
        return
      }
      dataSource.loading = true
			const { data, success } = await getCameraList(dataSource.selectedVideo)
			if (!success) return
			dataSource.selectedVideoUrl = data
      dataSource.loading = false
		}
    // 视频选择弹框关闭 更新视频地址
    const drawerClose = () => {
      getVidelListUrl()
    }
    // 搜索
    const search = async () => {
      dataSource.pageNum = 1
      await getData()
    }
    // 跳转视频云瞰平台
		const jump = () => {
			window.open('https://183.64.175.153:446/ssoforicm/login?userCode=admin&pwd=59e246f13befce586f1286a8db36c02b980984f9f2b6f9aec169bb833f022642&service=https://183.64.175.153:446/', 'foo', 'noopener=yes, noreferrer=yes')
		}

		return {
			...toRefs(dataSource),
			roadNo,
			getData,
      initData,
      drawerClose,
			getVidelListUrl,
			handleChecked,
			handlePageChange,
      search,
			jump,
		}
	},
})
</script>
<style lang="postcss" scoped>
.video-data {
	& .custom-video {
		width: 100% !important;
		height: 220px;
	}
}
.noSelected {
  height: 220px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.el-drawer) {
	background: #0C1D3C;
}
::v-deep(.el-input__inner) {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  &:hover {
    border: none;
  }
}
::v-deep(.el-select-dropdown__item) {
	color: #fff !important;
}
.drawer-content {
	padding-top: 50px;
	text-shadow: none;
}
.drawer-header {
	height: 50px;
	background: #213355;
	font-size: 18px;
	@apply flex items-center justify-between px-2 w-full;
}
.drawer-header-title {
	background: linear-gradient(0deg, #00d0fd 0.146484375%, #07ffed 99.31640625%);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
}
.video-text-item {
	height: 40px;
	background: #c29b9b14;
	font-size: 14px;
	color: #D5FBFF;
	font-weight: 400;
	@apply flex items-center justify-center;
}
.video-text-item-active {
	background: rgba(7, 255, 237, 0.12);
	color: #07FFED;
}
.content {
  padding: 10px 20px;
}
.title {
  padding-left: 20px;
  &::before{
    position: absolute;
    left: 20px;
    content: ' ';
    width: 5px;
    height: 20px;
    background: linear-gradient(180deg, #F7FFFF, #00D3FF);
    border-radius: 2px;
  }
}
</style>
