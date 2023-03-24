import request from "@/utils/request";

const getCategory1 = "/admin/product/getCategory1";
const getCategory2 = "/admin/product/getCategory2";
const getCategory3 = "/admin/product/getCategory3";

export const getCategory1Api = () => {
  return request.get(getCategory1);
};
/**
 * @description:
 * @param {number} id
 * @return {*}
 */
export const getCategory2Api = (id) => {
  return request.get(getCategory2 + `/${id}`);
};

export const getCategory3Api = (id) => {
  return request.get(getCategory3 + `/${id}`);
};
