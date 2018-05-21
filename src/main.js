// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// ES6的polyfill 不装IE会报错
require("es6-promise").polyfill();

import Vue from "vue";
import App from "./App";
import router from "./router";

import ElementUI from "element-ui";
import 'element-ui/lib/theme-chalk/index.css'
import VueClipboard from "vue-clipboard2";
import {fetchToken, getStorageUserInfo} from "./common/tools";

import "../static/css/index.css";
import "../static/css/reset.css";
import "../static/css/invalid.css";
import "../static/css/AdminLTE.min.css";
import "../static/css/style.css";
import "../static/css/yingli.css"; //管理后台自定义样式
import "../static/css/font-awesome.min.css";
import "../static/ueditor/ueditor.config.js";
import "../static/ueditor/ueditor.all.js";
import "../static/ueditor/lang/zh-cn/zh-cn.js";
import "../static/ueditor/ueditor.parse.min.js";
//注册全局方法
import util from "./common/util";

Vue.use(util);

Vue.use(ElementUI);

Vue.use(VueClipboard);

Vue.config.productionTip = false;

//事件监听bus
Vue.prototype.$bus = new Vue();

router.beforeEach((to, from, next) => {
  Vue.prototype.userInfo = getStorageUserInfo();
  check_role(to);
 
  if (Vue.prototype.userInfo.agent_info) {
    document.title = Vue.prototype.userInfo.agent_info.platform_name ? Vue.prototype.userInfo.agent_info.platform_name + '|' + to.name : '';
  } else {
    //next({path: '/login'})
  }
  if (!fetchToken() && to.path != '/login') {
    next({path: '/login'})
  } else {
    if (to.path == '/' || to.path == '/login') next();
    else if (Vue.prototype.navTree && Vue.prototype.navTree.some(function (i) {
        return i.children.some(function (ii) {
          return ii.path == to.path;
        })
      })) {
      next();
    } else {
      next();
      /*ElementUI.Notification({
       title: '警告',
       message: '你没有此权限!',
       type: 'warning'
       });*/
    }
  }
});

router.afterEach((to, from, next) => {
});

let check_role = function (to) {
  let user_info = getStorageUserInfo();
  let not_allowed_menu = user_info.not_allowed
  if(typeof (not_allowed_menu) === 'object'){
    if(not_allowed_menu.indexOf(to.path) !== -1 || not_allowed_menu.indexOf(to.name) !== -1){
      ElementUI.Notification({
        title: '警告',
        message: '你没有此权限!',
        type: 'warning'
      });
      router.push({path: '/'});
    }
  }
  
  //管理员所有信息1234
  if (user_info.role_id > 0 && user_info.role_id < 10) {
    Vue.prototype.role_group = 'System';
  } else if (user_info.role_id > 10 && user_info.role_id < 20) {
    Vue.prototype.role_group = 'Agent';
  }

  //获得用户菜单
  Vue.prototype.navTree = user_info.menuData
  Vue.prototype.role = user_info.role.role_en_name;

  if(user_info.role_id == 11){
    if (user_info.agent.is_option_open == 1) {
        
    }else if(user_info.agent.is_independent == 1){
        Vue.prototype.role_cate = 'independent';
    }
  }

};

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});



