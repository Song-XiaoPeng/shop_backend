<template>
  <section>
    <!--工具条-->
    <div class="searchgrid">
      <router-link v-if="false" :to="{path:'/system/holidayMaintain/create'}">
        <input class="yl-input-button" value=" 新增 " type="button">
      </router-link>
      <div style="float: right;">
        <input v-model="post_data.search.remark" style="width:100px;height:20px;"
               value="" maxlength="11" type="text" placeholder="搜索:备注">
        <input class="yl-input-button" value=" 查询 " type="button" v-on:click="search">
      </div>
    </div>

    <!--列表-->
    <el-table :data="forms.list"
              highlight-current-row
              v-loading="loading"
              style="width: 100%;">
      <el-table-column prop="year" label="年份" show-overflow-tooltip></el-table-column>
      <el-table-column prop="holiday" label="节假日时间" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" v-if="false">
        <template scope="scope">
          <router-link :to="{path:'/system/holidayMaintain/edit/'+scope.row.id}">
            <el-button size="small" title="修改" icon="edit"></el-button>
          </router-link>
          <el-button size="small" @click="destroy(scope.row.id,scope.$index)" title="删除" icon="delete"></el-button>
        </template>
      </el-table-column>
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
  import {getHolidayMaintains, destroyHolidayMaintain} from '../../../api/system';
  export default {
    data() {
      return {
        loading: false,
        forms: {},
        post_data: {
          search: {
            remark: ''
          },
          count: true,
          offset: 0,
          limit: 15,
          order: 'holiday desc'
        }
      }
    },
    created(){
      this.getList();
    },
    activated(){
      if (this.$route.meta.refresh) this.getList(); //第一次在created已创建 不需要刷新
      //else this.$route.meta.refresh = true;//默认要刷新
    },
    methods: {
      getList: function () {
        this.loading = true;
        getHolidayMaintains(this.post_data).then(res => {
          this.loading = false;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          this.forms = res.data;
        }).catch(error => this.ezNotifyAxiosCatch(error));
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
      destroy: function ($id, $index) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loading = true;
          destroyHolidayMaintain($id).then((res) => {
            if (res.status > 0) {
              //不是最后一页则更新该页 否则不更新只移除删除项
              if (this.post_data.offset + this.post_data.limit < this.forms.count) {
                this.getList();
              } else {
                this.forms.list.splice($index, 1);
                this.forms.count--;
              }
            }
            this.ezNotifyAxiosThen(res);
            this.loading = false;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        }).catch(() => {
        });
      }
    }
  }
</script>

<style scoped>
</style>
