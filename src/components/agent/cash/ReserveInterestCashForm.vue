<template>
    <el-form :model="form"
             label-width="180px"
             @submit.prevent="onSubmit"
             :rules="formRule"
             ref="agentForm"
             v-loading="loading3"
             style="margin:20px;width:60%;min-width:600px;">

        <el-form-item label="归属代理">
            <el-input :value="form.parentAgentName+'(id:'+ userInfo.agent.parent_id+')'" disabled></el-input>
        </el-form-item>
        <el-form-item label="代理商信息">
            <el-input :value="userInfo.phone + ' ' + userInfo.employee_name + ':' + userInfo.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="预留递延费总金额">
            <el-input :value="((form.totalInterest-form.totalInterestCost)*form.reserve_interest_rate) | round(2)" disabled>
                <template slot="prepend">+</template>
            </el-input>
        </el-form-item>
        <el-form-item label="累计已提现预留递延费金额">
            <el-input :value="form.totalReserveInterestCashAmount | round(2)" disabled>
                <template slot="prepend">-</template>
            </el-input>
        </el-form-item>
        <el-form-item label="最大可提现金额">
            <el-input :value="cashAvailable" disabled>
                <template slot="prepend">=</template>
            </el-input>
        </el-form-item>
        <el-form-item label="申请提现金额" required prop="cashOutAmount">
            <el-input v-model.number="form.cashOutAmount" type="number" min="0" :disabled="!hasBankInfo || form.already_cash || !!form.cash_time_not_allowed || userInfo.agent.is_forbid_cash>0" placeholder="实际可提现金额请务必与客服协商后再申请,否则不予通过"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click.native.prevent="onSubmit" :disabled="!hasBankInfo || form.already_cash || !!form.cash_time_not_allowed || userInfo.agent.is_forbid_cash>0">
                申请(每月最多一次)
            </el-button>
            <el-button @click.native.prevent="$emit('changeRefresh',false);$router.go(-1)">返回</el-button>
            <br/>
        </el-form-item>
    </el-form>
</template>

<script>
    import {agentReserveInterestCashInfo, agentCashOutUpdate} from '../../../api/agentCashOut';
    export default {
        props:['hasBankInfo'],
        data() {
            let cashOutAmoutCheck = (rule, value, callback) => {
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    callback(new Error('小数位数最多2位'));
                } else if (value > this.cashAvailable) {
                    callback(new Error('提现金额不能超过最大可提现金额'));
                } else if (value < 0.01) {
                    callback(new Error('提现金额不能小于0.01元'));
                } else {
                    callback();
                }
            };
            return {
                form: {cash_time_not_allowed:true,already_cash:true},
                loading3: false,
                formRule: {
                    cashOutAmount: [
                        {required: true, message: '不能为空'},
                        {validator: cashOutAmoutCheck, trigger: 'blur'}
                    ],
                }
            }
        },
        computed: {
            allowCash: function () {
              return
            },
            cashAvailable: function () {
                return ((this.form.totalInterest - this.form.totalInterestCost) * this.form.reserve_interest_rate - this.form.totalReserveInterestCashAmount).toFixed(2);
            }
        },
        mounted(){
            this.init();
        },
        methods: {
            init (){
                this.loading3 = true;
                agentReserveInterestCashInfo().then((res) => {
                    this.loading3 = false;
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
                            cash_type: 3,
                            cashOutAmount: this.form.cashOutAmount.toFixed(2),
                            cashable_amount: this.cashAvailable,
                            dueInterest: this.form.totalDebitInterest,
                            lossAmount: this.form.totalLossAmount,
                        };
                        this.loading3 = true;
                        agentCashOutUpdate(params).then(res => {
                            this.loading3 = false;
                            if (res.status === 0) {
                                this.ezNotifyAxiosThen(res);
                                setTimeout(function () {
                                    location.reload(true)
                                }, 2000);
                                return false;
                            }
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

