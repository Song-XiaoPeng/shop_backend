<template>
  <el-form :model="form"
           label-width="300px"
           @submit.prevent="onSubmit"
           ref="Form"
           v-loading="loading"
           label-position="right"
           style="margin:20px;"
           :rules="formRule"
  >

    <el-form-item label="客户姓名" prop="financier_name" required>
      <el-input size="small" style="width:200px" v-model="form.financier_name"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="account">
      <el-input size="small" style="width:200px" v-model="form.account"></el-input>
    </el-form-item>
      <!--<el-form-item label="账号密码" prop="password">
        <el-input size="small" style="width:200px" v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="重复账号密码" prop="passwordCheck">
        <el-input size="small" style="width:200px" v-model="form.passwordCheck" type="password"></el-input>
      </el-form-item>
      <el-form-item label="通讯密码" prop="communication_pw">
        <el-input size="small" style="width:200px" v-model="form.communication_pw" type="password"></el-input>
      </el-form-item>
      <el-form-item label="重复通讯密码" prop="communication_pwCheck">
        <el-input size="small" style="width:200px" v-model="form.communication_pwCheck" type="password"></el-input>
      </el-form-item>-->
    <el-form-item label="账户期初总额" prop="total_in_capital" required>
      <el-input size="small" style="width:200px" v-model.number="form.total_in_capital"></el-input>
    </el-form-item>
    <el-form-item label="交易证券" prop="securities_trader" required>
      <el-input size="small" style="width:200px" v-model="form.securities_trader"></el-input>
    </el-form-item>

    <el-form-item label="资金池" prop="capital_id" required>
      <el-select size="small" style="width:200px" v-model.number="form.capital_id" clearable placeholder="请选择">
        <el-option
          v-for="item in capitalPools"
          :key="item.id"
          :label="item.capital_name+' (id:'+item.id+')'"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="账户状态" prop="account_status" required>
      <el-select size="small" style="width:200px" v-model.number="form.account_status" clearable placeholder="请选择">
        <el-option
          v-for="item in account_status"
          :key="item.value"
          :label="item.key"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" @click.native.prevent="onSubmit">
        立即修改
      </el-button>
      <el-button size="small" @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {updateParentStockFinance, getParentStockFinance, getCapitalPools} from '../../../api/stock';

  export default {
    data() {
        /*let password = (rule, value, callback) => {
         /!*if (value === '') {
         callback(new Error('请输入密码'));
         } else {*!/
        if (this.form.passwordCheck !== '') {
          this.$refs.Form.validateField('passwordCheck');
        }
        callback();
         /!*}*!/
      };
      let passwordCheck = (rule, value, callback) => {
         /!*if (value === '') {
         callback(new Error('请再次输入账号密码'));
         } else *!/
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let communication_pw = (rule, value, callback) => {
         /!*if (value === '') {
         callback(new Error('请输入通讯密码'));
         } else {*!/
        if (this.form.communication_pwCheck !== '') {
          this.$refs.Form.validateField('communication_pwCheck');
        }
        callback();
         /!*}*!/
      };
      let communication_pwCheck = (rule, value, callback) => {
         /!*if (value === '') {
         callback(new Error('请再次输入通讯密码'));
         } else *!/
        if (value !== this.form.communication_pw) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
         };*/
      return {
        refresh: true,
        loading: false,
        //代理商基本信息
        form: {},
        capitalPools: {},
        account_status: [{'key': '操盘中', 'value': 1}, {'key': '单向冻结', 'value': 2}, {'key': '双向冻结', 'value': 3}],
        formRule: {
          financier_name: [
            {required: true, message: '不能为空'},
            {min: 1, max: 20, message: '客户姓名为1到20个字'}
          ],
          /*account: [
           {required: true,message: '不能为空'},
           ],*/
            /*password: [
            {validator: password, trigger: 'blur'}
          ],
          passwordCheck: [
            {validator: passwordCheck, trigger: 'blur'}
          ],
          communication_pw: [
            {validator: communication_pw, trigger: 'blur'}
          ],
          communication_pwCheck: [
            {validator: communication_pwCheck, trigger: 'blur'}
             ],*/
          total_in_capital: [
            {required: true, type: 'number', message: '不能为空', trigger: 'blur'},
          ],
          securities_trader: [
            {required: true, message: '不能为空'},
            {min: 1, max: 20, message: '所属券商为1到20个字'}
          ],
          capital_id: [
            {required: true, type: 'number', message: '不能为空', trigger: 'blur'},
          ],
          account_status: [
            {required: true, type: 'number', message: '不能为空', trigger: 'blur'},
          ]
        }
      }
    },
    created() {
      this.loading = true;
      getParentStockFinance(this.$route.params.id, this.post_data).then(res => {
        this.form = res.data;
          /*this.form.passwordCheck = this.form.password;
           this.form.communication_pwCheck = this.form.communication_pw;*/
        this.loading = false;
      }).catch(error => this.ezNotifyAxiosCatch(error));
      let capitalPoolPostData = {
        field: ['id', 'capital_name']
      };
      this.loading = true;
      getCapitalPools(capitalPoolPostData).then(res => {
        this.capitalPools = res.data.list;
        this.loading = false;
      }).catch(error => this.ezNotifyAxiosCatch(error));
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.$refs.Form.validate((valid) => {
          if (valid) {
            this.loading = true;
              /*delete this.form.passwordCheck;
               delete this.form.communication_pwCheck;*/
            updateParentStockFinance(this.$route.params.id, this.form).then((res) => {
              this.$router.push({path: '/stock/parentStockFinances'});
              this.ezNotifyAxiosThen(res);
              this.loading = false;
            }).catch(error => this.ezNotifyAxiosCatch(error))
          }
        });
      },
    }
  }
</script>
<style scoped>
</style>