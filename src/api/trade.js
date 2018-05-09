import {initAxios} from '../common/tools';

//当日委托
export const getUStockFinanceEntrusts = params => {
    return initAxios().post(`/v1/uStockFinanceEntrusts`, params).then(res => res.data);
};

//当日成交
export const getUStockFinanceDayMakedeals = params => {
    return initAxios().post(`/v1/uStockFinanceDayMakedeals`, params).then(res => res.data);
};

//母账户当日系统卖出或买入（成交）
export const getUParentStockFinanceDayMakedeals = params => {
    return initAxios().post(`/v1/uParentStockFinanceDayMakedeals`, params).then(res => res.data);
};
//母账户历史系统卖出或买入（成交）
export const getUParentStockFinanceDayMakedealHistorys = params => {
    return initAxios().post(`/v1/uParentStockFinanceDayMakedealHistorys`, params).then(res => res.data);
};

//母账户当日系统卖出或买入（委托）
export const getUParentStockFinanceEntrusts = params => {
    return initAxios().post(`/v1/uParentStockFinanceEntrusts`, params).then(res => res.data);
};
//母账户历史系统卖出或买入（委托）
export const getUParentStockFinanceEntrustHistorys = params => {
    return initAxios().post(`/v1/uParentStockFinanceEntrustHistorys`, params).then(res => res.data);
};

//历史委托
export const getUStockFinanceEntrustHistorys = params => {
    return initAxios().post(`/v1/uStockFinanceEntrustHistorys`, params).then(res => res.data);
};

//历史成交
export const getUStockFinanceDayMakedealHistorys = params => {
    return initAxios().post(`/v1/uStockFinanceDayMakedealHistorys`, params).then(res => res.data);
};

//资金流水
export const getUStockFinancingFlows = params => {
    return initAxios().post(`/v1/uStockFinancingFlows`, params).then(res => res.data);
};

//风控日志
export const getStockFinanceRiskLogs = params => {
    return initAxios().post(`/v1/stockFinanceRiskLogs`, params).then(res => res.data);
};

//佣金统计(实际还是成交表~)
export const getUStockFinanceMakedealFees = params => {
    return initAxios().post(`/v1/uStockFinanceDayMakedeals/fee_list`, params).then(res => res.data);
};

//持仓股份
export const getUStockFinanceHoldings = params => {
    return initAxios().post(`/v1/uStockFinanceHoldings`, params).then(res => res.data);
};

//平台资金
export const getPlatformCommissionFlows = params => {
  return initAxios().post(`/v1/platformCommissionFlows`, params).then(res => res.data);
};
