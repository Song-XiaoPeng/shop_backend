import {initAxios} from "../common/tools";

//子账户一键平仓
export const eveningUp = params => {
    return initAxios().post(`/v1/javaApi/eveningUp`, params).then(res => res.data);
};
//子账户分笔平仓
export const eveningUpPerHolding = params => {
    return initAxios().post(`/v1/javaApi/eveningUpPerHolding`, params).then(res => res.data);
};
//系统除权除息
export const doXrdr = params => {
    return initAxios().post(`/v1/javaApi/doXrdr`, params).then(res => res.data);
};

//买入交易关联当日子账户
export const assignBuyDayMakeDeal = params => {
    return initAxios().post(`/v1/javaApi/assignBuyDayMakeDeal`, params).then(res => res.data);
};
//买入交易关联历史子账户
export const assignBuyHistoryMakeDeal = params => {
    return initAxios().post(`/v1/javaApi/assignBuyHistoryMakeDeal`, params).then(res => res.data);
};
//卖出交易关联当日子账户
export const assignSellDayMakeDeal = params => {
    return initAxios().post(`/v1/javaApi/assignSellDayMakeDeal`, params).then(res => res.data);
};
//卖出交易关联历史子账户
export const assignSellHistoryMakeDeal = params => {
    return initAxios().post(`/v1/javaApi/assignSellHistoryMakeDeal`, params).then(res => res.data);
};


//修改母账户余额
export const adjustBalance = params => {
    return initAxios().post(`/v1/javaApi/adjustBalance`, params).then(res => res.data);
};

//系统派股票
export const postDeliveryStock = params => {
  return initAxios().post(`/v1/javaApi/deliveryStock`, params).then(res => res.data);
};

//股票回收
export const postRetrieveStock = params => {
  return initAxios().post(`/v1/javaApi/retrieveStock`, params).then(res => res.data);
};

//股票回收
export const postAssignStock = params => {
  return initAxios().post(`/v1/javaApi/assignStock`, params).then(res => res.data);
};

//结算
export const settleup = params => {
    return initAxios().post(`/v1/javaApi/settleup`, params).then(res => res.data);
};

//期权子账户平仓
export const childOptionLiquidate = params => {
  return initAxios().post(`/v1/javaApi/childOptionLiquidate`, params).then(res => res.data);
};

//平台期权账号登陆
export const childOptionLiquidateLogin = params => {
  return initAxios().post(`/v1/javaApi/childOptionLiquidateLogin`, params).then(res => res.data);
};

//发送期权交易短信
export const childOptionSendOptionTradeApply = params => {
  return initAxios().post(`/v1/javaApi/childOptionSendOptionTradeApply`, params).then(res => res.data);
};

//设置平台cookie
export const childOptionSetCookie = params => {
  return initAxios().post(`/v1/javaApi/childOptionSetCookie`, params).then(res => res.data);
};

//设置平台机器码
export const childOptionSetDeviceCode = params => {
  return initAxios().post(`/v1/javaApi/childOptionSetDeviceCode`, params).then(res => res.data);
};

//同步适当性审核申请列表
export const childOptionSyncNeedVerifyProductList = params => {
  return initAxios().post(`/v1/javaApi/childOptionSyncNeedVerifyProductList`, params).then(res => res.data);
};

//同步做市场产品列表
export const childOptionSyncProductList = params => {
  return initAxios().post(`/v1/javaApi/childOptionSyncProductList`, params).then(res => res.data);
};

//验证期权交易短信
export const childOptionVerifyOptionTradeApply = params => {
  return initAxios().post(`/v1/javaApi/childOptionVerifyOptionTradeApply`, params).then(res => res.data);
};

//验证期权交易短信
export const childOptionVerifyLoginStatus = params => {
  return initAxios().post(`/v1/javaApi/childOptionVerifyLoginStatus`, params).then(res => res.data);
};

//验证期权交易短信
export const childOptionVerifyMarketInfo = params => {
  return initAxios().post(`/v1/javaApi/childOptionVerifyMarketInfo`, params).then(res => res.data);
};