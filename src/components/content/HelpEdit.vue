<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           ref="agentForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item label="分类名" required>
      <el-input v-model="form.name" placeholder=""></el-input>
    </el-form-item>

    <el-form-item label="显示位置" required>
      <el-radio v-model="form.is_mobile" :label="0">电脑端</el-radio>
      <el-radio v-model="form.is_mobile" :label="1">手机端</el-radio>
    </el-form-item>

    <el-form-item label="帮助介绍">
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
  import {helpEdit, getHelpInfo} from '../../api/content';
  import UE from '../common/Ue.vue';

  export default {
    components: {
      UE
    },
    data() {
      return {
        refresh: true,
        loading: false,
        form: {
          id: "",
          name: "",
          content: "",
          agent_id: "",
          is_mobile: 0
        }
      }
    },
    created() {
      this.form.id = this.$route.params.id;
      if (this.form.id) {
        this.getInfo()
      }
      this.fetchTypeListData()
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.loading = true;
        this.form.content = this.$refs.ue.getUEContent();
        helpEdit(this.form).then((res) => {
          this.loading = false;
          this.ezNotifyAxiosThen(res);
          if (res.status > 0) {
            this.$router.push({path: '/content/helps'});
          }
        }).catch(error => this.ezNotifyAxiosCatch(error))
      },
      getInfo() {
        getHelpInfo(this.form).then((res) => {
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