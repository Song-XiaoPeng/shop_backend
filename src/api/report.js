import {initAxios} from "../common/tools";

//代理商日报表
export const agentDayAchievementReports = params => {
    return initAxios().post(`/v1/report/agentDayAchievementReports`, params).then(res => res.data);
};

//代理商日报表
export const agentDayAchievementReportsChildren = params => {
    return initAxios().post(`/v1/report/agentDayAchievementReportsChildren`, params).then(res => res.data);
};

//代理商峰值表
export const agentMaxPerformanceReports = params => {
    return initAxios().post(`/v1/report/agentMaxPerformanceReports`, params).then(res => res.data);
};

//代理商峰值表
export const agentMaxPerformanceReportsChildren = params => {
    return initAxios().post(`/v1/report/agentMaxPerformanceReportsChildren`, params).then(res => res.data);
};

//客户日报表
export const getClientDayReports = params => {
  return initAxios().get(`/v1/report/clientDayReports`, params).then(res => res.data);
};
//客户总业绩表
export const getClientFullReports = params => {
  return initAxios().get(`/v1/report/clientFullReports`, params).then(res => res.data);
};


//员工日报表
export const getEmployeeDayReports = params => {
  return initAxios().get(`/v1/report/employeeDayReports`, params).then(res => res.data);
};
//员工总表
export const getEmployeeFullReports = params => {
  return initAxios().get(`/v1/report/employeeFullReports`, params).then(res => res.data);
};
