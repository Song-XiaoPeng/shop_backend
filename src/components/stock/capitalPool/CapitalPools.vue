<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <router-link :to="{path:'/stock/capitalPool/create'}">
        <input class="yl-input-button" value=" 新增 " type="button">
      </router-link>
      <div style="float: right;">
        <input v-model="post_data.where.id" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:资金池ID">
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
      </div>
    </div>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">

      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="capital_name" label="资金池名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_time" label="创建时间" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updated_time" label="更新时间" min-width="120" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="{path:'/stock/capitalPool/edit/'+scope.row.id}">
            修改&nbsp;&nbsp;
          </router-link>
          <a href="javascript:void(0);" @click="openParentStockFinances(scope.row)">母账户详情</a>
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
      :title="'母账户详情('+form1.row.capital_name+')'"
      custom-class="width70"
      :visible.sync="dialog1Visible"
      top="150px">
      <el-table :data="form1.list">
        <el-table-column prop="id" label="母账户ID" show-overflow-tooltip></el-table-column>
        <el-table-column prop="account" label="账户号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="financier_name" label="客户姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="total_in_capital" label="账户入金总额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securities_trader" label="交易证券" show-overflow-tooltip></el-table-column>
        <el-table-column prop="current_total_capital" label="母账户总资金" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securities_account_market_value" label="持仓市值" show-overflow-tooltip></el-table-column>
        <el-table-column prop="available_capital" label="可用余额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="freezn_capital" label="冻结资金" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securities_account_remain" label="证券账户余额" show-overflow-tooltip></el-table-column>
        <el-table-column prop="securities_account_available_remain" label="证券账户可用余额" show-overflow-tooltip min-width="100px"></el-table-column>
      </el-table>
    </el-dialog>

  </section>
</template>

<script>
  import {getCapitalPools, getParentStockFinances} from '../../../api/stock';
  export default {
    data() {
      return {
        dialog1Visible: false,
        loading: false,
        forms: {},
        form1: {row: {}},
        post_data: {
          where: {
            id: ''
          },
          count: true,
          offset: 0,
          limit: 15
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
        getCapitalPools(this.post_data).then(res => {
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
      openParentStockFinances: function (row) {
        this.dialog1Visible = true;
        let parentStockFinancesPostData = {
          field: ['id', 'account', 'financier_name', 'total_in_capital',
            'securities_trader', 'securities_account_market_value',
            'available_capital', 'freezn_capital', 'securities_account_remain', 'securities_account_available_remain',
            '0 as current_total_capital'],
          where: {'capital_id': row.id}
        };
        this.loading = true;
        getParentStockFinances(parentStockFinancesPostData).then(res => {
          this.loading = false;
          this.form1.list = res.data.list;
          this.form1.row = row;
          console.log(this.form1)
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    }
  }
</script>

<style scoped>
</style>
