<template>
  <el-tabs tab-position="" style="height: 200px;" v-model="activeName"  @tab-click="handleClick">
    <el-tab-pane label="添加根菜单" name="0">
      <root-menu :button="buttonName" :permission="permission" :load="loading"></root-menu>
    </el-tab-pane>
    <el-tab-pane label="添加子菜单" name="1">
      <sub-menu :button="buttonName" :permission="permission" :load="loading"></sub-menu>
    </el-tab-pane>
    <el-tab-pane label="添加权限" name="2">
      <page-button :button="buttonName" :permission="permission" :load="loading"></page-button>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import {getPermissionDetail} from '@/api/roles.js'
  import rootMenu from './menu/rootMenu'
  import subMenu from './menu/subMenu'
  import pageButton from './menu/pageButton'

  export default {
    components: {
      rootMenu,subMenu,pageButton
    },
    data() {
      return {
        loading: false,
        type: '',
        buttonName:'新增',
        activeName: '0',
        permission1: {
          id: '',
          name: '',
          auth: '',
          path: '',
          icon_class: '',
          parent_id:''
        },
        permission: {},
        permission2: null
      }
    },
    methods: {
      handleClick(tab, event) {
        if(this.type != tab.name){
          this.permission = this.permission1
          return
        }
        this.getPermissionDetail()
      },
      getPermissionDetail() {
        let id = this.$route.params.id
        if(id){
          if(this.permission2){
            this.permission = this.permission2
            return
          }
          this.buttonName = "修改"
          this.loading = true
          getPermissionDetail({id}).then((res) => {
            this.loading = false
            this.permission = res.data
            this.permission2 = res.data
          })
        }
      }
    },
    created() {
      this.type = this.$route.query.type ? this.$route.query.type + '' : '0'
      this.activeName = this.type 
      this.getPermissionDetail()      
    }
  }
</script>