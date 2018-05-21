<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.whereBetween.recycle_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="回收起始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.recycle_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="回收截止日期">
          </el-date-picker>
        </div>
        <div style="float: right;">
          <input v-model="post_data.search.stock_code" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:证券代码">
          <input v-model="post_data.search.stock_name" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:证券名称">
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

      <el-table-column prop="recycle_time" min-width="120" label="回收时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_code" label="证券代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="stock_name" label="证券名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="holdings_quantity" label="持仓数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="total_bought_amount" label="回收总价"></el-table-column>
      <el-table-column prop="total_sold_amount" label="累计已分配金额"></el-table-column>
      <el-table-column prop="stock_info.price" label="最新价格"></el-table-column>
      <el-table-column prop="stock_total_amount" label="最新市值"></el-table-column>
      <el-table-column prop="parent_stock_finance_id" label="母账户ID"></el-table-column>
      <el-table-column label="操作" min-width="120" v-if="role=='SystemAdmin' || role=='SystemRisk'">
        <template scope="scope">
          <a href="javascript:void(0);" @click="openAssignStock(scope.row)">系统分配</a>
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
      title="股票分配"
      custom-class="width30"
      :visible.sync="dialog1Visible"
      top="150px">
      <el-form :model="form1" label-width="150px">
        <el-form-item label="股票信息">
          <code>{{form1.stock_code + ' ' + form1.stock_name}}</code>
        </el-form-item>
        <el-form-item label="持仓信息">
          <code>{{'数量:' + form1.holdings_quantity + ' 最新单价:' + form1.stock_info.price + ' 元'}}</code>
        </el-form-item>
        <el-form-item label="分配的子账户ID" required>
          <el-input size="small" style="width:200px" v-model.number="form1.stockFinanceId">
          </el-input>
        </el-form-item>
        <el-form-item label="股票分配单价" required>
          <el-input size="small" style="width:200px" v-model.number="form1.marketPrice">
          </el-input>
          元
        </el-form-item>
        <el-form-item label="股票分配数量" required>
          <el-input size="small" style="width:200px" v-model.number="form1.assignQuantity">
          </el-input>
        </el-form-item>
        <el-form-item label="股票分配总价格">
          <code>{{totalPrice}} 元</code>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialog1Visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAssignStock()">确 定</el-button>
            </span>
    </el-dialog>
  </section>
</template>

<script type="text/ecmascript-6">
  import {postAssignStock} from '../../../api/java'
  import {getUStockFinanceHoldings} from '../../../api/trade';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinanceHoldings',
        excel_column_arr: ['recycle_time', 'stock_code', 'stock_name', 'holdings_quantity',
          ['stock_info', 'price'], 'stock_total_amount', 'parent_stock_finance_id'
        ],
        excel_title_arr: ['回收时间', '证券代码', '证券名称', '持仓数量', '最新价格', '最新市值', '母账户ID'],
        pickerOptions1: {},
        pickerOptions2: {},
        is_search: true,
        dialog1Visible: false,
        loading: false,
        forms: {},
        form1: {stock_info: '', marketPrice: '', assignQuantity: ''},
        post_data: {
          field: ['*', '"" as stock_info', '"" as stock_total_amount'],
          search: {
            stock_code: '',
            stock_name: '',
          },
          where: {
            is_recycle: 1
          },
          whereBetween: {
            recycle_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
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
    computed: {
      totalPrice: function () {
        if (this.form1.marketPrice && this.form1.assignQuantity) return this.form1.marketPrice * this.form1.assignQuantity;
        return 0;
      }
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getUStockFinanceHoldings(this.post_data).then(res => {
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
      openAssignStock: function (row) {
        this.dialog1Visible = true;
        this.form1.stockFinanceHoldId = row.id;
        this.form1.stock_code = row.stock_code;
        this.form1.stock_name = row.stock_name;
        this.form1.stock_info = row.stock_info;
        this.form1.holdings_quantity = row.holdings_quantity;
      },
      doAssignStock: function () {
        this.$confirm('确认要分配给该子账户么吗?', '提示', {
          type: 'warning'
        }).then(() => {
          postAssignStock({
            stockFinanceHoldId: this.form1.stockFinanceHoldId,
            stockFinanceId: this.form1.stockFinanceId,
            marketPrice: this.form1.marketPrice,
            assignQuantity: this.form1.assignQuantity
          }).then((res) => {
            this.ezNotifyAxiosThen(res);
            this.loading = false;
            this.dialog1Visible = false;
            this.getList();
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      changeSelect1: function ($value) {
        this.post_data.whereBetween.recycle_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.recycle_time[1] = $value;
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
