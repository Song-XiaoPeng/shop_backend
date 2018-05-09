<template>
  <section style="margin-top: 15px;padding-top: 15px" v-loading="loading">

    <el-form ref="bankForm"
             :model="selectedBankCardInfo"
             :rules="bankCardRules"
             label-width="180px"
             style="margin:20px;width:60%;min-width:600px;">

      <el-form-item label="客户银行卡记录ID">
        <el-input v-model.number="selectedBankCardInfo.id" disabled></el-input>
      </el-form-item>
      <el-form-item label="请选择开户银行" required prop="bank_name">
        <el-select v-model="selectedBankCardInfo.bank_name" placeholder="请选择类型" filterable clearable>
          <el-option v-for="item in bankCardOptions" :label="item.bankName" :value="item.bankName" :key="item.bankCode"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="省份" required prop="open_province">

        <el-select v-model="selectedBankCardInfo.open_province" placeholder="请选择省份" filterable clearable>
          <el-option v-for="item in provinceCityDistrictCounty" :label="item.name" :value="item.name" :key="item.name"></el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="开户支行">
        <el-input v-model="selectedBankCardInfo.open_bank"></el-input>
      </el-form-item>
      <el-form-item label="开户行地址">
        <el-input v-model="selectedBankCardInfo.open_district"></el-input>
      </el-form-item>
      <el-form-item label="15~19位银行卡号" required prop="bank_card">
        <el-input v-model="selectedBankCardInfo.bank_card"></el-input>
      </el-form-item>
      <el-form-item label="配置选项" v-if="false">
        <el-checkbox v-model="selectedBankCardInfo.is_cash_bankcard" label="是否是提现银行卡" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="selectedBankCardInfo.is_open_netbank" label="是否开通网上银行" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>


      <el-form-item>
        <el-button type="primary"
                   @click.native.prevent="onSubmitBankCardEdit">
          修改
        </el-button>
        <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </section>


</template>

<script>
  import {bankCardUpdate, getClientBankInfo} from '../../api/bankCard';
  import {bankCardOptions, provinceCityDistrictCounty, patternBankCard, patternCellPhone} from '../../common/constData'

  export default {
    data() {
      let checkBankAccount = (rule, value, callback) => {
        if (value) {
          let reg = /^\d{15,19}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入纯数字15~19位银行卡号'));
          }
        }
        callback();
      };
      return {
        refresh: true,
        bankCardOptions,
        provinceCityDistrictCounty,
        bankCardRules: {
          bank_reg_cellphone: [
            {
              type: 'string',
              pattern: patternCellPhone,
              message: '请输入手机号',
              trigger: 'blur'
            }
          ],
          open_province: [
            {
              required: true,
              type: 'string',
              message: '请选择省份',
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
          bank_card: [
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
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      fetchBankInfo() {
        this.loading = true;
        getClientBankInfo(this.$route.params).then(res => {
          this.selectedBankCardInfo = res.data;
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      onSubmitBankCardEdit() {
        this.$refs.bankForm.validate((valid) => {
          if (valid) {
            bankCardUpdate(this.selectedBankCardInfo).then(res => {
              this.ezNotifyAxiosThen(res);
            }).catch(error => this.ezNotifyAxiosCatch(error));
          }
        });
      },
    },
    created() {
      this.fetchBankInfo();
    }
  }
</script>

<style scoped>


</style>
