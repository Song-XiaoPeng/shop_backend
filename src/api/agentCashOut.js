import {initAxios} from "../common/tools";


export const agentCashOutInfo = params => {
  return initAxios().post(`/v1/agentCashOutInfo`, params).then(res => res.data);
};

export const agentInterestCashInfo = params => {
    return initAxios().post(`/v1/agentInterestCashInfo`, params).then(res => res.data);
};
export const agentReserveInterestCashInfo = params => {
    return initAxios().post(`/v1/agentReserveInterestCashInfo`, params).then(res => res.data);
};
export const agentCommisionCashInfo = params => {
    return initAxios().post(`/v1/agentCommisionCashInfo`, params).then(res => res.data);
};

export const agentCashOutUpdate = params => {
  return initAxios().post(`/v1/agentCashOutUpdate`, params).then(res => res.data);
};
