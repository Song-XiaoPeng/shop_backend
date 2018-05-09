<template>
    <el-form :model="form"
             label-width="180px"
             @submit.prevent="onSubmit"
             :rules="formRule"
             ref="agentForm"
             v-loading="loading2"
             element-loading-text="计算中,请耐心等待。。。"
             style="margin:20px;width:60%;min-width:600px;">

        <el-form-item label="归属代理">
            <el-input :value="form.parentAgentName+'(id:'+ userInfo.agent.parent_id+')'" disabled></el-input>
        </el-form-item>
        <el-form-item label="代理商信息">
            <el-input :value="userInfo.phone + ' ' + userInfo.employee_name + ':' + userInfo.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="递延费总收益">
            <el-input :value="form.totalInterest | round(2)" disabled>
                <template slot="prepend">+</template>
            </el-input>
        </el-form-item>
        <el-form-item label="递延费总成本">
            <el-input :value="form.totalInterestCost | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="直属客户欠息金额">
            <el-input :value="form.totalDebitInterest | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="直属客户穿仓金额">
            <el-input :value="form.totalLossAmount | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="下属代理商穿仓欠息">
            <el-input :value="form.belongDebitInterestAndLossAmount | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="预留递延费总金额">
            <el-input :value="((form.totalInterest-form.totalInterestCost)*form.reserve_interest_rate) | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="累计已提现递延费金额">
            <el-input :value="form.totalInterestCashAmount | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="可提现金额">
            <el-input :value="cashAvailable" disabled>
                <template slot="prepend">=</template>
            </el-input>
        </el-form-item>
        <el-form-item label="申请提现金额" required prop="cashOutAmount">
            <el-input v-model.number="form.cashOutAmount" type="number" min="0" :disabled="!hasBankInfo || form.already_cash || form.cash_time_not_allowed || userInfo.agent.is_forbid_cash>0"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click.native.prevent="onSubmit" :disabled="!hasBankInfo || form.already_cash || !!form.cash_time_not_allowed || userInfo.agent.is_forbid_cash>0">申请(每天最多一次)</el-button>
            <el-button @click.native.prevent="$emit('changeRefresh',false);$router.go(-1)">返回</el-button>
            <br/>
            <span style="color:red">(每天15:00~16:00之间可申请,只可申请今天之前的收益)</span>
        </el-form-item>
    </el-form>
</template>

<script>
    import {agentInterestCashInfo, agentCashOutUpdate} from '../../../api/agentCashOut';
    let dt = new Date();
    export default {
        props:['hasBankInfo'],
        data() {
            let cashOutAmoutCheck = (rule, value, callback) => {
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    callback(new Error('小数位数最多2位'));
                } else if (value > this.cashAvailable) {
                    callback(new Error('提现金额不能超过可提现金额'));
                } else if (value < 0.01) {
                    callback(new Error('提现金额不能小于0.01元'));
                } else {
                    callback();
                }
            };
            return {
                form: {cash_time_not_allowed:true,already_cash:true},
                loading2: false,
                formRule: {
                    cashOutAmount: [
                        {required: true, message: '不能为空'},
                        {validator: cashOutAmoutCheck, trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {
            cashAvailable: function () {
                return ((this.form.totalInterest - this.form.totalInterestCost) * (1 - this.form.reserve_interest_rate) - this.form.totalDebitInterest - this.form.totalLossAmount - this.form.belongDebitInterestAndLossAmount - this.form.totalInterestCashAmount).toFixed(2);
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init (){
                this.loading2 = true;
                agentInterestCashInfo().then((res) => {
                    this.loading2 = false;
                    if (res.status === 0) {
                        return this.ezNotifyAxiosThen(res);
                    }
                    this.form = res.data;
                }).catch(error => this.ezNotifyAxiosCatch(error))
            },
            onSubmit() {
                this.$refs.agentForm.validate(valid => {
                    if (valid) {
                        let params = {
                            cash_type: 1,
                            cashOutAmount: this.form.cashOutAmount.toFixed(2),
                            cashable_amount: this.cashAvailable,
                            dueInterest: this.form.totalDebitInterest,
                            lossAmount: this.form.totalLossAmount,
                        };
                        this.loading2 = true;
                        agentCashOutUpdate(params).then(res => {
                            this.loading2 = false;
                            if (res.status === 0) return this.ezNotifyAxiosThen(res);
                            if (res.status > 0) {
                                this.$router.push({name: '代理提现'});
                            }
                        }).catch(error => this.ezNotifyAxiosCatch(error))
                    }
                });
            }
        }
    }
</script>

