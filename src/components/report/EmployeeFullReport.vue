<!-- 累计员工报表-->
<template>
  <section class="yl-clearfix">
    <div class="searchgrid">
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.agent_number" type="text" placeholder="代理商编号">
        <input class="yl-input-text" v-model="filters.cellphone" type="text" placeholder="员工手机号">
        <input value=" 查询 " class="yl-input-button" type="button" @click="search">
        <excel :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>
    </div>
    <span>注意:此报表开始统计时间为每个交易日的00:00</span>
    <el-table :data="pagination.data"
              highlight-current-row
              v-loading="listLoading"
              @sort-change="sortChange"
              style="width: 100%;">
      <el-table-column prop="employee.name" label="员工编号"></el-table-column>
      <el-table-column prop="emp_phone" label="手机号"></el-table-column>
      <el-table-column prop="employee.employee_name" label="姓名"></el-table-column>
      <el-table-column prop="emp_register_date" label="注册时间" sortable="custom"></el-table-column>
      <el-table-column prop="cust_total_incharge" label="累计充值" sortable="custom"></el-table-column>
      <el-table-column prop="cust_total_cash" label="累计提现" sortable="custom"></el-table-column>
      <el-table-column prop="cust_total_stock_finance" label="累计配资金额" sortable="custom"></el-table-column>
      <el-table-column prop="cust_total_make_deal" label="累计交易金额" sortable="custom"></el-table-column>
      <el-table-column prop="total_interests_percentage" label="累计递延费收益" sortable="custom"></el-table-column>
      <el-table-column prop="total_commision_percentage" label="累计佣金收益" sortable="custom"></el-table-column>
      <el-table-column prop="cust_total_adv_cost" label="累计推广成本" sortable="custom"></el-table-column>
      <el-table-column prop="occur_time" label="统计时间" sortable="custom"></el-table-column>
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

  </section>

</template>

<script>
  import {getEmployeeFullReports} from '../../api/report';
  import excel from '../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'report/employeeFullReports',
        excel_column_arr: [['employee', 'name'], 'emp_phone', ['employee', 'employee_name'], 'emp_register_date', 'cust_total_incharge',
          'cust_total_cash', 'cust_total_stock_finance', 'cust_total_make_deal', 'total_interests_percentage', 'total_commision_percentage',
          'cust_total_adv_cost', 'occur_time'
        ],
        excel_title_arr: ['员工编号', '手机号', '姓名', '注册时间', '累计充值', '累计提现', '累计配资金额', '累计交易金额', '累计递延费收益', '累计佣金收益', '累计推广成本', '统计时间'],
        filters: {
          cellphone: null,
          page: 1,
          size: 15,
          agent_number: null,
          order: ''
        },
        pagination: {},
        listLoading: false,
        pageIndex: 1,
      }
    },
    methods: {
      sortChange: function (sort) {
        let direction = sort.order == 'ascending' ? 'asc' : 'desc';
        this.filters.order = sort.prop + ' ' + direction;
        this.getList();
      },
      search: function () {
        this.filters.page = 1;
        this.getList();
      },
      pageIndexChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.getList();
      },
      //获取用户列表
      getList() {
        let params = this.filters;
        this.listLoading = true;
        getEmployeeFullReports({params}).then((res) => {
          this.pagination = res.data;
          this.listLoading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.getList();
      }
    },
    created() {
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

