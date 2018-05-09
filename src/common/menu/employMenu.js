//代理商员工的菜单
export const employMenu = [
    {
        path: '/agent',
        name: '基本管理',
        iconClass: 'fa fa-bank',
        children: [
            {
                path: '/agent/recommend/code',
                name: '我的推广链接',
            },
            {
                path: '/agent/serviceFee',
                name: '服务费明细表',
            },
            {
                path: '/agent/interestList',
                name: '配资递延费',
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
            {path: '/client/withdraw', name: '客户提现'},
            {path: '/client/recharge', name: '客户充值'},
            {path: '/client/message', name: '短信管理'},
        ],
    },
    {
        path: '/stock',
        name: '配资管理',
        iconClass: 'fa fa-btc',
        children: [
            {path: '/stock/uStockFinancings', name: '操盘账户'},
            {path: '/stock/uStockFinancingLogs', name: '配资记录'},
            {path: '/stock/uStockFinanceInterestPercentages', name: '配资付息'},
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
            {path: '/trade/stockFinanceRiskLogs', name: '风控日志'},
            {path: '/trade/uStockFinanceMakedealFees', name: '佣金统计'},
        ],
    }
];