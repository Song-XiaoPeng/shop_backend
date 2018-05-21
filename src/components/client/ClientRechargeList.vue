<template>
  <section class="yl-clearfix">
    <div class="searchgrid">
      <el-date-picker
        v-model="filters.created_time_1"
        type="datetime"
        size="small"
        style="width:160px"
        @change="changeSelect1"
        :picker-options="pickerOptions1"
        placeholder="充值起始日期时间">
      </el-date-picker>
      至
      <el-date-picker
        v-model="filters.created_time_2"
        type="datetime"
        size="small"
        style="width:160px"
        @change="changeSelect2"
        :picker-options="pickerOptions2"
        placeholder="充值截止日期时间">
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

      <select class="yl-select-option" v-model="filters.type" @change="search">
        <option :value="null">请选充值方式</option>
        <option v-for="(item,idx) in typeOptions" :key="item" :value="idx" v-text="item"></option>
      </select>
      <select class="yl-select-option " v-model="filters.status" @change="search">
        <option :value="null">请选充值状态</option>
        <option v-for="(item,idx) in statusOptions" :key="item" :value="idx" v-text="item"></option>
      </select>
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.keyword" type="text"
               placeholder="客户手机号/客户ID/客户姓名">
        <input class="yl-input-text" v-model="filters.remark" type="text"
               placeholder="后台备注">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
        <excel v-if="role_group=='System' || role_group=='Agent'" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </div>
    </div>
    <!--列表-->
    <el-table :data="pagination.data"
              v-loading="loading"
              style="width: 100%;">

      <el-table-column prop="cust_id" label="客户ID"></el-table-column>
      <el-table-column type="order_number" prop="order_number" label="充值单号" min-width="130px">
      </el-table-column>

      <el-table-column prop="client.cust_info" label="充值用户" min-width="120px" show-overflow-tooltip></el-table-column>

      <el-table-column prop="created_time" label="充值时间" min-width="120px">
      </el-table-column>
      <el-table-column prop="arrival_time" label="到账时间" min-width="120px">
      </el-table-column>
      <el-table-column prop="amount_of_account" label="充值金额" min-width="60px">
      </el-table-column>
      <el-table-column prop="fee" label="充值手续费" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="amount_received" label="到账金额" min-width="60px" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="type" label="充值方式" show-overflow-tooltip></el-table-column>
      <el-table-column prop="new_transfer_type" label="充值来源" show-overflow-tooltip></el-table-column>
      <el-table-column prop="new_status" label="充值状态" min-width="60px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="cust_remark" label="客户备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="后台备注" show-overflow-tooltip></el-table-column>

      <el-table-column label="操作" v-if="">
        <template scope="scope">
          <!--<el-button size="mini" @click="segueToClientRechargeAudit(scope.row)" v-if="scope.row.new_status == '处理中'&&role=='SystemAdmin'" title="账户审核"><i class="fa fa-pencil"></i></el-button>-->
          <template v-if="scope.row.new_status == '处理中' && role=='SystemAdmin'">
            <el-button size="mini" @click="segueToClientRechargeAudit(scope.row)" v-if="scope.row.new_status == '处理中'&&show_button_list.indexOf('客户充值审核')!=-1" title="账户审核"><i class="fa fa-pencil"></i></el-button>
          </template>
          <!--<el-button size="mini" @click="queryAccounts(scope.row.type,scope.row.order_number)" title="查询到账"><i class="fa fa-search" v-if="role=='SystemAdmin' || role=='SystemStaff'"></i></el-button>-->
          <template v-if="role=='SystemAdmin' || role=='SystemStaff' || role == 'SystemPayStaff'">
            <template v-if="show_button_list.indexOf('查询充值到账')!=-1">
              <el-button size="mini" @click="queryAccounts(scope.row.type,scope.row.order_number)" title="查询到账"><i class="fa fa-search" v-if=""></i></el-button>
            </template>
          </template>
          <template v-if="(role == 'SystemAdmin' || role == 'SystemPayStaff') && scope.row.status == 0">
              <el-button size="mini" @click="orderManual(scope.row)" title="手动到账"><i class="fa fa-credit-card"></i></el-button>
          </template>
        </template>
      </el-table-column>
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

    <el-dialog
            title="确认手动到账？"
            :visible.sync="dialogVisible"
            width="30%">
      <span>订单详细</span>
      <p>用户信息：{{row.client['cust_info']}}</p>
      <p>订单号：{{ManualOrderNum}}</p>
      <p>支付类型：{{row.type}}</p>
      <p>发起时间：{{row.created_time}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doManual()">确 定</el-button>
      </span>
    </el-dialog>
  </section>

</template>

<script>
  import {fetchClientRechargeList, queryUserAccount} from '../../api/client';
  import {loadingOpen,loadingClose,errorMsg,successMsg, getStorageUserInfo, goToManualOrder} from '../../common/tools'
  import excel from '../common/excel';
  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'clientRechargeList',
        excel_column_arr: ['cust_id', 'order_number', ['client', 'cust_info'], 'created_time', 'arrival_time', 'amount_of_account', 'fee', 'amount_received', 'type', 'new_transfer_type', 'new_status', 'cust_remark', 'remark'],
        excel_title_arr: ['客户ID', '充值单号', '充值用户', '充值时间', '到账时间', '充值金额', '充值手续费', '到账金额', '充值方式', '充值来源', '充值状态', '客户备注', '后台备注'],
        pickerOptions1: {},
        pickerOptions2: {},
        pickerOptions3: {},
        pickerOptions4: {},
        filters: {
          range: null,
          keyword: '',
            remark: '',
          status: null,
          type: null,
          page: 1,
          size: 15,
          created_time_1: '',
          created_time_2: '',
          arrival_time_1: '',
          arrival_time_2: '',
        },
        statusOptions: [
          '已提交',//0,
          '成功',//1,
          '失败',//2,
          '充值退回',//3,
          '处理中',//4
        ],
        typeOptions: {
          1: '转账汇款',
          2: '后台管理员充值',
          //3:'金米网关支付',
          /*4: '金米快捷支付',*/
          5: '银生宝网关支付',
          6: '银生宝认证支付',
          /*7: '万物认证支付',*/
          8: '浦刷支付',
          /*9: '栈道支付',*/
          10: '杉德快捷支付',
            11: '杉德网关支付',
            12: '博裕擎外放网关支付',
            16: '银联扫码支付',
            17: "环迅扫码支付",
            18: "环迅网银支付",
            19: "环迅快捷支付",
            20: "林丰云付网银支付",
            22: "通联快捷支付",
            27: "立客支付"
        },
        pagination: {},
        loading: false,
        pageIndex: 1,
        button_list: ['查询充值到账','客户充值审核'],
        show_button_list: [],
        row: {
            client:[]
        },
        ManualOrderNum: "",
        dialogVisible: false
      };
    },
    methods: {
      search() {
        this.filters.page = 1;
        this.getClientRecharges();
      },
      handleSizeChange(size) {
        this.filters.page = 1;
        this.filters.size = size;
        this.getClientRecharges();
      },
      handlePageChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.getClientRecharges();
      },
      segueToClientRechargeAudit(row) {
        this.$router.push({name: '客户充值审核', params: {id: row.id}});
      },
      //获取用户列表
      getClientRecharges() {
        this.loading = true;
        fetchClientRechargeList({params: this.filters}).then((res) => {
          this.pagination = res.data;
          this.loading = false;
        }).catch(error => {
          flashAxiosCatchError(error, this);
          this.loading = false;
        });
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
      },
      queryAccounts: function (type,orderNum) {
          loadingOpen('查询中请稍后');
        for(var idx in this.typeOptions){
            if(type==this.typeOptions[idx]){
                type=idx;
            }
        }
        queryUserAccount({type:type, orderNum:orderNum}).then(function (res) {
            loadingClose();
            console.log(res);
            if(res.data.length==0){
                errorMsg(res.msg);
                return;
            }
            if(res.data.status){
                successMsg(res.data.msg)
            }else{
                errorMsg(res.data.msg);
            }
        }).catch(function (err) {
            loadingClose();
            errorMsg("查询失败！请稍后再试！");
        })
      },
      //手动到账
      orderManual(row) {
          this.row = row
          this.ManualOrderNum = row.order_number
          this.dialogVisible = true
      },
        doManual() {
          let _this = this
          loadingOpen("执行中，请稍后")
          goToManualOrder({orderNum: _this.ManualOrderNum})
              .then(function (data) {
                  if(data.status == 0){
                      errorMsg(data.msg)
                  }else {
                      _this.dialogVisible = false
                      _this.row={
                          client: []
                      }
                      _this.getClientRecharges()
                  }
                  loadingClose()
                  console.log(data)
              }).catch(function (err) {
                  loadingClose()
                  console.log(err)
          })
        }
    },
    created() {
      this.getClientRecharges();
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
      if (this.$route.meta.refresh) this.getClientRecharges(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  };
</script>

