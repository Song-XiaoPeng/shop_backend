import {httpStatusCodeToMessage, URLDOMAIN} from "./tools";

export default {
  install(Vue, options) {
    Vue.prototype.domain = URLDOMAIN;
    Vue.prototype.ezNotifyAxiosThen = function (resBody) {
      let type = 'warning';
      let title = '提示';
      let message = '';
      if (typeof(resBody.code) != 'undefined') {
        type = resBody.code > 0 ? 'success' : 'warning';
        title = resBody.code > 0 ? '成功' : '提示';
        message = resBody.code > 0 ? '' : resBody.msg;
      }
      if (typeof(resBody.status) != 'undefined') {
        type = resBody.status > 0 ? 'success' : 'warning';
        title = resBody.status > 0 ? '成功' : '提示';
        message = resBody.code > 0 ? '' : resBody.msg;
      }
      this.$notify({title, message, type});
    };
    Vue.prototype.ezNotifyAxiosCatch = function (error) {
      this.loading = false;
      console.log(error.response);
      return;
      let code = 500;
      try {
        code = error.response.status;
      } catch (e) {
        console.log(e);
        code = 777;
      }
      this.$notify({
        title: code,
        message: httpStatusCodeToMessage(code),
        type: 'error',
      });
    };
    Vue.filter('round', function (value, param) {
      value = Number(value);
      return value ? value.toFixed(param) : 0;
      /*value = Number(value);
       if(!value) return 0;
       value = value.toFixed(3);
       return value.substring(0,value.lastIndexOf('.')+3);*/
    });
    Vue.prototype.plusZero = function (s) {
      return s < 10 ? '0' + s : s;
    };
  },
};
