<template>
    <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="employeForm"
           style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px">

    <el-form-item label="代理商id" prop="agent_id">
      <el-input v-model.string="form.agent_id"></el-input>
    </el-form-item>

    <el-form-item label="参数名称" prop="param_key">
      <el-input v-model.string="form.param_key"></el-input>
    </el-form-item>

    <el-form-item label="参数值" prop="param_value">
      <el-input v-model.string="form.param_value"></el-input>
    </el-form-item>

    <el-form-item label="参数说明" prop="param_value">
      <el-input v-model.string="form.remark"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 @click.native.prevent="onSubmit">
        {{ confirm_button_name }}
      </el-button>
      <el-button @click.native.prevent="$router.push({path: '/systemSetting/systemSettingList'});">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
    import { getSystemSettingDetails,setSystemSetting } from '../../../api/system'

    export default {
      data() {
          return {
              confirm_button_name: '新增',
              formRule: {
                agent_id: [
                  { required: true, message: '请输入代理商id', trigger: 'blur'  }
                ],
                param_key: [
                  { required: true, message: '请输入参数名称', trigger: 'blur'  }
                ],
                param_value: [
                  { required: true, message: '请输入参数值', trigger: 'blur'  }
                ],
                remark: [
                  { required: true, message: '请输入参数说明', trigger: 'blur'  }
                ]
              },
              form: {
                  id: '',
                  agent_id: '',
                  param_key: '',
                  param_value: '',
                  remark: ''
              }
          }
      },
      methods: {
        getSystemSettingDetails(params) {
          getSystemSettingDetails(params).then((res) => {
            if(res.status == 1){
              this.form = res.data
            }
          })
        },
        onSubmit() {          
          setSystemSetting(this.form).then((res) => {
            if(res.status == 1) {
              this.$router.push({path: '/systemSetting/systemSettingList'});
            }else{
              this.ezNotifyAxiosThen(res)
            }
          }).catch(error => this.ezNotifyAxiosCatch(error))
        }
      },
      created() {
        if(this.$route.params.id !== undefined){
          this.confirm_button_name = "修改"
          this.form.id = this.$route.params.id
          this.getSystemSettingDetails({id: this.$route.params.id})
        }
      }
    }
</script>
