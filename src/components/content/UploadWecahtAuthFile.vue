<template>
    <el-form
             label-width="180px"
             @submit.prevent="onSubmit"
             style="margin:20px;width:60%;min-width:600px;">
    <el-form-item label="认证文件">
        <el-upload
                class="upload-demo"
                :action="fileUploadUrl"
                :on-success="uploadSuccess"
                :show-file-list="false"
                multiple
                :limit="3"
                :headers="headers"
        >
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </el-form-item>

    </el-form>
</template>

<script>
    import {HOST, fetchToken} from '../../common/tools';

    export default {
        data() {
            return {
                fileUploadUrl: HOST + "/v1/uploadWechatAuthFile",
                headers: {
                    Authorization: 'Bearer ' + fetchToken()
                }
            }
        },
        created() {
        },
        methods: {
            uploadSuccess(res, file) {
                if (res.status == 1) {
                    alert(res.msg)
                } else {
                    alert(res.msg)
                }
            }
        },
        computed: {}
    }
</script>

<style scoped>

</style>