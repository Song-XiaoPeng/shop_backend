<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="wechatForm"
           style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px">

    <el-form-item label="默认回复" required prop="default_res">
      <el-input
        type="textarea"
        :rows="12"
        placeholder="请输入内容"
        v-model="form.default_res">
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-row :gutter="10">
        <el-col :span="16" :offset="8">
          <el-button type="primary"
                     @click.native.prevent="onSubmit">
            修改
          </el-button>
          <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
  import {updateWechatInfo,getWechatSettingDetail} from '../../../api/wechat';

  export default {
    props: ['form'],
    data() {
      return {
        refresh: true,
        loading: false,
        formRule: {
          default_res: [
            {
              required: true,
              message: '不能为空',
              trigger: 'blur',
            },
          ]
        },

      };
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit()
      {
        /*console.log(this.form);
        return;*/
        this.loading = true;
        this.$refs.wechatForm.validate((valid) => {
          if (valid) {
            updateWechatInfo({agent_id: this.$route.params.id, key:'default_res',value: this.form.default_res}).then((res) => {
              this.loading = false;
              this.$emit('refresh');
              this.ezNotifyAxiosThen(res);
            }).catch(error => {
              this.ezNotifyAxiosCatch(error);
            });
          }
        });
      }
    },
    created() {
      let agent_id = this.$route.params.id
      getWechatSettingDetail({agent_id:agent_id,type:'default_res'}).then((res) => {
        this.form.default_res = res.data.param_value
      })
    }
  };
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
