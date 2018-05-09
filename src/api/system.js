import {initAxios} from '../common/tools';

//系统参数
export const getSystemParams = (params = null) => {
    return initAxios().post(`/v1/systemParams`, params).then(res => {
        return res.data
    });
};
export const getSystemParam = (params = null) => {
    return initAxios().post(`/v1/systemParam`, params).then(res => {
        return res.data
    });
};

export const updateSystemParam = params => {
    return initAxios().post(`/v1/systemParam/update`, params).then(res => res.data);
};

//节假日维护管理
export const getHolidayMaintains = params => {
    return initAxios().post(`/v1/holidayMaintains`, params).then(res => res.data);
};
export const getHolidayMaintain = ($id, params) => {
    return initAxios().post(`/v1/holidayMaintain/` + $id, params).then(res => res.data);
};
export const storeHolidayMaintain = params => {
    return initAxios().post(`/v1/holidayMaintain/store`, params).then(res => res.data);
};
export const updateHolidayMaintain = ($id, params) => {
    return initAxios().post(`/v1/holidayMaintain/update/` + $id, params).then(res => res.data);
};
export const destroyHolidayMaintain = ($id, params) => {
    return initAxios().post(`/v1/holidayMaintain/destroy/` + $id, params).then(res => res.data);
};


//股票配资产品
export const getStockFinanceProducts = params => {
    return initAxios().post(`/v1/stockFinanceProducts`, params).then(res => res.data);
};
export const getStockFinanceProduct = ($id, params) => {
    return initAxios().post(`/v1/stockFinanceProduct/` + $id, params).then(res => res.data);
};
export const storeStockFinanceProduct = params => {
    return initAxios().post(`/v1/stockFinanceProduct/store`, params).then(res => res.data);
};
export const updateStockFinanceProduct = ($id, params) => {
    return initAxios().post(`/v1/stockFinanceProduct/update/` + $id, params).then(res => res.data);
};
export const destroyStockFinanceProduct = ($id, params) => {
    return initAxios().post(`/v1/stockFinanceProduct/destroy/` + $id, params).then(res => res.data);
};

//股票信息
export const getStockInfos = params => {
    return initAxios().post(`/v1/stockInfos`, params).then(res => res.data);
};
export const getStockInfo = ($id, params) => {
    return initAxios().post(`/v1/stockInfo/` + $id, params).then(res => res.data);
};
export const storeStockInfo = params => {
    return initAxios().post(`/v1/stockInfo/store`, params).then(res => res.data);
};
export const updateStockInfo = ($id, params) => {
    return initAxios().post(`/v1/stockInfo/update/` + $id, params).then(res => res.data);
};
export const destroyStockInfo = ($id, params) => {
    return initAxios().post(`/v1/stockInfo/destroy/` + $id, params).then(res => res.data);
};

//费用标准
export const getStockFees = params => {
    return initAxios().post(`/v1/stockFees`, params).then(res => res.data);
};
export const getStockFee = ($id, params) => {
    return initAxios().post(`/v1/stockFee/` + $id, params).then(res => res.data);
};
export const storeStockFee = params => {
    return initAxios().post(`/v1/stockFee/store`, params).then(res => res.data);
};
export const updateStockFee = ($id, params) => {
    return initAxios().post(`/v1/stockFee/update/` + $id, params).then(res => res.data);
};

//风控规则
export const getTransRistControlRules = (params = null) => {
    return initAxios().post(`/v1/transRistControlRules`, params).then(res => {
        return res.data
    });
};

//系统设置
export const getSystemSettingList = (params = null) => {
    return initAxios().post(`/v1/getSystemSettingList`, params).then(res => {
        return res.data
    });
};
export const setSystemSetting = (params = null) => {
    return initAxios().post(`/v1/setSystemSetting`, params).then(res => {
        return res.data
    });
};
export const delSystemSetting = (params = null) => {
    return initAxios().post(`/v1/delSystemSetting`, params).then(res => {
        return res.data
    });
};
export const getSystemSettingDetails = (params = null) => {
    return initAxios().post(`/v1/getSystemSettingDetails`, params).then(res => {
        return res.data
    });
};