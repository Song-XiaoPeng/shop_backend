//管理员的菜单
export const adminMenuOption2 = [
    {
        path: '/system',
        name: '系统管理',
        iconClass: 'fa fa-asterisk',//图标样式class
        children: [
            {path: '/system/user', name: '后台用户'},
            {path: '/system', name: '系统配置'},
            {path: '/system/holidayMaintains', name: '节假日'},
            {path: '/system/infos', name: '股票代码'},
            {path: '/system/financeProducts', name: '产品管理'},
            {path: '/system/fees', name: '收费标准'},
            {path: '/system/transRistControlRules', name: '风控标准'},
        ],
    },
    {
        path: '/cms',
        name: '内容管理',
        iconClass: 'fa fa-book',
        children: [
            {path: '/content/protocols', name: '协议管理'},
            {path: '/content/helps', name: '帮助管理'},
            {path: '/content/articles', name: '文章管理'},
            /*{path: '/content/wechats', name: '微信公众号管理'},*/
            {path: '/content/others', name: '其他管理'},
        ]
    },
    {
        path: '/agent',
        name: '代理管理',
        iconClass: 'fa fa-bank',
        children: [
            {
                path: '/agent',
                name: '代理列表',
            },
            {
                path: '/agent/cash',
                name: '提现记录',
            },
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
        path: '/stock',
        name: '配资管理',
        iconClass: 'fa fa-btc',
        children: [
            {path: '/stock/uStockFinancings', name: '操盘账户'},
            {path: '/stock/uStockFinancingRisks', name: '风控管理'},
            {path: '/stock/uStockFinancingLogs', name: '配资记录'},
            {path: '/stock/uStockFinanceInterestPercentages', name: '配资付息'},
            {path: '/stock/capitalPools', name: '资金池管理'},
            {path: '/stock/parentStockFinances', name: '操盘母账户管理'},
            {path: '/stock/xrDrInfos', name: '除权降息管理'},
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
    },
    /*{
      path: '/option',
      name: '期权管理',
      iconClass: 'fa fa-ticket',
      children: [
        {path: '/option/optionConfigs', name: '账号登录及设置'},
        {path: '/option/optionChildAccount', name: '期权客户账户'},
        {path: '/option/optionChildHold', name: '权利仓查询'},
        {path: '/option/optionInterest', name: '期权付息'},
        {path: '/option/optionFee', name: '期权佣金'},
        {path: '/option/optionProductApply', name: '产品申请'}
      ],
    },*/
    {
        path: '/options2',
        name: '期权管理',
        iconClass: 'fa fa-ticket',
        children: [
            {path: '/options2/optionsClient', name: '期权账户'},
            {path: '/options2/optionsQuotation', name: '报价管理'},
            {path: '/options2/optionsEntrust/buy', name: '委托'},
            {path: '/options2/optionsEntrustSuccess/buy', name: '成交'},
            {path: '/options2/optionsHold', name: '持仓'},
            {path: '/options2/optionsMessage', name: '短信'},
            {path: '/options2/optionsServiceFee', name: '管理费'},
            {path: '/options2/optionsForm', name: '统计报表'},
        ],
    },
];