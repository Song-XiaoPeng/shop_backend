<template>
  <div>
    <el-row style="background-color:#eaf7ff;" class="hold-transition sidebar-mini">
      <div class="body_header">
        <div class="header_left">
          <div class="header_logo">
            <!--"domain != 'gubao68.com' &&-->
            <a v-if="userInfo.agent_info && userInfo.agent_info.admin_platform_logo">
              <img id="logo_1" style="height:60px;width:290px" :src="userInfo.agent_info.admin_platform_logo" alt="短信通平台"/>
            </a>
            <a v-else>
              <img id="logo_1" src="~static/img/background_logo.jpg" alt="短信通平台"/>
            </a>
          </div>
        </div>
        <div class="shortcut-buttons-set" style="margin-right:10px;" v-on:click="logout">
          <img src="~static/img/layout.jpg" alt="退出系统" title="退出系统"/>
        </div>
        <div class="shortcut-buttons-set">
          <img src="~static/img/index.jpg" alt="系统首页" v-on:click="$router.push('/')" title="系统首页"/>
        </div>
        <div class="profile-links">
          <div id="usertip">
            <span style="display: block;vertical-align: middle;line-height: 18px;width: 190px;">
            {{userInfo.agent.agent_name}}<br/>
            {{userInfo.role.role_name}} : {{userInfo.name}}
            </span>
          </div>
          <div id="smstip"><span id="remainpoint"></span></div>
        </div>
      </div>
    </el-row>


    <el-row class="middle_content">
      <el-col :span="3" class="left">
        <div class="left_title">
          <img src="~static/img/menu-ico.jpg" border="0">
          <span class="font14">管理平台菜单</span>
        </div>
        <div class="left_list">
          <section>
            <ul class="sidebar-menu">
              <!--这里面不要动了-->
              <template v-for=" (value,num) in navTree">
                <li :key="value.name" :class="handleMenuClass(value,num)">
                  <a href="javascript:;" @click="expand_tree(num)">
                    <i :class="value.iconClass"></i>
                    <span>{{value.name}}</span>
                    <span class="pull-right-container">
                        <i class="fa fa-angle-left pull-right"></i>
                      </span>
                  </a>
                  <ul class="treeview-menu">
                    <template v-for="item in value.children">
                      <!--<li :key="item.path" :class="{active:currentPath.indexOf(item.path)==0}">-->
                      <li :key="item.path" :class="{active:currentPath==item.path}">
                        <router-link :to="item.path"><i class="fa fa-circle-o"></i>{{item.name}}</router-link>
                      </li>
                    </template>
                  </ul>
                </li>
              </template>
            </ul>
          </section>
        </div>
      </el-col>


      <el-col :span="21" class="right">
        <div class="right-title">
          <div id="rightico"></div>
          <div><strong>位置：</strong>
            <span v-for="item in $route.matched" :key="item.name" v-text="'['+item.name+']'" style="margin-right: 8px"> </span>
          </div>
        </div>

        <div class="right-content">
          <div class="content-box">
            <div style="padding:8px;" class="content-box-content">
              <!-- &lt;!&ndash;这个小组件就是你们要显示的内容&ndash;&gt;-->
              <keep-alive>
                <router-view v-if="$route.meta.keepAlive">
                  <!-- 这里是会被缓存的视图组件，比如 Home！ -->
                </router-view>
              </keep-alive>
              <router-view v-if="!$route.meta.keepAlive">
                <!-- 这里是不被缓存的视图组件，比如 Edit！ -->
              </router-view>
              <el-row type="flex" class="ip-info" justify="space-around" v-if="$route.path=='/'">
                <el-col :span="6" style="text-align: left">本次登录IP：{{userInfo.my_ip}}</el-col>
                <!--<el-col :span="6" style="text-align: center">上次登录IP：{{userInfo.last_ip}}</el-col>
                <el-col :span="6" style="text-align: right">上次登录时间：{{userInfo.updated_time}}</el-col>-->
              </el-row>
            </div>
          </div>
        </div>
      </el-col>

    </el-row>

    <div id="bottom-tip">
      <div class="middle" style="width:100%;">
        <div id="infozone">
          <div><a target='mainFrame'>暂无公告</a></div>
        </div>
      </div>
      <div style="float:left; width:240px;" id="liveclock">&nbsp;</div>
      <div style="float:right; width:140px; background:url(../../static/img/buttonright.jpg) no-repeat;">&nbsp;</div>
    </div>
    <div id="winpop">
      <div class="title">消息提示<span class="closeTip">X</span></div>
      <div id="showContent" class="con"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {ereaseTokenFromStorage} from '../common/tools';

  export default {
    data: function () {
      return {
        showDefaultPage: false,
        user: {role: {role_name: ''}, agent: {agent_name: ''}, role_id: 0},
        currentPath: '',
        currentClass: false,
        path: '',
        expand: '',
      };
    },
    created() {
      this.currentPath = this.$route.meta.menu ? this.$route.meta.menu : this.$route.path;
      /*//监听手动更新用户信息
       this.$bus.$on('dumb-update-user-info', () => this.updateUserInfo());*/
    },
    watch: {
      //第一次进入 '/'这个页面的时候这个行数不执行
      //监视路由，参数为要目标路由和当前页面的路由
      $route(to, from) {
        this.currentPath = to.meta.menu ? to.meta.menu : to.path;
      }
    },
    methods: {
      expand_tree: function (index) {
        this.expand = index === this.expand ? -1 : index;
      },
      logout: function () {
        this.$confirm('确认退出吗?', '提示', {
          type: 'warning'
        }).then(() => {
          ereaseTokenFromStorage();
          this.$router.push('/login');
        })
      },
      handleMenuClass(value, index) {
        if (this.expand === '') {
          if (this.currentPath.indexOf(value.path) == 0) {
            this.expand = index;
            return 'treeview menu-open';
          } else {
            return 'treeview';
          }
        } else if (this.expand == -1) {
          return 'treeview';
        } else {
          return this.expand == index ? 'treeview menu-open' : 'treeview';
        }
      }
    }
  }
</script>

<style scoped>

  .ip-info {
    margin-top: 16px;
    line-height: 45px;
    color: #444;
    font-size: 12px;
  }

  li.treeview.menu-open ul {
    display: block !important;
  }

  #infozone {
    font-size: 12px;
    color: #aa6;
    overflow: hidden;
    width: 300px;
    height: 30px;
  }

  #infozone div {
    height: 30px;
    line-height: 26px;
    white-space: nowrap;
    overflow: hidden;
  }

  .treeview-menu {
    font-size: 12px;
  }

  .sidebar-menu li {
  }

  .sidebar-menu li a, .sidebar-menu li a:hover, .sidebar-menu li a:active {
    text-decoration: none;
  }

  .sidebar-menu li a {
    text-decoration: none;
  }

  .sidebar-menu > li:hover > a, .sidebar-menu > li.active > a, .sidebar-menu > li.menu-open > a {
    color: white;
    background-color: #5EA6E0;
  }

  .skin-blue .sidebar-menu > li > .treeview-menu {
    background-color: #C9E7E9;
  }

  .sidebar-menu > li > .treeview-menu {
    background: #EEF9FF;
    color: black;
  }

  .treeview-menu {
    padding: 0;
    margin: 0;
  }

  .treeview-menu li {
    height: 40px;
    line-height: 35px;
  }

  .treeview-menu .active {
    font-weight: bold;
    color: black !important;
    line-height: 35px;
    background-image: linear-gradient(360deg, #F7FBFE, #1E8EDF, #F7FBFE);
  }

</style>
