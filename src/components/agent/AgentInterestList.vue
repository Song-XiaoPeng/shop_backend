<template>
  <div class="yl-clearfix">
    <el-row class="searchgrid">
      <el-col :span="8">
        <el-date-picker
          v-model="filters.interest_start_time_1"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect1"
          :picker-options="pickerOptions1"
          placeholder="收费起始日期时间">
        </el-date-picker>
        至
        <el-date-picker
          v-model="filters.interest_start_time_2"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect2"
          :picker-options="pickerOptions2"
          placeholder="收费截止日期时间">
        </el-date-picker>
      </el-col>

      <el-col :span="3">
        <select class="yl-select-option" v-model="filters.is_paid_over" @change="fetchAgentInterestList">
          <option :value="null">全部</option>
          <option v-for="(item,idx) in paidOptions" :key="item" :value="idx" v-text="item"></option>
        </select>
      </el-col>

      <el-col :span="5" style="text-align:center">
        总营收:
        <span v-text="pagination.thisAgentAllInterest.toFixed(2)" v-if="pagination.thisAgentAllInterest"></span>
        客户推广成本:
        <span v-text="pagination.thisAgentPromoteCast.toFixed(2)" v-if="pagination.thisAgentPromoteCast"></span>
      </el-col>
      <el-col :span="8">
        <div class="yl-float-right">
          <input v-model="filters.phone" type="text" placeholder="客户手机号">
          <input v-model="filters.stockAccountId" type="text" placeholder="子账户ID">
          <input class="yl-input-button" value=" 查询 " type="button" @click="search">
          <excel style="text-align:left;" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
        </div>
      </el-col>
    </el-row>
    <!--列表-->
    <el-table :data="pagination.data"
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="client.full_cust_info" label="客户信息"></el-table-column>
      <el-table-column prop="stock_finance_id" label="子账户ID"></el-table-column>
      <el-table-column prop="interest_type" label="业务类型">
      </el-table-column>
      <el-table-column label="产品类型" prop="u_stock_financing.stock_finance_product.product_name"></el-table-column>
      <el-table-column label="借款金额" prop="finance_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="保证金" prop="caution_amount" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="u_stock_financing.interest_rate" label="借款利率"></el-table-column>
      <el-table-column prop="total_insterests" label="递延费金额"></el-table-column>
      <el-table-column prop="interests" label="营收"></el-table-column>
      <el-table-column prop="cust_promotion_cost" label="客户推广成本">
      </el-table-column>
      <el-table-column prop="interest_start_time" label="收费时间"></el-table-column>
      <el-table-column prop="direct_agent_id" label="代理商ID"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column prop="replaced_is_paid_over" label="状态"></el-table-column>
    </el-table>

    <div class="yl-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
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
  import {getAgentInterestList} from '../../api/agent';
  import excel from '../common/excel';

  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'agent/interestList',
        excel_column_arr: [['client', 'full_cust_info'], 'stock_finance_id', 'interest_type', ['u_stock_financing', 'stock_finance_product', 'product_name'], 'finance_amount', 'caution_amount', ['u_stock_financing', 'interest_rate'],
          'total_insterests', 'interests', 'cust_promotion_cost', 'interest_start_time', 'direct_agent_id', 'remark', 'replaced_is_paid_over'],
        excel_title_arr: ['客户信息', '子账户ID', '业务类型', '产品类型', '借款金额', '保证金', '借款利率', '递延费金额', '营收', '客户推广成本', '收费时间', '代理商ID', '备注', '状态'
        ],
        pickerOptions1: {},
        pickerOptions2: {},
        paidOptions: [
          '未缴纳',//0
          '已缴纳',//1
        ],
        filters: {
          page: 1,
          size: 15,
          stockAccountId: null,
          phone: null,
          is_paid_over: null,
          interest_start_time_1: '',
          interest_start_time_2: '',
        },
        pageIndex: 1,
        pagination: {},
        loading: false,
      }
    },

    methods: {
      search() {
        this.filters.page = 1;
        this.fetchAgentInterestList();
      },
      fetchAgentInterestList() {
        this.loading = true;
        let params = this.filters;
        getAgentInterestList({params}).then(res => {
          this.pagination = res.data;
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchAgentInterestList();
      },
      handlePageChange(clickPageIndex) {
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchAgentInterestList();
      },
      changeSelect1: function ($value) {
        this.filters.interest_start_time_1 = $value;
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        this.filters.interest_start_time_2 = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    },
    created() {
      this.fetchAgentInterestList();
    },
    activated(){
      if (this.$route.meta.refresh) this.fetchAgentInterestList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

