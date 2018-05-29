<template>
  <el-form
    label-width="300px"
    @submit.prevent="onSubmit"
    ref="Form"
    v-loading="loading"
    label-position="right"
    style="margin:20px;">

    <template v-for="(form,index) in forms">
      <el-form-item :label="form.remark">
        <template v-if="form.param_type==1">
          <el-input size="small" style="" v-model="forms[index].param_value"></el-input>
        </template>
        <template v-else-if="form.param_type==2">
          <el-switch on-text="" off-text="" v-model="forms[index].param_value" on-value="1" off-value="0"></el-switch>
        </template>
        <template v-else>
          {{forms[index].param_value}}
        </template>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button size="small" type="primary" @click.native="onSubmit">
          修改(部分可修改)
      </el-button>
      <el-button size="small" @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {getSystemParams, updateSystemParam} from '../../../api/system';

  export default {
    data() {
      return {
        refresh: true,
        forms: {},
        loading: false,
      }
    },
    created(){
      this.loading = true;
      getSystemParams().then(res => {
        this.loading = false;
        if (res.status === 0) return this.ezNotifyAxiosThen(res);
        this.forms = res.data.list;
      }).catch(error => this.ezNotifyAxiosCatch(error));
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.loading = true;
         updateSystemParam(this.forms).then(res => {
         this.ezNotifyAxiosThen(res);
         this.loading = false;
         }).catch(error => this.ezNotifyAxiosCatch(error))
      }
    }
  }
</script>

<style scoped>
</style>
