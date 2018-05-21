<template>
  <el-form :model="form"
           label-width="300px"
           @submit.prevent="onSubmit"
           ref="Form"
           v-loading="loading"
           label-position="right"
           style="margin:20px;"
  >

    <el-form-item label="产品名称" prop="product_name">
      {{form.product_name}}
    </el-form-item>

    <el-form-item label="产品类型" prop="product_type">
      {{form.product_type}}
    </el-form-item>

    <el-form-item label="产品倍数" prop="product_times">
      {{form.product_times}}
    </el-form-item>

    <el-form-item label="产品最低配资额" prop="min_stock_finance">
      {{form.min_stock_finance}}
    </el-form-item>

    <el-form-item label="产品最高额配资额" prop="max_stock_finance">
      {{form.max_stock_finance}}
    </el-form-item>

    <el-form-item label="产品收取递延费比例" prop="interests_rate">
      {{form.interests_rate}}
    </el-form-item>

    <el-form-item label="预警线比例" prop="precautious_line_rate">
      {{form.precautious_line_rate}}
    </el-form-item>

    <el-form-item label="平仓线比例" prop="liquidation_line_rate">
      {{form.liquidation_line_rate}}
    </el-form-item>

    <el-form-item label="单票持仓比例" prop="single_stock_hold_rate">
      {{form.single_stock_hold_rate}}
    </el-form-item>

    <el-form-item label="启用禁用">
      <el-switch on-text="" off-text="" v-model="form.disable" :on-value="0" :off-value="1"></el-switch>
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
  import {getStockFinanceProduct, updateStockFinanceProduct} from '../../../api/system';

  export default {
    data() {
      return {
        refresh: true,
        loading: false,
        //代理商基本信息
        form: {},
        formRule: {
          product_name: [
            {required: true, message: '不能为空'},
            {min: 1, max: 50, message: '产品名称为1到50个字'}
          ],
          product_type: [
            {required: true, message: '不能为空'},
            {min: 1, max: 100, type: 'number', message: '产品类型在1~100之间'}
          ],
          product_times: [
            {required: true, message: '不能为空'},
            {min: 1, max: 100, type: 'number', message: '产品倍数在1~100之间'}
          ],
          min_stock_finance: [
            {required: true, message: '不能为空'},
            {min: 100, max: 1000000, type: 'number', message: '产品最低配资额在100~100000元'}
          ],
          max_stock_finance: [
            {required: true, message: '不能为空'},
            {min: 1000, max: 10000000, type: 'number', message: '产品最高配资额在1000~10000000元'}
          ],
          interests_rate: [
            {required: true, message: '不能为空'},
            {min: 0, max: 1, type: 'number', message: '递延费比例在0~1之间'}
          ],
          precautious_line_rate: [
            {required: true, message: '不能为空'},
            {min: 0, max: 1, type: 'number', message: '递延费比例在0~1之间'}
          ],
          liquidation_line_rate: [
            {required: true, message: '不能为空'},
            {min: 0, max: 1, type: 'number', message: '递延费比例在0~1之间'}
          ],
          single_stock_hold_rate: [
            {required: true, message: '不能为空'},
            {min: 0, max: 1, type: 'number', message: '递延费比例在0~1之间'}
          ]
        },
      }
    },
    created() {
      this.loading = true;
      getStockFinanceProduct(this.$route.params.id).then(res => {
        this.form = res.data;
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
            updateStockFinanceProduct(this.$route.params.id, this.form).then((res) => {
              this.$router.push({path: '/system/financeProducts'});
              this.ezNotifyAxiosThen(res);
              this.loading = false;
            }).catch(error => this.ezNotifyAxiosCatch(error))
          }
        });

      },
    }
  }
</script>
