<template>
    <section>
        <!--工具条-->
        <div class="searchgrid">
            <div style="width:100px;float:left;">
                <input class="yl-input-button" value=" 刷新数据 " type="button" v-on:click="getList">
            </div>
            <div style="float:left;">
              <el-select size="small" style="width:150px" v-model="post_data.where.status" placeholder="子账户状态筛选" clearable @change="changeSelect">
                    <el-option
                            v-for="item in status_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="width:200px;float:left;padding-left:10px">
                <b>低于预警线子账户数:<span class="h5" :style="{color:forms.props.precautions_count>0?'red':'black'}">
                    {{forms.props.precautions_count}}</span></b>
            </div>
            <div style="float: right;">
                <input v-model="post_data.where.id" style="width:100px;height:20px;"
                       value="" maxlength="11" type="text" placeholder="搜索:账户号码">
                <input v-model="post_data.has.client.search.cellphone" style="width:100px;height:20px;"
                       value="" maxlength="11" type="text" placeholder="搜索:手机号">
                <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
                <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
            </div>
            <div style="width:140px;float:right;">
                <input class="yl-input-button" value="按平仓线差额排序" type="button" v-on:click="sortLiiquidationLineBalance" :disabled="post_data.current_type==1">
            </div>
            <div style="width:140px;float:right;">
                <input class="yl-input-button" value="按预警线差额排序" type="button" v-on:click="sortPrecautiousLineBalance" :disabled="post_data.current_type!=1">
            </div>

        </div>

        <!--列表-->
        <el-table :data="forms.list"
                  highlight-current-row
                  v-loading="loading"
                  style="width: 100%;">
            <el-table-column label="子账户ID" prop="id" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column v-if="role=='SystemAdmin'" prop="capital_pool_id" label="资金池ID" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="客户ID" prop="cust_id" show-overflow-tooltip min-width="60px"></el-table-column>
          <el-table-column label="客户姓名" prop="client.real_name" show-overflow-tooltip></el-table-column>
            <el-table-column label="手机号码" prop="client.cellphone" show-overflow-tooltip min-width="90px"></el-table-column>
            <el-table-column label="产品名称" prop="stock_finance_product.product_name" show-overflow-tooltip></el-table-column>
            <el-table-column label="保证金" prop="total_caution" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="借款额" prop="current_finance_amount" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="可用余额" prop="available_amount" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="冻结金额" prop="freeze_money" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="净资产" prop="stock_finance.netAsserts" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="总资产" prop="stock_finance.totalAssert" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="证券市值" prop="stock_finance.stockFinanceMarketValue" show-overflow-tooltip min-width="60px"></el-table-column>
            <el-table-column label="盈亏额" show-overflow-tooltip min-width="60px">
                <template slot-scope="scope">
                    <span :style="{color:(scope.row.stock_finance.winLoss<0?'red':'black')}">{{scope.row.stock_finance.winLoss}}</span>
                </template>
            </el-table-column>
            <el-table-column label="持仓率" prop="stock_finance.holdingRate" show-overflow-tooltip></el-table-column>
            <el-table-column label="预警线差额" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :style="{color:(scope.row.stock_finance.precautiousGap<0?'red':'black')}">{{scope.row.stock_finance.precautiousGap}}</span>
                </template>
            </el-table-column>
            <el-table-column label="平仓线差额" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span :style="{color:(scope.row.stock_finance.liquidationGap<0?'red':'black')}">{{scope.row.stock_finance.liquidationGap}}</span>
                </template>
            </el-table-column>
            <el-table-column label="风控提示" prop="risk_notice" show-overflow-tooltip></el-table-column>
          <el-table-column label="子账户状态" prop="status" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作" min-width="230">
                <template slot-scope="scope">
                    <router-link v-if="role_group=='System'" :to="{path:'/stock/uStockFinancings/'+scope.row.id}">
                        交易查询
                    </router-link>
                    <a v-if="role=='SystemAdmin' || role=='SystemRisk'" href="javascript:void(0);" @click="doEveningUp(scope.row)" :class=
                            "{link_not_allow:!scope.row.stock_finance.stockFinanceMarketValue}">一键平仓</a>
                    <a v-if="role=='SystemAdmin' || role=='SystemRisk'" href="javascript:void(0);" @click="doPerEveningUp(scope.row)" :class=
                            "{link_not_allow:!scope.row.stock_finance.stockFinanceMarketValue}">分笔平仓</a>
                    <a v-if="role=='SystemAdmin' || role=='SystemRisk'" href="javascript:void(0);" @click="edit(scope.row)" :class=
                            "{link_not_allow:(scope.row.status=='已结算')}">修改</a>
                    <a v-if="role=='SystemAdmin'" href="javascript:void(0);" @click="doSettleup(scope.row)" :class=
                            "{link_not_allow:scope.row.stock_finance.stockFinanceMarketValue}">结算</a>
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
  import {getUStockFinancingsRiskList} from '../../../api/stock';
  import {eveningUp, settleup} from '../../../api/java';
  import excel from '../../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinancings/riskList',
        excel_column_arr: ['id', 'capital_pool_id', 'cust_id', ['client', 'real_name'], ['client', 'cellphone'],
          ['stock_finance_product', 'product_name'], 'total_caution', 'current_finance_amount', 'available_amount', 'freeze_money',
          ['stock_finance', 'netAsserts'], ['stock_finance', 'totalAssert'], ['stock_finance', 'stockFinanceMarketValue'],
          ['stock_finance', 'winLoss'], ['stock_finance', 'holdingRate'], ['stock_finance', 'precautiousGap'], ['stock_finance', 'liquidationGap'],
          'risk_notice', 'status'
        ],
        excel_title_arr: ['子账户ID', '资金池ID', '客户ID', '客户姓名', '手机号码', '产品名称', '保证金', '借款额', '可用余额',
          '冻结金额', '净资产', '总资产', '证券市值', '盈亏额', '持仓率', '预警线差额', '平仓线差额', '风控提示', '子账户状态'],
        status_list: [{value: 1, label: '操盘中'}, {value: 2, label: '单向冻结'}, {value: 3, label: '双向冻结'}],
        loading: false,
        forms: {props: ''},
        post_data: {
          field: ['*', '"" as stock_finance', '"" as total_caution', '"" as risk_notice', '"" as freeze_money'],
          current_type: 1,
          where: {
            status: '',
              id: ''
          },
          whereIn: {
            status: [1, 2, 3]
          },
          count: true,
          offset: 0,
          limit: 15,
          stock_finance_product: {
            field: ['id', 'product_name']
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
          }
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
      edit: function (row) {
        if (row.status == '已结算') return;
        this.$router.push({path: '/stock/uStockFinancing/edit/' + row.id});
      },
      doPerEveningUp: function (row) {
        if (!row.stock_finance.stockFinanceMarketValue) return;
        this.$router.push({path: '/trade/uStockFinacingHoldingList/sfid/' + row.id});
      },
      getList: function () {
        this.loading = true;
        getUStockFinancingsRiskList(this.post_data).then(res => {
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
        this.getList(88);
      },
      changeSelect: function (value) {
        this.post_data.offset = 0;
        this.getList();
      },
      doEveningUp: function (row) {
        if (!row.stock_finance.stockFinanceMarketValue) return;
        this.$confirm('确认要一键平仓吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          eveningUp({stockFinanceId: row.id}).then((res) => {
            this.loading = false;
            this.getList();
            this.ezNotifyAxiosThen(res);
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      doSettleup: function (row) {
        if (row.stock_finance.stockFinanceMarketValue) return;
        this.$confirm('确认要结算该子账户吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          settleup({stockFinanceId: row.id}).then((res) => {
            this.loading = false;
            this.getList();
            this.ezNotifyAxiosThen(res);
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      sortPrecautiousLineBalance: function () {
        if (this.post_data.current_type == 2) {
          return;
        }
        this.post_data.current_type = 2;
        this.getList();
      },
      sortLiiquidationLineBalance: function () {
        if (this.post_data.current_type == 1) {
          return;
        }
        this.post_data.current_type = 1;
        this.getList();
      }
    }
  }
</script>

<style scoped>
    input[type="button"][disabled] {
        cursor: not-allowed;
        color: rgba(26, 27, 45, 0.32) !important;
    }

    .link_not_allow {
        cursor: not-allowed;
        color: #aaa;
    }
</style>
