<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           ref="agentForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item
      label="协议类别"
      style="text-align: left!important;"
      required>
      <el-select
        style="width:360px"
        v-model="form.type"
        filterable
        :loading="loading"
        placeholder="搜索:代理商名称,如果不选择:则为一级代理商">
        <el-option label="请选择协议类别" value=""></el-option>
        <el-option
          v-for="item in protocolTypeData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类别介绍">
      <UE ref="ue" :defaultMsg="form.content"></UE>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 @click.native.prevent="onSubmit">
        提交
      </el-button>
      <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {protocolTypeList, protocolEdit, getProtocolInfo} from '../../api/content';
  import UE from '../common/Ue.vue';

  export default {
    components: {
      UE
    },
    data() {
      return {
        refresh: true,
        protocolTypeData: [],
        loading: false,
        form: {
          id: "",
          type: "",
          content: "",
        }
      }
    },
    created() {
      this.fetchProtocolTypeListData();
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        this.getProtocolInfo()
      }
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.loading = true;
        this.form.content = this.$refs.ue.getUEContent();
        protocolEdit(this.form).then((res) => {
          this.loading = false;
          this.ezNotifyAxiosThen(res);
          if (res.status > 0) {
            this.$router.push({path: '/content/protocols'});
          }
        }).catch(error => this.ezNotifyAxiosCatch(error))
      },
      fetchProtocolTypeListData() {
        protocolTypeList().then((res) => {
          this.protocolTypeData = res.data;
        });
      },
      getProtocolInfo() {
        getProtocolInfo(this.form).then((res) => {
          if (res.status == 1) {
            this.form = res.data
          }
        })
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>