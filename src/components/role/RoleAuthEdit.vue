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

    
    <el-form-item  label="权限列表" prop="auth_permission">
      <el-tree
        :data="backendApiAuthList"
        show-checkbox
        node-key="id"
        ref="tree1"
        :props="defaultProps1">
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
  import { getRoleDetail,addRolePermission,getBackendApiAuthList } from '../../api/roles'

  export default {
    data() {
      return {
        defaultExpandedKeys: [],
        defaultCheckedKeys: [],
        defaultProps1: {
          children: 'children',
          label: 'label'
        },
        backendApiAuthList: [],
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
      getBackendApiAuthList().then((res) => {
        let jsonData1 = res.data
        this.backendApiAuthList = jsonData1
      });
    }
  };
</script>
