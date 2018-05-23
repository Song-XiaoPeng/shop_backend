<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;" v-if="false">
          <el-date-picker
                  v-model="post_data.whereBetween.entrust_time[0]"
                  type="date"
                  size="small"
                  style="width:150px"
                  @change="changeSelect1"
                  :picker-options="pickerOptions1"
                  placeholder="委托起始日期">
          </el-date-picker>
          至
          <el-date-picker
                  v-model="post_data.whereBetween.entrust_time[1]"
                  type="date"
                  size="small"
                  style="width:150px"
                  @change="changeSelect2"
                  :picker-options="pickerOptions2"
                  placeholder="委托截止日期">
          </el-date-picker>
        </div>

        <div style="float: left;">
          <el-select size="small" v-model="selectStatus" style="width:150px" placeholder="委托状态筛选" clearable
                     @change="changeSelect">
            <el-option
                    v-for="item in status_list"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </div>

        <div style="float: right;">
          <input v-if="role_group=='System'" v-model="post_data.where.parent_stock_finance_id"
                 style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:母账户ID">

          <input v-model="post_data.where.id" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:当日委托ID">

          <input v-model="post_data.where.option_code" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:合约编码">

          <input v-model="post_data.where.option_name" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:合约简称">

          <!--<input v-model="post_data.search.option_name" style="width:100px;height:20px;"-->
          <!--value="" maxlength="11" type="text" placeholder="搜索:证券名称">-->

          <input v-model="post_data.has.client.search.cellphone" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:客户手机号">

          <input v-model="post_data.has.client.search.real_name" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:客户姓名">

          <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">

          <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr"
                 :title_arr="excel_title_arr" :name="excel_name"></excel>
        </div>

      </div>
    </template>

    <span>注意:当日委托归档到历史委托时间为每个交易日的22:10</span>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">

      <el-table-column prop="id" label="用户当日成交ID" show-overflow-tooltip></el-table-column>

      <el-table-column prop="client.cust_info" min-width="120px" label="客户信息"
                       show-overflow-tooltip></el-table-column>

      <el-table-column prop="option_code" label="合约编码" show-overflow-tooltip></el-table-column>

      <el-table-column prop="option_name" label="合约简称" show-overflow-tooltip></el-table-column>

      <el-table-column prop="entrust_bs" label="买卖方向"
                       show-overflow-tooltip></el-table-column>

      <el-table-column prop="real_status" label="成交状态"
                       show-overflow-tooltip></el-table-column>

      <el-table-column v-if="role_group=='System'" prop="entrust_amount" label="成交数量"
                       show-overflow-tooltip></el-table-column>

      <el-table-column prop="opt_business_price" label="成交价格"
                       show-overflow-tooltip></el-table-column>

      <el-table-column prop="business_time" label="成交时间"
                       show-overflow-tooltip></el-table-column>

      <el-table-column prop="parent_stock_finance_id" label="母账户ID" show-overflow-tooltip></el-table-column>

      <el-table-column prop="entrust_id" label="用户委托ID" show-overflow-tooltip></el-table-column>

      <el-table-column prop="entrust_no" label="委托编号" show-overflow-tooltip></el-table-column>

      <el-table-column v-if="role_group=='System'" prop="business_id" label="成交编号"
                       show-overflow-tooltip></el-table-column>

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
    import {getUStockFinanceDayMakedeals} from '../../../api/trade';
    import excel from '../../common/excel';

    export default {
        components: {
            excel
        },
        props: ['sfid'],
        data() {
            return {
                excel_name: this.$route.name,
                excel_url: 'uStockFinanceEntrusts',
                excel_column_arr: [
                    'id', ['client', 'cust_info'], 'entrust_time',
                    'option_code', 'option_name', 'caution_money', 'finance_amount', 'product_type',
                    'entrust_status', 'opt_entrust_price', 'entrust_amount', 'batch_no', 'entrust_bs','parent_stock_finance_id',  'entrust_no', 'entrust_source'
                ],
                excel_title_arr: [
                    '用户当日成交ID', '客户信息', '合约编码',
                    '合约简称', '买卖方向', '成交状态', '成交时间', '产品类型',
                    '委托状态', '委托价格', '委托数量', '委托批号', '买卖方向', '母账户ID', '委托编号', '委托来源'
                ],
                pickerOptions1: {},
                pickerOptions2: {},
                status_list: [
                    {value: -1, label: '委托等待返回'},
                    {value: 1, label: '未成交'},
                    {value: 2, label: '部分成交'},
                    {value: 3, label: '部成部撤'},
                    {value: 4, label: '已撤单'},
                    {value: 5, label: '已成交'},
                    {value: 6, label: '委托失败'},
                ],
                product_type: [
                    {value: 1, label: '不配资'},
                    {value: 2, label: '配资'}
                ],
                is_search: true,
                loading: false,
                forms: {},
                selectStatus: '', //复合状态筛选
                post_data: {
                    search: {},
                    where: {
                        parent_stock_finance_id: '' //母账户id
                    },
                    whereIn: {
                        entrust_status: '',
                    },
                    whereBetween: {
                        entrust_time: ['', '']
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
                                cellphone: '',
                                real_name: ''
                            }
                        }
                    },
                    order: 'id desc'
                }
            }
        },
        created() {
            if (this.sfid) this.is_search = false;
            this.getList();
        },
        activated() {
            if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
            else this.$route.meta.refresh = true;//默认要刷新
        },
        methods: {
            getList: function () {
                this.loading = true;
                getUStockFinanceDayMakedeals(this.post_data).then(res => {
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
                console.log(this.post_data)
                this.post_data.offset = 0;
                this.getList();
            },
            changeSelect: function (value) {
                switch (value) {
                    case -1:
                        this.post_data.whereIn.entrust_status = [-1];
                        break;
                    case 1:
                        this.post_data.whereIn.entrust_status = [1];
                        break;
                    case 2:
                        this.post_data.whereIn.entrust_status = [2];
                        break;
                    case 3:
                        this.post_data.whereIn.entrust_status = [3];
                        break;
                    case 4:
                        this.post_data.whereIn.entrust_status = [4];
                        break;
                    case 5:
                        this.post_data.whereIn.entrust_status = [5];
                        break;
                    case 6:
                        this.post_data.whereIn.entrust_status = [6];
                        break;
                    default:
                        this.post_data.whereIn.entrust_status = '';
                }
                this.post_data.offset = 0;
                this.getList();
            },
            changeSelect1: function ($value) {
                this.post_data.whereBetween.entrust_time[0] = $value;
                $value = $value ? $value + ' 0:0:0' : '';
                this.pickerOptions2 = {
                    disabledDate(time) {
                        return time.getTime() < new Date($value).getTime();
                    }
                };
            },
            changeSelect2: function ($value) {
                $value = $value ? $value + ' 23:59:59' : '';
                this.post_data.whereBetween.entrust_time[1] = $value;
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
