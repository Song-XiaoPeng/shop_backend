import Vue from "vue";
import Router from "vue-router";

import Login from "../components/Login.vue";
import Home from "../components/Home.vue";
import NotFound from "../components/404.vue";

import AgentCashTabPane from "../components/agent/cash/AgentCashTabPane.vue";
import AgentTable from "../components/agent/AgentTable.vue";
import AgentChildrenTable from "../components/agent/AgentChildrenTable.vue";
import AgentBankEdit from "../components/agent/AgentBankEdit.vue";
import AgentCashTable from "../components/agent/AgentCashTable.vue";
import AgentCashAudit from "../components/agent/AgentCashAudit.vue";
import AgentServiceFeeList from "../components/agent/AgentServiceFeeList.vue";
import AgentInterestList from "../components/agent/AgentInterestList.vue";
import PromoteQR from "../components/agent/PromoteQR.vue";
import FormAgentCreate from "../components/agent/FormAgentCreate.vue";
import FormAgentUpdate from "../components/agent/FormAgentUpdate.vue";

import EmployeeList from "../components/employee/EmployeeList.vue";
import SystemUserList from "../components/employee/SystemUserList.vue";
import EmployeeCreate from "../components/employee/FormEmployeeCreate.vue";
import EmployeeUpdate from "../components/employee/FormEmployeeUpdate.vue";

import ClientList from "../components/client/ClientList.vue";
import ClientEditForm from "../components/client/ClientEditForm.vue";
import ClientSwapForm from "../components/client/ClientSwapForm.vue";
import ClientBankList from "../components/client/ClientBankList.vue";
import ClientBankEdit from "../components/client/ClientBankEdit.vue";
import ClientWithdrawList from "../components/client/ClientWithdrawList.vue";
import ClientWithdrawEdit from "../components/client/ClientWithdrawEdit.vue";
import ClientRechargeList from "../components/client/ClientRechargeList.vue";
import ClientRechargeAudit from "../components/client/ClientRechargeAudit.vue";
import ClientAccountAdjust from "../components/client/ClientAccountAdjust.vue";
import MessageList from "../components/client/MessageList.vue";
import ClientMoneyList from "../components/client/ClientMoneyList.vue";


import SystemParams from "../components/system/params/SystemParams.vue";
import HolidayMaintains from "../components/system/holidayMaintain/HolidayMaintains.vue";

import AgentDayAchievementReports from "../components/report/AgentDayAchievementReports.vue";
import AgentMaxPerformanceReports from "../components/report/AgentMaxPerformanceReports.vue";
import EmployeeFullReport from "../components/report/EmployeeFullReport.vue";
import EmployeeDayReport from "../components/report/EmployeeDayReport.vue";
import ClientDayReport from "../components/report/ClientDayReport.vue";
import ClientFullReport from "../components/report/ClientFullReport.vue";

import Articles from "../components/content/Articles.vue";
import ArticleEdit from "../components/content/ArticleEdit.vue";
import Helps from "../components/content/Helps.vue";
import HelpEdit from "../components/content/HelpEdit.vue";
import Protocols from "../components/content/Protocols.vue";
import ProtocolEdit from "../components/content/ProtocolEdit.vue";
import Wechats from "../components/content/wechats/Wechats.vue";
import Others from "../components/content/Others.vue";
import OtherEdit from "../components/content/OtherEdit.vue";
import UploadWechatAuthFile from "../components/content/UploadWecahtAuthFile.vue";

import payEdit from "../components/pay/payTipsEdit.vue";

//角色
import roleCreate from "../components/role/RoleCreate.vue";
import RoleList from "../components/role/RoleList.vue";
import roleAuthEdit from "../components/role/RoleAuthEdit.vue";
import permissionList from "../components/role/permissionList.vue";

//委托
import UStockFinanceEntrusts from "../components/trade/uStockFinanceEntrust/UStockFinanceEntrusts.vue";
import UStockFinanceEntrustHistorys from "../components/trade/uStockFinanceEntrustHistory/UStockFinanceEntrustHistorys.vue";
import UStockFinanceDayMakedeals from "../components/trade/uStockFinanceDayMakedeal/UStockFinanceDayMakedeals.vue";
import UStockFinanceDayMakedealHistorys from "../components/trade/uStockFinanceDayMakedealHistory/UStockFinanceDayMakedealHistorys.vue";
import UStockFinacingHoldingList from "../components/trade/uStockFinancingHolding/UStockFinancingHoldingList.vue"; //持仓查询


//系统设置
import SettingCreate from "../components/system/setting/SettingCreate.vue";
import SystemSettingList from "../components/system/setting/SSystemSettingList.vue";

Vue.use(Router);

export default new Router({
    mode: 'history',
    linkActiveClass: 'select_leaf',
    linkExactActiveClass: 'select_leaf',
    routes: [
        {
            path: '/',
            component: Home,
            name: '代理管理',
            children: [
                // {path: '/agent', component: AgentTable, name: '代理列表', meta: {keepAlive: true}},
                // {path: '/agent/cash', component: AgentCashTable, name: '提现记录', meta: {keepAlive: true}},
                // {path: 'agent/recommend/code', component: PromoteQR, name: '我的推广', meta: {keepAlive: true}},
                // {path: '/agent/children', component: AgentChildrenTable, name: '我的收益', meta: {keepAlive: true}},
                {path: '/agent/applyCashOut', component: AgentCashTabPane, name: '代理商提现申请'},
                {path: '/agent', component: AgentTable, name: '代理列表', meta: {keepAlive: true}},
                {path: '/agent/children', component: AgentChildrenTable, name: '下级代理列表', meta: {keepAlive: true}},
                {path: '/agent/serviceFee', component: AgentServiceFeeList, name: '服务费明细表', meta: {keepAlive: true}},
                {path: '/agent/interestList', component: AgentInterestList, name: '配资递延费', meta: {keepAlive: true}},
                {path: '/agent/cash', component: AgentCashTable, name: '代理提现', meta: {keepAlive: true}},
                {path: '/agent/cashBankEdit', component: AgentBankEdit, name: '代理提现银行卡'},
                {path: '/agent/cash/audit/:id', component: AgentCashAudit, name: '代理提现审核'},
                {path: 'agent/create', component: FormAgentCreate, name: '代理商创建'},
                {path: 'agent/update/:id', component: FormAgentUpdate, name: '代理商修改'},
                {path: 'agent/recommend/code', component: PromoteQR, name: '推广二维码', meta: {keepAlive: true}}
            ]
        },
        {
            path: '/client',
            component: Home,
            name: '客户管理',
            children: [
                {path: '/client', component: ClientList, name: '客户列表', meta: {keepAlive: true}},
                {path: 'account', component: ClientMoneyList, name: '客户资金', meta: {keepAlive: true}},
                {path: 'swap/:id', component: ClientSwapForm, name: '客户变更归属'},
                {path: 'edit/:id', component: ClientEditForm, name: '客户修改'},
                {path: 'adjust/:id', component: ClientAccountAdjust, name: '调整客户余额'},
                {path: 'bankCard', component: ClientBankList, name: '客户银行卡', meta: {keepAlive: true}},
                {path: 'bankCard/edit/:id', component: ClientBankEdit, name: '客户银行卡编辑'},
                {path: 'withdraw', component: ClientWithdrawList, name: '客户提现', meta: {keepAlive: true}},
                {path: 'withdraw/audit/:id', component: ClientWithdrawEdit, name: '客户提现审核'},
                {path: 'recharge', component: ClientRechargeList, name: '客户充值', meta: {keepAlive: true}},
                {path: 'recharge/audit/:id', component: ClientRechargeAudit, name: '客户充值审核'},
                {path: 'message', component: MessageList, name: '短信查询', meta: {keepAlive: true}},
            ]
        },
        {
            path: '/client',
            component: Home,
            name: '交易管理',
            children: [
                {
                    path: '/trade/uStockFinanceEntrusts',
                    component: UStockFinanceEntrusts,
                    name: '当日委托',
                    meta: {keepAlive: true}
                },
                {
                    path: '/trade/uStockFinanceEntrustHistorys',
                    component: UStockFinanceEntrustHistorys,
                    name: '历史委托',
                    meta: {keepAlive: true}
                },
                {
                    path: '/trade/uStockFinanceDayMakedeals',
                    component: UStockFinanceDayMakedeals,
                    name: '当日成交',
                    meta: {keepAlive: true}
                },
                {
                    path: '/trade/uStockFinanceDayMakedealHistorys',
                    component: UStockFinanceDayMakedealHistorys,
                    name: '历史成交',
                    meta: {keepAlive: true}
                },
                {
                    path: '/trade/uStockFinacingHoldingList',
                    component: UStockFinacingHoldingList,
                    name: '持仓查询',
                    meta: {keepAlive: true}
                },

            ]
        },
        {
            path: '/system',
            component: Home,
            name: '系统管理',
            children: [
                {path: '/system', component: SystemParams, name: '平台配置', meta: {keepAlive: true}},
                {path: '/system/holidayMaintains', component: HolidayMaintains, name: '节假日管理', meta: {keepAlive: true}},
                /*{path: '/system/holidayMaintain/create', component: HolidayMaintainCreate, name: '新增节假日'},
                 {path: '/system/holidayMaintain/edit/:id', component: HolidayMaintainEdit, name: '修改节假日'},*/
                {path: '/system/user', component: SystemUserList, name: '后台用户', meta: {keepAlive: true}},
                {path: '/system/user/edit/:id', component: EmployeeUpdate, name: '修改后台用户'},
                {path: '/system/user/create', component: EmployeeCreate, name: '新增后台用户'},
            ]
        },
        {
            path: '/login',
            component: Login,
            name: '管理后台登陆',
        },
        {
            path: '/404',
            component: NotFound,
            name: '',
        },
        {
            path: '/content',
            component: Home,
            name: '内容管理',
            children: [
                {path: '/content/articles', component: Articles, name: '文章管理', meta: {keepAlive: true}},
                {path: '/content/articleEdit', component: ArticleEdit, name: '新增文章'},
                {path: '/content/articleEdit/:id', component: ArticleEdit, name: '修改文章'},
                {path: '/content/helps', component: Helps, name: '帮助中心', meta: {keepAlive: true}},
                {path: '/content/helpEdit', component: HelpEdit, name: '新增帮助'},
                {path: '/content/helpEdit/:id', component: HelpEdit, name: '修改帮助'},
                {path: '/content/protocols', component: Protocols, name: '协议管理', meta: {keepAlive: true}},
                {path: '/content/protocolEdit', component: ProtocolEdit, name: '新增协议'},
                {path: '/content/protocolEdit/:id', component: ProtocolEdit, name: '修改协议'},
                {path: '/content/wechats/:id', component: Wechats, name: '微信公众号', meta: {keepAlive: true}},
                {path: '/content/others', component: Others, name: '其他管理', meta: {keepAlive: true}},
                {path: '/content/otherEdit', component: OtherEdit, name: '新增其他'},
                {path: '/content/otherEdit/:id', component: OtherEdit, name: '修改其他'},
                {path: '/content/uploadWechatAuthFile', component: UploadWechatAuthFile, name: '上传微信认证文件'},
                {path: '/content/pay', component: payEdit, name: "支付管理"}
            ]
        },
        {
            path: '*',
            redirect: {path: '/404'}
        },
        {
            path: '/roles',
            component: Home,
            name: '角色管理',
            children: [
                {path: '/roles/RoleList', component: RoleList, name: '角色列表', meta: {}},
                {path: '/roles/roleCreate', component: roleCreate, name: '新增角色', meta: {}},
                {path: '/roles/roleCreate/:id', component: roleCreate, name: '修改角色', meta: {}},
                {path: '/roles/roleAuthEdit', component: roleAuthEdit, name: '新增权限', meta: {}},
                {path: '/roles/roleAuthEdit/:id', component: roleAuthEdit, name: '修改权限', meta: {}},
                {path: '/roles/permissionList', component: permissionList, name: '权限列表', meta: {keepAlive: true}},
            ]
        },
        {
            path: '/systemSetting',
            component: Home,
            name: '系统配置',
            children: [
                {path: 'systemSettingList', component: SystemSettingList, name: '系统设置列表', meta: {}},
                {path: 'settingCreate', component: SettingCreate, name: '系统设置', meta: {}},
                {path: 'settingCreate/:id', component: SettingCreate, name: '修改系统设置', meta: {}},
            ]
        },
        {
            path: '/employee',
            component: Home,
            name: '员工管理',
            children: [
                {path: '/employee', component: EmployeeList, name: '员工列表', meta: {keepAlive: true}},
                {path: 'create', component: EmployeeCreate, name: '员工创建'},
                {path: 'update/:id', component: EmployeeUpdate, name: '员工修改'}
            ]
        }
    ]
})
