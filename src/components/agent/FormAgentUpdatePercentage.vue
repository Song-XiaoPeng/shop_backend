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

    <el-form-item label="佣金分成比例0~1" required prop="commission_percentage">
      <el-input v-model.number="config.commission_percentage"></el-input>
    </el-form-item>

    <div v-if="Boolean(config.is_option_open)">
      <el-form-item label="期权金分成比例0~1" required prop="option_add_percentage">
        <el-input v-model.number="config.option_add_percentage"></el-input>
      </el-form-item>

      <el-form-item label="手续费分成比例0~1" required prop="option_service_percentage">
        <el-input v-model.number="config.option_service_percentage"></el-input>
      </el-form-item>

      <el-form-item label="日管理费分成比例0~1" required prop="option_daily_manage_percentage">
        <el-input v-model.number="config.option_daily_manage_percentage"></el-input>
      </el-form-item>
    </div>

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
          monthe_percentage: [
            {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
          ],
          commission_percentage: [
            {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
          ],
            option_add_percentage: [
                {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
            ],
            option_service_percentage: [
                {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
            ],
            option_daily_manage_percentage: [
                {required: true, message: '0~1', trigger: 'blur', min: 0, max: 1, type: 'number'}
            ],
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
              commission_percentage: 0,
              commission_id: 0,
              agent_id: this.agent_id,

                //设置期权分成比例
                option_add_id: 0,
                option_add_percentage: 0,
                option_service_id: 0,
                option_service_percentage: 0,
                option_daily_manage_id: 0,
                option_daily_manage_percentage: 0,
            }
            obj.parent_id = this.infoData.basic.parent_id;
            obj.is_option_open = this.infoData.basic.is_option_open
            this.infoData.configs.forEach((currentValue, index, array) => {
              if (currentValue.type == 0) {
                obj.day_percentage = currentValue.percentage;
                obj.day_id = currentValue.id;

              }
              if (currentValue.type == 1) {
                obj.month_percentage = currentValue.percentage;
                obj.month_id = currentValue.id;

              }
              if (currentValue.type == 2) {
                obj.commission_percentage = currentValue.percentage;
                obj.commission_id = currentValue.id;
              }

                if (currentValue.type == 10) {
                    obj.option_add_id = currentValue.id;
                    obj.option_add_percentage = currentValue.percentage;
                }
                if (currentValue.type == 11) {
                    obj.option_service_percentage = currentValue.percentage;
                    obj.option_service_id = currentValue.id;
                }
                if (currentValue.type == 12) {
                    obj.option_daily_manage_percentage = currentValue.percentage;
                    obj.option_daily_manage_id = currentValue.id;
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
              commission_percentage: 0,
              commission_id: 0,
              agent_id: 0,

                option_add_id: 0,
                option_add_percentage: 0,
                option_service_id: 0,
                option_service_percentage: 0,
                option_daily_manage_id: 0,
                option_daily_manage_percentage: 0,
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
