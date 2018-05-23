<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <div style="float: right;">
        <input v-model="post_data.search.product_name" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:产品名称">
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
      </div>

    </div>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="agent_id" label="代理商ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="product_name" label="产品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="product_type" label="产品类型" show-overflow-tooltip></el-table-column>
      <el-table-column prop="product_times" label="产品倍数" show-overflow-tooltip></el-table-column>
      <el-table-column prop="min_stock_finance" label="产品最低配资额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="max_stock_finance" label="产品最高额配资额" show-overflow-tooltip></el-table-column>
      <el-table-column prop="interests_rate" label="产品收取递延费比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="precautious_line_rate" label="预警线比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="liquidation_line_rate" label="平仓线比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="single_stock_hold_rate" label="单票持仓比例" show-overflow-tooltip></el-table-column>
      <el-table-column label="启用禁用">
        <template slot-scope="scope">
          {{ scope.row.disable ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <router-link :to="{path:'/system/financeProduct/edit/'+scope.row.id}">
            <el-button size="small" title="修改" icon="edit"></el-button>
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
  import {getStockFinanceProducts, destroyStockFinanceProduct} from '../../../api/system';
  export default {
    data() {
      return {
        loading: false,
        forms: {},
        post_data: {
          search: {
            product_name: '',
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
      //else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getStockFinanceProducts(this.post_data).then(res => {
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
      }
    }
  }
</script>

<style scoped>
</style>
