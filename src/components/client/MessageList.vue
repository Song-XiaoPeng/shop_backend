<template>
  <div class="yl-clearfix">
    <div class="searchgrid">

      <select class="yl-select-option yl-float-left" v-model="filters.status" @change="fetchMessageList">
        <option :value="null">全部</option>
        <option :value="1">成功</option>
        <option :value="0">失败</option>
      </select>
      <div class="yl-float-right">
        <input v-model="filters.fromDate" type="date" placeholder="请输入开始日期">
        <input v-model="filters.toDate" type="date" placeholder="请输入结束日期">
        <input v-model="filters.keyword" type="text" placeholder="手机号码">
        <input class="yl-input-button" value=" 查询 " type="button" @click="search">
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="tab-content default-tab" style="display: block;">
      <el-table :data="pagination.data"
                highlight-current-row
                v-loading="listLoading"
                style="width: 100%;">
        <el-table-column label="客户姓名" prop="client.real_name"></el-table-column>
        <el-table-column label="电话号码" prop="cellphone"></el-table-column>
        <el-table-column label="内容" prop="msg_content" min-width="160"></el-table-column>
        <el-table-column label="发送时间" prop="send_time"></el-table-column>
        <el-table-column label="发送状态">
          <template slot-scope="scp">
            {{scp.row.status > 0 ? '成功' : '失败'}}
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
  </div>

</template>

<script>
  import {getAgentMessageList} from '../../api/client';
  import {convertLevel} from '../../common/tools';
  export default {
    data() {
      return {
        filters: {
          keyword: '',
          page: 1,
          size: 15,
          status: null,
          fromDate: null,
          toDate: null,
        },
        pagination: {},
        listLoading: false,
        pageIndex: 1,
      };
    },
    methods: {
      search() {
        this.filters.page = 1;
        this.fetchMessageList();
      },
      pageIndexChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchMessageList();
      },
      //获取用户列表
      fetchMessageList() {
        let params = this.filters;
        this.listLoading = true;
        getAgentMessageList({params}).then((res) => {
          this.pagination = res.data;
          this.listLoading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchMessageList();
      },
      convertLevel(level) {
          return convertLevel(level);
      }
    },
    mounted() {
      this.fetchMessageList();
    },
  };
</script>

