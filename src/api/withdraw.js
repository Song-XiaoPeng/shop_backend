import {initAxios} from '../common/tools';

//获取客户列表
export const withdrawList = params => {
    return initAxios().get(`/v1/withdrawList`, params).then(res => res.data);
};

//更新客户信息
export const withdrawUpdate = params => {
    return initAxios().post(`/v1/withdrawUpdate`, params).then(res => res.data);
};

//更新客户信息
export const withdrawCheckAll = params => {
    return initAxios().post(`/v1/withdrawCheckAll`, params).then(res => res.data);
};

//获取提现详情
export const withdrawInfo = params => {
  return initAxios().post(`/v1/withdrawInfo`, params).then(res => res.data);
};
