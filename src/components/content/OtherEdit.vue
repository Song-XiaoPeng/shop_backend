<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           ref="agentForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item
      label="类别"
      style="text-align: left!important;"
      required>
      <el-select
        style="width:360px"
        v-model="form.type"
        filterable
        @change="changeType"
        :loading="loading"
        placeholder="搜索">
        <el-option label="请选择类别" value=""></el-option>
        <el-option
          v-for="item in otherTypeData"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item
            label="贴牌代理商"
            style="text-align: left!important;"
            required>
      <el-select
              style="width:360px"
              v-model="form.agent_id"
              filterable
              :loading="loading"
              placeholder="搜索">
        <el-option label="请选择代理商" :value="0"></el-option>
        <el-option
                v-for="item in agentDataC"
                :key="item.id"
                :label="item.agent_name"
                :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="是否全站使用">
      <el-input placeholder="" :value="presentType.is_display_whole_site == 1 ? '全站' : '本站'" disabled></el-input>
    </el-form-item>

    <el-form-item label="内容类型">
      <el-input placeholder="" :value="presentType.content_type == 1 ? '混合' : '图片'" disabled></el-input>
    </el-form-item>

    <el-form-item label="详情" >
      <UE ref="plugin1" :defaultMsg="form.content" v-show="presentType.content_type == 1"></UE>
      <pic-form ref="plugin2" :defaultMsg="form.content" v-show="presentType.content_type == 0"></pic-form>

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
  import {otherTypeList, otherEdit, getOtherInfo} from '../../api/content';
  import {agentSelectorList} from '../../api/agent';
  import UE from '../common/Ue.vue';
  import picForm from '../common/changeAblePicForm.vue';

  export default {
    components: {
      UE,
      picForm
    },
    data() {
      return {
        refresh: true,
        otherTypeData: [],
        agentData: [],
        presentType: {},
        loading: false,
        isInit: true,
        form: {
          id: "",
          type: "",
          content: "",
          agent_id: 0
        }
      }
    },
    created() {
      this.fetchTypeListData().then((res) => {
        this.fetchIndependAgentData().then((res) => {
            this.form.id = this.$route.params.id;
            if (this.form.id) {
                this.getOtherInfo()
            }
        })
      })
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.loading = true;
        this.form.content =  this.presentType.content_type == 1 ? this.$refs.plugin1.getUEContent() : this.$refs.plugin2.getUEContent();
        otherEdit(this.form).then((res) => {
            this.loading = false;
            this.ezNotifyAxiosThen(res);
            if (res.status > 0) {
              this.$router.push({name: "其他管理"});
            }
          }).catch(error => this.ezNotifyAxiosCatch(error))
      },
      fetchTypeListData() {
        return otherTypeList().then((res) => {
          this.otherTypeData = res.data;
        });
      },
      fetchIndependAgentData() {
          return agentSelectorList({isIndependent: 1, limit: 500}).then((res) => {
              this.agentData = res.data;
          });
      },
      getOtherInfo() {
        getOtherInfo(this.form).then((res) => {
            if (res.status == 1) {
                this.form = res.data
            }
        })
      },
      changeType(type) {
          let typeData = {}
          for (let i=0,len=this.otherTypeData.length; i<len; i++) {
              if (this.otherTypeData[i]["id"] == type) {
                  typeData = this.otherTypeData[i]
              }
          }
          this.presentType = typeData
          if (!this.isInit) {
              this.form.agent_id = 0
          }

          this.isInit = false
      }
    },
    computed: {
        agentDataC: function () {
            let newList = []
            let list = this.agentData
            for (let i=0,len=list.length; i<len; i++) {
              if (this.presentType.is_display_whole_site == 1) {
                  if (list[i]["agent_level"] == 1) newList.push(list[i])
              } else {
                  newList.push(list[i])
              }
            }

            return newList;
        }
    }

  }
</script>

<style scoped>

</style>