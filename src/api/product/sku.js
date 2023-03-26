import request from "@/utils/request";

const addSku = "/admin/product/saveSkuInfo";
const getSkuListBySpuId = "/admin/product/findBySpuId";
const getSkuList = "/admin/product/list";
const cancelSale = "/admin/product/cancelSale";
const onSale = "/admin/product/onSale";
const getSkuById = "/admin/product/getSkuById";

/**
 * 添加SKU
 * @param data AddOrUpdateSkuParams
 * @returns null
 */
export const addSkuApi = (data) => {
  return request.post(addSku, data);
};

/**
 * 通过SpuId获取Sku列表
 * @param spuId
 * @returns SkuList
 */
export const getSkuListBySpuIdApi = (spuId) => {
  return request.get(getSkuListBySpuId + `/${spuId}`);
};

/**
 * 获取SKU列表
 * @param page 当前页码
 * @param limit 每页条数
 * @returns GetSkuListApiResponse
 */
export const getSkuListApi = (page, limit) => {
  return request.get(getSkuList + `/${page}/${limit}`);
};

/**
 * 下架
 * @param skuId
 * @returns null
 */
export const cancelSaleApi = (skuId) => {
  return request.get(cancelSale + `/${skuId}`);
};

/**
 * 上架
 * @param skuId
 * @returns null
 */
export const onSaleApi = (skuId) => {
  return request.get(onSale + `/${skuId}`);
};

/**
 * 根据SkuId获取Sku详情
 * @param skuId
 * @returns AddOrUpdateSkuParams
 */
export const getSkuByIdApi = (skuId) => {
  return request.get(getSkuById + `/${skuId}`);
};
