import {initAxios} from '../common/tools';


//获取客户列表
export const clientList = params => {
    return initAxios().get(`/v1/clientList`, params).then(res => res.data);
};


//更新客户信息
export const clientUpdate = params => {
    return initAxios().post(`/v1/clientUpdate`, params).then(res => res.data);
};

//创建代理商 token
export const agentCreate = params => {
    return initAxios().post(`/v1/agentCreate`, params).then(res => res.data);
};

//客户流水  clientFlowAdd

export const clientAcountFlowAdjust = params => {
    return initAxios().post(`/v1/clientAcountFlowAdjust`, params).then(res => res.data);
};


export const getAgentSelectorList = params => {
  return initAxios().post(`/v1/getAgentSelectorList`, params).then(res => res.data);
};

export const getEmployeeSelectorList = params => {
  return initAxios().post(`/v1/getEmployeeSelectorList`, params).then(res => res.data);
};

export const clientInfo = params => {
  return initAxios().post(`/v1/clientInfo`, params).then(res => res.data);
};


export const swapClientHeritRelation = params => {
    return initAxios().post(`/v1/swapClientHeritRelation`, params).then(res => res.data);
};


//获取客户的充值记录
export const fetchClientRechargeList = params => {
    return initAxios().get(`/v1/clientRechargeList`, params).then(res => res.data);
};
//获取客户的充值记录
export const getClientRechargeInfo = params => {
  return initAxios().post(`/v1/clientRechargeInfo`, params).then(res => res.data);
};
export const updateClientRechargeInfo = params => {
  return initAxios().post(`/v1/clientRechargeUpdate`, params).then(res => res.data);
};


//客户资金流水
export const clientAccountList = params => {
    return initAxios().get(`/v1/clientAccountList`, params).then(res => res.data);
};


//短信列表
export const getAgentMessageList = params => {
  return initAxios().get(`/v1/agentMessageList`, params).then(res => res.data);
};

//颁发客户登陆token
export const issueClientToken = params => {
  return initAxios().post(`/v1/issueClientToken`, params).then(res => res.data);
};

//查询用户的充值情况
export const queryUserAccount = params =>{
    return initAxios().post(`/v1/queryUserAccount`,params).then(res => res.data)
}

//获得客户的完整电话号码
export const getCustomerPhone = params =>{
    return initAxios().post(`/v1/getCustomerPhone`,params).then(res => res.data)
}
