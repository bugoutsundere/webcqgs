import axios from "@/utils/axios";

export interface State {
  roadBase: Array<any>;
  gantryBase: Array<any>;
  evtSrc: Array<any>;
  checkedLayers: Array<any>;
  evtList: Array<any>;
  camaras: Array<any>;
  loadings: any;
  informationBoards: Array<any>;

  allRoads: Array<any>; // 写死的路段数据
  selectRoadId: any;
}

const state: State = {
  roadBase: [],
  evtSrc: [],
  camaras: [],
  checkedLayers: [],
  evtList: [],
  loadings: {},
  informationBoards: [],
  gantryBase: [],

  selectRoadId: 100,
  allRoads: [
    {
      id: 100,
      name: "全部",
      code: '',
      roadNo: '',
    },
    {
      id: 1,
      name: "渝隧高速",
      code: '105',
      roadNo: "G93",
      begStake: 305,
      endStake: 398,
      begLng: "105.719015",
      begLat: "30.253042",
      endLng: "106.346726",
      endLat: "29.659975",
      mileage: 93,
    },
    {
      id: 2,
      name: "潼荣高速",
      code: '101',
      roadNo: "S55",
      begStake: 0,
      endStake: 138.456,
      begLng: "105.493357",
      begLat: "29.358993",
      endLng: "105.908941",
      endLat: "30.33704",
      mileage: 138.456,
    },
    {
      id: 3,
      name: "秀松高速",
      code: '102',
      roadNo: "S63",
      begStake: 0,
      endStake: 30.571,
      begLng: "109.027503",
      begLat: "28.494711",
      endLng: "109.08161",
      endLat: "28.253853",
      mileage: 30.571,
    },
    {
      id: 4,
      name: "永泸高速",
      code: '103',
      roadNo: "S75",
      begStake: 0,
      endStake: 20.943,
      begLng: "105.916002",
      begLat: "29.262593",
      endLng: "105.727306",
      endLat: "29.251385",
      mileage: 20.943,
    },
    {
      id: 5,
      name: "合安高速",
      code: '103',
      roadNo: "S9",
      begStake: 114.399,
      endStake: 132.813,
      begLng: "105.726901",
      begLat: "30.222598",
      endLng: "105.618152",
      endLat: "30.139514",
      mileage: 18.414,
    },
    {
      id: 6,
      name: "石黔高速",
      code: "",
      roadNo: "G5515",
      begStake: 246.4,
      endStake: 329.58,
      begLng: "108.691026",
      begLat: "29.531146",
      endLng: "108.209093",
      endLat: "30.023914",
      mileage: 83.18
    }
  ],
};

// getters
const getters = {};

// actions
const actions = {
  async getRoadBase({ state, commit }: any): Promise<void> {
    if (state.roadBase?.length > 0) {
      return;
    }
    try {
      const res: any = await axios.get(
        "/http-server-yygl/publish/jsc/roadbase"
      );
      if (res.msgState === "SUCCESS") {
        commit("setRoadBase", res.msgContent);
      } else {
        throw res.msgDes;
      }
    } catch (error) {
      console.log("获取路段信息失败");
    }
  },
  async getEvtList({ state, commit }: any): Promise<void> {
    if (state.evtList?.length > 0) {
      return;
    }
    commit("setLoading", {
      key: "EVENT_POINT",
      value: true,
    });
    try {
      const res: any = await axios.get(
        "/external/event/cockpit-event-list?pageNo=1&pageSize=1000"
      );
      if (res?.data?.result) {
        commit("setEvtList", res?.data?.result);
      } else {
        throw res.msgDes;
      }
      commit("setLoading", {
        key: "EVENT_POINT",
        value: false,
      });
    } catch (error) {
      console.log("获取事件信息失败");
      commit("setLoading", {
        key: "EVENT_POINT",
        value: false,
      });
      commit("removeLayer", "EVENT_POINT");
    }
  },
  async getGantryBase({ state, commit }: any): Promise<void> {
    if (state.gantryBase?.length > 0) {
      return;
    }
    commit("setLoading", {
      key: "GANTRY_POINT",
      value: true,
    });
    try {
      const res: any = await axios.get(
        "/http-server-yygl/publish/jsc/gantrybase?com=list"
      );
      if (res.msgState === "SUCCESS") {
        commit("setGantryBase", res.msgContent);
      } else {
        throw res.msgDes;
      }
      commit("setLoading", {
        key: "GANTRY_POINT",
        value: false,
      });
    } catch (error) {
      console.log("获取门架信息失败");
      commit("setLoading", {
        key: "GANTRY_POINT",
        value: false,
      });
      commit("removeLayer", "GANTRY_POINT");
    }
  },
  async getEvtSrc({ state, commit }: any): Promise<void> {
    if (state.roadBase?.length > 0) {
      return;
    }
    try {
      const res: any = await axios.get("/sys/bm/findEventSource");
      if (res.success) {
        const list = res.data;
        const target: any = [];
        list?.forEach(({ name, code, children }: any) => {
          target.push({ name, code });
          if (children?.length > 0) {
            children.forEach((e: any) => {
              const { name: cName, code: cCode } = e;
              target.push({ name: name + "-" + cName, code: cCode });
            });
          }
        });
        commit("setEvtSrc", target);
      } else {
        throw "failed";
      }
    } catch (error) {
      console.log("获取事件来源信息失败");
    }
  },
  // 情报板
  async getAllInformationBoards({ state, commit }: any): Promise<void> {
    if (state.informationBoards?.length > 0) {
      return;
    }
    commit("setLoading", {
      key: "INFOMATION_BOARD_POINT",
      value: true,
    });
    try {
      const res: any = await axios.get(
        "/manage/getDeviceInfoList?typeCode=TY003&page=1&pageSize=1000"
      );
      if (res.result && res.datas) {
        commit("setInformationBoards", res.datas);
      } else {
        throw "获取情报板数据失败";
      }
      commit("setLoading", {
        key: "INFOMATION_BOARD_POINT",
        value: false,
      });
    } catch (error) {
      commit("setLoading", {
        key: "INFOMATION_BOARD_POINT",
        value: false,
      });
      console.log("获取情报板数据失败");
      commit("removeLayer", "INFOMATION_BOARD_POINT");
    }
  },
  // 视频
  async getAllCameras({ state, commit }: any): Promise<void> {
    if (state.camaras?.length > 0) {
      return;
    }
    commit("setLoading", {
      key: "CAMERA_POINT",
      value: true,
    });
    try {
      const res: any = await axios.get("/video/getVideoDeviceList");
      if (res.result && res.datas) {
        commit("setCamaras", res.datas);
      } else {
        throw "获取摄像头数据失败";
      }
      commit("setLoading", {
        key: "CAMERA_POINT",
        value: false,
      });
    } catch (error) {
      commit("setLoading", {
        key: "CAMERA_POINT",
        value: false,
      });
      console.log("获取摄像头失败");
      commit("removeLayer", "CAMERA_POINT");
    }
  },
};

// mutations
const mutations = {
  setRoadBase: (state: State, roadBase: any) => {
    state.roadBase = roadBase;
  },
  setGantryBase: (state: State, gantryBase: any) => {
    state.gantryBase = gantryBase;
  },
  setEvtSrc: (state: State, evtSrc: any) => {
    state.evtSrc = evtSrc;
  },
  setCheckedLayers: (state: State, checked: any) => {
    state.checkedLayers = checked;
  },
  setLoading: (state: State, { key, value }: any) => {
    state.loadings[key] = value;
  },
  setInformationBoards: (state: State, list: any) => {
    state.informationBoards = list;
  },
  setCamaras: (state: State, list: any) => {
    state.camaras = list;
  },
  setEvtList: (state: State, list: any) => {
    state.evtList = list;
  },
  removeLayer: (state: State, name: any) => {
    state.checkedLayers = state.checkedLayers.filter((e: any) => e !== name);
  },
  setSelectRoadId: (state: State, selectRoadId: any) => {
    state.selectRoadId = selectRoadId;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
