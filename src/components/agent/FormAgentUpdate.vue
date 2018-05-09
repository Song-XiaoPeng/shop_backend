<template>
  <el-tabs v-model="tabName" type="card" style="margin-top: 12px" v-loading="loading">
    <el-tab-pane label="基本信息" name="basic" v-if="(role=='AgentAdmin' && agent_id != userInfo.agent.id) || role=='SystemAdmin'">
      <form-agent-update-basic :agent_id="$route.params.id" :infoData.sync="allInfo" v-on:changeRefresh="changeRefresh"></form-agent-update-basic>
    </el-tab-pane>

    <el-tab-pane label="附加信息" name="info" v-if="isShowExtro && ((role=='AgentAdmin' && agent_id != userInfo.agent.id) || role=='SystemAdmin')">
      <form-agent-update-info :agent_id="$route.params.id" :raw-info="agentInfo" v-on:changeRefresh="changeRefresh"></form-agent-update-info>
    </el-tab-pane>

    <el-tab-pane label="分成配置" name="percentage" v-if="(role=='AgentAdmin' && agent_id != userInfo.agent.id) || role=='SystemAdmin'">
      <form-agent-update-percentage :agent_id="$route.params.id" :infoData="allInfo" v-on:changeRefresh="changeRefresh"></form-agent-update-percentage>
    </el-tab-pane>

    <el-tab-pane label="后台密码" name="user">
      <form-agent-update-user :agent_id.number="$route.params.id" :infoData="allInfo" v-on:changeRefresh="changeRefresh"></form-agent-update-user>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  import {getAgentInfo} from '../../api/agent';
  import FormAgentUpdateBasic from './FormAgentUpdateBasic.vue';
  import FormAgentUpdateInfo from './FormAgentUpdateInfo.vue';
  import FormAgentUpdatePercentage from './FormAgentUpdatePercentage.vue';
  import FormAgentUpdateUser from './FormAgentUpdateUser.vue';

  export default {
    components: {
      FormAgentUpdateUser,
      FormAgentUpdatePercentage,
      FormAgentUpdateInfo,
      FormAgentUpdateBasic,
    },
    data() {
      return {
        refresh: true,
        isShowExtro: false,
        tabName: 'basic',
        allInfo: {},
        agentInfo: {},
        percentageInfo: {},
        loading: false,
        agent_id: this.$route.params.id
      };
    },
    created() {
      if (this.role == 'AgentAdmin' && this.agent_id == this.userInfo.agent.id) {
        this.tabName = 'user';
      }
      this.$bus.$on('refresh-agent-info-update', (data) => {
        if (data.basic) {
          this.isShowExtro = data.basic.is_independent > 0;
          this.allInfo.basic = data.basic;
        }
      });
      this.getAgentInfo();
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      getAgentInfo() {
        this.loading = true;
        let id = this.$route.params.id;
        getAgentInfo({id}).then(res => {
          this.allInfo = res.data;
            console.log(res.data.basic.is_independent > 0)
          this.isShowExtro = res.data.basic.is_independent > 0;
          this.loading = false;
          this.agentInfo = res.data.info;
        }).catch(error => {
            this.ezNotifyAxiosCatch(error);
            this.loading = false;
          },
        );
      },
      changeRefresh(value){
        this.refresh = value;
      }
    }
  };
</script>

