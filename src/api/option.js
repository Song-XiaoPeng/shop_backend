import {initAxios} from '../common/tools';

//期权客户账户
export const getOptionChildAccounts = params => {
  return initAxios().post(`/v1/optionChildAccounts`, params).then(res => res.data);
};

export const getOptionChildAccount = ($id, params) => {
  return initAxios().post(`/v1/optionChildAccount/` + $id, params).then(res => res.data);
};

export const updateOptionChildAccount = ($id, params) => {
  return initAxios().post(`/v1/optionChildAccount/update/` + $id, params).then(res => res.data);
};

//权利仓查询
export const getOptionChildHolds = params => {
  return initAxios().post(`/v1/optionChildHolds`, params).then(res => res.data);
};
//期权付息
export const getOptionInterests = params => {
  return initAxios().post(`/v1/optionInterests`, params).then(res => res.data);
};
//期权佣金
export const getOptionFees = params => {
  return initAxios().post(`/v1/optionFees`, params).then(res => res.data);
};
//期权产品申请
export const getOptionProductApplys = params => {
  return initAxios().post(`/v1/optionProductApplys`, params).then(res => res.data);
};
//最近一次登录及短信信息
export const getOptionLoginAndMsgInfo = params => {
  return initAxios().post(`/v1/optionLoginAndMsgInfos`, params).then(res => res.data);
};