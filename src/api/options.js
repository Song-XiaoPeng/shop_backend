import {initAxios} from "../common/tools";

//获取期权账户
export const getChildShareOptionAccounts = params => {
  return initAxios().post(`/v1/childShareOptionAccounts`, params).then(res => res.data);
};

//委托认购
export const getChildShareOptionBuys = params => {
  return initAxios().post(`/v1/childShareOptionBuys`, params).then(res => res.data);
};

//委托行权
export const getChildShareOptionSells = params => {
  return initAxios().post(`/v1/childShareOptionSells`, params).then(res => res.data);
};

//更新委托行权
export const updateOptionBuy = params => {
  return initAxios().post(`/v1/childShareOptionBuy/update`, params).then(res => res.data);
};

//期权持仓
export const getChildShareOptionHolds = params => {
  return initAxios().post(`/v1/childShareOptionHolds`, params).then(res => res.data);
};

//创建期权行权
export const createOptionSell = params => {
  return initAxios().post(`/v1/childShareOptionSell/store`, params).then(res => res.data);
};

//更新期权行权
export const updateOptionSell = params => {
  return initAxios().post(`/v1/childShareOptionSell/update`, params).then(res => res.data);
};

//期权消息
export const getChildShareOptionMessages = params => {
  return initAxios().post(`/v1/childShareOptionMessages`, params).then(res => res.data);
};

//期权短信
export const getChildShareOptionSmsLogs = params => {
  return initAxios().post(`/v1/childShareOptionSmsLogs`, params).then(res => res.data);
};

//期权金明细
export const getChildShareOptionAmountFees = params => {
  return initAxios().post(`/v1/childShareOptionAmountFees`, params).then(res => res.data);
};

//期权金手续费
export const getChildShareOptionServiceFees = params => {
  return initAxios().post(`/v1/childShareOptionServiceFees`, params).then(res => res.data);
};

//期权金日管理费
export const getChildShareOptionDailyFees = params => {
  return initAxios().post(`/v1/childShareOptionDailyFees`, params).then(res => res.data);
};

//期权报表
export const getChildShareOptionReport = params => {
    return initAxios().post(`/v1/childShareOptionReport`, params).then(res => res.data);
};

//获取期权报价
export const getOptionsQuotations = params => {
    return initAxios().post(`/v1/optionsQuotations`, params).then(res => res.data);
};