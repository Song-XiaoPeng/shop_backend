<template>


  <div class="yl-clearfix">
    <div class="searchgrid">

      <input value=" 新增 " type="button" class="yl-input-button yl-float-left" @click="handleAddEmployeeOfThisAgent" v-show="!$route.query.agent_id">
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="ID/员工编号/员工姓名/手机号">
        <input value=" 查询 " type="button" class="yl-input-button" @click="search">
      </div>
    </div>
    <div class="tab-content default-tab yl-clearfix" style="display: block;">
      <el-table :data="pagination.data"
                v-loading="listLoading"
                style="width: 100%;">
        <el-table-column prop="id" label="ID">
        </el-table-column>
        <el-table-column prop="name" label="员工编号">
        </el-table-column>
        <el-table-column prop="employee_name" label="员工姓名">
        </el-table-column>
        <el-table-column prop="phone" label="员工电话">
        </el-table-column>

        <el-table-column label="天配">
          <template slot-scope="scope">
            <span v-text="calculatePercentage(scope.row,0)"></span>
          </template>
        </el-table-column>

        <el-table-column label="月配">
          <template slot-scope="scope">
            <span v-text="calculatePercentage(scope.row,1)"></span>
          </template>
        </el-table-column>

        <el-table-column label="提成">
          <template slot-scope="scope">
            <span v-text="calculatePercentage(scope.row,2)"></span>
          </template>
        </el-table-column>

        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-text="calculateEmployStatus(scope.row)"></span>
          </template>
        </el-table-column>

        <el-table-column prop="role.role_name" label="角色">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="role=='AgentAdmin'" size="mini" @click="handleEditEmployee(scope.row)" icon="edit" title="员工修改"></el-button>
            <el-button size="mini" @click="handlePlayEmployee(scope.row)" title="扮演员工"><i class="fa fa-play-circle"></i></el-button>
          </template>
        </el-table-column>
      </el-table>


      <div class="yl-pagination">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="pageIndex"
          :page-sizes="[15, 30, 45, 60]"
          :page-size="parseInt(pagination.per_page)"
          :total="pagination.total"
          style="float:right;">
        </el-pagination>
      </div>

    </div>
  </div>

</template>

<script>
  import {employeeList} from '../../api/employee';
  import {rolePlayIssueToken} from '../../api/user';
  import {STAFFHOST} from '../../common/tools';
  export default {
    data() {
      return {
          playLoginUrl: '',
        filters: {
          keyword: '',
          page: 1,
          size: 15,
          agent_id: 0,
        },
        pagination: {},
        listLoading: false,
        pageIndex: 1,
      }
    },
    watch: {
        playLoginUrl(newRoute, oldRoute) {
            window.open(
                newRoute,
                '_blank'
            );
        }
    },
    methods: {
      search() {
        this.filters.page = 1;
        this.fetchEmployeeList();
      },
      handlePageChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchEmployeeList();
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchEmployeeList();
      },
      //获取用户列表
      fetchEmployeeList() {
        let params = this.filters;
        this.listLoading = true;
        employeeList({params}).then((res) => {
          this.listLoading = false;
            this.pagination = res.data;
        }).catch(error => {
          this.ezNotifyAxiosCatch(error)
        });
      },
      //计算状态
      calculateEmployStatus(row) {
        return row.is_forbid > 0 ? '禁用' : '正常';
      },
      //计算员工分成比例
      calculatePercentage(row, type) {
        let percentage = '';
        if (!row.percentages) {
          return percentage;
        }
        row.percentages.forEach(value => {
          if (value.type == type) {
            percentage = value.percentage
          }
        })
        return percentage;
      },
      //添加员工
      handleAddEmployeeOfThisAgent: function () {
          this.$router.push({path: '/employee/create'});
      },
      //编辑员工
      handleEditEmployee: function (row) {
        this.$router.push({name: '员工修改', params: {id: row.id}});
      },
        //角色扮演
      handlePlayEmployee: function (row) {
          rolePlayIssueToken({employ_id: row.id}).then(res => {
              if (res.status == 1) {
                  let token = res.data.accessToken;
                this.playLoginUrl = STAFFHOST + '/login?access_token=' + token;
              } else {
                  this.ezNotifyAxiosThen(res)
              }
          });
      }
    },
    created() {
      this.fetchEmployeeList();
    },
    activated(){
      if (this.$route.meta.refresh) this.fetchEmployeeList(); //第一次在created已创建 不需要刷新
      else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

