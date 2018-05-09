<template>
  <!--更换客户归属-->
  <section style="width:100%; padding-top: 25px;margin-top: 15px" v-loading="loading">
    <el-form
      :model="form"
      label-width="180px"
      :rules="swapRules"
      ref="swapForm"
      @submit.prevent="onSubmitClientSwap"
      style="margin:20px;width:60%;min-width:600px;">
      <el-form-item label="更换代理商(支持搜索)" required>
        <el-select v-model="form.swapAgentId"
                   clearable
                   filterable
                   style="width:350px"
                   remote
                   @change="changeAgentSelect"
                   placeholder="搜索ID/名称/手机号(仅显示最匹配的10条)"
                   :remote-method="searchAgent"
        >
          <el-option
            v-for="item in agentOptions"
            :key="item.id"
            :label="item.id+'-'+item.agent_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请选择代理的员工" prop="swapEmployeeId">
        <el-select v-model="form.swapEmployeeId"
                   clearable
                   filterable
                   style="width:350px"
                   remote
                   placeholder="搜索ID/名称/手机号(仅显示最匹配的10条)"
                   :disabled="!employeeOptions.length"
                   :remote-method="searchEmployee"
        >
          <el-option
            v-for="item in employeeOptions"
            :key="item.id"
            :label="item.id+'-'+item.employee_name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click.native.prevent="onSubmitClientSwap">修改</el-button>
        <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
      </el-form-item>
    </el-form>

  </section>
</template>

<script>
  import {getAgentSelectorList, getEmployeeSelectorList, swapClientHeritRelation} from '../../api/client';

  export default {
    data() {
      return {
        refresh: true,
        search_agent: '',
        search_employee: '',
        form: {
          swapAgentId: null,
          swapEmployeeId: null,
          clientId: this.$route.params.id,
        },
        swapRules: {},
        loading: false,
        agentOptions: [],
        employeeOptions: [],
      }
    },
    methods: {
      changeAgentSelect(value){
        this.search_agent = '';
        this.search_employee = '';
        this.form.swapEmployeeId = '';
        if (value) {
          getEmployeeSelectorList({agent_id: value}).then(res => {
            if (!res.data || !res.data.list.length) {
              this.form.swapEmployeeId = '暂无员工可以选择';
            }
            this.employeeOptions = res.data.list;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        } else {
          this.employeeOptions = [];
        }
      },
      changeEmployeeSelect(value){
      },
      searchAgent(query) {
        if (!query || query == this.form.swapAgentId) return;
        let agent_id = query.toString();
        if (this.form.swapAgentId && agent_id.substr(0, agent_id.indexOf('-')) == this.form.swapAgentId) return;//如果正好是现在选择的值 则return
        this.search_agent = query;
        let check = () => {
          if (!this.search_agent || query != this.search_agent) return;
          getAgentSelectorList({search: query}).then(res => {
            this.agentOptions = res.data.list;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        };
        setTimeout(check, 500);
      },
      searchEmployee(query) {
        if (!query || query == this.form.swapEmployeeId) return;
        let employee_id = query.toString();
        if (this.form.swapEmployeeId && employee_id.substr(0, employee_id.indexOf('-')) == this.form.swapEmployeeId) return;//如果正好是现在选择的值 则return
        this.search_employee = query;
        let check = () => {
          if (!this.form.swapEmployeeId || query != this.search_employee) return;
          getEmployeeSelectorList({agent_id: this.form.swapEmployeeId, search: query}).then(res => {
            this.employeeOptions = res.data.list;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        };
        setTimeout(check, 500);
      },
      onSubmitClientSwap() {
        this.$refs.swapForm.validate(valid => {
          if (valid) {
            this.loading = true;
            swapClientHeritRelation(this.form).then(res => {
              this.ezNotifyAxiosThen(res);
              this.loading = false;
            }).catch(error => this.ezNotifyAxiosCatch(error));
          }
        })
      },
    },
    created() {
      getAgentSelectorList().then(res => {
        this.agentOptions = res.data.list;
        this.form.swapAgentId = res.data.list[0].id;
      }).catch(error => this.ezNotifyAxiosCatch(error));
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    }
  }
</script>

<style scoped>


</style>
