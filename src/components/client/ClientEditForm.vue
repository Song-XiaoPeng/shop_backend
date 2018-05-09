<template>
  <section style="width:100%; margin-top: 60px" v-loading="loading">


    <el-form :model="clientInfo"
             label-width="160px"
             @submit.prevent="onSubmit"
             :rules="formRule"
             ref="clientForm"
             style="margin:20px;width:60%;min-width:600px;">
      <el-form-item label="真实姓名">
        <el-input v-model.number="clientInfo.real_name" :disabled="role!='SystemAdmin' && role!='SystemStaff'"></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model.number="clientInfo.nick_name" :disabled="role!='SystemAdmin' && role!='SystemStaff'"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码">
        <el-input v-model="clientInfo.id_card" :disabled="role!='SystemAdmin' && role!='SystemStaff'"></el-input>
      </el-form-item>

      <el-form-item label="电话" required prop="cellphone">
          <el-input v-model="clientInfo.cellphone"></el-input>
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
          <el-input v-model="clientInfo.password"></el-input>
      </el-form-item>

      <el-form-item label="是否解绑微信公众号">

        <el-switch
          :width="60"
          v-model="clientInfo.openid"
          on-text="解绑">
        </el-switch>
      </el-form-item>

      <el-form-item label="配置选项">
        <el-checkbox v-model="clientInfo.is_login_forbidden" label="是否禁用登录" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="clientInfo.is_cash_forbidden" label="是否禁用账户提现" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="clientInfo.is_charge_forbidden" label="是否禁止充值" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="clientInfo.is_stock_finance_forbidden" label="是否禁止配资" :true-label=1 :false-label=0></el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.native.prevent="onSubmitClientEdit" :loading="btnLoading">修改</el-button>
        <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import {clientUpdate, clientInfo} from '../../api/client';

  export default {
    data() {
      return {
        refresh: true,
        formRule: {
          cellphone: [
            {
              required: true,
              message: '手机号码是必填',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /^[*|#]{0,1}1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确手机号码',
              trigger: 'blur'
            }
          ],
          password: [
            {
              min: 6,
              max: 20,
              message: '密码最短6位,最长20位',
              trigger: 'blur'
            }
          ],

        },
        clientInfo: {},
        pagination: {},
        loading: false,
        btnLoading: false,

      }
    },
    created() {
      this.fetchClientInfo()
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    mounted() {
    },
    methods: {
      onSubmitClientEdit() {
        this.$refs.clientForm.validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            clientUpdate(this.clientInfo).then(res => {
              this.ezNotifyAxiosThen(res)
              this.btnLoading = false;
            }).catch(error => this.ezNotifyAxiosCatch(error));
          }
        });
      },
      fetchClientInfo() {
        this.loading = true;
        clientInfo(this.$route.params).then((res) => {
          this.clientInfo = res.data;
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    }
  }


</script>

<style scoped>


</style>
