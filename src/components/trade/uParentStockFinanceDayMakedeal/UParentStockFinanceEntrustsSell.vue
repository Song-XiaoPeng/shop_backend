<template>
    <section>
        <!--工具条-->
        <div class="searchgrid">
            <div style="float:left;">
                <el-date-picker
                  v-model="post_data.whereBetween.parent_entrust_deal_time[0]"
                  type="date"
                  size="small"
                  style="width:150px"
                  @change="changeSelect1"
                  :picker-options="pickerOptions1"
                  placeholder="成交起始日期">
                </el-date-picker>
                至
                <el-date-picker
                  v-model="post_data.whereBetween.parent_entrust_deal_time[1]"
                  type="date"
                  size="small"
                  style="width:150px"
                  @change="changeSelect2"
                  :picker-options="pickerOptions2"
                  placeholder="成交截止日期">
                </el-date-picker>
                <el-select size="small" style="width:180px;padding-left:10px" v-model="todayOrHistory" placeholder="请选择" @change="changeSelect">
                    <el-option
                            v-for="item in status_list"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
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

        <!--列表-->
        <el-table :data="forms.list"
                  highlight-current-row
                  v-loading="loading"
                  style="width: 100%;">

            <el-table-column v-if="role_group=='System'" prop="parent_stock_finance_id" label="母账户ID" show-overflow-tooltip></el-table-column>
            <el-table-column prop="stock_code" label="证券代码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="stock_name" label="证券名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sell_buy" label="成交方向" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parent_entrust_deal_time" min-width="120" label="成交日期" show-overflow-tooltip></el-table-column>
            <el-table-column prop="parent_entrust_status" label="成交状态" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bargain_average_price" label="成交均价" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bargain_amount" label="成交数量" show-overflow-tooltip></el-table-column>
            <el-table-column prop="bargain_price" label="成交金额" show-overflow-tooltip></el-table-column>
            <el-table-column v-if="role_group=='System'" prop="makedeal_ids" label="成交编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>

            <el-table-column label="操作">
                <template scope="scope">
                    <a href="javascript:void(0);" @click="openAssign(scope.row)">系统补卖</a>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="系统补卖"
                custom-class="width30"
                :visible.sync="dialog1Visible"
                top="150px">
            <el-form :model="form1"
                     ref="Form1"
                     :rules="form1Rule">
                <el-form-item label="分配提示" label-width="150px">
                    成交股票 : {{form1.stock_code + ' ' + form1.stock_name}}
                    <br/>
                    成交情况 : {{form1.sell_buy + form1.bargain_amount + '股, 卖出' + form1.bargain_price + '元'}}
                </el-form-item>
                <el-form-item label="子账户ID" label-width="150px" required prop="stock_finance_id">
                    <el-input size="small" style="width:200px" v-model="form1.stock_finance_id"></el-input>
                </el-form-item>
                <el-form-item label="备注" label-width="150px" prop="remark">
                    <el-input type="textarea" v-model="form1._remark" style="width:200px;"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialog1Visible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAssign(form1)">确 定</el-button>
            </span>
        </el-dialog>

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
  import {getUParentStockFinanceEntrusts, getUParentStockFinanceEntrustHistorys} from '../../../api/trade';
  import {assignSellDayMakeDeal, assignSellHistoryMakeDeal} from '../../../api/java';
  import excel from '../../common/excel';

  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uParentStockFinanceEntrusts',
        excel_column_arr: ['parent_stock_finance_id', 'stock_code', 'stock_name', 'sell_buy',
          'parent_entrust_deal_time', 'parent_entrust_status', 'bargain_average_price', 'bargain_amount', 'bargain_price', 'makedeal_ids',
          'remark'
        ],
        excel_title_arr: ['母账户ID', '证券代码', '证券名称', '成交方向', '成交日期', '成交状态', '成交均价', '成交数量', '成交金额', '成交编号',
          '备注'],
        pickerOptions1: {},
        pickerOptions2: {},
        form1Rule: {
          stock_finance_id: [
            {required: true, message: '不能为空'},
          ]/*,
             remark: [
             {required: true, message: '不能为空'},
             ]*/
        },
        status_list: [{value: 1, label: '今日母账户待系统补卖'}, {value: 2, label: '历史母账户待系统补卖'}],
        loading: false,
        todayOrHistory: 1,
        forms: {},
        form1: {client: ''},
        dialog1Visible: false,
        post_data: {
          field: ['id', 'parent_entrust_status', 'sell_buy', 'parent_finance_entrust_id', 'stock_code', 'stock_name',
            'bargain_average_price', 'remark', 'entrust_time',
            'bargain_amount', 'bargain_price', 'parent_stock_finance_id', 'parent_entrust_deal_time', '"" as makedeal_ids'],
          search: {
            stock_code: '',
            stock_name: '',
          },
          where: {
            sell_buy: 2,
          },
          whereBetween: {
            parent_entrust_deal_time: ['', '']
          },
          whereIn: {
            parent_entrust_status: [3, 5]
          },
          makedeal: {
            field: ['parent_entrust_id', 'parent_makedeal_id'],
          },
          whereNull: 'stock_finance_entrust_id',
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
        if (this.todayOrHistory == 1) {
          getUParentStockFinanceEntrusts(this.post_data).then(res => {
            this.forms = res.data;
            this.loading = false;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        } else {
          getUParentStockFinanceEntrustHistorys(this.post_data).then(res => {
            this.forms = res.data;
            this.loading = false;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }
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
        if (value == 1) this.excel_url = 'uParentStockFinanceEntrusts';
        else this.excel_url = 'uParentStockFinanceEntrustHistorys';
        this.post_data.offset = 0;
        this.getList();
      },
      openAssign: function (row) {
        this.dialog1Visible = true;
        this.form1 = row;
      },
      doAssign: function (row) {
        this.$refs.Form1.validate((valid) => {
          if (valid) {
            this.$confirm('确认要分配吗?', '提示', {
              type: 'warning'
            }).then(() => {
              this.loading = true;
              if (this.todayOrHistory == 1) {
                assignSellDayMakeDeal({id: row.id, stockFinanceId: row.stock_finance_id, remark: row._remark}).then((res) => {
                  this.dialog1Visible = false;
                  this.ezNotifyAxiosThen(res);
                  this.getList();
                }).catch(error => this.ezNotifyAxiosCatch(error));
              } else {
                assignSellHistoryMakeDeal({id: row.id, stockFinanceId: row.stock_finance_id, remark: row._remark}).then((res) => {
                  this.dialog1Visible = false;
                  this.ezNotifyAxiosThen(res);
                  this.getList();
                }).catch(error => this.ezNotifyAxiosCatch(error));
              }
            }).catch(() => {
            });
          }
        });
      },
      changeSelect1: function ($value) {
        this.post_data.whereBetween.parent_entrust_deal_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.parent_entrust_deal_time[1] = $value;
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
