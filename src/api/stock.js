import {initAxios} from '../common/tools';

//操操盘账户（子账户）  /以及风控管理
export const getUStockFinancings = params => {
    return initAxios().post(`/v1/uStockFinancings`, params).then(res => res.data);
};

export const getUStockFinancingsRiskList = params => {
    return initAxios().post(`/v1/uStockFinancings/riskList`, params).then(res => res.data);
};
export const getUStockFinancing = ($id, params) => {
    return initAxios().post(`/v1/uStockFinancing/` + $id, params).then(res => res.data);
};
export const storeUStockFinancing = params => {
    return initAxios().post(`/v1/uStockFinancing/store`, params).then(res => res.data);
};
export const updateUStockFinancing = ($id, params) => {
    return initAxios().post(`/v1/uStockFinancing/update/` + $id, params).then(res => res.data);
};

//配资付息记录
export const getUStockFinanceInterestPercentages = params => {
    return initAxios().post(`/v1/uStockFinanceInterestPercentages`, params).then(res => res.data);
};
export const getUStockFinanceInterestPercentagesSFID = ($id, params) => {
    return initAxios().post(`/v1/uStockFinanceInterestPercentages/stock_finance_id/` + $id, params).then(res => res.data);
};

//除权降息管理
export const getXrDrInfos = params => {
    return initAxios().post(`/v1/xrDrInfos`, params).then(res => res.data);
};

//资金池管理
export const getCapitalPools = params => {
    return initAxios().post(`/v1/capitalPools`, params).then(res => res.data);
};
export const getCapitalPool = ($id, params) => {
    return initAxios().post(`/v1/capitalPool/` + $id, params).then(res => res.data);
};
export const storeCapitalPool = params => {
    return initAxios().post(`/v1/capitalPool/store`, params).then(res => res.data);
};
export const updateCapitalPool = ($id, params) => {
    return initAxios().post(`/v1/capitalPool/update/` + $id, params).then(res => res.data);
};

//母账户管理
export const getParentStockFinances = params => {
    return initAxios().post(`/v1/parentStockFinances`, params).then(res => res.data);
};
export const getParentStockFinance = ($id, params) => {
    return initAxios().post(`/v1/parentStockFinance/` + $id, params).then(res => res.data);
};
export const storeParentStockFinance = params => {
    return initAxios().post(`/v1/parentStockFinance/store`, params).then(res => res.data);
};
export const updateParentStockFinance = ($id, params) => {
    return initAxios().post(`/v1/parentStockFinance/update/` + $id, params).then(res => res.data);
};
