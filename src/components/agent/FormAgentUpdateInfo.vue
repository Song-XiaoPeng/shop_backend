<template>

  <el-form :model="info"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="infoRules"
           ref="infoForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item label="代理平台名称" required prop="platform_name">
      <el-input v-model="info.platform_name"></el-input>
    </el-form-item>

    <el-form-item label="代理平台备注" prop="remark">
      <el-input v-model="info.remark"></el-input>
    </el-form-item>

    <el-form-item label="省份" prop="province">
      <el-input v-model="info.province"></el-input>
    </el-form-item>
    <el-form-item label="城市" prop="city">
      <el-input v-model="info.city"></el-input>
    </el-form-item>
    <el-form-item label="地址" prop="address">
      <el-input v-model="info.address"></el-input>
    </el-form-item>

    <el-form-item label="服务时间" prop="service_time">
      <el-input v-model="info.service_time"></el-input>
    </el-form-item>
    <el-form-item label="客服电话" prop="service_phone">
      <el-input v-model="info.service_phone"></el-input>
    </el-form-item>
    <el-form-item label="客服邮箱" prop="service_email">
      <el-input v-model="info.service_email" type="email" placeholder="mylord@qq.com"></el-input>
    </el-form-item>
    <el-form-item label="客服QQ" prop="service_qq">
      <el-input v-model="info.service_qq"></el-input>
    </el-form-item>
    <el-form-item label="客服QQ群" prop="qq_group">
      <el-input v-model="info.qq_group"></el-input>
    </el-form-item>
    <el-form-item label="PC端域名" prop="web_domain">
      <el-input v-model="info.web_domain" placeholder="www.bing.com"></el-input>
    </el-form-item>
    <el-form-item label="移动端域名" prop="mobile_domain">
      <el-input v-model="info.mobile_domain" placeholder="m.bing.com"></el-input>
    </el-form-item>
    <el-form-item label="首页标题" prop="seo_title">
      <el-input v-model="info.seo_title"></el-input>
    </el-form-item>

    <el-form-item label="首页描述" prop="seo_description">
      <el-input v-model="info.seo_description"></el-input>
    </el-form-item>
    <el-form-item label="首页关键字" prop="seo_keyword">
      <el-input v-model="info.seo_keyword"></el-input>
    </el-form-item>
    <el-form-item label="网站备案号" prop="website_record_no">
      <el-input v-model="info.website_record_no"></el-input>
    </el-form-item>

    <el-form-item label="版权信息" prop="copyright">
      <el-input v-model="info.copyright"></el-input>
    </el-form-item>
    <el-form-item label="微信公众号appid" prop="appid">
      <el-input v-model="info.appid"></el-input>
    </el-form-item>
    <el-form-item label="公众号秘钥" prop="public_key">
      <el-input v-model="info.public_key"></el-input>
    </el-form-item>
    <el-form-item label="是否生成公众号菜单">
      <el-switch
        :width="60"
        v-model="is_make_wechat_menu"
      >
      </el-switch>
    </el-form-item>

    <el-form-item label="公众微信号二维码" prop="public_qr">
      <el-input v-model="info.public_qr" placeholder=""></el-input>
      <br>
      <el-upload
        class="upload-demo"
        :action="fileUploadUrl"
        :on-success="uploadSuccessPublicQr"
        :show-file-list="false"
        multiple
        :limit="3"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="客服微信二维码" prop="cust_qr">
      <el-input v-model="info.cust_qr" placeholder=""></el-input>
      <br>
      <el-upload
        class="upload-demo"
        :action="fileUploadUrl"
        :on-success="uploadSuccessCustQr"
        :show-file-list="false"
        multiple
        :limit="3"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="微信公众号名称" prop="public_number_name">
      <el-input v-model="info.public_number_name"></el-input>
    </el-form-item>

    <el-form-item label="短信平台类型" prop="sms_captcha_template_id">
      <el-select v-model="info.sms_captcha_template_id" placeholder="请选择(不选默认飞鸽)" clearable>
        <el-option
            v-for="item in sms_type_list"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="短信平台账号" prop="sms_account">
      <el-input v-model="info.sms_account"></el-input>
    </el-form-item>
    <el-form-item label="短信平台密码" prop="sms_pwd">
      <el-input v-model="info.sms_pwd"></el-input>
    </el-form-item>

    <el-form-item label="短信平台签名ID" prop="sms_sign_id">
      <el-input v-model.number="info.sms_sign_id"></el-input>
    </el-form-item>

    <el-form-item label="配资合同甲方姓名" prop="contract_name">
      <el-input v-model="info.contract_name"></el-input>
    </el-form-item>

    <el-form-item label="配资合同甲方身份证号码" prop="contract_identity">
      <el-input v-model="info.contract_identity"></el-input>
    </el-form-item>

    <el-form-item label="配资合同丙方公司名称" prop="contract_company_name">
      <el-input v-model="info.contract_company_name"></el-input>
    </el-form-item>

    <el-form-item label="后台管理logo" prop="admin_platform_logo">
      <el-input v-model="info.admin_platform_logo" placeholder=""></el-input>
      <br>
      <el-upload
        class="upload-demo"
        :action="fileUploadUrl"
        :on-success="uploadSuccess"
        :show-file-list="false"
        multiple
        :limit="3"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </el-form-item>

    <el-form-item label="银行账号（客户充值）" prop="recharge_bank_account">
      <el-input v-model="info.recharge_bank_account"></el-input>
    </el-form-item>

    <el-form-item label="账户名称（客户充值）" prop="recharge_real_name">
      <el-input v-model="info.recharge_real_name"></el-input>
    </el-form-item>

    <el-form-item label="开户银行（客户充值）" prop="recharge_bank_name">
      <el-input v-model="info.recharge_bank_name"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 :loading="loading"
                 @click.native.prevent="submitInfoForm">
        更新附加信息
      </el-button>
      <el-button @click.native.prevent="$emit('changeRefresh',false);$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>


</template>

<script>
  import {agentUpdateInfo} from '../../api/agent';
  import {HOST} from '../../common/tools';

  export default {

    data() {
      return {
        is_make_wechat_menu: false,
        fileUploadUrl: HOST + "/v1/uploadPic",
        loading: false,
        orig_info: {},
        //登陆账号密码
        sms_type_list:[{value: 1, label: '飞鸽短信平台'}, {value: 2, label: '台湾迅航科技短信平台'}],
        infoRules: {
          platform_name: [
            {required: true, message: '平台名称1~20个字', trigger: 'blur', min: 1, max: 20}
          ],
          province: [
            {message: '请填写省份名称', trigger: 'blur'}
          ],
          city: [
            {message: '请填写城市名称', trigger: 'blur'}
          ],
          address: [
            {message: '请填写区县街道详细地址', trigger: 'blur'}
          ],
          service_time: [
            {message: '请填写服务时间段', trigger: 'blur', max: 128}
          ],
          service_phone: [
            {message: '客服电话号码5~20个字', trigger: 'blur', min: 5, max: 20}
          ],
          service_email: [
            {message: '请填写客服邮箱', trigger: 'blur', type: 'email'}
          ],
          service_qq: [
            {message: '请填写QQ号码5~20个字', trigger: 'blur', min: 5, max: 20}
          ],
          qq_group: [
            {message: '请填写QQ群号5~50个字', trigger: 'blur', min: 5, max: 50}
          ],
          web_domain: [
            {message: '请填写合法的域名', trigger: 'blur'}
          ],
          mobile_domain: [
            {message: '请填写合法的域名', trigger: 'blur'},
          ],
          seo_title: [
            {message: '请填写SEO标题', trigger: 'blur',}
          ],
          seo_description: [
            {message: '请填写SEO描述', trigger: 'blur'}
          ],
          seo_keyword: [
            {message: '请填写SEO关键字,以逗号分隔', trigger: 'blur'}
          ],
          website_record_no: [
            {message: '前填写网站备案号', trigger: 'blur', max: 50}
          ],
          copyright: [
            {message: '请填写版权信息', trigger: 'blur', max: 100}
          ],
          cust_qr: [
            {message: '请填写客服微信二维码', trigger: 'blur', max: 100}
          ],
          appid: [
            {message: '请填写微信公众号appID', trigger: 'blur', max: 20}
          ],
          public_key: [
            {message: '请填写微信公众号秘钥', trigger: 'blur', max: 100}
          ],
          public_qr: [
            {message: '请填写微信公众号二维码', trigger: 'blur', max: 100}
          ],
          public_number_name: [
            {message: '请填写微信公众号名称', trigger: 'blur', max: 50}
          ],
          sms_account: [
            {message: '短信平台账号', trigger: 'blur'}
          ],
          sms_pwd: [
            {message: '短信平台密码', trigger: 'blur'}
          ],
          sms_sign_id: [
            {message: '短信平台签名ID', trigger: 'blur', type: 'number'}
          ],
          remark: [
            {message: '备注0~255字符', trigger: 'blur', max: 255}
          ],
        }
      }
    },
    computed: {
      info() {
        try {
          return this.rawInfo;
        } catch (e) {
          return {
            id: 0,
            platform_name: '',
            web_domain: '',
            mobile_domain: '',
            province: '',
            city: '',
            address: '',
            service_time: '',
            service_phone: '',
            service_email: '',
            service_qq: '',
            qq_group: '',
            website_record_no: '',
            copyright: '',
            seo_title: '',
            seo_description: '',
            seo_keyword: '',
            cust_qr: '',
            appid: '',
            public_key: '',
            public_qr: '',
            public_number_name: '',
            remark: '',
            sms_captcha_template_id: '',
            sms_account: '',
            sms_pwd: '',
            sms_sign_id: '',
            contract_name: '',
            contract_identity: '',
            admin_platform_logo: '',
            recharge_bank_account: '',
            recharge_real_name: '',
            recharge_bank_name: ''
          };
        }
      },
    },


    methods: {
      submitInfoForm() {
        this.info.id = this.agent_id;
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            let data = this.info
            data.is_make_wechat_menu = this.is_make_wechat_menu
            this.loading = true;
            agentUpdateInfo(data).then(res => {
              //this.info = res.data;
              this.loading = false;
              this.ezNotifyAxiosThen(res);
              if (res.status > 0) {
                this.$router.go(-1);
              }
            }).catch(error => this.ezNotifyAxiosCatch(error))
          }
        });
      },
      uploadSuccess(res, file) {
        this.ezNotifyAxiosThen(res);
        if (res.status == 1) {
          this.info.admin_platform_logo = res.data.url
        }
        console.log(res)
      },
      uploadSuccessPublicQr(res, file){
        this.ezNotifyAxiosThen(res);
        if (res.status == 1) {
          this.info.public_qr = res.data.url
        }
        console.log(res, this.info.public_qr)
      },
      uploadSuccessCustQr(res, file) {
        this.ezNotifyAxiosThen(res);
        if (res.status == 1) {
          this.info.cust_qr = res.data.url
        }
        console.log(res)
      }
    },
    props: ['agent_id', 'rawInfo']
  }

</script>


