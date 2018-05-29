<template>

  <section v-loading.body="loading" style="padding: 10px;margin-top: 5px">
    <h2 class="qr-text"><span class="fa fa-gear"></span>我的推广码</h2>
    <h3 class="qr-text">PC端推广链接:{{pc}}</h3>
    <h3 class="qr-text">移动端推广链接:{{mobile}}</h3>
    <qrcode :value="mobile" :options="{ size: 120 }"></qrcode>
    <h4 class="qr-text">推广码:{{code}}</h4>
  </section>
</template>

<script>
  import {getRecommendCode} from '../../api/agent';
  import VueQrcode from '@xkeshi/vue-qrcode';
  export default {
    components: {qrcode: VueQrcode},
    data() {
      return {
        pc: '',
        mobile: '',
        code: '',
        loading: true,
        downloadButton: true,
      }
    },
    created() {
      this.getRecommendCodeInfo()
    },
    methods: {
      getRecommendCodeInfo() {
        this.loading = true;
        getRecommendCode(null).then((res) => {
          this.pc = res.data.web_host;
          this.mobile = res.data.mobile_host;
          this.code = res.data.code;
          this.loading = false;
        }).catch(error => this.ezNotifyAxiosCatch(error))
      }
    },

  }


</script>

<style scope>
  .qr-text {
    font-size: 12px;
    line-height: 30px;
  }
</style>
