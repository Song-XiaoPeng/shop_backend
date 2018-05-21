<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <router-link :to="{path:'/stock/parentStockFinance/create'}">
        <input class="yl-input-button" value=" 新增 " type="button">
      </router-link>
      <div style="float: right;">
        <template>
          <el-input v-model="post_data.search.account"
                    value="" :maxlength=11 type="text" placeholder="搜索:母账户账号"  style="width: 150px">
          </el-input>
          <el-input v-model="post_data.search.securities_trader" style="width: 150px"
                    value="" :maxlength=11 type="text" placeholder="搜索:交易证券">
          </el-input>
          <el-select v-model="post_data.search.capital_id" placeholder="所属资金池">
            <el-option
                    v-for="item in capitalPoolsData"
                    :key="item.id"
                    :label="item.capital_name +'(id:'+item.id+')'"
                    :value="item.id"
                    :disabled="item.disabled">
            </el-option>
          </el-select>
          <el-select v-model="post_data.search.account_status" placeholder="账户状态">
            <el-option
                    v-for="item in typeData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
            </el-option>
          </el-select>
        </template>
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
      </div>
    </div>
    <span>注意:校对母账户资金时间为每个交易日的 9:10</span>
    <br />
    <span>该查询条件下合计可用余额：{{allCountMoney}}（元）</span>
    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">

      <el-table-column prop="id" label="母账户ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="account" label="账号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="financier_name" label="客户姓名" min-width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="capital_id" label="所属资金池" show-overflow-tooltip></el-table-column>
      <el-table-column prop="capital_pool.capital_name" label="资金池名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="replaced_account_status" label="账户状态" show-overflow-tooltip></el-table-column>
      <el-table-column prop="securities_trader" label="交易证券" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_time" min-width="120" label="创建时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="current_total_capital" label="母账户总资金" show-overflow-tooltip></el-table-column>
      <el-table-column prop="securities_account_market_value" label="持仓市值" show-overflow-tooltip></el-table-column>
      <el-table-column label="可用余额" show-overflow-tooltip>
        <template scope="scope">
          {{formatNum(scope.row.available_capital)}}
        </template>
      </el-table-column>
      <el-table-column prop="freezn_capital" label="冻结资金" show-overflow-tooltip></el-table-column>
      <el-table-column prop="securities_account_remain" label="证券账户余额" show-overflow-tooltip></el-table-column>
      <el-table-column label="证券账户可用余额" show-overflow-tooltip min-width="100px">
        <template scope="scope">
          {{formatNum(scope.row.securities_account_available_remain)}}
        </template>
      </el-table-column>
      <el-table-column label="登录状态" show-overflow-tooltip>
        <template scope="scope">
          <span v-if="scope.row.new_login_status == '未登录'" style="color: red">{{scope.row.new_login_status}}</span>
          <span v-else >{{scope.row.new_login_status}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-if="role=='SystemAdmin'">
        <template scope="scope">
          <router-link :to="{path:'/stock/parentStockFinance/edit/'+scope.row.id}">
            修改
          </router-link>
          <a href="javascript:void(0);" @click="openAdjustBalance(scope.row)">修改余额</a>
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
      title="修改余额"
      custom-class="width30"
      :visible.sync="dialogVisible"
      top="150px">
      <el-form :model="form1">
        <el-form-item label="母账户信息" label-width="200px">
          账户号: {{form1.account}}
          <br/>
          客户姓名: {{form1.financier_name}}
          <br/>
          交易证券: {{form1.securities_trader}}
        </el-form-item>
        <el-form-item label="增减可用余额(增为正,减为负)" label-width="200px">
          <el-input size="small" style="width:200px" v-model="form1.offset_amount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="doAdjustBalance(form1)">确 定</el-button>
            </span>
    </el-dialog>
  </section>
</template>

<script>
  import {getParentStockFinances, getCapitalPools} from '../../../api/stock';
  import {adjustBalance} from '../../../api/java';
  export default {
    data() {
      return {
        loading: false,
        dialogVisible: false,
        forms: {},
        form1: {},
        post_data: {
          field: ['id', 'account', 'financier_name', 'capital_id', 'account_status as replaced_account_status',
            'securities_trader', 'created_time', 'securities_account_market_value',
            'available_capital', 'freezn_capital', 'securities_account_remain', 'securities_account_available_remain',
            '0 as current_total_capital', '"" as new_login_status'],
          search: {
            account: '',
            securities_trader: '',
            account_status: '',
            capital_id: ''
          },
          capital_pool: {
            field: ['id', 'capital_name']
          },
          count: true,
          offset: 0,
          limit: 15,
          order: 'id desc'
        },
        capitalPoolsData:[],
        typeData:[{
            value: "",
            label: "下拉选择账户状态"
        },{
            value: 1,
            label: "操盘中"
        },{
            value: 2,
            label: "单向冻结"
        },{
            value: 3,
            label: "禁止"
        }],
        allCountMoney: 0,
      }
    },
    created(){
      this.getList();
      this.getPools();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getParentStockFinances(this.post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          this.forms = res.data;
          this.allCountMoney=0;
          for(var item in res.data.list){
              this.allCountMoney+=res.data.list[item].available_capital;
          }
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      getPools:function () {
          let capitalPoolPostData = {
              field: ['id', 'capital_name']
          };
          getCapitalPools(capitalPoolPostData).then(res => {
              this.capitalPoolsData = res.data.list;
              this.capitalPoolsData.unshift({id:"",capital_name:"下拉选择所属资金池"});
              console.log(this.capitalPoolsData)
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
      openAdjustBalance: function (row) {
        this.dialogVisible = true;
        this.form1 = row;
      },
      doAdjustBalance: function (row) {
        this.$confirm('确认要修改余额吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          adjustBalance({parentStockFinanceId: row.id, offsetAmount: row.offset_amount}).then((res) => {
            this.ezNotifyAxiosThen(res);
            this.getList();
            this.loading = false;
            this.dialogVisible = false;
          }).catch(error => console.log(error));
        }).catch(() => {
        });
      },
      formatNum: function (value) {
        if(!value) return '0.00';
          var intPart = parseInt(value);
          var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
          var floatPart = ".00";
          var value2Array = value.toString().split(".");
          if(value2Array.length == 2) {
              floatPart = value2Array[1].toString();
              if(floatPart.length == 1) {
                  return intPartFormat + "." + floatPart + '0';
              } else {
                  return intPartFormat + "." + floatPart;
              }
          } else {
              return intPartFormat + floatPart;
          }
      },
    }
  }
</script>

<style scoped>
</style>
