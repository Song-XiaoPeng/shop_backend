<template>
  <el-form :model="form"
           label-width="300px"
           @submit.prevent="onSubmit"
           ref="Form"
           v-loading="loading"
           label-position="right"
           style="margin:20px;"
  >

    <el-form-item label="资金池名称" prop="stock_code">
      <el-input size="small" style="width:200px" v-model="form.capital_name"></el-input>
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
  import {updateCapitalPool, getCapitalPool} from '../../../api/stock';

  export default {
    data() {
      return {
        refresh: true,
        loading: false,
        form: {},
        formRule: {
          capital_name: [
            {required: true, message: '不能为空'},
            {min: 1, max: 20, message: '资金池名字为1到20个字'}
          ]
        }
      }
    },
    created() {
      this.loading = true;
      getCapitalPool(this.$route.params.id, this.post_data).then(res => {
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
            updateCapitalPool(this.$route.params.id, this.form).then((res) => {
              this.$router.push({path: '/stock/capitalPools'});
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