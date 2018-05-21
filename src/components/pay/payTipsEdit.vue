<template>
    <el-form id="test"
             @submit.prevent="onSubmit"
             label-width="180px"
             style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px" method="post" :action="updateUrl">
        <el-form-item v-for="(val, key, index) in Paylist" :label="val" :key="key">
            <el-input :name="key" :value="PayTips[key] != null ? PayTips[key] : ''"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary"
                       @click.native.prevent="onSubmit">
                更新
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {getPayList, HOST, updateTips, successMsg, errorMsg} from '../../common/tools';
    export default {
        name: "pay-tips-edit",
        data() {
            return {
                Paylist: {},
                PayTips: {},
                updateUrl: HOST + "/v1/payList",
                loading: false
            }
        },
        methods: {
            getList() {
                let _this =this
                getPayList().then(function (res) {
                    _this.Paylist = res.payData
                    if(res.tips != ""){
                        _this.PayTips = res.tips
                    }
                }).catch(function (err) {
                    new Error("获取失败")
                    errorMsg("获取数据失败")
                })
            },
            onSubmit() {
                this.loading = true
                var data = this.formser()
                updateTips(data).then(function (data) {
                    if (data.status){
                      successMsg("更新成功")
                    }
                }).catch(function (err) {
                    new Error(err)
                    errorMsg("更新失败，请稍后再试")
                })
                this.loading =false
            },
            formser (){
                var form=document.getElementById("test");
                var arr={};
                for (var i = 0; i < form.elements.length; i++) {
                    var feled=form.elements[i];
                    switch(feled.type) {
                        case 'button':
                            break;
                        default:
                            if (arr[feled.name]) {
                                arr[feled.name]=arr[feled.name]+','+feled.value;
                            }else{
                                arr[feled.name]=feled.value;
                            }
                    }
                }
                return arr
            },
        },
        mounted(){
            this.getList()
        }
    }
</script>

<style scoped>

</style>
