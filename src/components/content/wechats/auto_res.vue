<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="wechatForm"
           style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px">
    <el-form-item label="自动回复" required prop="auto_res">
      <el-row>
        <el-col :span="23" :offset="1">
          <el-button type="primary" @click="addAutoRes">新增自动回复(最多20个)</el-button>
        </el-col>
      </el-row>
      <template v-for="(auto_res,index) in form.auto_res">
        <el-row>
          <el-col :span="8">
            <el-input v-model="auto_res.key">
              <template slot="prepend">用户发送:</template>
            </el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button size="small" type="primary" @click="addSubAutoRes(auto_res.value)">新增回复内容(最多8个)</el-button>
            <el-button size="small" type="primary" @click="delAutoRes(index)">删除</el-button>
          </el-col>
        </el-row>
        <template v-for="(sub_auto_res,index) in auto_res.value">
          <el-row>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="22" :offset="2">
                  <el-input v-model="sub_auto_res.title" placeholder="标题">
                    <template slot="prepend">标题</template>
                  </el-input>
                </el-col>
                <el-col :span="22" :offset="2">
                  <el-input v-model="sub_auto_res.description" placeholder="描述">
                    <template slot="prepend">描述</template>
                  </el-input>
                </el-col>
                <el-col :span="22" :offset="2">
                  <el-input v-model="sub_auto_res.image" placeholder="图片">
                    <template slot="prepend">图片</template>
                  </el-input>
                </el-col>
                <el-col :span="22" :offset="2">
                  <el-input v-model="sub_auto_res.url" placeholder="链接地址">
                    <template slot="prepend">链接地址</template>
                  </el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3" :offset="1">
              <br>
              <el-button size="small" type="primary" @click="delSubAutoRes(auto_res.value,index)">删除</el-button>
            </el-col>
          </el-row>
        </template>
      </template>
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
        formRule: {}
      };
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      addAutoRes(){
        this.form.auto_res.push({'key': '', 'value': [{title: '', description: '', image: '', url: ''}]});
        console.log(this.form.auto_res);
      },
      delAutoRes(index){
        this.form.auto_res.splice(index, 1);
      },
      addSubAutoRes(value){
        value.push({title: '', description: '', image: '', url: ''});
      },
      delSubAutoRes(res, index){
        res.splice(index, 1);
      },
      onSubmit()
      {
        /*console.log(this.form);
        return;*/
        this.loading = true;
        this.$refs.wechatForm.validate((valid) => {
          if (valid) {
            updateWechatInfo({agent_id: this.$route.params.id, key:'auto_res',value: this.form.auto_res}).then((res) => {
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
      getWechatSettingDetail({agent_id:agent_id,type:'auto_res'}).then((res) => {
        this.form.default_res = res.data.param_value
      })
    }
  }
  ;
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
