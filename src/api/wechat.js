import {initAxios} from "../common/tools";


//获取微信公众号信息
export const getWechatInfo = params => {
  return initAxios().post(`/v1/wechatInfo`, params).then(res => res.data);
};
///更新微信公纵号信息
export const updateWechatInfo = params => {
  return initAxios().post(`/v1/wechat/update`, params).then(res => res.data);
};
export const getWechatSettingDetail = params => {
  return initAxios().post(`/v1/wechat/getWechatSettingDetail`, params).then(res => res.data);
};