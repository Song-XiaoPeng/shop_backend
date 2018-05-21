<template>
    <el-form
           label-width="180px"
           :model="permission"
           :rules="rules"
           ref="from"
           style="margin:20px;width:60%;min-width:600px;"
           v-loading="load">
        <el-form-item label="菜单名称" prop="name">
            <el-input v-model="permission.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>

        <el-form-item label="前端路由" prop="path">
            <el-input v-model="permission.path" placeholder="请输入前端路由"></el-input>
        </el-form-item>

        <el-form-item label="图标样式" prop="icon_class">
            <el-input v-model="permission.icon_class" placeholder="请输入图标样式"></el-input>
        </el-form-item>

        <el-form-item label="权限名称" prop="auth">
            <el-input v-model="permission.auth" placeholder="请输入权限名称"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm('from')" :loading="loading">{{ button }}</el-button>
            <!-- <el-button @click="resetForm('from')">重置</el-button> -->
            <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import {setPermission} from '@/api/roles.js'
export default {
    props:['button', 'permission', 'load'],
    data() {
        return {
            loading: false,
            rules: {
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ],
                auth: [
                    // { required: true, message: '请输入权限名称', trigger: 'blur' }
                ],
                path: [
                    { required: true, message: '请输入前端路由', trigger: 'blur' }
                ],
                icon_class: [
                    { required: true, message: '请输入图标样式', trigger: 'blur' }
                ],
            }
        }    
    },
    methods:{
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loading = true;
                    setPermission(this.permission).then((res) => {
                        this.loading = false;
                        this.ezNotifyAxiosThen(res)
                        if(res.status > 0){
                            this.$router.go(-1);
                        }
                    }).catch(error => this.ezNotifyAxiosCatch(error))
                } else {
                    return false;
                }
            });
        }
    },
    created() {
    }
}
</script>
