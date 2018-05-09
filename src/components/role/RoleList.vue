<template>
    <div class="yl-clearfix">
        <div class="searchgrid">
            <!-- <input value=" 新增 " type="button" class="yl-input-button yl-float-left" @click="$router.push({name: '新增角色'})">
            
            <div class="yl-float-right">
                <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="角色名称">
                <input value=" 查询 " class="yl-input-button" type="button" @click="">
            </div> -->
        </div>
        <div class="tab-content default-tab yl-clearfix" style="display: block;">
            <el-table :data="pagination.data"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;">
                <el-table-column label="ID" prop="id"></el-table-column>

               <el-table-column label="角色名称">
                    <template scope="scope">
                        <span v-text="scope.row.role_name"></span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="150px">
                    <template scope="scope">
                        <el-button size="mini" @click="editRole(scope.row.id)" title="修改角色"><i class="fa fa-pencil"></i></el-button>
                        <!-- <el-button size="mini" @click="editAuth(scope.row.id)" title="api接口权限配置"><i class="fa fa-pencil"></i></el-button> -->
                        <el-button size="small" @click="destroy(scope.row.id,scope.$index)" title="删除" icon="delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!-- <div class="yl-pagination">
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
            </div> -->

        </div>
    </div>
</template>

<script>
    import { getRoleList } from '../../api/roles'

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
        destroy($id, $index) {
          this.$confirm('确认删除该记录吗?' , '提示', {
              type: 'warning'
          }).then(() => {
              this.loading = true;
              // protocolDelete({id: $id}).then((res) => {
              //     if(res.status == 1){
              //         this.updateProtocols();
              //     }
              //     this.ezNotifyAxiosThen(res);
              //     this.loading = false;
              // }).catch(error => this.ezNotifyAxiosCatch(error));
          }).catch(() => {
          });
        },
        editRole(id) {
          this.$router.push({name: '修改角色', params: {id}});
        },
        editAuth(id) {
          this.$router.push({name: '设置接口权限', params: {id}});
        },
        handleCurrentChange(val) {
          this.pageIndex = val
          this.filters.page = val
          this.getRoleList();
        },
        handleSizeChange(val) {
          this.filters.page_size = val
          this.getRoleList();
        },
        getRoleList() {
          let params = this.filters
          this.listLoading = true;
          getRoleList(params).then((res) => {
              if (res.status == 1) {
                  this.pagination = res;
                  console.log(this.pagination)
              }
              this.listLoading = false;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }
      },
      created() {
        this.getRoleList()
      }
    }
</script>
