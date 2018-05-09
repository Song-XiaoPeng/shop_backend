<template>
  <section style="margin-top: 15px;padding-top: 15px" v-loading="loading">

    <el-form ref="bankForm"
             :model="bankInfo"
             :rules="bankCardRules"
             label-width="180px"
             style="margin:20px;width:70%;min-width:600px;">

      <el-form-item label="说明">
        <el-input value="银行卡必须与合作商所签署合同上填写的一致,否则提现申请将不予审核通过;绑定后不支持修改" disabled></el-input>
      </el-form-item>


      <el-form-item label="接收验证码手机号">
        <el-input :value="bankInfo.phone?bankInfo.phone:'注意:请先在修改页面绑定手机号!'" disabled>
        </el-input>
        <el-button size="small" type="primary" @click.native.prevent="handleSendSms" :disabled="disAble">发送验证码</el-button>
      </el-form-item>


      <el-form-item label="短信验证码:" required prop="code">
        <el-input v-model.number="bankInfo.code" :disabled="disAble"></el-input>
      </el-form-item>


      <el-form-item label="请选择开户银行" required prop="bank_name">
        <el-select v-model="bankInfo.bank_name" placeholder="请选择类型" filterable clearable :disabled="disable_bank_name">
          <el-option v-for="item in bankCardOptions" :label="item.bankName" :value="item.bankName" :key="item.bankCode"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="银行户名" required>
        <el-input v-model="bankInfo.bank_account_name" placeholder="提现银行卡姓名" :disabled="disable_bank_account_name"></el-input>
      </el-form-item>
      <el-form-item label="开户支行" required>
        <el-input v-model="bankInfo.bank_branch" placeholder="格式：XX省XX市XX支行" :disabled="disable_bank_branch"></el-input>
      </el-form-item>
      <el-form-item label="15~19位银行卡号" required prop="bank_account">
        <el-input v-model="bankInfo.bank_account" :disabled="disable_bank_account"></el-input>
      </el-form-item>


      <el-form-item>
        <el-button type="primary"
                   :disabled="disable_submit"
                   @click.native.prevent="onSubmitBankCardEdit">
          绑定
        </el-button>
        <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </section>


</template>

<script>
  import {agentBankCardSendSms, agentBankCardInfo, agentBankCardUpdate} from '../../api/agentBankCard';

  import {bankCardOptions, provinceCityDistrictCounty, patternBankCard, patternCellPhone} from '../../common/constData'


  import {getStorageUserInfo} from '../../common/tools'

  export default {
    data() {
      let checkBankAccount = (rule, value, callback) => {
        if (value) {
          let reg = /^\d{15,19}$/;
          if (!reg.test(value)) {
            this.disable_submit = true
            callback(new Error('请输入纯数字15~19位银行卡号'));
          }
        }
        callback();
      };
      return {
        refresh: true,
        disAble: true,
        disable_code: true,
        disable_bank_name: true,
        disable_bank_account_name: true,
        disable_bank_branch: true,
        disable_bank_account: true,
        code: '',
        bankInfo: {
          bank_account: '',
          bank_name: '',
          phone: '',
          code: '',
          bank_account_name: '',
          bank_branch: ''
        },
        bankCardOptions,
        provinceCityDistrictCounty,
        bankCardRules: {
          code: [
            {
              required: true,
              type: 'number',
              min: 1000,
              max: 9999,
              message: '请输入4位数字',
              trigger: 'blur'
            }
          ],
          open_province: [
            {
              required: true,
              type: 'string',
              message: '请选择开户银行名称',
              trigger: 'blur'
            },
          ],
          bank_name: [
            {
              required: true,
              type: 'string',
              message: '请选择开户银行名称',
              trigger: 'blur'
            },
          ],
          bank_account: [
            {
              required: true,
              trigger: 'blur'
            },
            {
              validator: checkBankAccount,
              trigger: 'blur'
            }
          ],
        },
        selectedBankCardInfo: {},
        loading: false,
      }
    },
    computed: {
      disable_submit() {
        var that = this
        
        if(!this.bankInfo.bank_account){
          return true
        }else{
          let reg = /^\d{15,19}$/;
          if (!reg.test(that.bankInfo.bank_account)) {
            return true
          } 
        }

        if(!this.bankInfo.bank_name){
          return true;
        }

        if(!this.bankInfo.code){          
          return true         
        } else {
          let reg = /^\d{4}$/;
          if (!reg.test(that.bankInfo.code)) {
            return true
          }  
        }

        if(!this.bankInfo.bank_account_name){
          return true;
        }

        if(this.bankInfo.bank_branch === ''){
          return true;
        }
        
        return false;
        // return (!this.bankInfo.phone || !this.bankInfo.bank_name || !this.bankInfo.bank_account_name || !this.bankInfo.bank_branch
        // || !this.bankInfo.bank_account || !this.bankInfo.code) ? true : false;
      }
    },
    methods: {
      fetchBankCardInfo() {
        this.loading = true;
        agentBankCardInfo(null).then(res => {
          this.loading = false;
          this.bankInfo = {
            bank_name: res.data.bank_name === null ? '' : res.data.bank_name ,
            bank_account_name: res.data.bank_account_name === null ? '' : res.data.bank_account_name ,
            bank_branch: res.data.bank_branch === null ? '' : res.data.bank_branch,
            bank_account: res.data.bank_account === null ? '' : res.data.bank_account ,
            phone: res.data.phone,
            code: '',
          };
          if (this.bankInfo.phone && (!this.bankInfo.bank_name || !this.bankInfo.bank_account_name || !this.bankInfo.bank_branch || !this.bankInfo.bank_account)) this.disAble = false;
          if (!this.bankInfo.bank_name) this.disable_bank_name = false;
          if (!this.bankInfo.bank_account_name) this.disable_bank_account_name = false;
          if (!this.bankInfo.bank_branch) this.disable_bank_branch = false;
          if (!this.bankInfo.bank_account) this.disable_bank_account = false;   
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      onSubmitBankCardEdit() {
        this.$refs.bankForm.validate(valid => {
          if (valid) {
            agentBankCardUpdate(this.bankInfo).then(res => {
              this.ezNotifyAxiosThen(res);
              if (res.status == 1) {
                this.$router.go(-1);
              }
            }).catch(error => this.ezNotifyAxiosCatch(error));
          }
        });
      },
      //发送验证码
      handleSendSms() {
        agentBankCardSendSms().then(res => {
          this.ezNotifyAxiosThen(res);
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    },
    created() {
      this.fetchBankCardInfo()
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    }
  }
</script>

<style scoped>
</style>
