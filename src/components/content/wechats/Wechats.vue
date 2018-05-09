<template>
    <el-tabs v-model="tabName" type="card" style="margin-top: 12px" v-loading="loading">
        <el-tab-pane label="自定义菜单" name="wechat_menu" @refresh = 'getInfo'>
            <wechatMenu :form="form">
            </wechatMenu>
        </el-tab-pane>
        <el-tab-pane label="自动回复" name="auto_res">
            <autoRes :form="form">
            </autoRes>
        </el-tab-pane>
        <el-tab-pane label="关注回复" name="welcome_res">
            <welcomeRes :form="form">
            </welcomeRes>
        </el-tab-pane>
        <el-tab-pane label="默认回复" name="default_res">
            <defaultRes :form="form">
            </defaultRes>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import autoRes from './auto_res.vue';
    import defaultRes from './default_res.vue';
    import wechatMenu from './wechat_menu.vue';
    import welcomeRes from './welcome_res.vue';
    import {getWechatInfo} from '../../../api/wechat';
    export default {
        components: {
            autoRes,
            defaultRes,
            wechatMenu,
            welcomeRes
        },
        data() {
            return {
                refresh: true,
                loading: false,
                //代理商基本信息
                form: {
                    default_res: '',
                    welcome_res: '',
                    auto_res: '',
                    menu: ''
                },
                tabName: 'wechat_menu'
            };
        },
        beforeRouteLeave(to, from, next) {
            to.meta.refresh = this.refresh;
            next();
        },
        created(){
            this.getInfo();
        },
        methods: {
            getInfo(){
                getWechatInfo({agentId: this.$route.params.id}).then((res) => {
                    this.loading = false;
                    if (res.status === 0) {
                        this.ezNotifyAxiosThen(res);
                    }
                    this.form = res.data;
                }).catch(error => {
                    this.ezNotifyAxiosCatch(error);
                });
            },
        }
    };
</script>

<style scoped>
    .el-row {
        margin-bottom: 10px;
    }
</style>
