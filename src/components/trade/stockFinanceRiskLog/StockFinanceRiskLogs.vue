<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.whereBetween.risk_control_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="风控起始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.risk_control_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="风控截止日期">
          </el-date-picker>
        </div>
        <div style="float: right;">
          <input v-model="post_data.has.client.search.cellphone" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:客户手机号">
          <input v-model="post_data.where.stock_finance_id" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:子账户ID">
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

      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="risk_control_type" label="类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_id" label="子账户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cust_id" label="用户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.cellphone" label="用户电话" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.real_name" label="用户姓名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="risk_control_time" min-width="120" label="风控时间" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="remark" label="风控详情" show-overflow-tooltip min-width="150px"></el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <router-link :to="{path:'/stock/uStockFinancings/'+scope.row.stock_finance_id}">
            交易查询
          </router-link>
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

<script>
  import {getStockFinanceRiskLogs} from '../../../api/trade';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    props: ['sfid'],
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'stockFinanceRiskLogs',
        excel_column_arr: ['id', 'risk_control_type', 'stock_finance_id', 'cust_id', ['client', 'cellphone'], ['client', 'real_name'],
          'risk_control_time', 'remark'
        ],
        excel_title_arr: ['ID', '类型', '子账户ID', '用户ID', '用户电话', '用户姓名', '风控时间', '风控详情'],
        pickerOptions1: {},
        pickerOptions2: {},
        is_search: true,
        loading: false,
        forms: {},
        post_data: {
          where: {
            stock_finance_id: this.sfid,
          },
          whereBetween: {
            risk_control_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          client: {
            field: ['id', 'real_name', 'cellphone']
          },
          has: {
            'client': {
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
      if (this.sfid) this.is_search = false;
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getStockFinanceRiskLogs(this.post_data).then(res => {
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
        this.post_data.whereBetween.risk_control_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.risk_control_time[1] = $value;
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
