//管理员的菜单
export const adminMenu = [
  {
    path: '/system',
    name: '系统管理',
    iconClass: 'fa fa-asterisk',//图标样式class
    children: [
      {path: '/system/user', name: '后台用户'},
      {path: '/system', name: '系统配置'},
      {path: '/system/financeProducts', name: '产品管理'},
    ],
  },
  {
    path: '/client',
    name: '客户管理',
    iconClass: 'fa fa-user-plus',
    children: [
      {path: '/client', name: '客户列表'},
      {path: '/client/account', name: '客户资金'},
      {path: '/client/recharge', name: '客户充值'},
      {path: '/client/withdraw', name: '客户提现'},
      {path: '/client/bankCard', name: '银行卡管理'},
      {path: '/client/message', name: '短信管理'},
    ],
  },
  {
    path: '/trade',
    name: '交易管理',
    iconClass: 'fa fa-yen',
    children: [
      {path: '/trade/uStockFinanceEntrusts', name: '当日委托'},
      {path: '/trade/uStockFinanceDayMakedeals', name: '当日成交'},
      {path: '/trade/uStockFinanceEntrustHistorys', name: '历史委托'},
      {path: '/trade/uStockFinanceDayMakedealHistorys', name: '历史成交'},
      {path: '/trade/uStockFinancingFlows', name: '资金流水'},
      {path: '/trade/uStockFinacingHoldingList', name: '持仓股份'},
      {path: '/trade/uStockFinaceHoldingAssignList', name: '系统分配'},
      {path: '/trade/stockFinanceRiskLogs', name: '风控日志'},
      {path: '/trade/uParentStockFinanceEntrustsSell', name: '母账户系统卖出'},
      {path: '/trade/uParentStockFinanceEntrustsBuy', name: '母账户系统买入'},
      {path: '/trade/uStockFinanceMakedealFees', name: '佣金统计'},
      {path: '/trade/platformCommissionFlows', name: '平台资金'}
    ],
  },
  {
    path: '/report',
    name: '查询统计',
    iconClass: 'fa fa-pie-chart',
    children: [
      {path: '/report/agentDayAchievementReports', name: '代理商日报表'},
      {path: '/report/agentMaxPerformanceReports', name: '代理商峰值表'},
      {path: '/report/clientDay', name: '运营日报表'},
      {path: '/report/clientFull', name: '运营累计报表'},
      /*{path: '/report/employeeDay', name: '员工日报表'},
       {path: '/report/employeeFull', name: '员工累计报表'},*/
    ],
  }
];
