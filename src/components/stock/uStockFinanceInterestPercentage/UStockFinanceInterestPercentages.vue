<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <div style="float:left;">
        <el-date-picker
          v-model="post_data.whereBetween.created_time[0]"
          type="datetime"
          size="small"
          style="width:180px;"
          @change="changeSelect1"
          :picker-options="pickerOptions1"
          placeholder="收费起始日期时间">
        </el-date-picker>
        至
        <el-date-picker
          v-model="post_data.whereBetween.created_time[1]"
          type="datetime"
          size="small"
          style="width:180px;"
          @change="changeSelect2"
          :picker-options="pickerOptions2"
          placeholder="收费截止日期时间">
        </el-date-picker>
        <el-select size="small" style="width:150px" v-model="post_data.where.is_paid_over" placeholder="子账户状态筛选" clearable @change="changeSelect">
          <el-option
            v-for="item in is_paid_over_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="float: right;">
        <input v-model="post_data.where.cust_id" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:客户ID">
        <input v-model="post_data.where.stock_finance_id" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:子账户ID">
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
        <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
      </div>
    </div>
    <span>注意:配资定时收息时间为每个交易日的 01:30</span>
    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">

      <el-table-column label="代理商ID" prop="agent_id" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户信息" prop="client.cust_info" min-width="120px" show-overflow-tooltip></el-table-column>
      <el-table-column label="子账户ID" prop="stock_finance_id" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column label="业务类型" prop="interest_type" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column label="产品名称" prop="u_stock_financing.stock_finance_product.product_name" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column label="借款金额" prop="finance_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="保证金" prop="caution_amount" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column label="借款利率" prop="u_stock_financing.interest_rate" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column label="递延费金额" prop="total_insterests" min-width="70px" show-overflow-tooltip></el-table-column>
      <el-table-column label="账户余额" prop="account_left" show-overflow-tooltip></el-table-column>
      <el-table-column label="收费说明" v-if="role=='SystemAdmin'" prop="remark" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role!='AgentStaff' && forms.props.agent_level<2" :label="convertLevel(1)+'级代理营收'" prop="agent1_interests" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role!='AgentStaff' && forms.props.agent_level<3" :label="convertLevel(2)+'级代理营收'" prop="agent2_interests" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role!='AgentStaff' && forms.props.agent_level<4" :label="convertLevel(3)+'级代理营收'" prop="agent3_interests" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role!='AgentStaff' && forms.props.agent_level<5" :label="convertLevel(4)+'级代理营收'" prop="agent4_interests" show-overflow-tooltip></el-table-column>
      <el-table-column v-if="role!='AgentStaff' && forms.props.agent_level<6" :label="convertLevel(5)+'级代理营收'" prop="agent5_interests" show-overflow-tooltip></el-table-column>
      <el-table-column label="已缴纳金额" prop="paid_amount" show-overflow-tooltip></el-table-column>
      <el-table-column label="客户推广成本" prop="cust_promotion_cost" min-width="80px" show-overflow-tooltip></el-table-column>
      <el-table-column label="收费时间" prop="created_time" min-width="120" show-overflow-tooltip></el-table-column>
      <el-table-column label="状态" prop="replaced_is_paid_over" min-width="60px" show-overflow-tooltip></el-table-column>
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
  import {getUStockFinanceInterestPercentages} from '../../../api/stock';
  import excel from '../../common/excel';
  import {convertLevel} from '../../../common/tools';

  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'uStockFinanceInterestPercentages',
        excel_column_arr: ['agent_id', ['client', 'cust_info'], 'stock_finance_id', 'interest_type',
          ['u_stock_financing', 'stock_finance_product', 'product_name'], 'finance_amount',
          'caution_amount', ['u_stock_financing', 'stock_finance_product', 'interests_rate'], 'total_insterests',
          'account_left', 'remark', 'agent1_interests', 'agent2_interests', 'agent3_interests', 'agent4_interests', 'agent5_interests',
          'paid_amount', 'cust_promotion_cost', 'created_time', 'replaced_is_paid_over'
        ],
        excel_title_arr: ['代理商ID', '客户信息', '子账户ID', '业务类型', '产品名称', '借款金额', '保证金', '借款利率', '递延费金额',
          '账户余额', '收费说明', convertLevel(1) + '级代理营收', convertLevel(2) + '级代理营收', convertLevel(3) + '级代理营收',
          convertLevel(4) + '级代理营收', convertLevel(5) + '级代理营收', '已缴纳金额', '客户推广成本', '收费时间', '状态'],
        pickerOptions1: {},
        pickerOptions2: {},
        loading: false,
        forms: {props: {agent_level: ''}},
        dialog1Visible: false,
        is_paid_over_list: [{value: 0, label: '未缴纳完成'}, {value: 1, label: '缴纳完成'}],
        post_data: {
          field: ['id', 'cust_id', 'stock_finance_id', 'interest_type', 'total_insterests', 'account_left', 'agent1_interests',
            'agent2_interests', 'agent3_interests', 'agent4_interests', 'agent5_interests', 'paid_amount', 'add_money_time', 'add_money_amount',
            'cust1_interests', 'cust2_interests', 'cust3_interests', 'remark', 'created_time', 'is_paid_over as replaced_is_paid_over', '"" as cust_promotion_cost', 'finance_amount', 'caution_amount'],
          where: {
            cust_id: '',
            stock_finance_id: '',
            is_paid_over: ''
          },
          whereBetween: {
            created_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          u_stock_financing: {
            field: ['id', 'product_id', 'init_caution_money', 'post_finance_caution_money',
              'post_add_caution_money', 'interest_rate'],
            stock_finance_product: {
              field: ['id', 'product_name', 'interests_rate']
            }
          },
          client: {
            field: ['id', 'real_name', 'cellphone', '"" as cust_info']
          },
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
        getUStockFinanceInterestPercentages(this.post_data).then(res => {
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
      convertLevel(level) {
        return convertLevel(level);
      },
      changeSelect1: function ($value) {
        this.post_data.whereBetween.created_time[0] = $value;
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        this.post_data.whereBetween.created_time[1] = $value;
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
