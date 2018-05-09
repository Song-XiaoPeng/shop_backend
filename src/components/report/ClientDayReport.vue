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
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.agent_id" type="text" style="width:100px" placeholder="代理商ID">
        <input class="yl-input-text" v-model="filters.cust_id" type="text" style="width:100px" placeholder="客户ID">
        <input class="yl-input-text" v-model="filters.cellphone" type="text" style="width:100px" placeholder="客户手机号">
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
      <el-table-column prop="cust_id" label="客户ID"></el-table-column>
      <el-table-column prop="client.cellphone" label="客户手机号"></el-table-column>
      <el-table-column prop="client.real_name" label="姓名"></el-table-column>
      <el-table-column prop="client.created_time" label="注册时间"></el-table-column>
      <el-table-column prop="client.cust_capital_amount" label="可用余额"></el-table-column>
      <el-table-column prop="self.agent.agent_name" label="代理名称"></el-table-column>
      <el-table-column prop="self.agent_id" label="代理ID"></el-table-column>
      <el-table-column prop="current_add_stock_finance_money" label="新增配资" sortable="custom"></el-table-column>
      <el-table-column prop="self.stock_finance_contract_money" label="操盘配资金额"></el-table-column>
      <el-table-column prop="day_make_deal_money" label="交易金额" sortable="custom"></el-table-column>
      <el-table-column prop="day_deferred_charges" label="递延费" sortable="custom"></el-table-column>
      <el-table-column prop="commission" label="佣金" sortable="custom"></el-table-column>
      <el-table-column v-if="role=='SystemAdmin'" prop="day_service_fee" label="服务费" sortable="custom"></el-table-column>
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
  import {getClientDayReports} from '../../api/report';
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
        excel_url: 'report/clientDayReports',
        excel_column_arr: ['cust_id', ['client', 'cellphone'], ['client', 'real_name'], ['client', 'created_time'],
          ['client', 'cust_capital_amount'], ['self', 'agent', 'agent_name'], ['self', 'agent_id'],
          'current_add_stock_finance_money', ['self', 'stock_finance_contract_money'], 'day_make_deal_money', 'day_deferred_charges',
          'commission', 'day_service_fee', 'occur_time'
        ],
        excel_title_arr: ['客户ID', '客户手机号', '姓名', '注册时间', '可用余额', '代理名称', '代理ID', '新增配资', '操盘配资金额', '交易金额',
          '递延费', '佣金', '服务费', '统计时间'],
        pickerOptions1: {},
        pickerOptions2: {},
        filters: {
          cellphone: null,
          page: 1,
          size: 15,
          agent_id: null,
          cust_id: '',
          occur_time_1: '',
          occur_time_2: '',
          order: 'day_service_fee desc'
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
        getClientDayReports({params}).then((res) => {
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

