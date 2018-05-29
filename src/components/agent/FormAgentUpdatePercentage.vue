<template>

  <el-form :model="config"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="configRules"
           ref="configForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item label="天配分成比例0~1" required prop="day_percentage">
      <el-input v-model.number="config.day_percentage"></el-input>
    </el-form-item>

    <el-form-item label="月配分成比例0~1" required prop="month_percentage">
      <el-input v-model.number="config.month_percentage"></el-input>
    </el-form-item>

    <el-form-item label="开仓费" required prop="service_charge">
      <el-input v-model.number="config.service_charge"></el-input>
    </el-form-item>

    <el-form-item label="佣金" required prop="service_charge">
      <el-input v-model.number="config.commission_charge"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 :loading="loading"
                 @click.native.prevent="submitPercentageInfoForm">
        修改分成比例
      </el-button>
      <el-button @click.native.prevent="$emit('changeRefresh',false);$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>

</template>

<script>
  import {agentUpdatePercentage} from '../../api/agent';
  import {flashAxiosCatchError, flashAxiosThenMessage} from '../../common/tools'

  export default {
    data() {
      return {
        loading: false,
        configs: [],//代理商配置信息
        configRules: {
          day_percentage: [
            {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
          ],
          month_percentage: [
            {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
          ],
          service_charge: [
            {required: true, message: '>0整数', trigger: 'blur', min: 0, type: 'number'}
          ],
          commission_charge: [
            {required: true, message: '>0整数', trigger: 'blur', min: 0, type: 'number'}
          ]
        }
      }
    },
    computed: {
      config: {
        // getter
        get: function () {

          try {
            let obj = {
              parent_id: 0,
              day_percentage: 0,
              day_id: 0,
              month_percentage: 0,
              month_id: 0,
              service_charge: 0,
              service_charge_id: 0,
              commission_charge_id:0,
              commission_charge:0,
              agent_id: this.agent_id,
            }
            obj.parent_id = this.infoData.basic.parent_id;
            this.infoData.configs.forEach((currentValue, index, array) => {
              if (currentValue.type == 0) {
                obj.day_percentage = currentValue.amount;
                obj.day_id = currentValue.id;

              }
              if (currentValue.type == 1) {
                obj.month_percentage = currentValue.amount;
                obj.month_id = currentValue.id;

              }
              if (currentValue.type == 2) {
                obj.service_charge = currentValue.amount;
                obj.service_charge_id = currentValue.id;
              }
              if (currentValue.type == 3) {
                obj.commission_charge = currentValue.amount;
                obj.commission_charge_id = currentValue.id;
              }
            })
            return obj
          } catch (e) {
            return {
              parent_id: 0,
              day_percentage: 0,
              day_id: 0,
              month_percentage: 0,
              month_id: 0,
              service_charge: 0,
              service_charge_id: 0,
              commission_charge_id:0,
              commission_charge:0,
              agent_id: 0,
            }
          }
        },
      }
    },
    methods: {

      //修改用户密码

      submitPercentageInfoForm() {
        this.$refs.configForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            agentUpdatePercentage(this.config).then(res => {
              this.loading = false;
              this.ezNotifyAxiosThen(res);
              if (res.status > 0) {
                this.$router.go(-1);
              }
            }).catch(error => this.ezNotifyAxiosCatch(error))

          }
        });
      },

    },
    props: ['agent_id', 'infoData']
  }


</script>


<style scoped>

</style>
