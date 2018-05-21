<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.whereBetween.updated_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="交易起始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.updated_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="交易截止日期">
          </el-date-picker>
        </div>
        <div style="float: right;">
          <input v-model="post_data.where.cust_id" style="width:100px;height:20px;" type="text" placeholder="搜索:客户ID">
          <input v-model="post_data.where.stock_finance_id" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:子账户ID">
          <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
          <excel v-if="role_group=='System' || role_group=='Agent'" :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
        </div>

      </div>
    </template>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_id" label="子账户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.full_cust_info" label="客户信息" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updated_time" min-width="120" label="交易时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="account_money" label="记账金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="available_amount" label="记账余额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="union_entrust.stock_code" label="证券代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="union_entrust.stock_name" label="证券名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="entrust_id" label="子账户委托ID" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="union_entrust.stock_entrust_code" label="委托编号" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="account_type" label="交易类型" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="account_remark" label="记账说明" show-overflow-tooltip></el-table-column>

    </el-table>

    <!--工具条-->
    <div class="pagination">
      <el-col :span="24" class="toolbar">
        <el-pagination
          @size-change="changeSize"
          @current-change="pageChange"
          :current-page="post_data.offset/post_data.limit+1"
          :page-sizes="[15, 30, 45, 60]"
          :page-size="post_data.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="forms.count"
          style="float:left;">
        </el-pagination>
      </el-col>
    </div>
  </section>
</template>

<script>
  import {getUStockFinancingFlows} from '../../../api/trade';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    props: ['sfid'],
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinancingFlows',
        excel_column_arr: ['id', 'stock_finance_id', ['client', 'full_cust_info'], 'updated_time', 'account_money', 'available_amount', ['union_entrust', 'stock_code'], ['union_entrust', 'stock_name'], 'entrust_id', ['union_entrust', 'stock_entrust_code'], 'account_type', 'account_remark'
        ],
        excel_title_arr: ['ID', '子账户ID', '客户信息', '交易时间', '记账金额', '记账余额', '证券代码', '证券名称', '子账户委托ID', '委托编号', '交易类型',
          '记账说明'],
        pickerOptions1: {},
        pickerOptions2: {},
        is_search: true,
        loading: false,
        forms: {},
        post_data: {
          field: ['*', '"" as union_entrust'],
          where: {
            cust_id: '',
            stock_finance_id: this.sfid,
          },
          whereBetween: {
            updated_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          u_stock_finance_entrust: {
            field: ['id', 'stock_entrust_code', 'stock_code', 'stock_name'],
          },
          u_stock_finance_entrust_history: {
            field: ['id', 'stock_entrust_code', 'stock_code', 'stock_name'],
          },
          client: {
            field: ['id', 'real_name', 'cellphone', '"" as full_cust_info']
          },
          order: 'updated_time desc,id desc'
        }
      }
    },
    created(){
      //特殊处理 查找指定数组 js中一切皆为数组
      if (this.role_group != 'System') {
        function checkElement(element) {
          return JSON.stringify(['union_entrust', 'stock_entrust_code']) == JSON.stringify(element);
        }

        let index = this.excel_column_arr.findIndex(checkElement);
        this.excel_column_arr.splice(index, 1);
        this.excel_title_arr.splice(index, 1);
      }
      if (this.sfid) this.is_search = false;
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getUStockFinancingFlows(this.post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          this.forms = res.data;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      pageChange: function (index) {
        this.post_data.offset = (index - 1) * this.post_data.limit;
        this.getList();
      },
      changeSize: function (num) {
        this.post_data.offset = 0;
        this.post_data.limit = num;
        this.getList();
      },
      search: function () {
        this.post_data.offset = 0;
        this.getList();
      },
      changeSelect1: function ($value) {
        this.post_data.whereBetween.updated_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.updated_time[1] = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    }
  }
</script>

<style scoped>
</style>
