<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="employeForm"
           style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px">

    <el-form-item label="角色名称" required prop="role_name">
      <el-input v-model.string="form.role_name"></el-input>
    </el-form-item>

    <el-form-item  label="菜单列表" prop="role_permission">
      <el-tree
        :data="permissionList"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps">
      </el-tree>
    </el-form-item>


    <el-form-item>
      <el-button type="primary"
                 @click.native.prevent="onSubmit">
        修改
      </el-button>
      <el-button @click.native.prevent="$router.push({path: '/roles/RoleList'});">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { getTreeList,getRoleDetail,addRolePermission,getBackendApiAuthList } from '../../api/roles'
  import {refreshUserMenuData} from '../../common/tools'

  export default {
    data() {
      return {
        backendApiAuthList: [],
        defaultExpandedKeys: [],
        defaultCheckedKeys: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultProps1: {
          children: 'children',
          label: 'label'
        },
        permissionList: [],
        refresh: true,
        loading: false,
        form: {
          id: '',
          role_name: '',
          permissions: [],
        },
        formRule: {
          role_name: [
            { required: true, message: '请输入角色名称', trigger: 'blur'  }
          ]
        }
      };
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      onSubmit() {
        this.loading = true;
        this.$refs.employeForm.validate((valid) => {
          if (valid) {
            this.form.permissions = this.$refs.tree.getCheckedKeys()
            addRolePermission(this.form).then((res) => {
              this.loading = false;            
              this.ezNotifyAxiosThen(res);
              if (res.status > 0) {
                if(this.form.id === this.userInfo.role.id){
                  refreshUserMenuData().then(() => {
                    location.reload()
                  })
                }
                this.$router.push({path: '/roles/RoleList'});
              }
            }).catch(error => {
              this.ezNotifyAxiosCatch(error);
            });
          }
        });
      },
    },
    created() {
      getTreeList(this.form).then((res) => {
        this.loading = false;
        let jsonData = res.data
        let data = []
        for(let i=0;i<jsonData.length;i++){
          let jsonChildren = jsonData[i].children
          let children = []
          for(let j=0;j<jsonChildren.length;j++){
              let children1 = []
              let jsonChildren1 = jsonChildren[j].children
              for(let k=0;k<jsonChildren1.length;k++){
                  children1.push({
                      id: jsonChildren1[k].id,
                      label: jsonChildren1[k].name,
                      children: []
                  })
              }
            children.push({
              id: jsonChildren[j].id,
              label: jsonChildren[j].name,
              children: children1
            });
          }
            data.push({
                id: jsonData[i].id,
                children: children,
                label: jsonData[i].name
            })
        }
        this.permissionList = data
        let id = this.$route.params.id
        if(id){
          this.form.id = id
          getRoleDetail({id: id}).then((res) => {
            let jsonData = res.data
            this.defaultCheckedKeys = jsonData.default_checked_permission 
            this.defaultExpandedKeys = jsonData.default_expanded_permission
            this.form.role_name = jsonData.role.role_name
          }).then(() => {
            for(let i=0;i<this.defaultCheckedKeys.length;i++){
              this.$refs.tree.setChecked(this.defaultCheckedKeys[i],true,false)
            }
          })
        }
      }).catch(error => {
        this.ezNotifyAxiosCatch(error);
      });

    }
  };
</script>
