<template>
  <span style="text-align: left">
    <input class="yl-input-button" value="导出Excel" type="button" @click="excelVisible=true">
    <el-dialog
      title="导出选项"
      custom-class="width30"
      :visible.sync="excelVisible"
      top="150px">
      <el-radio-group v-model="excel_radio" style="padding:0 0 20px 50px;">
        <el-radio :label="1">当前页</el-radio>
        <el-radio :label="2">全选(最多100页)</el-radio>
        <el-radio :label="3">自定义(最多50页)</el-radio>
      </el-radio-group>
      <el-form style="min-width:500px;height:100px;" label-width="100px" :rules="ExcelRules" ref="form" :model="form">
        <el-form-item v-show="excel_radio==3" label="起始页" prop="excel_page_start" required>
          <el-input size="small" style="width:200px" v-model="form.excel_page_start"></el-input>
        </el-form-item>
        <el-form-item v-show="excel_radio==3" label="结束页" prop="excel_page_end" required>
          <el-input size="small" style="width:200px" v-model="form.excel_page_end"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="excelVisible = false">取 消</el-button>
          <el-button size="small" type="primary" @click="excelExport()">确 定</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
  import {excelDownload} from '../../api/common';
  import {doExcelExport} from '../../common/tools';
  export default {
    props: ['post_data', 'url', 'column_arr', 'title_arr', 'method', 'name'],
    data() {
      let checkPageEnd = (rule, value, callback) => {
        if (value && this.form.excel_page_start) {
          if (this.form.excel_page_end - this.form.excel_page_start > 49) {
            callback(new Error('最多选择50页！'));
          }
          callback();
        }
        callback();
      };
      return {
        excel_radio: 1,
        excelVisible: false,
        loading: false,
        form: {excel_page_start: '', excel_page_end: ''},
        ExcelRules: {
          excel_page_start: [
            {required: true, message: '不能为空', trigger: 'blur'},
          ],
          excel_page_end: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {validator: checkPageEnd, trigger: 'blur'}
          ]
        },
      }
    },
    created(){
    },
    methods: {
      excelExport: function () {
        let post_data = JSON.parse(JSON.stringify(this.post_data));
        post_data.limit = post_data.limit ? post_data.limit : post_data.size;//代码和周写得不一样 此处做兼容
          post_data.extra = {
              column_arr: this.column_arr,
              title_arr: this.title_arr,
              url: this.url,
              method: this.method == 'get' ? 'get' : 'post',
              excel_name: this.name
          };
        if (this.excel_radio == 2) {
          post_data.limit = 100 * post_data.limit;
          post_data.offset = 0;
          this.excelVisible = false;
            doExcelExport(post_data,);
        }
        else if (this.excel_radio == 3) {
          this.$refs.form.validate((valid) => {
            if (valid) {
              post_data.offset = (this.form.excel_page_start - 1) * post_data.limit;
              post_data.limit = (this.form.excel_page_end - this.form.excel_page_start + 1) * post_data.limit;
              this.excelVisible = false;
                doExcelExport(post_data);
            }
          })
        } else {
          this.excelVisible = false;
            doExcelExport(post_data);
        }
        this.loading = true;
      }
    }
  }
</script>

<style scoped>
</style>