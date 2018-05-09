<template>
  <section class="yl-clearfix">
    <div class="searchgrid">
      <div style="float: left;">
        <el-date-picker
          v-model="filters.occur_time_1"
          type="date"
          size="small"
          style="width:150px"
          @change="changeSelect1"
          :picker-options="pickerOptions1"
          placeholder="选择开始日期">
        </el-date-picker>
        至
        <el-date-picker
          v-model="filters.occur_time_2"
          type="date"
          size="small"
          style="width:150px"
          @change="changeSelect2"
          :picker-options="pickerOptions2"
          placeholder="选择结束日期">
        </el-date-picker>
      </div>
      <span>注意:此报表开始统计时间为每个交易日的00:00</span>
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.employe_id" type="text" placeholder="搜索:员工ID">
        <input class="yl-input-text" v-model="filters.cellphone" type="text" placeholder="搜索:员工手机号">
        <input value=" 查询 " class="yl-input-button" type="button" @click="search">
        <excel :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>
    </div>
    <el-table :data="pagination.data"
              highlight-current-row
              v-loading="listLoading"
              @sort-change="sortChange"
              style="width: 100%;">
      <el-table-column prop="emp_id" label="员工ID"></el-table-column>
      <el-table-column prop="employee.employee_name" label="姓名"></el-table-column>
      <el-table-column prop="employee.phone" label="手机号"></el-table-column>
      <el-table-column prop="employee.created_time" label="注册时间"></el-table-column>
      <el-table-column prop="cust_day_stock_finance" label="新增配资" sortable="custom"></el-table-column>
      <el-table-column prop="self.total_cust_day_stock_finance" label="累计配资金额"></el-table-column>
      <el-table-column prop="cust_day_makedeal" label="交易金额" sortable="custom"></el-table-column>
      <el-table-column prop="total_interests_percentage" label="递延费收益" sortable="custom"></el-table-column>
      <el-table-column prop="total_commision_percentage" label="佣金收益" sortable="custom"></el-table-column>
      <el-table-column prop="cust_total_adv_cost" label="推广成本" sortable="custom"></el-table-column>
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
  import {getEmployeeDayReports} from '../../api/report';
  import excel from '../common/excel';
  let now = new Date();
  now.setTime(now.getTime() - 24 * 60 * 60 * 1000);
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'report/employeeDayReports',
        excel_column_arr: ['emp_id', ['employee', 'employee_name'], ['employee', 'phone'], ['employee', 'created_time'],
          'cust_day_stock_finance', ['self', 'total_cust_day_stock_finance'], 'cust_day_makedeal', 'total_interests_percentage',
          'total_commision_percentage', 'cust_total_adv_cost', 'occur_time'
        ],
        excel_title_arr: ['员工ID', '姓名', '手机号', '注册时间', '新增配资', '累计配资金额', '交易金额', '递延费收益', '佣金收益', '推广成本',
          '统计时间'],
        pickerOptions1: {},
        pickerOptions2: {},
        filters: {
          cellphone: null,
          page: 1,
          size: 15,
          employe_id: null,
          occur_time_1: '',
          occur_time_2: '',
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
        getEmployeeDayReports({params}).then((res) => {
          this.pagination = res.data;
          this.listLoading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.getList();
      },
      changeSelect1: function ($value) {
        this.filters.occur_time_1 = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.filters.occur_time_2 = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    },
    created() {
      this.changeSelect1(now.getFullYear() + "-" + this.plusZero(now.getMonth() + 1) + "-" + this.plusZero(now.getDate()));
      this.changeSelect2(now.getFullYear() + "-" + this.plusZero(now.getMonth() + 1) + "-" + this.plusZero(now.getDate()));
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

