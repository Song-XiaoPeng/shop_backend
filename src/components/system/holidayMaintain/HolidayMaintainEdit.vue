<template>
  <el-form :model="form"
           label-width="300px"
           @submit.prevent="onSubmit"
           ref="Form"
           v-loading="loading"
           label-position="right"
           style="margin:20px;"
  >
    <el-form-item label="备注" prop="remark">
      <el-input size="small" style="width:200px" v-model="form.remark"></el-input>
    </el-form-item>
    <el-form-item label="节假日时间" prop="holiday" required>
      <el-date-picker size="small" style="width:200px" v-model="form.holiday" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="changeDate">
      </el-date-picker>
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
  import {updateHolidayMaintain, getHolidayMaintain} from '../../../api/system';

  export default {
    data() {
      return {
        refresh: true,
        loading: false,
        form: {},
        formRule: {
          holiday: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ]
        },
        post_data: {
          field: ['remark', 'holiday']
        }
      }
    },
    created() {
      this.loading = true;
      getHolidayMaintain(this.$route.params.id, this.post_data).then(res => {
        this.form = res.data;
        this.loading = false;
      }).catch(error => this.ezNotifyAxiosCatch(error));
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      changeDate($value) {
        this.form.holiday = $value;
      },
      onSubmit() {
        this.$refs.Form.validate((valid) => {
          if (valid) {
            this.loading = true;
            updateHolidayMaintain(this.$route.params.id, this.form).then((res) => {
              this.$router.push({path: '/system/holidayMaintains'});
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
