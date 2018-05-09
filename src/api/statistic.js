import {initAxios} from '../common/tools';

//代理商业绩
export const getAgentDayAchievementReportList = params => {
  return initAxios().get(`/v1/agentDayAchievementReportList`, params).then(res => res.data);
};
