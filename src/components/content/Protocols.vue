<template>
    <div class="yl-clearfix">
        <div class="searchgrid">

            <input value=" 新增 " type="button" class="yl-input-button yl-float-left" @click="$router.push({name: '新增协议'})">
            <div class="yl-float-right">
                <input class="yl-input-text" v-model="filters.keyword" type="text" placeholder="协议名称/ID/代理商ID">
                <input value=" 查询 " class="yl-input-button" type="button" @click="updateProtocols">
            </div>
        </div>
        <div class="tab-content default-tab yl-clearfix" style="display: block;">
            <el-table :data="pagination.data"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;">
                <el-table-column label="ID" prop="id"></el-table-column>

               <el-table-column label="协议名称">
                    <template slot-scope="scope">
                        <span v-text="scope.row.name"></span>
                    </template>
                </el-table-column>

                <el-table-column label="来源">
                    <template slot-scope="scope">
                        <span v-text="scope.row.agent_id == userInfo.agent_id ? '本站' : '代理'+scope.row.agent_id"></span>
                    </template>
                </el-table-column>


                <el-table-column prop="created_time" label="操作时间">
                    <template slot-scope="scope">
                        <span v-text="scope.row.updated_time"></span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" min-width="150px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEditProtocol(scope.row.id)" title="代理修改"><i class="fa fa-pencil"></i></el-button>
                        <el-button size="small" @click="destroy(scope.row.id,scope.$index)" title="删除" icon="el-icon-delete"></el-button>
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
    import {getStorageUserInfo} from '../../common/tools';
    import {protocolList, protocolDelete} from '../../api/content';
    export default {
        data() {
            return {
                filters: {
                    keyword: '',
                    page: 1,
                    size: 15,
                },
                userInfo: {},
                pagination: {},
                listLoading: false,
              pageIndex: 1,
            }
        },
        methods: {
            update() {
                this.userInfo = getStorageUserInfo()

                this.updateProtocols()
            },
            pageIndexChange(clickPageIndex) {
                //分页页面发生改变
                this.filters.page = clickPageIndex;
              this.pageIndex = clickPageIndex;
                this.updateProtocols();
            },
            updateProtocols() {
                let params = this.filters;
                this.listLoading = true;
                protocolList({params}).then((res) => {
                    if (res.status == 1) {
                        this.pagination = res.data;
                    }
                    this.listLoading = false;
                }).catch(error => this.ezNotifyAxiosCatch(error));
            },
            handleSizeChange(size) {
                this.filters.size = size;
                this.filters.page = 1;
                this.updateProtocols();
            },
            handleEditProtocol: function (id) {
                this.$router.push({name: '修改协议', params: {id}});
            },
            destroy: function ($id, $index) {
                this.$confirm('确认删除该记录吗?' , '提示', {
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    protocolDelete({id: $id}).then((res) => {
                        if(res.status == 1){
                            this.updateProtocols();
                        }
                        this.ezNotifyAxiosThen(res);
                        this.loading = false;
                    }).catch(error => this.ezNotifyAxiosCatch(error));
                }).catch(() => {
                });
            }
        },
        mounted() {
            this.update()
        }
    }
</script>
