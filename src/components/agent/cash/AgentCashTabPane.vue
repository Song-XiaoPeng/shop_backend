<template>
    <el-tabs v-model="tabName" type="card" style="margin-top: 12px"
             @tab-click="handleClick">
        <el-tab-pane label="递延费提现" name="interest">
            <form-interest v-on:changeRefresh="changeRefresh" :hasBankInfo="agent.hasBankInfo">
            </form-interest>
        </el-tab-pane>

        <el-tab-pane label="服务费提现" name="commion">
            <form-commion v-on:changeRefresh="changeRefresh" :hasBankInfo="agent.hasBankInfo">
            </form-commion>
        </el-tab-pane>

        <el-tab-pane label="预留递延费提现" name="Reserve_interest">
            <form-reserve-interest v-on:changeRefresh="changeRefresh" :hasBankInfo="agent.hasBankInfo">
            </form-reserve-interest>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import FormInterest from './InterestCashForm.vue';
    import FormCommion from './CommisionCashForm.vue';
    import FormReserveInterest from './ReserveInterestCashForm.vue';
    import {agentCashOutInfo} from '../../../api/agentCashOut';

    export default {
        components: {
            FormInterest,
            FormCommion,
            FormReserveInterest
        },
        data() {
            return {
                agent: {replaced_interest_cost_type: ''},
                refresh: true,
                tabName: 'interest',
                loading: false,
            };
        },
        beforeRouteLeave(to, from, next) {
            to.meta.refresh = this.refresh;
            next();
        },
        mounted(){
            this.fetchAgentCashOutInfo();
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab.name);
            },
            changeRefresh(value){
                this.refresh = value;
            },
            fetchAgentCashOutInfo() {
                this.loading = true;
                agentCashOutInfo().then((res) => {
                    this.loading = false;
                    if (res.status === 0) {
                        return this.ezNotifyAxiosThen(res);
                    }
                    this.agent = res.data;
                    if (this.agent.is_forbid_cash) {
                        return this.$notify({
                            title: '您已被禁止提现！',
                            message: '',
                            type: 'info'
                        });
                    }
                    if (!this.agent.hasBankInfo) {
                        this.$confirm('未绑定提现银行卡或银行卡信息不全，不允许提现！', '提示', {
                            confirmButtonText: '前往绑定',
                            cancelButtonText: '暂不绑定',
                            type: 'warning'
                        }).then(() => {
                            this.$router.push({path: '/agent/cashBankEdit'});
                        }).catch(error => this.ezNotifyAxiosCatch(error));
                    }
                    //if (this.agent.replaced_interest_cost_type == '峰值计算') this.tabName = 'commion';
                }).catch(error => this.ezNotifyAxiosCatch(error))
            }
        }
    };
</script>

