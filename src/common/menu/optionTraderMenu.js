//管理员的菜单
export const optionTraderMenu = [
    {
        path: '/options',
        name: '期权管理',
        iconClass: 'fa fa-ticket',
        children: [
            {path: '/options/optionsClient', name: '期权账户'},
            {path: '/options/optionsEntrust/buy', name: '委托'},
            {path: '/options/optionsEntrustSuccess/buy', name: '成交'},
            {path: '/options/optionsHold', name: '持仓'},
            {path: '/options/optionsMessage', name: '短信'},
            {path: '/options/optionsServiceFee', name: '管理费'},
            {path: '/options/optionsForm', name: '统计报表'},
        ],
    },
];