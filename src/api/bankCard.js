import {initAxios} from '../common/tools';


export const bankCardList = params => {
    return initAxios().get(`/v1/bankCardList`, params).then(res => res.data);
};


//更新客户信息
export const bankCardUpdate = params => {
    return initAxios().post(`/v1/bankCardUpdate`, params).then(res => res.data);
};


//单条银行卡数据
export const getClientBankInfo = params => {
  return initAxios().post(`/v1/bankCardInfo`, params).then(res => res.data);
};
