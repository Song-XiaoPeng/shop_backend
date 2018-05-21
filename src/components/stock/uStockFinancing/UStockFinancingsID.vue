<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <div style="min-width:400px;float:left;">
        <span class="h5">客户 <b>{{form.client.cellphone + ' ' + form.client.real_name}}</b></span>&nbsp;
        <span class="h5">子账户ID <b>{{form.id}}</b></span>
        <span class="h5">的 <b>{{label}}</b> 信息</span>
      </div>
      <div style="float:left;">
        <el-select size="small" style="width:150px" v-model="currentView" placeholder="请选择..." clearable @change="changeSelect">
          <el-option
            v-for="item in status_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>

    <component v-bind:sfid="id" v-bind:is="currentView">
    </component>
  </section>
</template>


<script type="text/ecmascript-6">
  import {getUStockFinancing} from '../../../api/stock';
  import UStockFinanceEntrusts from '../../trade/uStockFinanceEntrust/UStockFinanceEntrusts';
  import UStockFinanceEntrustHistorys from '../../trade/uStockFinanceEntrustHistory/UStockFinanceEntrustHistorys';
  import UStockFinanceDayMakedeals from '../../trade/uStockFinanceDayMakedeal/UStockFinanceDayMakedeals';
  import UStockFinanceDayMakedealHistorys from '../../trade/uStockFinanceDayMakedealHistory/UStockFinanceDayMakedealHistorys';
  import UStockFinancingHoldingList from '../../trade/uStockFinancingHolding/UStockFinancingHoldingList';
  import UStockFinancingFlows from '../../trade/uStockFinancingFlow/UStockFinancingFlows';
  import StockFinanceRiskLogs from '../../trade/stockFinanceRiskLog/StockFinanceRiskLogs';

  export default {
    data() {
      return {
        label: '',
        id: '',
        currentView: '',
        status_list: [
          {value: 'UStockFinanceEntrusts', label: '当日委托'},
          {value: 'UStockFinanceDayMakedeals', label: '当日成交'},
          {value: 'UStockFinanceEntrustHistorys', label: '历史委托'},
          {value: 'UStockFinanceDayMakedealHistorys', label: '历史成交'},
          {value: 'UStockFinancingFlows', label: '资金流水'},
          {value: 'UStockFinancingHoldingList', label: '股票持仓'},
          {value: 'StockFinanceRiskLogs', label: '风控日志'}],
        loading: false,
        form: {id: '', client: {cellphone: '', real_name: ''}},
        post_data: {
          field: ['id', 'cust_id'],
          offset: 0,
          limit: 1,
          client: {
            field: ['id', 'real_name', 'cellphone']
          },
          order: 'id desc'
        }
      }
    },
    created(){
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) {
        this.currentView = '';
        this.getList(); //第一次在created已创建 不需要刷新
      }
      else this.$route.meta.refresh = true;//默认要刷新
    },
    components: {
      UStockFinanceEntrusts,
      UStockFinanceEntrustHistorys,
      UStockFinanceDayMakedeals,
      UStockFinanceDayMakedealHistorys,
      UStockFinancingHoldingList,
      UStockFinancingFlows,
      StockFinanceRiskLogs
    },
    methods: {
      getList: function () {
        this.loading = true;
        this.id = this.$route.params.id;
        getUStockFinancing(this.id, this.post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          this.form = res.data;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      changeSelect: function (value) {
        if (!value) {
          this.label = '';
        } else {
          let obj = {};
          obj = this.status_list.find((item) => {
            return item.value === value;
          });
          this.label = obj.label;
        }
      }
    },
    render: function (h) {
      return h('div', h(this.currentView));
    }
  }
</script>

<style scoped>
</style>
