<template>
  <section class="yl-clearfix">
    <section class="searchgrid">
      <div style="float:left;">
        <el-date-picker
          v-model="filters.parent_entrust_datetime_1"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect1"
          :picker-options="pickerOptions1"
          placeholder="交易起始日期时间">
        </el-date-picker>
        至
        <el-date-picker
          v-model="filters.parent_entrust_datetime_2"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect2"
          :picker-options="pickerOptions2"
          placeholder="交易截止日期时间">
        </el-date-picker>
      </div>
      <div class="yl-float-right">
        <input v-model="filters.keyword" type="text" placeholder="客户手机号/子账号ID">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
        <excel style="text-align:left;" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>
    </section>
    <span>注意:此报表开始统计时间为每个交易日的15:30</span>
      <!--列表-->
    <el-table :data="pagination.data"
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="client.cellphone" label="手机号">
      </el-table-column>
      <el-table-column prop="stock_finance_id" label="子账号ID">
      </el-table-column>
      <el-table-column prop="myFee" label="服务费提成">
      </el-table-column>
      <el-table-column prop="parent_entrust_datetime" label="交易时间">
      </el-table-column>
      <el-table-column prop="replaced_sell_buy" label="买卖类型">
      </el-table-column>
      <el-table-column prop="parent_entrust_id" label="委托编号">
      </el-table-column>
      <el-table-column prop="total_bargin_amount" label="成交金额">
      </el-table-column>
      <el-table-column prop="commison" label="佣金">
      </el-table-column>
      <el-table-column prop="agent_id" label="代理商ID">
      </el-table-column>
      <el-table-column prop="agent.agent_number" label="代理商编号">
      </el-table-column>
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


  </section>


</template>

<script>
  import {getAgentServiceFeeList} from '../../api/agent';
  import excel from '../common/excel';

  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'agentServiceFeeList',
        excel_column_arr: [['client', 'cellphone'], 'stock_finance_id', 'myFee', 'parent_entrust_datetime',
          'replaced_sell_buy', 'parent_entrust_id', 'total_bargin_amount', 'commison', 'agent_id', ['agent', 'agent_number']],
        excel_title_arr: ['手机号', '子账号ID', '服务费提成', '交易时间', '买卖类型', '委托编号', '成交金额', '佣金', '代理商ID', '代理商编号'],
        pickerOptions1: {},
        pickerOptions2: {},
        sellOption: [
          '其他',
          '买入',//1
          '卖出'//2
        ],
        filters: {
          keyword: '',
          page: 1,
          size: 15,
          parent_entrust_datetime_1: '',
          parent_entrust_datetime_2: '',
        },
        pageIndex: 1,
        pagination: {},
        loading: false,
      }
    },

    methods: {
      search() {
        this.filters.page = 1;
        this.fetchAgentServiceFeeList();
      },
      fetchAgentServiceFeeList() {
        this.loading = true;
        let params = this.filters;
        getAgentServiceFeeList({params}).then(res => {
          this.pagination = res.data;
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchAgentServiceFeeList();
      },
      handlePageChange(clickPageIndex) {
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchAgentServiceFeeList();
      },
      changeSelect1: function ($value) {
        this.filters.parent_entrust_datetime_1 = $value;
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        this.filters.parent_entrust_datetime_2 = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    },
    created() {
      this.fetchAgentServiceFeeList();
    },
    activated(){
      if (this.$route.meta.refresh) this.fetchAgentServiceFeeList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

