<style scoped>
    .buttonOption {
        width:22px;
        height:22px;
        padding:0;
    }
</style>
<template>
    <div class="yl-clearfix">
        <el-row class="searchgrid">
            <el-col :span="8" style="text-align: center">
        <span>
          今日新增会员数量{{todayCount}}人
        </span>
                <span>
          会员人数{{totalCount}}人
        </span>
            </el-col>
            <el-col :span="16">
                <div class="yl-float-right">
                    <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="客户姓名/客户昵称/客户手机号">
                    <input class="yl-input-text" v-model="filters.id" type="text" style="width:100px;"
                           placeholder="客户ID">
                    <input class="yl-input-text" v-model="filters.search_agent_id" style="width:100px;" type="text"
                           placeholder="代理ID">
                    <input class="yl-input-button" value=" 查询 " type="button" @click="search">
                    <input v-if="role=='SystemAdmin' || role=='SystemRisk'" class="yl-input-button" value="导出欠费客户"
                           type="button" @click="excelExport()">
                </div>
            </el-col>
        </el-row>
        <!--列表-->
        <el-table :data="data"
                  v-loading="loading"
                  @sort-change="sortChange"
                  style="width: 100%;">
            <el-table-column prop="id" label="客户ID">
            </el-table-column>
            <el-table-column prop="real_name" label="真实姓名">
            </el-table-column>
            <el-table-column prop="cellphone" label="手机">
                <template slot-scope="scope">
                    <el-popover
                            ref="popover2"
                            placement="top-start"
                            title=""
                            width="200"
                            trigger="click"
                            @show="show_phone_no(scope.row)">
                        <p>手机：{{ scope.row.full_phone_no }}</p>
                        <a style="text-decoration:underline;cursor:pointer"
                           slot="reference">{{scope.row.cellphone}}</a>
                    </el-popover>

                </template>
            </el-table-column>
            <el-table-column prop="nick_name" label="昵称">
            </el-table-column>
            <el-table-column prop="created_time" label="注册时间" min-width="120">
            </el-table-column>
            <el-table-column prop="reg_ip" label="注册IP">
            </el-table-column>
            <el-table-column prop="direct_cust_id" label="推荐人ID">
            </el-table-column>
            <el-table-column label="代理ID">
                <template slot-scope="scope">
                    <el-popover
                            ref="popover1"
                            placement="top-start"
                            title=""
                            width="200"
                            trigger="click"
                            @show="show_agent_info(scope.row)">
                        <p>代理商编号：{{scope.row.agent_number}}</p>
                        <p>代理商名称：{{scope.row.agent_name}}</p>
                        <a style="text-decoration:underline;cursor:pointer;"
                           slot="reference">{{scope.row.direct_agent_id}}</a>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="direct_emp_id" label="员工ID">
            </el-table-column>
            <el-table-column prop="cust_capital_amount" label="客户余额" sortable="custom">
            </el-table-column>
            <el-table-column prop="u_stock_financing_count" label="在配合约数">
            </el-table-column>
            <el-table-column label="操作" width="150" v-if="role_group=='System'">
                <!--<template slot-scope="scope">-->
                    <!--<el-button v-if="role=='SystemAdmin'" size="mini" @click="segueToCleintEdit(scope.row)" icon="edit" title="客户修改"></el-button>-->
                    <!--<el-button v-if="role=='SystemAdmin'" size="mini" @click="segueToCleintSwap(scope.row)" title="修改客户归属关系"><i class="fa fa-exchange"></i></el-button>-->
                    <!--<el-button v-if="role=='SystemAdmin'" size="mini" @click="segueToCleintAccountAdjust(scope.row)" title="账户调整"><i class="fa fa-btc"></i></el-button>-->
                    <!--<el-button v-if="role_group=='System'" size="mini" @click="select_row = scope.row; dialog1Visible=true;" title="扮演用户,请在浏览器里面始终容许显示弹出窗口"><i class="fa fa-play-circle"></i></el-button>-->
                <!--</template>-->
                <template slot-scope="scope">
                    <template v-if="role=='SystemAdmin'">
                        <el-button v-if="show_button_list.indexOf('客户修改')!=-1" class="buttonOption" size="mini" @click="segueToCleintEdit(scope.row)" icon="el-icon-edit"
                                   title="客户修改"></el-button>
                        <el-button v-if="show_button_list.indexOf('客户变更归属')!=-1" class="buttonOption"  size="mini" @click="segueToCleintSwap(scope.row)"
                                   title="修改客户归属关系"><i class="fa fa-exchange"></i></el-button>
                        <el-button v-if="show_button_list.indexOf('调整客户余额')!=-1" class="buttonOption"  size="mini" @click="segueToCleintAccountAdjust(scope.row)"
                                   title="账户调整"><i class="fa fa-btc"></i></el-button>
                    </template>
                    <template v-if="role_group=='System'">
                        <el-button v-if="show_button_list.indexOf('扮演用户')!=-1"  class="buttonOption" size="mini"
                                   @click="select_row = scope.row; dialog1Visible=true;" title="扮演用户,请在浏览器里面始终容许显示弹出窗口"><i
                                class="fa fa-play-circle"></i></el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <div class="yl-pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                    :current-page="pageIndex"
                    :page-sizes="[15, 30, 45, 60]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-size="parseInt(pagination.per_page)"
                    :total="pagination.total"
                    style="float:right;">
            </el-pagination>
        </div>

        <el-dialog
                title="扮演客户"
                custom-class="width30"
                :visible.sync="dialog1Visible"
                top="150px">

            <el-radio-group v-model="play_type" style="padding:0 0 20px 50px;">
                <el-radio :label="1">扮演客户->电脑端登录</el-radio>
                <el-radio :label="2">扮演客户->手机端登录</el-radio>
            </el-radio-group>

            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialog1Visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="handlePlayClient(select_row)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {clientList, issueClientToken, getCustomerPhone} from '../../api/client';
    import {agentSelectorList, getAgentInfo} from '../../api/agent';
    import {convertLevel, HOMEHOST, MOBILEHOST, doExcelExport, getStorageUserInfo} from '../../common/tools';

    export default {
        data() {
            return {
                excel_name: this.$route.name,
                excel_url: 'clientList',
                excel_column_arr: ['id', 'real_name', 'cellphone', 'nick_name', 'created_time', 'reg_ip', 'direct_cust_id', 'direct_agent_id', 'direct_emp_id', 'cust_capital_amount', 'u_stock_financing_count'],
                excel_title_arr: ['客户ID', '真实姓名', '手机', '昵称', '注册时间', '注册IP', '推荐人ID', '代理ID', '员工ID', '客户余额', '在配合约数'],
                todayCount: 0,
                totalCount: 0,
                agentOptions: [],
                dialog1Visible: false,
                play_type: 1,
                select_row: '',
                filters: {
                    range: '',
                    keyword: '',
                    id: '',
                    search_agent_id: '',
                    page: 1,
                    size: 15,
                    order: ''
                },
                playLoginUrl: '',
                selectedRow: {},
                pageIndex: 1,
                pagination: {},
                data: [],
                loading: false,
                button_list: [
                    '客户修改', '客户变更归属', '调整客户余额', '扮演用户'
                ],
                show_button_list: []
            }
        },

        methods: {
            show_phone_no: function(row) {
                if(row.full_phone_no) return
                this.loading = true;
                getCustomerPhone({id: row.id}).then(res => {
                    this.loading = false;
                    row.full_phone_no = res.data.phone;
                }).catch(error => {
                        this.loading = false;
                        this.ezNotifyAxiosCatch(error);
                    },
                );
            },
            sortChange: function (sort) {
                let direction = sort.order == 'ascending' ? 'asc' : 'desc';
                this.filters.order = sort.prop + ' ' + direction;
                this.fetchClientList();
            },
            search() {
                this.filters.page = 1;
                this.fetchClientList();
            },
            show_agent_info: function (row) {
                if(row.agent_name) return
                let id = row.direct_agent_id;
                this.loading = true;
                getAgentInfo({id}).then(res => {
                    this.loading = false;
                    let agent_info = res.data.basic;
                    row.agent_number = agent_info.agent_number;
                    row.agent_name = agent_info.agent_name;
                }).catch(error => {
                        this.loading = false;
                        this.ezNotifyAxiosCatch(error);
                    },
                );
            },
            handleSizeChange(size) {
                this.filters.size = size;
                this.filters.page = 1;
                this.fetchClientList();
            },
            handlePageChange(clickPageIndex) {
                //分页页面发生改变
                this.filters.page = clickPageIndex;
                this.pageIndex = clickPageIndex;
                this.fetchClientList();
            },
            //获取用户列表
            fetchClientList() {
                let params = this.filters;
                this.loading = true;
                clientList({params}).then((res) => {
                    this.loading = false;
                    if (res.data.list.data) {
                        this.data = res.data.list.data.map(item => {
                            item['agent_number'] = '';
                            item['agent_name'] = '';
                            item['full_phone_no'] = '';
                            return item;
                        });
                    }
                    this.pagination = res.data.list;
                    this.todayCount = res.data.todayCount;
                    this.totalCount = res.data.totalCount;
                }).catch(error => {
                    this.loading = false;
                    console.log(error)
                });
            },
            segueToCleintSwap: function (row) {
                let id = row.id;
                this.$router.push({name: '客户变更归属', params: {id}})
            },

            segueToCleintAccountAdjust: function (row) {
                let id = row.id;
                //客户调整月
                this.$router.push({name: '调整客户余额', params: {id}})
            },

            segueToCleintEdit(row) {
                let id = row.id;
                this.$router.push({name: '客户修改', params: {id}})
            },
            handlePlayClient: function (row) {
                issueClientToken({client_id: row.id}).then(res => {
                    if (res.status === 1) {
                        let token = res.data.access_token;
                        this.playLoginUrl = (this.play_type == 2 ? MOBILEHOST : HOMEHOST) + '/login?access_token=' + token;
                    } else {
                        this.ezNotifyAxiosThen(res);
                    }
                }).catch(error => this.ezNotifyAxiosCatch(error));
            },
            excelExport: function () {
                let post_data = JSON.parse(JSON.stringify(this.filters));
                post_data.page = 1;
                post_data.size = 999999;
                post_data.overdue = true;
                post_data.extra = {
                    column_arr: this.excel_column_arr,
                    title_arr: this.excel_title_arr,
                    url: this.excel_url,
                    method: 'get',
                    excel_name: this.excel_name
                };
                doExcelExport(post_data);
            }
        },
        created() {
            this.fetchClientList();
            if (this.role == 'AgentAdmin') {
                agentSelectorList().then((res) => {
                    this.agentOptions = res.data;
                });
            }
            //获得界面操作按钮是否隐藏
            let userInfo = getStorageUserInfo()
            let notAllowed = userInfo.not_allowed
            for (let i = 0; i < this.button_list.length; i++) {
                if (notAllowed.indexOf(this.button_list[i]) == -1) {//没找到，则显示该按钮
                    this.show_button_list.push(this.button_list[i]);
                }
            }
        },
        watch: {
            playLoginUrl(newRoute, oldRoute) {
                window.open(
                    newRoute,
                    '_blank'
                );
            },
        },
        computed: {
            options: function () {
                return this.agentOptions.map(value => {
                    let rObj = {};
                    rObj.id = value.id;
                    rObj.label = `『${convertLevel(value.agent_level)}级』${value.agent_name}`;
                    return rObj;
                });
            }
        },
        activated() {
            if (this.$route.meta.refresh) this.fetchClientList(); //第一次在created已创建 不需要刷新
            else this.$route.meta.refresh = true;//默认要刷新
        }
    }
</script>
