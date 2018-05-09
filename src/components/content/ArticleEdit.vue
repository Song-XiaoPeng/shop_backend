<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           ref="agentForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item
      label="文章类别"
      style="text-align: left!important;"
      required>
      <el-select
        style="width:360px"
        v-model="form.type"
        filterable
        :loading="loading"
        placeholder="搜索:代理商名称,如果不选择:则为一级代理商">
        <el-option label="请选择文章类别" value=""></el-option>
        <el-option
          v-for="item in typeData"
          :key="item.type"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="文章标题" required>
      <el-input v-model="form.title" placeholder=""></el-input>
    </el-form-item>

    <el-form-item label="文章描述">
      <el-input type="textarea" v-model="form.summary" placeholder=""></el-input>
    </el-form-item>

    <el-form-item label="封面图片">
      <el-input v-model="form.cover_pic" placeholder=""></el-input>
      <br>
      <el-upload
        class="upload-demo"
        :action="fileUploadUrl"
        :on-success="uploadSuccess"
        :show-file-list="false"
        multiple
        :limit="3"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="排序">
      <el-input v-model="form.sort" placeholder=""></el-input>
    </el-form-item>

    <el-form-item label="首页标题(SEO)">
      <el-input v-model="form.seo_title"></el-input>
    </el-form-item>

    <el-form-item label="页面关键词(SEO)">
      <el-input v-model="form.seo_keyword"></el-input>
    </el-form-item>

    <el-form-item label="页面描述(SEO)">
      <el-input v-model="form.seo_description"></el-input>
    </el-form-item>

    <el-form-item label="内容">
      <UE ref="ue" :defaultMsg="form.content"></UE>
    </el-form-item>

    <el-button type="primary"
               @click.native.prevent="onSubmit">
      提交
    </el-button>
    <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
  </el-form>
</template>

<script>
  import {HOST} from '../../common/tools';
  import {articleTypeList, articleEdit, getArticleInfo} from '../../api/content';
  import UE from '../common/Ue.vue';

  export default {
    components: {
      UE
    },
    data() {
      return {
        refresh: true,
        typeData: [],
        loading: false,
        form: {
            id: "",
            type: "",
            title: "",
            content: "",
            summary: "",
            cover_pic: "",
            sort: 99,
            seo_title: '',
            seo_keyword: '',
            seo_description: '',
        },
        fileUploadUrl: HOST + "/v1/uploadPic",
      }
    },
    created() {
      this.getTypeData()

      this.form.id = this.$route.params.id;
      if (this.form.id) {
        this.getArticleInfo()
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
        articleEdit(this.form).then((res) => {
          this.loading = false;
          this.ezNotifyAxiosThen(res);
          if (res.status > 0) {
            this.$router.push({path: '/content/articles'});
          }
        }).catch(error => this.ezNotifyAxiosCatch(error))
      },
      getTypeData() {
        articleTypeList().then((res) => {
          this.typeData = res.data;
        });
      },
      getArticleInfo() {
        getArticleInfo(this.form).then((res) => {
          if (res.status == 1) {
            this.form = res.data
          }
        })
      },
      uploadSuccess(res, file) {
        this.ezNotifyAxiosThen(res);
        if (res.status == 1) {
          this.form.cover_pic = res.data.url
        }
      }
    },
    computed: {}
  }
</script>

<style scoped>

</style>