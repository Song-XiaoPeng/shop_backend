<template>
    <el-form
           label-width="180px"
           :model="permission"
           :rules="rules"
           ref="from"
           style="margin:20px;width:60%;min-width:600px;"
           :loading="load">
        <el-form-item label="所属菜单名称" prop="parent_id" required>
            <el-select v-model="permission.parent_id" clearable placeholder="请选择上级菜单">
                <el-option-group
                    v-for="group in options"
                    :key="group.id"
                    :label="group.name">
                    <el-option
                        v-for="item in group.children"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-option-group>
            </el-select>
        </el-form-item>   

        <el-form-item label="权限名称" prop="name">
            <el-input v-model="permission.name" placeholder="请输入权限名称"></el-input>
        </el-form-item>

        <el-form-item label="权限" prop="auth">
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
import {setPermission,getParentList} from '@/api/roles.js'
export default {
    props:['button', 'permission', 'load'], 
    data() {
        return {
            loading: false,
            options: {},
            rules: {
                parent_id: [
                    // { required: true, message: '请选择父菜单名称', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' }
                ],
                auth: [
                    { required: true, message: '请输入权限名称', trigger: 'blur' }
                ]
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
                            // this.$router.go(-1);
                        }
                    }).catch(error => this.ezNotifyAxiosCatch(error))
                } else {
                    return false;
                }
            });
        }
    },
    created() {
        getParentList({type: 1}).then(res => {
            this.options = res.data
        })
    }
}
</script>
