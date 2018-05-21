<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <div style="float: right;">
        <input v-model="post_data.where.stock_finance_id" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:子账户id">
        <input v-model="post_data.search.stock_code" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:股票代码">
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
        <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
      </div>
    </div>

    <span>注意:除权派息时间为每个交易日的 9:05</span>
    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;"
    >
      <el-table-column prop="stock_finance_id" label="子账户id" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_finance_hold_id" label="子账户持仓id" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role=='SystemAdmin'" prop="parent_stock_finance_id" label="母账户id" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_code" label="股票代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_name" label="股票名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="xr_dr_announcement" label="除权除息公告日" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_right_regday" label="股权登记日" show-overflow-tooltip></el-table-column>
      <el-table-column prop="xr_dr_day" label="除权除息日" show-overflow-tooltip></el-table-column>
      <el-table-column prop="xr_stock_times" label="除权派股倍数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_hodings" label="登记股数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="post_xr_stocks" label="派送股数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dr_amount" label="除息金额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dr_total_amount" label="除息总金额" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role=='SystemAdmin'" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="xr_dr_status" label="除权除息状态" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作">
        <template scope="scope">
          <a href="javascript:void(0);" @click="xrdr(scope.row)" :class="{link_not_allow:(scope.row.xr_dr_status=='已分配')}">重新分配</a>
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
  import {getXrDrInfos} from '../../../api/stock';
  import {doXrdr} from '../../../api/java';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'xrDrInfos',
        excel_column_arr: ['stock_finance_id', 'stock_finance_hold_id', 'parent_stock_finance_id', 'stock_code', 'stock_name',
          'xr_dr_announcement', 'stock_right_regday', 'xr_dr_day', 'xr_stock_times', 'stock_hodings', 'post_xr_stocks', 'dr_amount',
          'dr_total_amount', 'remark', 'xr_dr_status'],
        excel_title_arr: ['子账户ID', '子账户持仓id', '母账户id', '股票代码', '股票名称', '除权除息公告日', '股权登记日', '除权除息日', '除权派股倍数',
          '登记股数', '派送股数', '除息金额', '除息总金额', '备注', '除权除息状态'],
        loading: false,
        forms: {},
        post_data: {
          search: {
            stock_code: ''
          },
          where: {
            stock_finance_id: ''
          },
          count: true,
          offset: 0,
          limit: 15,
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
        getXrDrInfos(this.post_data).then(res => {
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
      xrdr: function (row) {
        if (row.xr_dr_status == '已分配') return;
        this.$confirm('确认重新分配吗?', '提示', {
          type: 'warning'
        }).then(() => {
          doXrdr({id: row.id}).then((res) => {
            this.ezNotifyAxiosThen(res);
            this.getList();
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
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
