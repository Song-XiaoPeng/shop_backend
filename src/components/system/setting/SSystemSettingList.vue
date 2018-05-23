<template>
  <div class="yl-clearfix">
        <div class="searchgrid">
            <input value=" 新增 " type="button" class="yl-input-button yl-float-left" @click="$router.push({name: '系统设置'})">
            
            <div class="yl-float-right">
                <input class="yl-input-text" v-model="filters.keywords" type="text" placeholder="代理商id/代理商名称/参数名称">
                <input value=" 查询 " class="yl-input-button" type="button" @click="search">
            </div>
        </div>
        <div class="tab-content default-tab yl-clearfix" style="display: block;">
            <el-table :data="pagination.data"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;">
                <el-table-column label="ID" prop="id"></el-table-column>

               <el-table-column label="代理商id">
                    <template slot-scope="scope">
                        <span v-text="scope.row.agent_id"></span>
                    </template>
                </el-table-column>

               <el-table-column label="代理商名称">
                    <template slot-scope="scope">
                        <span v-text="scope.row.agent_name"></span>
                    </template>
                </el-table-column>

               <el-table-column label="参数名称">
                    <template slot-scope="scope">
                        <span v-text="scope.row.param_key"></span>
                    </template>
                </el-table-column>

               <el-table-column label="参数值">
                    <template slot-scope="scope">
                        <span v-text="scope.row.param_value"></span>
                    </template>
                </el-table-column>

               <el-table-column label="参数说明">
                    <template slot-scope="scope">
                        <span v-text="scope.row.remark"></span>
                    </template>
                </el-table-column>

               <el-table-column label="修改时间">
                    <template slot-scope="scope">
                        <span v-text="scope.row.updated_time"></span>
                    </template>
                </el-table-column>

               <el-table-column label="添加时间">
                    <template slot-scope="scope">
                        <span v-text="scope.row.created_time"></span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="150px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="edit(scope.row.id)" title="修改系统设置"><i class="fa fa-pencil"></i></el-button>
                        <el-button size="small" @click="destroy(scope.row.id,scope.$index)" title="删除" icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <div class="yl-pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
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
  import { getSystemSettingList,getSystemSettingDetails,delSystemSetting } from '../../../api/system'

  export default {
    data() {
      return {
          filters:{
            keywords: '',
            page: 1,
            page_size: 15,
          },
          pagination: [] ,
          listLoading: false ,
          pageIndex: 1
        }
    },
    methods: {
      search() {
          this.filters.page = 1;
          this.getSystemSettingList()
      },
      destroy($id, $index) {
        this.$confirm('确认删除该记录吗?' , '提示', {
            type: 'warning'
        }).then(() => {
            this.loading = true;
            delSystemSetting({id: $id}).then((res) => {
                if(res.status == 1){
                    this.pagination.data.splice($index,1)
                }
                this.ezNotifyAxiosThen(res);
                this.loading = false;
            }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      },
      edit(id) {
        this.$router.push({name: '修改系统设置', params: {id}});
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.filters.page = val
        this.getSystemSettingList();
      },
      handleSizeChange(val) {
        this.filters.page_size = val
        this.getSystemSettingList();
      },
      getSystemSettingList() {
        let params = this.filters
        this.listLoading = true;
        getSystemSettingList(params).then((res) => {
            if (res.status == 1) {
                this.pagination = res.data;
                console.log(this.pagination)
            }
            this.listLoading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    },
    created() {
      this.getSystemSettingList()
    }
  };
</script>
