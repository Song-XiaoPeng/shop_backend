<template>


  <div class="yl-clearfix">
    <div class="searchgrid">

      <input value=" 新增 " type="button" class="yl-input-button yl-float-left" @click="handleAddEmployeeOfThisAgent" v-show="!$route.query.agent_id">
      <div class="yl-float-right">
        <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="ID/员工姓名/手机号">
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


        <el-table-column label="状态">
          <template scope="scope">
            <span v-text="calculateEmployStatus(scope.row)"></span>
          </template>
        </el-table-column>

        <el-table-column prop="role.role_name" label="角色">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button v-if="role=='SystemAdmin'" size="mini" @click="handleEditEmployee(scope.row)" icon="edit" title="后台用户修改"></el-button>
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
  import {rolePlayIssueToken, getUserList} from '../../api/user';

  export default {
    data() {
      return {
        filters: {
          keyword: '',
          page: 1,
          size: 15
        },
        pagination: {},
        listLoading: false,
        pageIndex: 1,
      }
    },
    methods: {
      search() {
        this.filters.page = 1;
        this.fetchAdminStaffList();
      },
      handlePageChange(clickPageIndex) {
        //分页页面发生改变
        this.filters.page = clickPageIndex;
        this.pageIndex = clickPageIndex;
        this.fetchAdminStaffList();
      },
      handleSizeChange(size) {
        this.filters.size = size;
        this.filters.page = 1;
        this.fetchAdminStaffList();
      },
      //获取用户列表
      fetchAdminStaffList() {
        let params = this.filters;
        this.listLoading = true;
        getUserList({params}).then((res) => {
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
        this.$router.push({path: '/system/user/create'});
      },
      //编辑员工
      handleEditEmployee: function (row) {
        this.$router.push({path: '/system/user/edit/' + row.id});
      }
    },
    created() {
      this.fetchAdminStaffList();
    },
    activated(){
      if (this.$route.meta.refresh) this.fetchAdminStaffList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    }
  }
</script>

