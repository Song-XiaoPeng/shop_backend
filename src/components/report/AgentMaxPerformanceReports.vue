<template>
  <section>
    <!--工具条-->
    <template v-if="is_search">
      <div class="searchgrid">
        <div style="float: left;">
          <el-date-picker
            v-model="post_data.where.occur_time"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect3"
            :picker-options="pickerOptions3"
            placeholder="选择查询日期">
          </el-date-picker>
          （指定日期树状展示所有相关代理商）
        </div>

        <div style="float:right;">
          <el-date-picker
            v-model="post_data.whereBetween.occur_time[0]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect1"
            :picker-options="pickerOptions1"
            placeholder="选择报表开始日期">
          </el-date-picker>
          至
          <el-date-picker
            v-model="post_data.whereBetween.occur_time[1]"
            type="date"
            size="small"
            style="width:150px"
            @change="changeSelect2"
            :picker-options="pickerOptions2"
            placeholder="选择报表结束日期">
          </el-date-picker>
          <input v-model="post_data.search.agent_id" style="width:100px;height:20px;"
                 value="" maxlength="11" type="text" placeholder="搜索:代理商ID">
          <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
          <excel :post_data="post_data" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name"></excel>
        </div>
      </div>
    </template>

    <span>注意:此报表开始统计时间为每个交易日的00:00</span>
    <!--列表-->
    <el-table :data="forms.list"
              @sort-change="sortChange"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;"
              :row-style="showRow">
      <el-table-column label="代理ID" :min-width="post_data.where.occur_time?'120px':''" show-overflow-tooltip align="left">
        <template scope="scope">
          <span v-if="scope.row._level" v-for="n in scope.row._level">&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;</span>
          <i v-if="scope.row._expanded===0 && !scope.row._nomore" class="fa fa-plus-square fa-lg" @click="showChildren(scope)"></i>
          <i v-else-if="scope.row._expanded===1 && !scope.row._nomore" class="fa fa-minus-square fa-lg" @click="hideChildren(scope.row)"></i>
          <span v-else-if="scope.row._nomore===1">&nbsp;&nbsp;.&nbsp;</span>
          <span :style="post_data.where.occur_time?'margin-left:10':''">{{ scope.row.agent_id }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="agent.agent_name" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="agent.agent_level" label="级别" show-overflow-tooltip></el-table-column>
      <el-table-column prop="agent.parent_id" label="归属代理" show-overflow-tooltip></el-table-column>
      <el-table-column prop="max_performance" label="直属最大配资峰值" show-overflow-tooltip sortable="custom"></el-table-column>
      <el-table-column prop="total_performance" label="总最大配资峰值" show-overflow-tooltip sortable="custom"></el-table-column>
      <el-table-column prop="occur_time" label="统计时间" show-overflow-tooltip min-width="100px" sortable="custom"></el-table-column>
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
  import {agentMaxPerformanceReports} from '../../api/report';
  import excel from '../common/excel';
  export default {
    props: ['sfid'],
    components: {
      excel
    },
    data() {
      let now = new Date();
      now.setTime(now.getTime() - 24 * 60 * 60 * 1000);
      let occur_time = now.getFullYear() + "-" + this.plusZero(now.getMonth() + 1) + "-" + this.plusZero(now.getDate());
      return {
        occur_time1: '',
        occur_time2: '',
        excel_name: this.$route.name,
        excel_url: 'report/agentMaxPerformanceReports',
        excel_column_arr: ['agent_id', ['agent', 'agent_name'], ['agent', 'agent_level'], ['agent', 'parent_id'], 'max_performance', 'total_performance',
          'occur_time'
        ],
        excel_title_arr: ['代理ID', '名称', '级别', '归属代理', '直属最大配资峰值', '总最大配资峰值', '统计时间'],
        pickerOptions1: {},
        pickerOptions2: {},
        pickerOptions3: {},
        is_search: true,
        loading: false,
        forms: {},
        date_range: "",
        post_data: {
          where: {
            agent_id: '',
            occur_time: occur_time
          },
          search: {
            agent_id: ''
          },
          whereBetween: {
            occur_time: ['', '']
          },
          count: true,
          offset: 0,
          limit: 15,
          order: ''
        }
      }
    },
    created(){
      if (this.sfid) this.is_search = false;
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      sortChange: function (sort) {
        let direction = sort.order == 'ascending' ? 'asc' : 'desc';
        this.post_data.order = sort.prop + ' ' + direction;
        this.getList();
      },
      getList: function () {
        this.loading = true;
        agentMaxPerformanceReports(this.post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          if (!res.data.list) return this.forms = [];
          this.forms.count = res.data.count; //必须分开不然有bug
          //默认只显示自己
          if (!this.post_data.where.occur_time) {
            this.forms.list = res.data.list;
            return;
          }
          //否则选定了具体天数 则去处理层级关系
          this.forms.list = res.data.list.map((item, index) => {
            if (item.agent_id == '合计最大') return item;
            if (index == 0 && this.post_data.offset == 0) {
              item._level = 0;
              item._expanded = -1;//默认不展开 1展开 2变成. -1空白
              item._show = true;
              return item;
            }
            item._level = 0;
            item._expanded = 0;
            item._show = true;
            return item;
          });
        }).catch(error => console.log(error));
      },
      showChildren: function (scope) {
        if (scope.row.loadChildren) {
          //如果已经load过children 则直接展开
          return scope.row._expanded = 1;
        }
        let children_post_data = {
          only_add: true,
          limit: 0,
          where: {
            occur_time: this.post_data.where.occur_time,
            agent_id: scope.row.agent_id
          }
        };
        this.loading = true;
        agentMaxPerformanceReports(children_post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          if (!res.data.list || res.data.list.length === 0) {
            scope.row._expanded = 1;
            scope.row._nomore = 1;
            scope.row.loadChildren = true;
            return;
          }
          let children_list = res.data.list.map((item, index) => {
            item._level = scope.row._level + 1;
            if (item._level > 3) item._nomore = 1;//最多5级代理商
            item._expanded = 0;
            item._show = scope.row;
            return item;
          });
          scope.row._expanded = 1;
          scope.row.loadChildren = true;
          this.forms.list.splice(scope.$index + 1, 0, ...children_list);//插入children数据
        }).catch(error => console.log(error));
      },
      hideChildren: function (row) {
        row._expanded = 0;
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
      changeSelect1: function ($value) {
        if (this.post_data.whereBetween.occur_time[0] == $value) return;
        if ($value && this.post_data.where.occur_time) {
          this.changeSelect3('');
        }
        this.post_data.whereBetween.occur_time[0] = $value;
        $value = $value ? $value + ' 0:0:0' : '';
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() < new Date($value).getTime();
          }
        };
      },
      changeSelect2: function ($value) {
        if (this.post_data.whereBetween.occur_time[1] == $value) return;
        if ($value && this.post_data.where.occur_time) {
          this.changeSelect3('');
        }
        $value = $value ? $value + ' 23:59:59' : '';
        this.post_data.whereBetween.occur_time[1] = $value;
        this.pickerOptions1 = {
          disabledDate(time) {
            return time.getTime() > new Date($value).getTime();
          }
        };
      },
      changeSelect3: function ($value) {
        if (this.post_data.where.occur_time == $value) return;
        if ($value && this.post_data.whereBetween.occur_time[0]) this.changeSelect1('');
        if ($value && this.post_data.whereBetween.occur_time[1]) this.changeSelect2('');
        this.post_data.where.occur_time = $value;
        if ($value) {
          this.getList();
        }
      },
      showRow: function (row, index) {
        if (typeof(row._show) == "object") {
          if (row._show._expanded) {
            return '';
          } else {
            row._expanded = 0;
            return 'display:none;';
          }
        } else if (row.agent_id == "合计最大") {
          //合计最后一行改变颜色
          return 'background-color:rgb(202, 232, 234)';
        } else if (!this.post_data.where.occur_time) {
          //如果不需要层级关系
          return '';
        } else {
          return row._show ? '' : 'display:none;';
        }
      }
    }
  }
</script>

<style>
</style>

