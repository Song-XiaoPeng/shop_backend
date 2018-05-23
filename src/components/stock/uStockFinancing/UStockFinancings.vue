<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <div style="float:left;">
        <el-date-picker
          v-model="post_data.whereBetween.stock_finance_begin_time[0]"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect1"
          :picker-options="pickerOptions1"
          placeholder="配资起始日期时间">
        </el-date-picker>
        至
        <el-date-picker
          v-model="post_data.whereBetween.stock_finance_begin_time[1]"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect2"
          :picker-options="pickerOptions2"
          placeholder="配资截止日期时间">
        </el-date-picker>
        <el-select size="small" style="width:150px;padding-left:10px" v-model="post_data.where.status" placeholder="子账户状态筛选" clearable @change="changeSelect">
          <el-option
            v-for="item in status_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="float: right;">
        <input v-model="post_data.where.id" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:账户号码">
        <input v-model="post_data.has.client.search.cellphone" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:手机号">
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
        <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
      </div>

    </div>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;"
              @sort-change="sortChange"
              :row-class-name="tableRowClassName"
    >
      <el-table-column prop="id" label="账户号码" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role=='SystemAdmin'" prop="capital_pool_id" label="资金池ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cust_id" label="客户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.real_name" label="客户姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.cellphone" label="手机号码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_product.product_name" label="产品名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="子账户状态" prop="status" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_begin_time" min-width="120" label="配资日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_settleup" label="结算日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="interest_rate" label="递延费率" show-overflow-tooltip></el-table-column>
      <el-table-column label="起初金额" prop="total_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="总保证金" prop="order_total_caution" show-overflow-tooltip sortable="custom"></el-table-column>
      <el-table-column label="借款金额" prop="current_finance_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="可用额度" prop="available_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="总资产" prop="stock_finance.totalAssert" show-overflow-tooltip></el-table-column>
      <el-table-column label="净资产" prop="stock_finance.netAsserts" show-overflow-tooltip min-width="60px"></el-table-column>
      <el-table-column label="证券市值" prop="stock_finance.stockFinanceMarketValue" show-overflow-tooltip></el-table-column>
      <el-table-column label="盈亏额" show-overflow-tooltip>
        <template slot-scope="scope">
          <span :style="{color:(scope.row.stock_finance.winLoss<0?'red':'black')}">{{scope.row.stock_finance.winLoss}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="{path:'/stock/uStockFinancings/'+scope.row.id}">
            交易查询
          </router-link>
          <a v-if="role=='SystemAdmin' || role=='SystemRisk'" href="javascript:void(0);" @click="edit(scope.row)" :class="{link_not_allow:(scope.row.status=='已结算')}">修改</a>
        </template>
      </el-table-column>
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


<script type="text/ecmascript-6">
  import {getUStockFinancings} from '../../../api/stock';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinancings',
        excel_column_arr: ['id', 'capital_pool_id', 'cust_id', ['client', 'real_name'], ['client', 'cellphone'],
          ['stock_finance_product', 'product_name'], 'status', 'stock_finance_begin_time', 'stock_finance_settleup',
            'interests_rate', 'total_amount', 'order_total_caution', 'current_finance_amount', 'available_amount',
          ['stock_finance', 'totalAssert'], ['stock_finance', 'netAsserts'], ['stock_finance', 'stockFinanceMarketValue'], ['stock_finance', 'winLoss']
        ],
        excel_title_arr: ['账户号码', '资金池ID', '客户ID', '客户姓名', '手机号码', '产品名称', '子账户状态', '配资日期', '结算日期',
          '递延费率', '起初金额', '总保证金', '借款金额', '可用额度', '总资产', '净资产', '证券市值', '盈亏额'],
        pickerOptions1: {},
        pickerOptions2: {},
        status_list: [{value: 1, label: '操盘中'}, {value: 2, label: '单向冻结'}, {value: 3, label: '双向冻结'}, {value: 4, label: '已结算'}],
        loading: false,
        forms: {},
        post_data: {
          field: ['*', '"" as stock_finance', '"" as total_amount',
            'IFNULL(init_caution_money,0)+IFNULL(post_finance_caution_money,0)+IFNULL(post_add_caution_money,0) as order_total_caution'],
          where: {
            status: '',
            id: ''
          },
          whereBetween: {
            stock_finance_begin_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          stock_finance_product: {
            field: ['id', 'product_name', 'interests_rate']
          },
          client: {
            field: ['id', 'real_name', 'cellphone']
          },
          has: {
            client: {
              search: {
                cellphone: ''
              }
            }
          },
          order: 'id desc'
        }
      }
    },
    created(){
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      sortChange: function (sort) {
        let direction = sort.order == 'ascending' ? 'asc' : 'desc';
        this.post_data.order = sort.prop + ' ' + direction + ',id desc';
        this.getList();
      },
      tableRowClassName: function (row, index) {
        if (row.stock_finance.winLoss == 0) return 'red';
      },
      edit: function (row) {
        if (row.status == '已结算') return;
        this.$router.push({path: '/stock/uStockFinancing/edit/' + row.id});
      },
      getList: function () {
        this.loading = true;
        getUStockFinancings(this.post_data).then(res => {
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
      changeSelect: function (value) {
        this.post_data.offset = 0;
        this.getList();
      },
      changeSelect1: function ($value) {
        this.post_data.whereBetween.stock_finance_begin_time[0] = $value;
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        this.post_data.whereBetween.stock_finance_begin_time[1] = $value;
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
  .link_not_allow {
    cursor: not-allowed;
    color: #aaa;
  }
</style>
