import {initAxios} from '../common/tools';


export const agentBankCardSendSms = params => {
  return initAxios().post(`/v1/agentBankCardSendSms`, params).then(res => res.data);
};

export const agentBankCardInfo = params => {
  return initAxios().post(`/v1/agentBankCardInfo`, params).then(res => res.data);
};

export const agentBankCardUpdate = params => {
  return initAxios().post(`/v1/agentBankCardUpdate`, params).then(res => res.data);
};
