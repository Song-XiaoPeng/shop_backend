<template>
  <section class="yl-clearfix">
    <div class="searchgrid">
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
      <el-table-column prop="agent.agent_name" label="代理"></el-table-column>
      <el-table-column prop="agent_id" label="代理ID"></el-table-column>
      <el-table-column prop="total_in_money" label="累计充值" sortable="custom"></el-table-column>
      <el-table-column prop="total_cash_money" label="累计提现" sortable="custom"></el-table-column>
      <el-table-column prop="total_stock_finance_money" label="累计配资金额" sortable="custom"></el-table-column>
      <el-table-column prop="deferred_charges" label="累计递延费" sortable="custom"></el-table-column>
      <el-table-column prop="commission" label="累计佣金" sortable="custom"></el-table-column>
      <el-table-column v-if="role=='SystemAdmin'" prop="total_service_fee" label="累计服务费" sortable="custom"></el-table-column>
      <el-table-column prop="occur_time" label="最后统计时间" sortable="custom"></el-table-column>
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
  import {getClientFullReports} from '../../api/report';
  import excel from '../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'report/clientFullReports',
        excel_column_arr: ['cust_id', ['client', 'cellphone'], ['client', 'real_name'], ['client', 'created_time'], ['client', 'cust_capital_amount'], ['agent', 'agent_name'], 'agent_id', 'total_in_money', 'total_cash_money', 'total_stock_finance_money', 'deferred_charges', 'commission', 'total_service_fee', 'occur_time'
        ],
        excel_title_arr: ['客户ID', '客户手机号', '姓名', '注册时间', '可用余额', '代理', '代理ID', '累计充值', '累计提现', '累计配资金额',
          '累计递延费', '累计佣金', '累计服务费', '最后统计时间'],
        filters: {
          cellphone: null,
          page: 1,
          size: 15,
          agent_id: null,
          cust_id: '',
          order: 'total_service_fee desc'
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
        getClientFullReports({params}).then((res) => {
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

