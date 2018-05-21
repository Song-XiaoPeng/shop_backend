<template>
  <section>
    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="id" label="ID" show-overflow-tooltip></el-table-column>
      <el-table-column prop="agent_id" label="代理商id" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buy_commission_rate" label="买入佣金比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sell_commission_rate" label="卖出佣金比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buy_stampduty_rate" label="买入印花税比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sell_stampduty_rate" label="卖出印花税比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buy_transfer_rate" label="买入过户费比例" show-overflow-tooltip>
        <template scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>深市股票交易不收取过户费</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.buy_transfer_rate }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="sell_transfer_rate" label="卖出过户费比例" show-overflow-tooltip>
        <template scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>深市股票交易不收取过户费</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>{{ scope.row.sell_transfer_rate }}</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="buy_witness_rate" label="买入见证费比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sell_witness_rate" label="卖出见证费比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buy_brokerage_rate" label="买入经手费比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sell_brokerage_rate" label="卖出经手费比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="buy_fee_rate" label="买入规费比例" show-overflow-tooltip></el-table-column>
      <el-table-column prop="sell_fee_rate" label="卖出规费比例" show-overflow-tooltip></el-table-column>

      <!--<el-table-column label="操作">
          <template scope="scope">
              <el-button size="small" title="修改(暂不支持)" icon="edit"></el-button>
          </template>
      </el-table-column>-->
    </el-table>
  </section>
</template>

<script>
  import {getStockFees} from '../../../api/system';
  export default {
    data() {
      return {
        loading: false,
        forms: {},
        post_data: {
          count: true
        }
      }
    },
    created(){
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getStockFees(this.post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          this.forms = res.data;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    }
  }
</script>

<style scoped>
</style>