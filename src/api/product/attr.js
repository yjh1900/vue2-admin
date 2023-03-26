import store from "@/store";
import request from "@/utils/request";
const getAttrList = "/admin/product/attrInfoList";

// store.state.category.category1Id
// 注意添加模块名category
export const getAttrListApi = () => {
  return request.get(
    getAttrList +
      `/${store.state.category.category1Id}/${store.state.category.category2Id}/${store.state.category.category3Id}`
  );
};
