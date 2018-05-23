<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.whereBetween.updated_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="更新起始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.updated_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="更新截止日期">
          </el-date-picker>
        </div>
        <div style="float: right;">
          <input v-model="post_data.has.client.search.cellphone" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:客户手机号">
          <input v-model="post_data.where.stock_finance_id" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:子账户ID">
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

      <!--<el-table-column prop="stock_finance_id" label="子账户ID" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="client.cust_info" min-width="120px" label="客户信息" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="updated_time" min-width="120" label="更新时间" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="stock_code" label="证券代码" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="stock_name" label="证券名称" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="holdings_quantity" label="持仓数量" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="available_sell_quantity" label="可卖数量" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="total_sold_amount" label="累计卖出金额" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="avarage" label="参考成本价" show-overflow-tooltip></el-table-column>-->
      <!--<el-table-column prop="stock_info.price" label="最新价格"></el-table-column>-->
      <!--<el-table-column prop="stock_total_amount" label="最新市值"></el-table-column>-->
      <!--<el-table-column v-if="role_group=='System'" prop="parent_stock_finance_id" label="母账户ID"></el-table-column>-->

      <el-table-column prop="id" label="主键编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="entrust_id" label="委托编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="client.cust_info" min-width="120px" label="客户信息" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updated_time" min-width="120" label="更新时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="option_code" label="合约代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="option_name" label="合约简称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="option_type" label="期权种类" show-overflow-tooltip></el-table-column>
      <el-table-column prop="hold_amount" label="持仓数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="enable_amount" label="可用数量" show-overflow-tooltip></el-table-column>
      <el-table-column prop="exercise_date" label="行权日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="exercise_price" label="行权价格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="total_fare" label="总费用" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_time" label="创建时间" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role_group=='System'" prop="parent_stock_finance_id" label="母账户ID"></el-table-column>


      <el-table-column label="操作" min-width="120" v-if="role_group=='System'">
        <template slot-scope="scope" v-if="role=='SystemAdmin' || role=='SystemRisk'">
          <a v-if="false" href="javascript:void(0);" @click="openDeliveryStock(scope.row)">派股</a>
          <a href="javascript:void(0);" @click="doEveningUpPerHolding(scope.row)">平仓</a>
          <a href="javascript:void(0);" @click="openRetrieveStock(scope.row)">系统回收</a>
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

    <!--系统派股票-->
    <el-dialog
      title="派股"
      custom-class="width30"
      :visible.sync="dialog1Visible"
      top="150px">
      <el-form :model="form1">
        <el-form-item label="用户信息" label-width="150px">
          <code> {{form1.client.real_name + ' ' + form1.client.cellphone}}</code>
        </el-form-item>
        <el-form-item label="股票信息" label-width="150px">
          <code>{{form1.stock_code + ' ' + form1.stock_name}}</code>
        </el-form-item>
        <el-form-item label="配送数量" label-width="150px">
          <el-input size="small" style="width:200px" v-model.number="form1.deliveryStockAmount" min="0"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialog1Visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doDeliveryStock()">确 定</el-button>
            </span>
    </el-dialog>

    <el-dialog
      title="系统回收"
      custom-class="width30"
      :visible.sync="dialog2Visible"
      top="150px">
      <el-form :model="form2" label-width="150px">
        <el-form-item label="股票信息">
          <code>{{form2.stock_code + ' ' + form2.stock_name}}</code>
        </el-form-item>
        <el-form-item label="持仓数量">
          <code>{{form2.holdings_quantity}}</code>
        </el-form-item>
        <el-form-item label="回收股票单价" required>
          <el-input size="small" style="width:200px" v-model.number="form2.marketPrice">
          </el-input>
          元
        </el-form-item>
        <el-form-item label="回收股票总价">
          <code>{{totalPrice}} 元</code>
        </el-form-item>
        <!--<el-form-item label="按市值回收比例" required>
          <el-input size="small" style="width:200px" v-model.number="form2.retrievePercentage">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialog2Visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doRetrieveStock()">确 定</el-button>
            </span>
    </el-dialog>
  </section>
</template>

<script type="text/ecmascript-6">
  import {eveningUpPerHolding, postDeliveryStock, postRetrieveStock} from '../../../api/java'
  import {getUStockFinanceHoldings} from '../../../api/trade';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    props: ['sfid'],
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinanceHoldings',
        excel_column_arr: ['stock_finance_id', ['client', 'cust_info'], 'updated_time', 'stock_code', 'stock_name', 'holdings_quantity',
          'available_sell_quantity', 'total_sold_amount', 'avarage', ['stock_info', 'price'], 'stock_total_amount', 'parent_stock_finance_id'
        ],
        excel_title_arr: ['子账户ID', '客户信息', '更新时间', '证券代码', '证券名称', '持仓数量', '可卖数量', '累计卖出', '参考成本价',
          '最新价格', '最新市值', '母账户ID'],
        pickerOptions1: {},
        pickerOptions2: {},
        is_search: true,
        dialog1Visible: false,
        dialog2Visible: false,
        loading: false,
        forms: {},
        form1: {client: ''},
        form2: {marketPrice: '', holdings_quantity: ''},
        post_data: {
          field: ['*', '"" as avarage', '"" as stock_info', '"" as stock_total_amount'],
          search: {
            stock_code: '',
            stock_name: '',
          },
          where: {

          },
          whereBetween: {
            updated_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          client: {
            field: ['id', 'real_name', 'cellphone', '"" as cust_info']
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
    watch: {
      $route(newValue, oldValue) {
        this.getList();
      }
    },
    created(){
      this.getList();
    },
    computed: {
      totalPrice: function () {
        if (this.form2.marketPrice && this.form2.holdings_quantity) return this.form2.marketPrice * this.form2.holdings_quantity;
        return 0;
      }
    },
    activated(){
      /*if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
       else this.$route.meta.refresh = true;//默认要刷新*/
      this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        if (this.$route.params.sfid) {
          this.is_search = false;
          this.post_data.where.stock_finance_id = this.$route.params.sfid;
        } else if (this.sfid) {
          this.is_search = false;
          this.post_data.where.stock_finance_id = this.sfid;
        } else {
          this.is_search = true;
        }
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
      openDeliveryStock: function (row) {
        this.dialog1Visible = true;
        this.form1 = row;
      },
      openRetrieveStock: function (row) {
        this.dialog2Visible = true;
        this.form2.stock_code = row.stock_code;
        this.form2.stock_name = row.stock_name;
        this.form2.stockFinanceHoldId = row.id;
        this.form2.holdings_quantity = row.holdings_quantity;
      },
      doDeliveryStock: function () {
        this.$confirm('确认要派股吗?', '提示', {
          type: 'warning'
        }).then(() => {
          postDeliveryStock({stockFinanceHoldId: this.form1.id, deliveryStockAmount: this.form1.deliveryStockAmount}).then((res) => {
            this.ezNotifyAxiosThen(res);
            this.loading = false;
            this.dialog1Visible = false;
            this.getList();
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      doRetrieveStock: function () {
        this.$confirm('确认要回收吗?', '提示', {
          type: 'warning'
        }).then(() => {
          postRetrieveStock({stockFinanceHoldId: this.form2.stockFinanceHoldId, marketPrice: this.form2.marketPrice, retrievePercentage: 1}).then((res) => {
            this.ezNotifyAxiosThen(res);
            this.loading = false;
            this.dialog2Visible = false;
            this.getList();
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      doEveningUpPerHolding: function (row) {
        this.$confirm('确认要平仓吗?', '提示', {
          type: 'warning'
        }).then(() => {
          eveningUpPerHolding({id: row.id}).then((res) => {
            this.ezNotifyAxiosThen(res);
            this.loading = false;
            this.getList();
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      changeSelect1: function ($value) {
        this.post_data.whereBetween.updated_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.updated_time[1] = $value;
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
