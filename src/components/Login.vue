<template>
  <el-form
    @keyup.enter.native.prevent="submitForm('ruleForm')"
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-position="left"
    label-width="0px"
    class="login-container">
    <h3 class="title">后台系统登录</h3>

    <el-form-item
      prop="username">
      <el-input
        type="text"
        v-model="ruleForm.username"

        placeholder="用户名/代理编号/员工编号"></el-input>
    </el-form-item>
    <el-form-item
      prop="password">
      <el-input
        type="password"
        v-model="ruleForm.password"

        placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop="captchaCode">
      <el-input
        type="text"
        v-model="ruleForm.captchaCode"

        placeholder="请输入图像验证码"></el-input>
    </el-form-item>

    <el-checkbox
      v-model="checked"
      checked
      class="remember">
      记住密码
    </el-checkbox>
    <a @click="fetchCaptcha" class="captcha-img" v-loading="loading"><img :src="captchaSrc"></a>

    <el-form-item
      style="width:100%;">
      <el-button
        type="primary"
        style="width:100%;"
        @click.native.prevent="submitForm('ruleForm')"
        :loading="logining">
        登录
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  //http://element.eleme.io/#/zh-CN/component/alert
  import {requestLogin, createCaptcha, storeUserInfo, resetNoticeType} from '../api/user';
  import {TOKEN_OBJ_ID, TOKEN_REFRESH, fetchToken, setStorage} from '../common/tools';
  import JSEncrypt from 'jsencrypt';
  let crypt = new JSEncrypt();
  let public_key=`MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8yY4yneut770arIb+hhuwPbV4
qP75ZtfSZmEMK64pldpcGeCbp4uFaOqwXMy7cszsYnD9YnMJLN82zt2ttOU9APcC
HWS1Qi72AkxnyROTIICYU0oi+I+5elogPgkOxKyi2bWb6pR9IkDR3EYmYear0biw
D0DJ3ztdzWa+W1IbOQIDAQAB`;
  crypt.setKey(public_key);
  /*const CLIENT_SECRET = 'ONjIiDAupLsvWRgLc69guRIPv49RdWbFN44CKRiE';
  const CLIENT_ID = 6;*/
  const GRANT_TYPE = 'password';
  const SCOPE = '';
  export default {
    data() {
      return {
        logining: false,
        loading: false,
        checked: true,
        captchaSrc: '',
        ruleForm: {
          grant_type: GRANT_TYPE,
          /*client_id: CLIENT_ID,
           client_secret: CLIENT_SECRET,*/
          scope: SCOPE,
          username: '',//电话号码
          password: '', //密码
          captchaId: '',//验证码的唯一id
          captchaCode: '',//图像验证码的字符
        },
        //https://github.com/yiminghe/async-validator
        rules: {
          username: [
            {
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
//            {
//              type: 'string',
//              pattern: /^[*|#]{0,1}1[3|4|5|6|7|8|9][0-9]\d{4,8}$/,
//              message: '请输入正确手机号码',
//              trigger: 'blur'
//            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              message: '密码最短6位',
              trigger: 'blur'
            }
          ],
          captchaCode: [
            {
              required: true,
              message: '请输入图像验证码',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /^\d{5}$/,
              message: '请输入5位数的数字',
              trigger: 'blur'
            }
          ]
        },
      };
    },
    methods: {
      submitForm(formName) {
        //https://cn.vuejs.org/v2/guide/components.html#子组件索引
        this.$refs[formName].validate(valid => {
          if (valid) {
            let form = Object.assign({},this.ruleForm);
            form.password = crypt.encrypt(this.ruleForm.password);
            requestLogin(form).then(res => {
              if (res.msg) {
                this.$notify({
                  title: '验证码错误',
                  message: '请重新输入验证码',
                  type: 'error'
                });
                this.fetchCaptcha();
              } else {
                if (this.checked) {
                  setStorage(TOKEN_OBJ_ID, res.access_token);
                  setStorage(TOKEN_REFRESH, res.refresh_token);
                } else {
                  setStorage(TOKEN_OBJ_ID, res.access_token, 0);
                  setStorage(TOKEN_REFRESH, res.refresh_token, 0);
                }
                storeUserInfo().then(res => {
                  if(res.feeIsEnough !== undefined){
                    this.$notify({title:"提示", message:res.feeIsEnough, type:"warning"});
                  }
                  if(res.user.notice_pwd_chg !== undefined){
                    this.$notify({title:"提示", message:res.user.notice_pwd_chg, type:"warning"});
                    resetNoticeType({notice_type: 1}).then(() => {
                    })
                  }
                  this.userInfo = res.user;
                  this.$router.push({path: '/'});
                }).catch(error => this.ezNotifyAxiosCatch(error));
              }
            }).catch(error => {
              this.fetchCaptcha();
              this.ezNotifyAxiosCatch(error);
            })
          }
        });
      },
      //获取验证码  点击验证码刷新的时候 调用这个方法
      fetchCaptcha() {
        //this.$bus.$emit('refresh_user_info');
        let uniqueId = new Date().valueOf();
        this.loading = true;
        createCaptcha({captchaId: uniqueId}).then(res => {
          this.loading = false;
          this.captchaSrc = res.data;
          if (res.status === 0) return this.ezNotifyAxiosThen(res);
          this.ruleForm.captchaId = uniqueId;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    },
    //获取图形码
    created() {
      this.fetchCaptcha();
      //自动登陆
      if (this.$route.query.access_token) {
        setStorage(TOKEN_OBJ_ID, this.$route.query.access_token);
        storeUserInfo().then(res => {
          this.$router.push({path: '/'});
        }).catch(error => this.ezNotifyAxiosCatch(error));
      }
    }
  }

</script>

<style scoped>

  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 70px auto auto auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;

  }

  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .remember {
    margin: 0px 0px 35px 0px;
  }

  .captcha-img {
    position: relative;
    float: right;
    width: 150px;
    height: 40px;
  }

  .captcha-img:hover {
    cursor: pointer;
  }

</style>
