<template>
    <div class="yl-clearfix">
        <div class="searchgrid">
          <el-col :span="8">
            <input value=" 新增 " type="button" class="yl-input-button yl-float-left" @click="$router.push({name: '新增文章'})">
            <el-select size="small" style="width:150px;padding-left:10px" v-model="filters.type" placeholder="文章分类筛选" clearable @change="updateData">
              <el-option
                v-for="item in type_list"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
            <el-col :span="16">
            <div class="yl-float-right">
                <input class="yl-input-text" v-model="filters.title" type="text" placeholder="文章标题" style="width:120px">
                <input class="yl-input-text" v-model="filters.id" type="text" placeholder="ID" style="width:120px">
                <input class="yl-input-text" v-model="filters.agent_id" type="text" placeholder="来源/代理商ID" style="width:120px">
              <input value=" 查询 " class="yl-input-button" type="button" @click="updateData">
            </div>
          </el-col>
        </div>
        <div class="tab-content default-tab yl-clearfix" style="display: block;">
            <el-table :data="pagination.data"
                      highlight-current-row
                      v-loading="listLoading"
                      style="width: 100%;">
                <el-table-column label="ID" prop="id"></el-table-column>

              <el-table-column label="文章分类">
                <template slot-scope="scope">
                  <span v-text="scope.row.replaced_type"></span>
                </template>
              </el-table-column>

                <el-table-column label="标题">
                    <template slot-scope="scope">
                        <span v-text="scope.row.title"></span>
                    </template>
                </el-table-column>

                <el-table-column label="排序">
                    <template slot-scope="scope">
                        <span v-text="scope.row.sort"></span>
                    </template>
                </el-table-column>

              <!--<el-table-column label="文章分类">
                  <template slot-scope="scope">
                      <span v-text="scope.row.type_name"></span>
                  </template>
              </el-table-column>-->

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
                        <el-button size="mini" @click="handleEdit(scope.row.id)" title="代理修改"><i class="fa fa-pencil"></i></el-button>
                        <el-button size="small" @click="destroy(scope.row.id,scope.$index)" title="删除" icon="delete"></el-button>
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
    import {articleList, articleDelete} from '../../api/content';
    export default {
        data() {
            return {
              type_list: [{value: 1, label: '股票配资新闻'}, {value: 2, label: '配资常见问题'}, {value: 3, label: '公告'},
                  {value: 4, label: '微信文章'}, {value: 5, label: '个股期权'},{value: 6, label: '外盘期货'},{value: 7, label: '原油期货'}],
                filters: {
                    title: '',
                    id: '',
                    agent_id: '',
                    page: 1,
                    size: 15,
                    type: ''
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

                this.updateData()
            },
            pageIndexChange(clickPageIndex) {
                //分页页面发生改变
                this.filters.page = clickPageIndex;
              this.pageIndex = clickPageIndex;
                this.updateData();
            },
            updateData() {
                let params = this.filters;
                this.listLoading = true;
                articleList({params}).then((res) => {
                    if (res.status == 1) {
                        this.pagination = res.data;
                    }
                    this.listLoading = false;
                }).catch(error => this.ezNotifyAxiosCatch(error));
            },
            handleSizeChange(size) {
                this.filters.size = size;
                this.filters.page = 1;
                this.updateData();
            },
            handleEdit: function (id) {
                this.$router.push({name: '修改文章', params: {id}});
            },
            destroy: function ($id, $index) {
                this.$confirm('确认删除该记录吗?' , '提示', {
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    articleDelete({id: $id}).then((res) => {
                        if(res.status == 1){
                            this.updateData();
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