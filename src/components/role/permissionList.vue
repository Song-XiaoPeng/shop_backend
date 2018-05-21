<template>
    <div class="yl-clearfix">
        <div class="searchgrid">
            <input value="添加权限" type="button" class="yl-input-button yl-float-left" @click="$router.push({name: '新增权限'})">
            <input value="添加角色" type="button" class="yl-input-button yl-float-left" @click="$router.push({name: '新增角色'})">

            <div class="yl-float-right">
            </div>
        </div>

        <el-table
        :data="tableData"
        style="width: 100%"
        highlight-current-row
        :row-style="showRow"
        v-loading="loading">
            <el-table-column prop="id" label="ID" align="left">
                <template scope="scope">
                <span v-if="scope.row._level" v-for="n in scope.row._level">&nbsp;&nbsp;.&nbsp;&nbsp;&nbsp;</span>
                <i v-if="scope.row._expanded===0 && !scope.row._nomore" class="fa fa-plus-square fa-lg" @click="showChildren(scope)"></i>
                <i v-else-if="scope.row._expanded===1 && !scope.row._nomore" class="fa fa-minus-square fa-lg" @click="hideChildren(scope.row)"></i>
                <span v-else-if="scope.row._nomore===1">&nbsp;.&nbsp;</span>
                {{ scope.row.id }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="权限名称"></el-table-column>
            <el-table-column prop="parent_id" label="父ID"></el-table-column>
            <el-table-column prop="path" label="前端路由"></el-table-column>
            <el-table-column prop="icon_class" label="图标" align="left">
                <template scope="scope">
                    <span style="display:inline-block;width:20%;padding-left:30px">
                        <i :class="scope.row.icon_class"></i>
                    </span style="display:inline-block;width:50%">
                    <span>{{ scope.row.icon_class }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="auth" label="权限"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {getParentList} from '@/api/roles.js'
    export default {
        data() {
            return {
                loading: false,
                expand: '',
                tableData: []
            }
        },
        methods: {
            handleEdit(idx, row) {
                this.$router.push({path: '/roles/roleAuthEdit/' + row.id,query:{type:row._level}})
            },
            handleDelete() {},
            showChildren(scope) {                
                if (scope.row.loadChildren) {
                    //如果已经load过children 则直接展开
                    return scope.row._expanded = 1;
                }
                let post_data = {
                    parent_id: scope.row.id, 
                    type: 2
                }
                this.loading = true
                getParentList(post_data).then(res => {
                    this.loading = false
                    if(!res.data || res.data.length === 0) {
                        scope.row._expanded = 1
                        scope.row._nomore = 1
                        return 
                    }
                    let children_list = res.data.map((item, index) => {
                        item._level = scope.row._level + 1;
                        if (item._level >= 2) item._nomore = 1;//跟菜单0-子菜单1-权限2 _level从0开始
                        item._expanded = 0; //显示 +
                        item._show = scope.row;
                        return item;
                    });
                    scope.row._expanded = 1
                    scope.row.loadChildren = true
                    this.tableData.splice(scope.$index + 1, 0, ...children_list);//插入children数据
                })
            },
            hideChildren(row) {
                row._expanded = 0;
            },
            showRow(row, index) {
                if(typeof(row._show) === 'object'){
                    if(row._show._expanded === 1){
                        return 
                    }else {
                        row._expanded = 0
                        return 'display:none'
                    }
                }
            }
        },
        created() {
            this.loading = true
            getParentList({parent_id: 0, type: 2}).then(res => {
                this.loading = false
                res.data.forEach(element => {
                    element._level = 0;
                    element._expanded = 0;//0不展开(+) 1展开(-)
                    element._show = true;
                    return element
                });
                this.tableData = res.data
            })
        }
    }
</script>