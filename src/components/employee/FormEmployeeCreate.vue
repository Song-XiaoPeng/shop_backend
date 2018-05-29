<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="employeForm"
           style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px">

    <el-form-item label="员工编号(登录账号)" required prop="name">
      <el-input v-model.string="form.name"></el-input>
    </el-form-item>

    <el-form-item label="登录密码" required prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="重复密码" required prop="confirm_password">
      <el-input v-model="form.confirm_password" type="password"></el-input>
    </el-form-item>

    <el-form-item label="请选择角色" required prop="role_id">
      <el-select v-model.number="form.role_id" placeholder="请选择">
        <el-option
          v-for="(value,key) in roleOptions"
          :key="value"
          :label="key"
          :value="value">
        </el-option>
      </el-select>

    </el-form-item>


    <el-form-item label="员工姓名" required prop="employee_name">
      <el-input v-model="form.employee_name"></el-input>
    </el-form-item>

    <el-form-item label="联系电话" required prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item label="email" prop="email">
      <el-input v-model="form.email" type="email"></el-input>
    </el-form-item>

    <el-form-item label="天配提成比例" required prop="day_percentage" v-if="role=='AgentAdmin'">
      <el-input v-model.number="form.day_percentage"></el-input>
    </el-form-item>

    <el-form-item label="月配提成比例" required prop="month_percentage" v-if="role=='AgentAdmin'">
      <el-input v-model.number="form.month_percentage"></el-input>
    </el-form-item>

    <el-form-item label="开仓提成" required prop="service_recharge" v-if="role=='AgentAdmin'">
      <el-input v-model.number="form.service_recharge"></el-input>
    </el-form-item>

    <el-form-item label="备注" prop="remark">

      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="form.remark">
      </el-input>

    </el-form-item>

    <el-form-item label="是否禁止" v-if="false">
      <el-switch on-text="" off-text="" v-model.number="form.is_forbid" on-value="1" off-value="0"></el-switch>
    </el-form-item>


    <el-form-item>
      <el-button type="primary"
                 @click.native.prevent="onSubmit">
        创建
      </el-button>
      <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {employeeCreate} from '../../api/employee';

  import {adminRoles, agentRoles} from '../../common/tools';

  export default {
    data() {
      let passwordConfirmCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        refresh: true,
        roleOptions: this.role_group == 'System' ? adminRoles : agentRoles,
        loading: false,
        //代理商基本信息
        form: {
          role_id: this.role_group == 'System' ? null : 16,
          employee_name: '',
          is_forbid: 0,
          name: (Math.floor(Math.random() * 999999) + 1000000).toString(),
          phone: '',
          password: '',
          confirm_password: '',
          day_percentage: 0,
          month_percentage: 0,
          service_recharge: 0,
          remark: '',
        },

        formRule: {
          name: [
            {
              required: true,
              message: '管理后台登陆名6~11位',
              min: 6,
              max: 11,
              trigger: 'blur',
            },
          ],
          email: [
            {
              type: 'email',
              message: '请填写邮箱地址',
              trigger: 'blur',
            },
          ],
          role_id: [
            {
              type: 'number',
              required: true,
              message: '请选择角色',
              trigger: 'blur',
            },
          ],
          employee_name: [
            {
              required: true,
              message: '员工真实姓名',
              trigger: 'blur',
            },
            {min: 2, max: 20, message: '姓名长度2~20个字符', trigger: 'blur'},

          ],
          phone: [
            {
              required: true,
              message: '手机号码是必填',
              trigger: 'blur',
            },
            {
              type: 'string',
              pattern: /^[*|#]{0,1}1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确手机号码',
              trigger: 'blur',
            },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
            {
              min: 6,
              max: 20,
              message: '密码最短6位,最长20位',
              trigger: 'blur',
            },
          ],
          confirm_password: [
            {validator: passwordConfirmCheck, trigger: 'blur'},
          ],
          day_percentage: [
            {
              min: 0,
              max: 1,
              type: 'number',
              message: '比例在0~1之间',
              trigger: 'blur',
            },

          ],
          month_percentage: [
            {
              min: 0,
              max: 1,
              type: 'number',
              message: '比例在0~1之间',
              trigger: 'blur',
            },

          ],
          service_recharge: [
            {
              min: 0,
              type: 'number',
              message: '大于0整数',
              trigger: 'blur',
            },

          ],
        },

      };
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.loading = true;
        this.$refs.employeForm.validate((valid) => {
          if (valid) {
            employeeCreate(this.form).then((res) => {
              this.loading = false;
              this.ezNotifyAxiosThen(res);
              if (res.status > 0) {
                if (this.role_group == 'System') {
                  this.$router.push({path: '/system/user'});
                } else {
                  this.$router.push({path: '/employee'});
                }
              }
            }).catch(error => {
              this.ezNotifyAxiosCatch(error);
            });
          }
        });
      },
    },
  };
</script>
