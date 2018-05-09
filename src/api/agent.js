import {initAxios} from "../common/tools";


//更新代理商的信息信息
export const agentUpdate = params => {
    return initAxios().post(`/v1/agentUpdate`, params).then(res => res.data);
};

//更新代理商的附加信息
export const agentUpdateInfo = params => {
    return initAxios().post(`/v1/agentChangeInfo`, params).then(res => res.data);
};
//修改代理商分成比例
export const agentUpdatePercentage = params => {
    return initAxios().post(`/v1/agentChangePercentage`, params).then(res => res.data);
};

//创建代理商 token
export const agentCreate = params => {
    return initAxios().post(`/v1/agentCreate`, params).then(res => res.data);
};

//修改代理商基本信息
export const agentChangeBasicInfo = params => {
    return initAxios().post(`/v1/agentChangeBasic`, params).then(res => res.data);
};

//agentChangeInfo


//获取代理商列表 创建编辑的时候
export const agentSelectorList = params => {
    return initAxios().post(`/v1/agentSelectorList`, params).then(res => res.data);
};

//代理商列表 包含分页 和 代理商名称搜索
export const agentList = params => {
    return initAxios().get(`/v1/agentList`, params).then(res => res.data);
};
//获取代理商的信息信息
export const getAgentInfo = params => {
    return initAxios().post(`/v1/agentInfo`, params).then(res => res.data);
};


//代理提现记录审核
export const getAgentCashList = params => {
    return initAxios().get(`/v1/agentCashList`, params).then(res => res.data);
};

//获取推广码
export const getRecommendCode = params => {
    return initAxios().post(`/v1/recommendCode`, params).then(res => res.data);
};


//获取代理商的后辈代理商
export const getAgentChildrenList = params => {
    return initAxios().get(`/v1/agentChildrenList`, params).then(res => res.data);
};


//agentCashUpdate

export const getAgentCashInfo = params => {
  return initAxios().post(`/v1/agentCashInfo`, params).then(res => res.data);
};
//获取代理商提现单条信息
export const updateAgentCashInfo = params => {
  return initAxios().post(`/v1/agentCashUpdate`, params).then(res => res.data);
};

//获取代理商服务列表
export const getAgentServiceFeeList = params => {
  return initAxios().get(`/v1/agentServiceFeeList`, params).then(res => res.data);
};


//代理商利息分钱
export const getAgentInterestList = params => {
  return initAxios().get(`/v1/agent/interestList`, params).then(res => res.data);
};
//获取代理商资金池信息
export const getAgentCapitalPoolListWithInfo = params => {
  return initAxios().post(`/v1/agentCapitalPoolListWithInfo`, params).then(res => res.data);
};
