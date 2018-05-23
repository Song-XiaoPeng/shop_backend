<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.whereBetween.accounting_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="记账起始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.accounting_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="记账截止日期">
          </el-date-picker>
        </div>
        <el-select size="small" style="width:150px;padding-left:10px" v-model="post_data.where.accounting_type" placeholder="记账类型" clearable @change="changeSelect">
          <el-option
            v-for="item in status_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div style="float: right;">
          <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
        </div>
      </div>
    </template>
    <span>注意:平台佣金报表时间为每个交易日的 22:00</span>
    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">

      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="platform_flow_money" label="平台当日流水金额" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.platform_flow_money | round(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="accounting_money" label="记账金额" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.accounting_money | round(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="replaced_accounting_type" label="记账类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="accounting_time" label="记账时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="account_left_money" label="充值账户余额" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.account_left_money | round(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="history_bargin_money" label="历史成交金额" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.history_bargin_money | round(2)}}
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
  import {getPlatformCommissionFlows} from '../../../api/trade';
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
        excel_column_arr: ['id', 'platform_flow_money', 'accounting_money', 'replaced_accounting_type',
          'accounting_time', 'account_left_money', 'history_bargin_money'
        ],
        excel_title_arr: ['ID', '平台当日流水金额', '记账金额', '记账类型', '记账时间', '充值账户余额', '历史成交金额'],
        pickerOptions1: {},
        pickerOptions2: {},
        status_list: [{value: 0, label: '充值'}, {value: 1, label: '配资佣金扣费'}, {value: 2, label: '期权佣金扣费'}],
        is_search: true,
        loading: false,
        forms: {},
        post_data: {
          field: ['*', 'accounting_type as replaced_accounting_type'],
          where: {
            accounting_type: '',
          },
          whereBetween: {
            accounting_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
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
        getPlatformCommissionFlows(this.post_data).then(res => {
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
        this.post_data.whereBetween.accounting_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.accounting_time[1] = $value;
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
