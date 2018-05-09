<template>
  <div class="yl-clearfix">
    <div class="searchgrid">
      <div style="float:left;">
        <el-date-picker
          v-model="filters.created_time_1"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect1"
          :picker-options="pickerOptions1"
          placeholder="申请起始日期时间">
        </el-date-picker>
        至
        <el-date-picker
          v-model="filters.created_time_2"
          type="datetime"
          size="small"
          style="width:180px"
          @change="changeSelect2"
          :picker-options="pickerOptions2"
          placeholder="申请截止日期时间">
        </el-date-picker>

        <select class="yl-select-option" v-model="filters.cash_status" @change="search">
          <option :value="null">请选择状态</option>
          <option v-for="(item,idx) in statusOptions" :key="item" :value="idx" v-text="item"></option>
        </select>
        <select class="yl-select-option" v-model="filters.cash_type" @change="search">
          <option :value="null">请选择提现类型</option>
          <option v-for="(item,idx) in cashTypeOptions" :key="item" :value="idx" v-text="item"></option>
        </select>
      </div>
      <div style="float:right;">
        <input v-model="filters.keyword" type="text" class="yl-input-text" placeholder="代理商ID/代理商编号/代理商名称">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
        <excel style="text-align:left;" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>
    </div>


    <el-table :data="pagination.data"
              v-loading="listLoading"
              style="width: 100%;">
      <el-table-column label="代理商ID" prop="agent_id">
      </el-table-column>
      <el-table-column label="代理商编号" prop="agent.agent_number">
      </el-table-column>
      <el-table-column prop="created_time" label="申请时间">
      </el-table-column>
      <el-table-column label="可提现金额" prop="cashable_amount">
      </el-table-column>
      <el-table-column label="客户欠利息" prop="due_interest_amount">
      </el-table-column>
      <el-table-column label="穿仓金额" prop="stock_loss_amount">
      </el-table-column>
      <el-table-column prop="cash_amount" label="提现金额">
      </el-table-column>
      <el-table-column prop="fee" label="手续费">
      </el-table-column>
      <el-table-column prop="in_amount" label="实际金额">
      </el-table-column>
      <el-table-column prop="replaced_cash_status" label="状态">
      </el-table-column>
      <el-table-column prop="replaced_cash_type" label="提现类型">
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="180">
      </el-table-column>
      <!--<el-table-column label="操作" min-width="50px" v-if="role=='SystemAdmin' || role=='SystemAccount'">
        <template scope="scope">
          <el-button v-if="scope.row.replaced_cash_status=='已申请' || scope.row.replaced_cash_status=='处理中'  || scope.row.replaced_cash_status=='审核通过'" size="mini" @click="$router.push({name:'代理提现审核',params:{id:scope.row.id}})" title="审核"><i class="fa fa-pencil"></i></el-button>
        </template>
      </el-table-column>-->
      <template v-if="role=='SystemAdmin' || role=='SystemAccount'">
        <el-table-column label="操作" min-width="50px" v-if="show_button_list.indexOf('提现记录审核')!=-1">
          <template scope="scope">
            <el-button v-if="scope.row.replaced_cash_status=='已申请' || scope.row.replaced_cash_status=='处理中'" size="mini" @click="$router.push({name:'代理提现审核',params:{id:scope.row.id}})" title="审核"><i class="fa fa-pencil"></i></el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>


    <!--列表-->

    <div class="yl-pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="pageIndexChange"
        :current-page="pageIndex"
        :page-sizes="[15, 30, 45, 60]"
        layout="total, sizes, prev, pager, next, jumper"
        :page-size="parseInt(pagination.per_page)"
        :total="pagination.total"
        style="float:right;">
      </el-pagination>
    </div>

  </div>
</template>


<script>
  import {getAgentCashList} from '../../api/agent';
  import {getStorageUserInfo} from '../../common/tools';
  import excel from '../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'agentCashList',
        excel_column_arr: ['agent_id', ['agent', 'agent_number'], 'created_time', 'cashable_amount', 'due_interest_amount',
          'stock_loss_amount', 'cash_amount', 'fee', 'in_amount', 'replaced_cash_status', 'replaced_cash_type', 'remark'],
        excel_title_arr: ['代理商ID', '代理商编号', '申请时间', '可提现金额', '客户欠利息', '穿仓金额', '提现金额', '手续费', '实际金额', '状态', '提现类型', '备注'],
        pickerOptions1: {},
        pickerOptions2: {},
        statusOptions: {
          1: '已付',
          2: '已申请',
          3: '已撤回',
          4: '处理中',
            5: '提现失败',
            6: '审核通过'
        },
          cashTypeOptions: {
              1: '递延费提现',
              2: '服务费提现',
              3: '冻结递延费提现'
          },
        filters: {
          keyword: '',
          page: 1,
          size: 15,
            cash_type: null,
          created_time_1: '',
          created_time_2: '',
          cash_status: null,
        },
        pagination: {},
        listLoading: false,
        pageIndex: 1,
        button_list: ['提现记录审核'],
        show_button_list: []
      }
    },
    methods: {
      search() {
        this.filters.page = 1;
        this.fetchAgentCashList();
      },
      pageIndexChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchAgentCashList();
      },
      //后去
      fetchAgentCashList() {
        let params = this.filters;
        this.listLoading = true;
        getAgentCashList({params}).then((res) => {
          this.pagination = res.data;
          this.listLoading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchAgentCashList();
      },
      changeSelect1: function ($value) {
        this.filters.created_time_1 = $value;
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        this.filters.created_time_2 = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    },
    created() {
      this.fetchAgentCashList();
      //获得界面操作按钮是否隐藏
      let userInfo = getStorageUserInfo()
      let notAllowed = userInfo.not_allowed
      for (let i = 0; i < this.button_list.length; i++) {
          if (notAllowed.indexOf(this.button_list[i]) == -1) {//没找到，则显示该按钮
              this.show_button_list.push(this.button_list[i]);
          }
      }
    },
    activated(){
      if (this.$route.meta.refresh) this.fetchAgentCashList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

