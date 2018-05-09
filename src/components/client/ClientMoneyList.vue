<template>
  <div class="yl-clearfix">
    <div class="searchgrid">
      <el-date-picker
        v-model="filters.created_time_1"
        type="datetime"
        size="small"
        style="width:180px"
        @change="changeSelect1"
        :picker-options="pickerOptions1"
        placeholder="流水记录起始日期时间">
      </el-date-picker>
      至
      <el-date-picker
        v-model="filters.created_time_2"
        type="datetime"
        size="small"
        style="width:180px"
        @change="changeSelect2"
        :picker-options="pickerOptions2"
        placeholder="流水记录截止日期时间">
      </el-date-picker>
      <el-select size="small" style="width:150px;padding-left:10px" v-model="filters.flow_type" placeholder="业务类型筛选" clearable @change="changeSelect">
        <el-option
          v-for="item in flow_type_list"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.remark" type="text" placeholder="搜索:备注" style="width:120px">
        <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="客户手机号/客户ID/客户姓名">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
        <excel v-if="role_group=='System'" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>
    </div>
    <!--列表-->
    <el-table :data="pagination.data"
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="cust_id" label="客户ID"></el-table-column>
      <el-table-column prop="created_time" label="发生时间" min-width="90px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.full_cust_info" label="用户信息" min-width="120px"></el-table-column>
      <el-table-column prop="new_flow_type" label="业务类型" min-width="70" show-overflow-tooltip></el-table-column>
      <el-table-column prop="income_amount" label="收入金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="outgo_amount" label="支出金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="account_left" label="剩余金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" min-wdith="190" show-overflow-tooltip></el-table-column>

    </el-table>

    <div class="yl-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageIndexChange"
        :current-page="pageIndex"
        :page-sizes="[15, 30, 45, 60]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="parseInt(pagination.per_page)"
        :total="pagination.total"
        style="float:right;">
      </el-pagination>
    </div>

  </div>

</template>

<script>
  import {clientAccountList} from '../../api/client';
  import excel from '../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'clientAccountList',
        excel_column_arr: ['cust_id', 'created_time', ['client', 'full_cust_info'], 'new_flow_type', 'income_amount', 'outgo_amount', 'account_left', 'remark'],
        excel_title_arr: ['客户ID', '发生时间', '用户信息', '业务类型', '收入金额', '支出金额', '剩余金额', '备注'],
        pickerOptions1: {},
        pickerOptions2: {},
        flow_type_list: [
          {value: 1, label: '充值'},
          {value: 2, label: '提现'},
          {value: 3, label: '充值退回'},
          {value: 4, label: '配资支出'},
          {value: 5, label: '利息支出'},
          {value: 6, label: '保证金支出'},
          {value: 7, label: '利润提取'},
          {value: 8, label: '配资撤回'},
          {value: 9, label: '推广收益'},
          {value: 10, label: '后台审核充值'},
          {value: 11, label: '后台调整充值'},
          {value: 101, label: '期权转入'},
          {value: 102, label: '期权转出'},
          {value: 103, label: '期权收息'}
        ],
        filters: {
          range: null,
          keyword: '',
          page: 1,
          size: 15,
          flow_type: '',
          created_time_1: '',
          created_time_2: '',
          remark: ''
        },
        pagination: {},
        loading: false,
        pageIndex: 1,
      }
    },
    methods: {
      changeSelect: function (value) {
        this.filters.page = 1;
        this.getClientAccounts();
      },
      search() {
        this.filters.page = 1;
        this.getClientAccounts();
      },
      pageIndexChange(clickPageIndex) {
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.getClientAccounts();
      },
      handleSizeChange(size) {
        this.filters.page = 1;
        this.filters.size = size;
        this.getClientAccounts();
      },
      getClientAccounts() {
        let params = this.filters;
        this.loading = true;
        clientAccountList({params}).then(res => {
          this.pagination = res.data;
          this.loading = false;
        }).catch(error => {
          this.ezNotifyAxiosCatch(error);
          this.loading = false;
        });
      },
      changeSelect1: function ($value) {
        this.filters.created_time_1 = $value;
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        this.filters.created_time_2 = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    },
    created(){
      this.getClientAccounts();
    },
    activated(){
      if (this.$route.meta.refresh) this.getClientAccounts(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

