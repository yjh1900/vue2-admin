import {
  getSpuListApi,
  getBaseSaleAttrListApi,
  saveSpuInfoApi,
  getSpuInfoApi,
  getSpuImageListApi,
  getSpuSaleAttrListApi,
  postSpuInfoApi,
} from "@/api/product/spu";

// 定义数据
// 多个模块（至少两个）共享的数据
// 当前模块管理的状态数据
const state = {
  curSpuItem: {},
  spuList: [],
};
// 只读的计算属性数据
const getters = {};
// 直接修改vuex数据方法
const mutations = {
  GET_CATEGORY_1_LIST(state, list1) {
    state.category1List = list1;
  },
  GET_CATEGORY_2_LIST(state, { list2, c1Id }) {
    state.category1Id = c1Id;
    state.category2List = list2;
    state.category2Id = undefined;
    state.category3Id = undefined;
    state.category3List = [];
  },
};
// 发送请求的操作（负责与后端进行交互）
const actions = {
  async getCategory1List({ commit }) {
    const list1 = await getCategory1Api();
    commit("GET_CATEGORY_1_LIST", list1.data);
  },
  async getCategory2List({ commit }, c1Id) {
    const list2 = await getCategory2Api(c1Id);
    commit("GET_CATEGORY_2_LIST", { list2: list2.data, c1Id });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
