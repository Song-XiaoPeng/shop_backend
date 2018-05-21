<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.whereBetween.stock_finance_entrust_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="委托起始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.stock_finance_entrust_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="委托截止日期">
          </el-date-picker>
        </div>
        <div style="float: right;">
          <input v-model="post_data.where.stock_finance_id" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:子账户ID">
          <input v-model="post_data.search.stock_code" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:证券代码">
          <input v-model="post_data.search.stock_name" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:证券名称">
          <input v-model="post_data.has.client.search.cellphone" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:客户手机号">
          <input v-model="post_data.has.client.search.real_name" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:客户姓名">
          <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
          <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
        </div>
      </div>
    </template>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">

      <el-table-column prop="id" label="子账户委托ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_id" label="子账户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.cust_info" min-width="120px" label="客户信息" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_entrust_time" min-width="120" label="委托日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_code" label="证券代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_name" label="证券名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sold_or_buy" label="买卖标志" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_entrust_status" label="委托状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="entrust_price" label="委托价格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="entrust_amount" label="委托数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="u_parent_stock_finance_entrust.bargain_average_price" label="成交均价" show-overflow-tooltip></el-table-column>
      <el-table-column prop="u_parent_stock_finance_entrust.bargain_amount" label="成交数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="u_parent_stock_finance_entrust.bargain_price" label="成交金额" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="parent_stock_finance_id" label="母账户ID" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="stock_entrust_code" label="委托编号" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="entrust_source" label="委托来源" show-overflow-tooltip></el-table-column>

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
  import {getUStockFinanceEntrustHistorys} from '../../../api/trade';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    props: ['sfid'],
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinanceEntrustHistorys',
        excel_column_arr: ['id', 'stock_finance_id', ['client', 'cust_info'], 'stock_finance_entrust_time', 'stock_code', 'stock_name',
          'sold_or_buy', 'stock_finance_entrust_status', 'entrust_price', 'entrust_amount', ['u_parent_stock_finance_entrust', 'bargain_average_price'],
          ['u_parent_stock_finance_entrust', 'bargain_amount'], ['u_parent_stock_finance_entrust', 'bargain_price'], 'parent_stock_finance_id',
          'stock_entrust_code', 'entrust_source'
        ],
        excel_title_arr: ['子账户委托ID', '子账户ID', '客户信息', '委托日期', '证券代码', '证券名称', '买卖标志', '委托状态', '委托价格',
          '委托数量', '成交均价', '成交数量', '成交金额', '母账户ID', '委托编号', '委托来源'],
        pickerOptions1: {},
        pickerOptions2: {},
        is_search: true,
        loading: false,
        forms: {},
        post_data: {
          search: {
            stock_code: '',
            stock_name: '',
          },
          where: {
            stock_finance_id: this.sfid,
          },
          whereBetween: {
            stock_finance_entrust_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          u_parent_stock_finance_entrust: {
            field: ['stock_finance_entrust_id', 'bargain_amount', 'bargain_average_price', 'bargain_price']
          },
          client: {
            field: ['id', 'real_name', 'cellphone', '"" as cust_info']
          },
          has: {
            client: {
              search: {
                cellphone: '',
                real_name: ''
              }
            }
          },
          order: 'id desc'
        }
      }
    },
    created(){
      if (this.sfid) this.is_search = false;
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getUStockFinanceEntrustHistorys(this.post_data).then(res => {
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
        this.post_data.whereBetween.stock_finance_entrust_time[0] = $value;//一定要放在0:0:0前面,不然对于日期字段查询出问题
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.stock_finance_entrust_time[1] = $value;
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
