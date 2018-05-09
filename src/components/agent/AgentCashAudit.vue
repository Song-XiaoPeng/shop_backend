<template>
  <section style="margin-top: 15px;padding-top: 15px" v-loading="loading">
    <el-form ref="agentCashInfo"
             :model="agentCashInfo"
             :rules="bankCardRules"
             label-width="180px"
             style="margin:20px;width:60%;min-width:600px;">

      <el-form-item label="提示">
        状态更改为'已付'将直接扣除代理佣金
      </el-form-item>

      <el-form-item label="申请金额">
        <code v-text="agentCashInfo.cash_amount"></code>元
      </el-form-item>

      <el-form-item label="状态" required>
        <el-select v-model="agentCashInfo.cash_status">
          <el-option v-for="(item,idxxx) in statusOptions" :label="item" :value="parseInt(idxxx)" :key="item"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="手续费" prop="fee">
        <el-input v-model.number="agentCashInfo.fee"></el-input>
      </el-form-item>

      <el-form-item label="到账金额">
        <el-input :value="agentCashInfo.cash_amount - agentCashInfo.fee" disabled></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="银行卡+姓名+银行卡号"
          v-model="agentCashInfo.remark">
        </el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary"
                   :loading="btnloading"
                   v-if="role=='SystemRisk' || role=='SystemAccount' || role=='SystemAdmin'"
                   @click.native.prevent="onSubmitAgentCashInfo">修改
        </el-button>
        <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </section>

</template>

<script>
  import {getAgentCashInfo, updateAgentCashInfo} from '../../api/agent';
  export default {
    data() {
      let checkFee = (rule, value, callback) => {
        if (value >= this.agentCashInfo.cash_amount) {
          callback(new Error('手续费不能超过或等于申请金额!'));
        } else if (value < 0) {
          callback(new Error('手续费不能为负数!'));
        }
        callback();
      };
      return {
        refresh: true,
          //1:已付,2:已申请3:已撤回,4:处理中,5:提现失败,6:审核通过
        statusOptions: {
          //'请选择',//0,
          1: '已付',//1,
          //'已申请',//2,
          //'已撤回',//3,
          4: '处理中',//4
          5: '提现失败',//5
            6: '审核通过',//6
        },
        bankCardRules: {
          fee: [
            {validator: checkFee, trigger: 'blur'}
          ],
          bank_name: [
            {
              required: true,
              type: 'string',
              message: '请选择开户银行名称',
              trigger: 'blur'
            },
          ],
        },
        btnloading: false,
        agentCashInfo: {cash_amount: 0},
        loading: false,
      }
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    computed: {},
    methods: {
      fetchClientagentCashInfo() {
        this.loading = true;
        getAgentCashInfo(this.$route.params).then(res => {
          this.agentCashInfo = res.data;
          if (res.data.cash_status == 1) {
            this.$notify({
              title: '充值已审核完成',
              message: '请不要重复审核导致导致错误!!!',
              type: 'error'
            });
            this.$router.go(-1);
          }
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      onSubmitAgentCashInfo() {
        this.$refs.agentCashInfo.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            updateAgentCashInfo(this.agentCashInfo).then(res => {
              this.ezNotifyAxiosThen(res);
              this.$router.go(-1);
            }).catch(error => this.ezNotifyAxiosCatch(error));
          }
        });
      },
    },
    created() {
      this.fetchClientagentCashInfo();
    }
  }
</script>

<style scoped>


</style>
