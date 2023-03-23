import request from "@/utils/request";

const getTrademarkList = "/admin/product/baseTrademark";
const getAllTrademarkList = "/admin/product/baseTrademark/getTrademarkList";
const addTrademark = "/admin/product/baseTrademark/save";
const updateTrademark = "/admin/product/baseTrademark/update";
const delTrademark = "/admin/product/baseTrademark/remove";

/**
 * 获取品牌分页列表
 * @param page 当前页码
 * @param limit 每页条数
 * @returns TrademarkList
 */
export const getTrademarkListApi = (page, limit) => {
  return request({
    url: getTrademarkList + `/${page}/${limit}`,
  });
};

/**
 * 获取所有品牌列表
 * @returns TrademarkList
 */
export const getAllTrademarkListApi = () => {
  return request({
    url: getAllTrademarkList,
  });
};

/**
 * 添加品牌
 * @param tmName 品牌名称
 * @param logoUrl 品牌LOGO
 * @returns null
 */
export const addTrademarkApi = (tmName, logoUrl) => {
  return request({
    url: addTrademark,
    method: "post",
    data: {
      tmName,
      logoUrl,
    },
  });
};

/**
 * 更新品牌
 * @param data TrademarkItem
 * @returns null
 */
export const updateTrademarkApi = (data) => {
  return request({
    url: updateTrademark,
    method: "put",
    data,
  });
};

/**
 * 删除品牌
 * @param id 品牌id
 * @returns null
 */
export const delTrademarkApi = (id) => {
  return request({
    url: delTrademark + `/${id}`,
    method: "delete",
  });
};
