//管理员的菜单
export const option2TraderMenu = [
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