<template>
  <el-form :model="form"
           label-width="300px"
           @submit.prevent="onSubmit"
           ref="Form"
           v-loading="loading"
           label-position="right"
           style="margin:20px;"
  >

    <el-form-item label="账户号码" prop="id">
      {{ form.id }}
    </el-form-item>

    <el-form-item label="客户姓名" prop="real_name">
      {{ form.client.real_name}}
    </el-form-item>

    <el-form-item v-if="role=='SystemAdmin'" label="资金池" prop="capital_pool_id">
      <template v-if="form.status==4">
        {{form.capital_pool_id}}
      </template>
      <template v-else>
        <el-select size="small" style="width:200px" v-model.number="form.capital_pool_id" clearable placeholder="请选择">
          <el-option
            v-for="item in capitalPools"
            :key="item.id"
            :label="item.capital_name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </el-form-item>

    <el-form-item label="子账户状态" prop="status">
      <template v-if="form.status==4">
        已结算
      </template>
      <template v-else>
        <el-select size="small" style="width:200px" v-model.number="form.status" clearable placeholder="请选择">
          <el-option
            v-for="item in status_list"
            :key="item.value"
            :label="item.key"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
    <el-form-item label="预警线" prop="precautious_line_amount">
      <template v-if="form.status==4">
        {{form.precautious_line_amount}}
      </template>
      <template v-else>
        <el-input size="small" style="width:200px" v-model="form.precautious_line_amount"></el-input>
      </template>
    </el-form-item>
    <el-form-item label="平仓线" prop="liiquidation_line_amount">
      <template v-if="form.status==4">
        {{form.liiquidation_line_amount}}
      </template>
      <template v-else>
        <el-input size="small" style="width:200px" v-model="form.liiquidation_line_amount"></el-input>
      </template>
    </el-form-item>
    <el-form-item label="配资日期" prop="stock_finance_begin_time">
      {{ form.stock_finance_begin_time }}
    </el-form-item>

    <el-form-item>
      <el-button size="small" type="primary" @click.native.prevent="onSubmit" :disabled="form.status==4">
        立即修改
      </el-button>
      <el-button size="small" @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {updateUStockFinancing, getUStockFinancing, getCapitalPools} from '../../../api/stock';

  export default {
    data() {
      return {
        refresh: true,
        status_list: [{key: '操盘中', value: 1}, {key: '单向冻结', value: 2}, {key: '双向冻结', value: 3},
          {key: '已结算', value: 4, disabled: true}],
        loading: false,
        //代理商基本信息
        form: {client: {real_name: ''}},
        post_data: {
          field: ['id', 'capital_pool_id', 'status', 'precautious_line_amount',
            'cust_id', 'liiquidation_line_amount', 'stock_finance_begin_time'],
          client: {
            field: ['id', 'real_name']
          }
        },
        capitalPools: {}
      }
    },
    created() {
      this.loading = true;
      getUStockFinancing(this.$route.params.id, this.post_data).then(res => {
        this.form = res.data;
        this.form.status = this.status_list.find((n) => n.key == this.form.status).value;
        /*this.form.passwordCheck=this.form.password;
         this.form.communication_pwCheck=this.form.communication_pw;*/
        this.loading = false;
      }).catch(error => this.ezNotifyAxiosCatch(error));
      let capitalPoolPostData = {
        field: ['id', 'capital_name']
      };
      this.loading = true;
      getCapitalPools(capitalPoolPostData).then(res => {
        this.loading = false;
        this.capitalPools = res.data.list;
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
            updateUStockFinancing(this.$route.params.id, this.form).then((res) => {
              this.$router.go(-1);
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