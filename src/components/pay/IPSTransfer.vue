<template>
    <div>
        <el-form id="test"
                 @submit.prevent="onSubmit"
                 label-width="180px"
                 style="margin-top:15px;width:60%;min-width:600px; padding-top: 15px" method="post" :action="IPSTransferUrl">
            <el-form-item  label="转账金额">
                <el-input name="transferAmount" v-model="transferAmount" placeholder="填写转账金额"></el-input>
            </el-form-item>
            <el-form-item  label="转账账号">
                <el-input name="customerCode" v-model="customerCode" placeholder="商户为在三方后台设置的客户号"></el-input>
            </el-form-item>
            <el-form-item  label="付款项目">
                <el-input name="collectionItemName" v-model="collectionItemName" placeholder="请填写付款项目名称"></el-input>
            </el-form-item>
            <el-form-item label='付款备注'>
                <el-input type="textarea" name="remark" v-model="remark"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click.native.prevent="onSubmit">
                    转账
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { HOST, successMsg, errorMsg, goTransfer, loadingOpen, loadingClose} from '../../common/tools';
    export default {
        name: "i-p-s-transfer",
        data() {
            return {
                IPSTransferUrl: HOST+"/v1/IPSTransfer",
                transferAmount: "",
                customerCode: "",
                collectionItemName: "",
                remark: ""
            }
        },
        methods: {
            onSubmit() {
                let _this = this
                if(_this.transferAmount == ""){
                    errorMsg("金额不能为空")
                    return false
                }
                if(_this.customerCode == ""){
                    errorMsg("付款账户不能为空")
                    return false
                }
                if(_this.collectionItemName == ""){
                    errorMsg("付款项目不能为空")
                    return false
                }
                loadingOpen("执行中！请稍候")
                goTransfer({transferAmount: _this.transferAmount, customerCode: _this.customerCode, collectionItemName: _this.collectionItemName, remark: _this.remark}).then(function (data) {
                    loadingClose()
                    if(data.status == 0){
                        errorMsg(data.msg)
                    }else{
                        successMsg(data.msg)
                        _this.transferAmount = ""
                        _this.customerCode = ""
                        _this.collectionItemName = ""
                        _this.remark = ""
                    }
                }).catch(function (err) {
                    console.log(err)
                    loadingClose()
                })
            }
        }
    }
</script>

<style scoped>

</style>
