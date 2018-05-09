<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="wechatForm"
           style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px">

    <el-form-item label="菜单" required prop="menu">
      <el-row>
        <el-col :span="23" :offset="1">
          <el-button type="primary" @click="addMenu">新增主菜单(最多3个)</el-button>
        </el-col>
      </el-row>
      <template v-for="(menu,index) in form.menu">
        <el-row>
          <el-col :span="8">
            <el-input v-model="menu.name">
              <template slot="prepend">主菜单:</template>
            </el-input>
          </el-col>
          <el-col :span="8" :offset="1">
            <el-button size="small" type="primary" @click="addSubMenu(menu.sub_button)">新增子菜单(最多5个)</el-button>
            <el-button size="small" type="primary" @click="delMenu(index)">删除子菜单</el-button>
          </el-col>
        </el-row>
        <template v-for="(submenu,index) in menu.sub_button">
          <el-row>
            <el-col :span="20">
              <el-row :gutter="10">
                <el-col :span="8" :offset="2">
                  <el-input v-model="submenu.name" placeholder="子菜单名称">
                    <template slot="prepend">子菜单名</template>
                  </el-input>
                </el-col>
                <el-col :span="6">
                  <el-select size="small" style="width:150px;" v-model="submenu.type" placeholder="子菜单类型">
                    <el-option
                      style="text-align: center"
                      v-for="item in menu_list"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="submenu.url" placeholder="子菜单链接地址">
                    <template slot="prepend">{{submenu.type == 'click' ? '事件名称' : '链接地址'}}</template>
                  </el-input>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="3" :offset="1">
              <el-button size="small" type="primary" @click="delSubMenu(menu.sub_button,index)">删除</el-button>
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
  import {updateWechatInfo} from '../../../api/wechat';

  export default {
      props: ['form'],
    data() {
      return {
        menu_list: [{value: 'view', label: '链接地址'}, {value: 'authView', label: '带登录的链接地址'}, {value: 'click', label: '自定义点击事件'}],
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
      addMenu(){
        this.form.menu.push({name: '', sub_button: [{type: "", name: "", url: ""}]});
        console.log(this.form.menu);
      },
      delMenu(index){
        this.form.menu.splice(index, 1);
      },
      addSubMenu(value){
        value.push({type: "", name: "", url: ""});
      },
      delSubMenu(res, index){
        res.splice(index, 1);
      },
      onSubmit()
      {
        /*console.log(this.form);
        return;*/
        this.loading = true;
        this.$refs.wechatForm.validate((valid) => {
          if (valid) {
            updateWechatInfo({agentId:this.$route.params.id, menu: this.form.menu}).then((res) => {
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
  };
</script>

<style scoped>
  .el-row {
    margin-bottom: 10px;
  }
</style>
