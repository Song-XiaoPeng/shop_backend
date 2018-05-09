<template>
  <section class="yl-clearfix">
    <div class="searchgrid">

      <div class="yl-float-right">
        <input v-model="filters.search_bank_name" type="text" placeholder="搜索:银行名称">
        <input v-model="filters.search_bank_card" type="text" placeholder="搜索:银行卡号">
        <input v-model="filters.keyword" type="text" placeholder="姓名/手机号/用户ID">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="tab-content default-tab" style="display: block;">
      <!--列表-->
      <el-table :data="pagination.data"
                highlight-current-row
                v-loading="loading"
                style="width: 100%;">

        <el-table-column type="id" prop="cust_id" label="用户ID">
        </el-table-column>
        <el-table-column prop="client.real_name" label="客户姓名"></el-table-column>
        <el-table-column prop="client.cellphone" label="客户手机"></el-table-column>
        <el-table-column prop="bank_name" label="开户银行">
        </el-table-column>
        <el-table-column prop="open_bank" label="开户支行">
        </el-table-column>
        <el-table-column prop="bank_card" label="银行卡号">
        </el-table-column>
        <el-table-column prop="open_province" label="省份">
        </el-table-column>
        <el-table-column prop="open_district" label="开户行地址">
        </el-table-column>
        <el-table-column label="操作" width="60">
          <template scope="scope">
            <el-button size="mini" @click="segueToBankEdit(scope.row)" icon="edit" title="修改银行卡"></el-button>
          </template>
        </el-table-column>
      </el-table>

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


  </section>


</template>

<script>
  import {bankCardList, bankCardUpdate} from '../../api/bankCard';
  import {bankCardOptions, provinceCityDistrictCounty, patternBankCard, patternCellPhone} from '../../common/constData'

  export default {
    data() {
      return {
        filters: {
          range: '',
          keyword: '',
          page: 1,
          agent_id: 0,
          search_bank_name: '',
          search_bank_card: ''
        },
        pagination: {},
        loading: false,
        pageIndex: 1,
      }
    },
    methods: {
      search() {
        this.filters.page = 1;
        this.getBankCards();
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.getBankCards();
      },
      pageIndexChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.getBankCards();
      },
      //获取用户列表
      getBankCards() {
        let params = this.filters;
        this.loading = true;
        bankCardList({params}).then((res) => {
          this.pagination = res.data;
          this.loading = false;
        });
        //NProgress.start();
      },
      segueToBankEdit: function (row) {
        this.$router.push({name: '客户银行卡编辑', params: {id: row.id}})

      },
      onSubmitBankCardEdit() {
        this.$refs.bankForm.validate((valid) => {
          if (valid) {
            bankCardUpdate(this.selectedBankCardInfo).then((res) => {
              let type = res.status > 0 ? 'success' : 'warning';
              let title = res.msg;
              this.$emit('homeFlashMessage', {type, title});
              if (res.status > 0) {
                this.selectedBankCardInfo = res.data;
              }
            });
            this.dialogFormVisibleBankCardEdit = false
          }
        });
      },
    },
    created() {
      this.getBankCards();
    },
    activated(){
      if (this.$route.meta.refresh) this.getBankCards(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

