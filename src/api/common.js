import {initAxios} from "../common/tools";


//导出excel 功能
/*export const excelDownload = (params, options) => {
  return initAxios().post(`/v1/excelExport`, params, options).then(res => res.data);
 };*/

export const excelDownload = (params, options) => {
  return initAxios().get(`/v1/excelExport`, params).then(res => res.data);
};