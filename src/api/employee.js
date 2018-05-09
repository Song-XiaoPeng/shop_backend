import {initAxios} from '../common/tools';

//获取代理商员工列表
export const employeeList = params => {
    return initAxios().get(`/v1/employeeList`, params).then(res => res.data);
};


export const employeeCreate = params => {
    return initAxios().post(`/v1/employeeCreate`, params).then(res => res.data);
};


export const employeeInfo = params => {
    return initAxios().post(`/v1/employeeInfo`, params).then(res => res.data);
};

export const employeeUpdate = params => {
    return initAxios().post(`/v1/employeeUpdate`, params).then(res => res.data);
};