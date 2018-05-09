<template>
  <div class="yl-clearfix">
    <div class="searchgrid">
      <input value="返回上一层" type="button" class="yl-input-button yl-float-left" @click="refresh=false;$router.go(-1)">
    </div>
    <el-table :data="pagination.data"
              highlight-current-row
              v-loading="listLoading"
              style="width: 100%;">
      <el-table-column label="#" prop="id"></el-table-column>
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

      <el-table-column label="天配" width="45">
        <template scope="scope">
          <span v-text="calculatePercentage(scope.row,0)"></span>
        </template>
      </el-table-column>

      <el-table-column label="月配" width="45">
        <template scope="scope">
          <span v-text="calculatePercentage(scope.row,1)"></span>
        </template>
      </el-table-column>

      <el-table-column label="服务费" width="45">
        <template scope="scope">
          <span v-text="calculatePercentage(scope.row,2)"></span>
        </template>
      </el-table-column>


      <el-table-column prop="agent_level" label="代理值" width="46">
        <template scope="sp">
          {{agentLevels[sp.row.agent_level]}}
        </template>
      </el-table-column>

      <el-table-column label="状态" width="46">
        <template scope="scope">
          <span v-text="scope.row.is_locked ? '禁用' : '正常'"></span>
        </template>
      </el-table-column>


      <el-table-column prop="created_time" label="添加时间">
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
                     v-if="role=='AgentAdmin' || role=='SystemAdmin'"
                     title="代理修改"><i class="fa fa-pencil"></i></el-button>
          <el-button v-if="(role=='AgentAdmin' || role=='SystemAdmin') && scope.row.agent_level<5"
                     size="mini" @click="handleAddChildAgent(scope.row)" title="添加下级代理"><i class="fa fa-plus-square"></i></el-button>
          <el-button v-if="(role=='AgentAdmin' || role=='SystemAdmin' || role=='SystemStaff') && scope.row.id != userInfo.agent_id"
                     size="mini" @click="handlePlayAgent(scope.row)" title="扮演代理"><i class="fa fa-play-circle"></i></el-button>
        </template>
      </el-table-column>
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
  import {getAgentChildrenList} from '../../api/agent';
  import {rolePlayIssueToken} from '../../api/user';
  import {AGENTHOST} from '../../common/tools';

  export default {
    data() {
      return {
        refresh: true,
        playLoginUrl: '',
        agentList: [],
        listLoading: false,
        agentLevels: {1: 'K', 2: 'H', 3: 'T', 4: 'E', 5: 'Q'},
        pageIndex: 1,
          filters: {
              page: 1,
              size: 15
          },
          pagination: {}
      };
    },
    methods: {
      pageIndexChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.getAgentFamilyList();
      },
      //获取用户列表
      getAgentFamilyList() {
          let params = this.filters;
          params.agent_id = this.$route.query.agent_id;
        //不带参数就显示自己的代理商和下级
        this.listLoading = true;
          getAgentChildrenList({params}).then(res => {
              this.pagination = res.data;
          this.listLoading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.getAgentFamilyList();
      },
      handleAddChildAgent: function(row) {

        let query = {parentId: row.id};
        this.$router.push({path: '/agent/create', query});
      },
      handleEmployeeList: function(row) {
        this.$router.push({name: '员工列表', query: {agent_id: row.id}});
      },
      handleEditAgent: function(row) {
        let id = row.id;
        this.$router.push({name: '代理商修改', params: {id}});
      },
      //角色扮演
      handlePlayAgent: function(row) {
        rolePlayIssueToken({agent_id: row.id}).then(res => {
          if (res.status == 1) {
            this.playLoginUrl = AGENTHOST + '/login?access_token=' + res.data.accessToken;
          } else {
            this.ezNotifyAxiosThen(res);
          }
        });
      },
      calculatePercentage(row, type) {
        let percentage = '';
        if (!row.percentages) {
          return percentage;
        }
        row.percentages.forEach(value => {
          if (value.type == type) {
            percentage = value.percentage;
          }
        });
        return percentage;
      },
    },
    watch: {
      '$route': function(newRoute, oldRoute) {
        this.getAgentFamilyList();
      },
      'playLoginUrl': function(newRoute, oldRoute) {
        window.open(
          newRoute,
          '_blank',
        );
      },
    },
    created() {
      this.getAgentFamilyList();
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    activated(){
      if (this.$route.meta.refresh) this.getAgentFamilyList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  };
</script>

