<template>
    <div id="new_main">

    <div v-for="(v,k) in trs" class="file">
    <template v-if="v.status">
    <el-input v-model="trs[k].picUrl"  placeholder="图片地址" class="picUrl"></el-input>
    <el-upload
            class="uploadButton"
            :action="fileUploadUrl"
            :on-success="uploadSuccess"
            :show-file-list="false"
            multiple
            :limit="3"
    >
    <el-button size="small" type="primary" @click="setInputIndex(k)">上传</el-button>
    </el-upload>
    <el-input v-model="trs[k].url" placeholder="链接地址，可不填" class="linkUrl"></el-input>
    <el-button size="small" type="primary" @click="add" v-if="k==0">新增</el-button>
    <el-button size="small" type="primary" @click="del(k)" v-else>减少</el-button>
    </template>
    </div>

    </div>
</template>
<script>
    import {HOST} from '../../common/tools';
    export default {
        name: 'pic-form',
        data () {
            return {
                fileUploadUrl: HOST + "/v1/uploadPic",
                trs: [{picUrl:"",url:"",status:true},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false},
                    {picUrl:"",url:"",status:false}
                ],
                inputIndex: 0
            }
        },
        props: {
            defaultMsg: {
                default: []
            }
        },
        mounted() {
        },
        methods: {
            uploadSuccess(res) {
                this.ezNotifyAxiosThen(res);
                if (res.status == 1) {
                    this.trs[this.inputIndex]["picUrl"] = res.data.url
                }
            },
            add() {
                for (let i=0,len=this.trs.length; i<len; i++) {
                    if (this.trs[i]["status"] == false) {
                        this.trs[i]["status"] = true
                        break
                    }
                }
            },
            del(index) {
                this.trs[index]["status"] = false
                this.trs[index]["picUrl"] = ""
                this.trs[index]["url"] = ""
            },
            setInputIndex(index) {
                this.inputIndex = index
            },
            getUEContent() {
                let data = [];
                for (let i=0,len=this.trs.length; i<len; i++) {
                    if (this.trs[i].status && this.trs[i]["picUrl"] ) {
                        data.push(this.trs[i])
                    }
                }
                return data
            }
        },
        destroyed() {
        },
        watch: {
          defaultMsg(newVal, oldVal) {
            if (Array.isArray(newVal) ) {
                for (let i=0,len=this.defaultMsg.length; i<len; i++) {
                    this.trs[i]["picUrl"] = this.defaultMsg[i]["picUrl"]
                    this.trs[i]["url"] = this.defaultMsg[i]["url"]
                    this.trs[i]["status"] = this.defaultMsg[i]["status"]
                }
                }
            }
        },
    }
</script>

<style>
    .file {
        margin-bottom: 10px;
    }
    .picUrl {
        float: left;
        width: 40%;
        margin-right: 20px;
    }
    .uploadButton {
        float: left;
        margin-right: 20px;
    }
    .linkUrl {
        float: left;
        width: 40%;
        margin-right: 20px;
    }
</style>