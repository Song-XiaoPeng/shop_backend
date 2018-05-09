<template>
  <div class="yl-clearfix">
    <el-row class="searchgrid">
      <el-col :span="6">
        <input value=" 新增 "
               type="button"
               v-if="role=='SystemAdmin' || role=='AgentAdmin'"
               class="yl-input-button"
               @click="$router.push({name: '代理商创建'})">
      </el-col>
      <el-col :span="6" style="text-align:right;">
        <el-select size="small" style="width:100px;" v-model="filters.agentSelect" placeholder="代理值" clearable @change="changeSelect">
          <el-option
            style="text-align: center"
            v-for="item in agentSelects"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select size="small" style="width:100px;" v-model="filters.is_independent" placeholder="是否贴牌" clearable @change="changeSelect">
          <el-option
            style="text-align: center"
            v-for="item in independent_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select size="small" style="width:130px;" v-model="filters.is_option_open" placeholder="是否开通期权" clearable @change="changeSelect">
          <el-option
            style="text-align: center"
            v-for="item in options_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="12" style="text-align:right;">
        <input class="yl-input-text" v-model="filters.phone" style="width:120px" type="text" placeholder="联系人手机号">
        <input class="yl-input-text" v-model="filters.search_remark" style="width:120px" type="text" placeholder="代理商备注">
        <input v-if="role_group=='System'" class="yl-input-text" v-model="filters.independent_remark" style="width:120px" type="text" placeholder="贴牌备注">
        <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="代理商用户名/代理商编号/代理商ID">
        <input value=" 查询 " class="yl-input-button" type="button" @click="search">
        <excel style="text-align:left;" :post_data="filters" :url="excel_url" :column_arr="excel_column_arr" :title_arr="excel_title_arr" :name="excel_name" method="get"></excel>
      </el-col>
    </el-row>
    <div class="tab-content default-tab yl-clearfix" style="display: block">
      <el-table :data="pagination.data"
                highlight-current-row
                v-loading="listLoading"
                @sort-change="sortChange"
                style="width: 100%;">
        <el-table-column label="代理商ID" prop="id"></el-table-column>
        <el-table-column label="代理商编号" prop="agent_number"></el-table-column>
        <el-table-column label="名称" prop="agent_name"></el-table-column>
        <el-table-column label="域名">
          <template scope="scope">
            <span v-text="scope.row.info ? scope.row.info.web_domain : ''"></span>
          </template>
        </el-table-column>

        <el-table-column label="上级代理商">
          <template scope="scope">
            <span v-if="scope.row.parent">{{scope.row.parent.agent_name}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="owner_name" label="联系人">
        </el-table-column>
        <el-table-column prop="phone" label="联系电话">
        </el-table-column>

        <el-table-column label="天配" min_width="50" prop="new_percentages.dayPercentage">
        </el-table-column>

        <el-table-column label="月配" min_width="50" prop="new_percentages.monthPercentage">
        </el-table-column>

        <el-table-column label="服务费" min_width="50" prop="new_percentages.commissionPercentage">
        </el-table-column>

        <el-table-column prop="replaced_agent_level" label="代理值" min_width="80" sortable="custom">
        </el-table-column>

        <el-table-column prop="replaced_is_locked" label="状态" min_width="50">
        </el-table-column>

        <el-table-column prop="replaced_interest_cost_type" label="提现方式" min_width="80">
        </el-table-column>

        <el-table-column prop="created_time" label="添加时间" min_width="120" sortable="custom">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column v-if="role_group=='System'" prop="info.remark" label="贴牌备注">
        </el-table-column>

        <el-table-column label="操作" min-width="120">
          <template scope="scope">
            <router-link
              v-if="(role=='AgentAdmin' || role=='SystemAdmin') && scope.row.agent_level<5"
              class="el-button el-button--default el-button--mini"
              type="button"
              :to="{name:'下级代理列表',query:{agent_id:scope.row.id}}">
              <i class="fa fa-sitemap" title="下级代理商"></i>
            </router-link>
            <el-button size="mini"
                       @click="handleEditAgent(scope.row)"
                       title="代理修改"
                       v-if="role=='AgentAdmin' || role=='SystemAdmin'"><i class="fa fa-pencil"></i></el-button>
            <el-button v-if="(role=='AgentAdmin' || role=='SystemAdmin') && scope.row.agent_level<5"
                       size="mini" @click="handleAddChildAgent(scope.row)" title="添加下级代理"><i class="fa fa-plus-square"></i></el-button>
            <el-button v-if="(role=='AgentAdmin' || role=='SystemAdmin' || role=='SystemStaff') && scope.row.id != userInfo.agent_id" size="mini" @click="handlePlayAgent(scope.row)" title="扮演代理"><i class="fa fa-play-circle"></i></el-button>
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
  import {agentList} from '../../api/agent';
  import {rolePlayIssueToken} from '../../api/user';
  import {AGENTHOST} from '../../common/tools';
  import excel from '../common/excel';

  export default {
    components: {
      excel
    },
    data() {
      return {
        excel_name: this.$route.name,
        excel_url: 'agentList',
        excel_column_arr: ['id', 'agent_number', 'agent_name', ['info', 'web_domain'], ['parent', 'agent_name'], 'owner_name', 'phone',
          ['new_percentages', 'dayPercentage'], ['new_percentages', 'monthPercentage'], ['new_percentages', 'commissionPercentage'],
          'replaced_agent_level', 'replaced_is_locked', 'replaced_interest_cost_type', 'created_time', 'remark'],
        excel_title_arr: ['代理商ID', '代理商编号', '名称', '域名', '上级代理商', '联系人', '联系电话', '天配', '月配', '服务费', '代理值', '状态', '提现方式', '添加时间', '备注'
        ],
        filters: {
          keyword: '',
          page: 1,
          size: 15,
          agentSelect: '',
          order: '',
          search_remark: '',
          phone: '',
          independent_remark: '',
          is_independent: '',
          is_option_open: '',
        },
        agentSelects: [{value: 1, label: 'K'}, {value: 2, label: 'H'}, {value: 3, label: 'T'},
          {value: 4, label: 'E'}, {value: 5, label: 'Q'}],
        independent_list: [{value: 1, label: '是贴牌'}, {value: 0, label: '非贴牌'}],
        options_list: [{value: 1, label: '已开通期权'}, {value: 0, label: '未开通期权'}],
        playLoginUrl: '',
        pagination: {},
        listLoading: false,
        pageIndex: 1,
      }
    },
    methods: {
      sortChange: function (sort) {
        let direction = sort.order == 'ascending' ? 'asc' : 'desc';
        this.filters.order = sort.prop + ' ' + direction;
        this.getAgentListByPageAndName();
      },
      search() {
        this.filters.page = 1;
        this.getAgentListByPageAndName();
      },
      pageIndexChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.getAgentListByPageAndName();
      },
      //获取用户列表
      getAgentListByPageAndName() {
        let params = this.filters;
        this.listLoading = true;
        agentList({params}).then((res) => {
          this.listLoading = false;
          this.pagination = res.data;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.getAgentListByPageAndName();
      },
      handleAddChildAgent: function (row) {
        let query = {parentId: row.id};
        this.$router.push({path: '/agent/create', query});
      },
      handleEmployeeList: function (row) {
        this.$router.push({name: '员工列表', query: {agent_id: row.id}})
      },
      handleEditAgent: function (row) {
        let id = row.id;
        this.$router.push({name: '代理商修改', params: {id}});
      },
      //角色扮演
      handlePlayAgent: function (row) {
        rolePlayIssueToken({agent_id: row.id}).then(res => {
          if (res.status == 1) {
            let token = res.data.accessToken;
            this.playLoginUrl = AGENTHOST + '/login?access_token=' + token;
          } else {
            this.ezNotifyAxiosThen(res)
          }
        });
      },
      changeSelect: function (value) {
        this.filters.page = 1;
        this.getAgentListByPageAndName();
      },
    },
    watch: {
      playLoginUrl(newRoute, oldRoute) {
        window.open(
          newRoute,
          '_blank'
        );
      },
    },
    created() {
      this.getAgentListByPageAndName();
    },
    activated(){
      if (this.$route.meta.refresh) this.getAgentListByPageAndName(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>
