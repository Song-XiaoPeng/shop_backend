import axios from "axios";
import {Notification} from "element-ui";
import config from "../config";

export const VERSION = '201804171800';
export const TOKEN_OBJ_ID = 'token_json_key';
export const TOKEN_REFRESH = 'token_refresh';
export const STORAGE_TIME = 240;//分钟,storage过期时间
export const REFRESH_TIME = 120;//分钟,每检测到大于120分钟会刷新一次storage和access_token;
export const KEY_USER_INFO = 'authed_user_menu_info_agent_info';
export const HOST = config.ADMINAPIHOST?config.ADMINAPIHOST:"http://" + location.hostname + ":7777";
//export const HOST = "http://admin.gubao68.com:7777";
//export const HOST = "http://10.10.1.111:7777";
let url_http = location.href.slice(0, location.href.indexOf(':'));
export const URLDOMAIN = location.hostname.slice(location.hostname.indexOf('.')+1);
export const AGENTHOST = url_http + "://" + config.AGENTHOST + "." + URLDOMAIN;
export const STAFFHOST = url_http + "://" + config.STAFFHOST + "." + URLDOMAIN;
export const HOMEHOST = url_http + "://" + config.HOMEHOST + "." + URLDOMAIN;
export const MOBILEHOST = url_http + "://" + config.MOBILEHOST + "." + URLDOMAIN;

console.log(HOMEHOST);

let is_token_locked = false;

import {MessageBox, Loading} from 'element-ui'
//初始化一个 axios instance
export function initAxios() {
  if (is_token_locked) return false;
  let host = HOST;
  let authHeader = 'Bearer ' + fetchToken();
  let instance = axios.create({
    baseURL: host,
    timeout: 10000,
    headers: {'Authorization': authHeader, 'X-CustomHeader': VERSION},
  });
  instance.interceptors.response.use(function (res) {
    //在这里对返回的数据进行处理
    if (res.data && res.data.status === 2) {
      alert('更新提示：点击确定将刷新并更新系统!\n' +
        '更新内容: ' + res.data.msg);
      location.reload(true);
      return;
    }
    //放在这里比较好每个请求只会执行一次 若放在fetchToken方法里 由于有options请求会更新2次
    let time = getStorageUsedTime(TOKEN_OBJ_ID);
    let fresh_token = getStorage(TOKEN_REFRESH);
    if (fresh_token && time > REFRESH_TIME * 60 * 1000) {
      is_token_locked = true;
      axios.post(HOST + '/oauth/token', {
        grant_type: 'refresh_token',
        refresh_token: fresh_token
      }).then(function (res) {
        setStorage(TOKEN_OBJ_ID, res.data.access_token);
        setStorage(TOKEN_REFRESH, res.data.refresh_token);
      }).then((res) => {
        is_token_locked = false
      });
    }
    return res;
  }, function (err) {
    console.log(err.response);
    handleError(err);
  });
  return instance;
}

export function getStorageUserInfo() {
  let info = JSON.parse(localStorage.getItem(KEY_USER_INFO));
  try {
    return info.user;
  } catch (e) {
    return {
      agent_id: 0,
      agent_info: {},
      role_id: 0,
      phone: '',
      name: '',
      agent: {},
      role: {}
    };
  }
}

export function fetchToken() {
  try {
    return getStorage(TOKEN_OBJ_ID);
  } catch (e) {
    return '';
  }
}

export function doExcelExport(post_data, column_arr, url) {
    Date.prototype.Format = function (fmt) {
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
    let time = new Date().Format("yyyy-MM-dd_HH-mm-ss");
    let authHeader = 'Bearer ' + fetchToken();
    post_data.extra.headers = {'Authorization': authHeader, 'X-CustomHeader': VERSION};
    post_data.extra.excel_name = post_data.extra.excel_name + time;
    //这个blob响应类型非请求头 很重要！！！ 但是IE 360等不兼容 不能用a标签下载
  /*excelDownload(post_data, {responseType: 'blob'}).then(res => {
   this.loading = false;
   if (res.status === 0) return this.ezNotifyAxiosThen(res);
   const elink = document.createElement('a') // 创建a标签
   elink.download = this.name + time + '.xls'; // 文件名
   elink.style.display = 'none'
   elink.href = URL.createObjectURL(new Blob([res]))
   document.body.appendChild(elink);
   elink.click(); // 触发点击a标签事件
   document.body.removeChild(elink)
   }).catch(error => this.ezNotifyAxiosCatch(error));*/
    /**
     * param 将要转为URL参数字符串的对象
     * key URL参数字符串的前缀
     * encode true/false 是否进行URL编码,默认为true
     *
     * return URL参数字符串
     */
    let urlEncode = function (param, key, encode) {
        if (param == null) return '';
        let paramStr = '';
        let t = typeof (param);
        if (t == 'string' || t == 'number' || t == 'boolean') {
            paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
        } else {
            for (let i in param) {
                let k = key == null ? i : key + '[' + i + ']';
                paramStr += urlEncode(param[i], k, encode);
            }
        }
        return paramStr;
    };
    //直接新窗口打开
    window.open(
        HOST + '/v1/excelExport?' + urlEncode(post_data).slice(1),
        '_blank',
    );
}

//清除浏览器储存的token
export function ereaseTokenFromStorage() {
  //发送销毁登陆token的请求
  if (fetchToken()) {
    initAxios().post(`/v1/logout`).then(res => console.log(res));
  }
  //清除token
  delStorage(TOKEN_OBJ_ID);
  delStorage(TOKEN_REFRESH);
  delStorage(KEY_USER_INFO);
}

export function refreshUserMenuData() {
  return initAxios().post(`/v1/getMenuData`).then(res => {
    let userInfo = JSON.parse(localStorage.getItem(KEY_USER_INFO))
    userInfo.user.menuData = res.data.data.menuData
    userInfo.user.not_allowed = res.data.data.not_allowed
    localStorage.setItem(KEY_USER_INFO, JSON.stringify(userInfo));
  })
}

export function getPayList() {
    return initAxios().post('/v1/getAllPay').then(res => res.data)
}
export const updateTips = params => {
    return initAxios().post(`/v1/updateTips`, params).then(res => res.data);
};

/*export function setCookie(name, value, minuts = STORAGE_TIME) {
 if (minuts) {
 let d = new Date;
 d.setTime(d.getTime() + minuts * 60 * 1000);//固定时间
 window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
 }
 else window.document.cookie = name + "=" + value + ";path=/;";
 }
 export function getCookie(name) {
 let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
 return v ? v[2] : null;
 }
 export function delCookie(name) {
 setCookie(name, '', -1);
 }*/

//设置Storage
export function setStorage(name, value, minuts = STORAGE_TIME) {
  if (sessionStorage.getItem(name) || !minuts) {
    let time = new Date().getTime();
    sessionStorage.setItem(name, JSON.stringify({value: value, time: time}));
  }
  else {
    let time = new Date().getTime() + minuts * 60 * 1000;
    localStorage.setItem(name, JSON.stringify({value: value, time: time}));
  }
}
//获取Storage
export function getStorage(name) {
  let rs = localStorage.getItem(name);
  if (rs) {
    let obj = JSON.parse(rs);
    obj.time = obj.time - new Date().getTime();
    if (obj.time < 0) {
      delStorage(name);
      return '';
    }
    return obj.value;
  }
  let rs_session = JSON.parse(sessionStorage.getItem(name));
  return rs_session ? rs_session.value : '';
}
//获取Storage用了多长时间
export function getStorageUsedTime(name) {
  let rs = localStorage.getItem(name);
  if (rs) {
    let obj = JSON.parse(rs);
    let time = new Date().getTime() - obj.time + STORAGE_TIME * 60 * 1000;
    if (time < 0) {
      delStorage(name);
      return 0;
    }
    return time;
  }
  let rs_session = JSON.parse(sessionStorage.getItem(name));
  return rs_session ? new Date().getTime() - rs_session.time + STORAGE_TIME * 60 * 1000 : 0;
}
//清除Storage
export function delStorage(name) {
  localStorage.removeItem(name);
  sessionStorage.removeItem(name);
}

export function convertLevel(level) {
  return levelList[level] || level;
}

export const adminRoles = config.adminRoles?config.adminRoles:{
  '系统管理员': 1,
  '系统客服': 2,
  '系统风控': 3,
  '系统财务': 4,
  '系统运营': 5,
  '期权交易员': 17,
  '期权客服': 29,
};
export const agentRoles = {
  /*'代理管理员': 11,
   '代理客服': 12,
   '代理财务': 14,
   '代理运营': 15,*/
  '代理员工': 16,
};

export const levelList = {
  1: "K",
  2: "H",
  3: "T",
  4: "E",
  5: "Q"
};

export function httpStatusCodeToMessage(code) {
  const msgs = {
    400: '语义有误，当前请求无法被服务器理解,请求参数有误',
    401: '身份验证失败,请重新登录',
    429: '网络请求次数太频繁了',
    404: '请求失败，请求所希望得到的资源未被在服务器上发现',
    405: '请求行中指定的请求方法不能被用于请求相应的资源',
    412: '图像验证码错误,服务器在验证在请求的头字段中给出先决条件时，没能满足其中的一个或多个',
    500: '服务器错误',
    777: '网络错误',
  };
  let title = '';
  if (code in msgs) {
    title = code + ':' + msgs[code];
  } else {
    title = code + ':' + msgs[777];
  }
  return title;
}

export function handleError(error) {
  console.log(error.response)
  let code = 500;
  try {
    code = error.response.status;
  } catch (e) {
    console.log(e);
    code = 777;
  }

  if (code == 555) {
    Notification({
      title: '温馨提示：',
      message: error.response.data.msg,
      type: 'info',
    });
  } else {
    Notification({
      title: code,
      message: httpStatusCodeToMessage(code),
      type: 'error',
    });
  }
  if (code == 401) {
    //清除token
    delStorage(TOKEN_OBJ_ID);
    delStorage(TOKEN_REFRESH);
    delStorage(KEY_USER_INFO);
    //location.replace('/login');
  }
}
// 正确的提示框
export const successMsg = (msg) => {
    MessageBox.alert(msg, '提示', {
        'type': 'success',
        'center': true
    })
}

// 错误的提示框
export const errorMsg = (msg) => {
    MessageBox.alert(msg, '提示', {
        'type': 'error',
        'center': true
    })
}

// 加载
export const loadingOpen = (msg) => {
    return Loading.service({
        fullscreen: true,
        lock: true,
        text: msg,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

// 关闭加载
export const loadingClose = () => {
    let loadingInstance = loadingOpen()
    loadingInstance.close()
}
