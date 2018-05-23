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
        <el-select size="small" style="width:150px;padding-left:10px" v-model="post_data.where.product_type" placeholder="产品类型" clearable @change="changeSelect">
          <el-option
            v-for="item in product_type_list"
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
              style="width: 100%;">
      <el-table-column label="账户号码" prop="id" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户id" prop="cust_id" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户姓名" prop="client.real_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="手机号码" prop="client.cellphone" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="stock_finance_product.product_name" show-overflow-tooltip></el-table-column>
      <el-table-column label="借款金额" prop="current_finance_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="保证金" prop="total_caution" show-overflow-tooltip></el-table-column>
      <el-table-column label="操盘倍数" prop="stock_finance_product.product_times" show-overflow-tooltip></el-table-column>
      <el-table-column label="预警线金额" prop="precautious_line_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="平仓线金额" prop="liiquidation_line_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="配资开始日期" prop="stock_finance_begin_time" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="子账户状态" prop="status" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <a href="javascript:void(0);" @click="openInterest(scope.row)">付息详情</a>
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

    <el-dialog
      title="付息详情"
      :visible.sync="dialog1Visible"
      top="150px">
      <el-table :data="form1">
        <el-table-column property="id" label="ID"></el-table-column>
        <el-table-column property="total_insterests" label="递延费金额"></el-table-column>
        <el-table-column property="account_left" label="账户余额"></el-table-column>
        <el-table-column property="created_time" min-width="120" label="收费时间"></el-table-column>
        <el-table-column v-if="role=='SystemAdmin'" prop="remark" label="备注"></el-table-column>
        <el-table-column property="replaced_is_paid_over" label="状态"></el-table-column>
      </el-table>
    </el-dialog>
  </section>
</template>


<script type="text/ecmascript-6">
  import {getUStockFinancings, getUStockFinanceInterestPercentagesSFID} from '../../../api/stock';
  import excel from '../../common/excel';

  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinancings',
        excel_column_arr: ['id', 'cust_id', ['client', 'real_name'], ['client', 'cellphone'], ['stock_finance_product', 'product_name'],
          'current_finance_amount', 'total_caution', ['stock_finance_product', 'product_times'], 'precautious_line_amount',
          'liiquidation_line_amount', 'stock_finance_begin_time', 'status'
        ],
        excel_title_arr: ['账户号码', '客户id', '客户姓名', '手机号码', '产品名称', '借款金额', '保证金', '操盘倍数', '预警线金额',
          '平仓线金额', '配资开始日期', '子账户状态'],
        pickerOptions1: {},
        pickerOptions2: {},
        status_list: [{value: 1, label: '操盘中'}, {value: 2, label: '单向冻结'}, {value: 3, label: '双向冻结'}, {value: 4, label: '已结算'}],
        product_type_list: [{value: 1, label: '天配'}, {value: 2, label: '月配'}, {value: 3, label: '免费体验'}],
        loading: false,
        forms: {},
        form1: [],
        dialog1Visible: false,
        post_data: {
          field: ['id', 'cust_id', 'product_id', 'status', 'stock_finance_begin_time', 'available_amount',
            'precautious_line_amount', 'liiquidation_line_amount', 'init_caution_money', 'post_finance_caution_money',
            'post_add_caution_money', 'current_finance_amount', '"" as total_caution'],
          where: {
              id: '',
            status: '',
            product_type: '',
          },
          whereBetween: {
            stock_finance_begin_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          stock_finance_product: {
            field: ['id', 'product_name', 'product_times']
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
      openInterest: function (row) {
        this.dialog1Visible = true;
        this.loading = true;
        let interestPercentagePostData = {
          field: ['id', 'cust_id', 'stock_finance_id', 'total_insterests', 'account_left', 'is_paid_over', 'remark', 'created_time', 'add_money_time', 'add_money_amount', 'cust_id', 'is_paid_over as replaced_is_paid_over'],
        };
        getUStockFinanceInterestPercentagesSFID(row.id, interestPercentagePostData).then(res => {
          this.form1 = res.data.list;
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
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
</style>