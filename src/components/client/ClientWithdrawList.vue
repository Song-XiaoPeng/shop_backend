<template>
  <div class="yl-clearfix">
    <div class="searchgrid">
      <el-date-picker
        v-model="filters.created_time_1"
        type="datetime"
        size="small"
        style="width:160px"
        @change="changeSelect1"
        :picker-options="pickerOptions1"
        placeholder="申请起始日期时间">
      </el-date-picker>
      至
      <el-date-picker
        v-model="filters.created_time_2"
        type="datetime"
        size="small"
        style="width:160px"
        @change="changeSelect2"
        :picker-options="pickerOptions2"
        placeholder="申请截止日期时间">
      </el-date-picker>
      <el-date-picker
        v-model="filters.arrival_time_1"
        type="datetime"
        size="small"
        style="width:160px"
        @change="changeSelect3"
        :picker-options="pickerOptions3"
        placeholder="到账起始日期时间">
      </el-date-picker>
      至
      <el-date-picker
        v-model="filters.arrival_time_2"
        type="datetime"
        size="small"
        style="width:160px"
        @change="changeSelect4"
        :picker-options="pickerOptions4"
        placeholder="到账截止日期时间">
      </el-date-picker>


      <select class="yl-select-option" v-model="filters.cash_status" @change="fetchWithdrawsList">
        <option :value="null">请选择状态</option>
        <option v-for="(item,idx) in auditOptions" :key="item" :value="idx" v-text="item"></option>
      </select>

      <input v-if="role=='SystemAdmin' || role=='SystemAccount'" class="yl-input-button" value="一键设置已打款" type="button" @click="withdrawCheckAll">

      <div class="yl-float-right">
        <input v-model="filters.keyword" type="text" placeholder="客户手机号/客户ID/客户姓名">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
        <excel v-if="role=='SystemAdmin' || role=='SystemAccount'" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>

    </div>
    <div class="tab-content default-tab" style="display: block;">
      <el-table :data="pagination.data"
                v-loading="loading"
                style="width: 100%;"
                @selection-change="handleSelectionChange">
        <el-table-column
                :selectable="checkboxIsDisabled"
                type="selection"
                width="55"
                prop="id">
        </el-table-column>
        <el-table-column prop="cust_id" label="客户ID"></el-table-column>
        <el-table-column label="申请用户" min-width="100" prop="client.cust_info">
        </el-table-column>
        <el-table-column prop="cash_amount" label="申请金额">
        </el-table-column>
        <el-table-column prop="fee" label="手续费">
        </el-table-column>
        <el-table-column prop="in_amount" label="到账金额">
        </el-table-column>
        <el-table-column label="收款信息" min-width="160" prop="cust_remark">
        </el-table-column>
        <el-table-column prop="created_time" min-width="90" label="申请时间">
        </el-table-column>
        <el-table-column prop="updated_time" min-width="90" label="审核时间">
        </el-table-column>
        <el-table-column prop="replaced_cash_status" label="处理状态">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作" width="60"
                         v-if="role=='SystemAccount' || role=='SystemAdmin'">
          <template slot-scope="scope" v-if="show_button_list.indexOf('客户提现审核')!=-1">
            <el-button v-if="scope.row.cash_status <= 1" size="mini" @click="segueToAudit(scope.row)" title="审核处理"><i class="fa fa-pencil"></i></el-button>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="60"-->
                         <!--v-if="show_button_list.indexOf('客户提现审核')!=-1">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button v-if="scope.row.cash_status <= 1" size="mini" @click="segueToAudit(scope.row)" title="审核处理"><i class="fa fa-pencil"></i></el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>


      <div class="yl-pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :current-page="pageIndex"
          :page-sizes="[15, 30, 45, 60]"
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="parseInt(pagination.per_page)"
          :total="pagination.total"
          style="float:right;">
        </el-pagination>
      </div>

    </div>


  </div>

</template>

<script>
  import {withdrawList, withdrawUpdate, withdrawCheckAll} from '../../api/withdraw';
  import {getStorageUserInfo} from '../../common/tools';
  import excel from '../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        checked_ids: [],
        excel_name: this.$route.name,
        excel_url: 'withdrawList',
        excel_column_arr: ['cust_id', ['client', 'cust_info'], 'cash_amount', 'fee', 'in_amount', 'cust_remark', 'created_time', 'updated_time',
          'replaced_cash_status', 'remark'],
        excel_title_arr: ['客户ID', '申请用户', '申请金额', '手续费', '到账金额', '收款信息', '申请时间', '审核时间', '处理状态', '备注'],
        pickerOptions1: {},
        pickerOptions2: {},
        pickerOptions3: {},
        pickerOptions4: {},
        auditOptions: ['待审核', '待打款', '审核失败', '已打款', '撤销成功'],
        filters: {
          keyword: '',
          size: 15,
          page: 1,
          agent_id: 0,
          cash_status: null,
          created_time_1: '',
          created_time_2: '',
          arrival_time_1: '',
          arrival_time_2: '',
        },
        pagination: {},
        loading: false,
        pageIndex: 1,
        button_list: ['客户提现审核'],
        show_button_list: []
      }
    },
    methods: {
      handleSelectionChange(val) {
        this.checked_ids = [];
        val.forEach((currentVal,index) => {
            this.checked_ids.push(currentVal.id)
        })
      },
      checkboxIsDisabled(row,index) {
        if (['待审核','待打款'].indexOf(row.replaced_cash_status) == -1) {
            return false;
        } else {
            return true;
        }
      },
      withdrawCheckAll() {
          this.$confirm('确定要一键设置为已打款吗？注意：所有待审核将变为已打款，且手续费为0，请谨慎操作！' , '提示', {
              type: 'warning'
          }).then(() => {
              this.loading = true;
              withdrawCheckAll({checked_ids: this.checked_ids}).then((res) => {
                  this.loading = false;
                  this.ezNotifyAxiosThen(res);
                  this.search();
              }).catch(error => this.ezNotifyAxiosCatch(error));
          }).catch(() => {
          });
      },
      search() {
        this.filters.page = 1;
        this.fetchWithdrawsList();
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchWithdrawsList();
      },
      handlePageChange(clickPageIndex) {
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchWithdrawsList();
      },
      //获取用户列表
      fetchWithdrawsList() {
        let params = this.filters;
        this.loading = true;
        withdrawList({params}).then((res) => {
          this.pagination = res.data;
          this.loading = false;
        });
      },
      //转到审计页面
      segueToAudit: function (row) {
        this.$router.push({name: '客户提现审核', params: {id: row.id}})
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
      },
      changeSelect3: function ($value) {
        this.filters.arrival_time_1 = $value;
        this.pickerOptions4 = {
          disabledDate(time) {
            return time.getTime() < new Date(new Date($value).setHours(0, 0, 0, 0)).getTime();
          }
        };
      },
      changeSelect4: function ($value) {
        this.filters.arrival_time_2 = $value;
        this.pickerOptions3 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      }
    },
    created() {
      this.fetchWithdrawsList();
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
      if (this.$route.meta.refresh) this.fetchWithdrawsList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

