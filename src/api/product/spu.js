import request from "@/utils/request";

const getSpuList = "/admin/product";
const getBaseSaleAttrList = "/admin/product/baseSaleAttrList";
const saveSpuInfo = "/admin/product/saveSpuInfo";
const getSpuInfo = "/admin/product/getSpuInfo";
const getSpuImageList = "/admin/product/spuImageList";
const getSpuSaleAttrList = "/admin/product/spuSaleAttrList";
const postSpuInfo = "/admin/product/updateSpuInfo";

export const getSpuListApi = ({ page, limit, category3Id }) => {
  return request.get(
    getSpuList + `/${page}/${limit}?category3Id=${category3Id}`
  );
};

export const getBaseSaleAttrListApi = () => {
  return request.get(getBaseSaleAttrList);
};

export const saveSpuInfoApi = (data) => {
  return request.post(saveSpuInfo, data);
};

export const getSpuInfoApi = (spuId) => {
  return request.get(getSpuInfo + `/${spuId}`);
};

export const getSpuImageListApi = (spuId) => {
  return request.get(getSpuImageList + `/${spuId}`);
};

export const getSpuSaleAttrListApi = (spuId) => {
  return request.get(getSpuSaleAttrList + `/${spuId}`);
};

export const postSpuInfoApi = (data) => {
  return request.post(postSpuInfo, data);
};
