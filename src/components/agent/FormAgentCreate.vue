<template>
  <el-form :model="form"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="formRule"
           ref="agentForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item
      label="所属代理(支持搜索)"
      style="text-align: left!important;"
      prop="parent_id">
      <el-select
        style="width:360px"
        @change="selectorChangeParentAgent"
        v-model.number="form.parent_id"
        clearable
        filterable
        remote
        ref="select"
        :remote-method="searchAgent"
        :loading="loading"
        placeholder="搜索ID/名称/手机号(仅显示最匹配的10条)">
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.label"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="代理编号(登录账号)" required prop="name">
      <el-input v-model.string="form.name"></el-input>
    </el-form-item>

    <el-form-item label="登录密码" required prop="password">
      <el-input v-model="form.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="重复密码" required prop="confirm_password">
      <el-input v-model="form.confirm_password" type="password"></el-input>
    </el-form-item>

    <el-form-item label="代理名称" required prop="agent_name">
      <el-input v-model="form.agent_name"></el-input>
    </el-form-item>
    <el-form-item label="联系姓名" required prop="owner_name">
      <el-input v-model="form.owner_name"></el-input>
    </el-form-item>

    <el-form-item label="联系电话" required prop="phone">
      <el-input v-model="form.phone"></el-input>
    </el-form-item>

    <el-form-item label="银行户名" v-if="role_group=='System'">
      <el-input v-model="form.bank_account_name"></el-input>
    </el-form-item>
    <el-form-item label="开户银行" prop="bank_name" v-if="role_group=='System'">
      <!--<el-input v-model="form.bank_name"></el-input>-->
      <el-select v-model="form.bank_name" placeholder="请选择类型" filterable clearable>
        <el-option v-for="(item,idx) in bankCardOptions" :label="item.bankName" :value="item.bankName" :key="item.idx"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开户支行" v-if="role_group=='System'">
      <el-input v-model="form.bank_branch" placeholder="格式：XX省XX市XX支行"></el-input>
    </el-form-item>
    <el-form-item label="提现账号" prop="bank_account" v-if="role_group=='System'">
      <el-input v-model="form.bank_account"></el-input>
    </el-form-item>


    <el-form-item
      v-if="role_group=='System'"
      required
      label="默认资金池"
      prop="capital_id">
      <el-select
        style="width:360px"
        v-model.number="form.capital_id"
        placeholder="请选择默认资金池">
        <el-option
          v-for="item in poolList"
          :key="item.id"
          :label="item.capital_name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>


    <!--<el-form-item label="天配递延费提成" required prop="day_percentage">-->
      <!--<el-input v-model.number="form.day_percentage"></el-input>-->
    <!--</el-form-item>-->

    <!--<el-form-item label="月配提成比例" required prop="month_percentage">-->
      <!--<el-input v-model.number="form.month_percentage"></el-input>-->
    <!--</el-form-item>-->

    <el-form-item label="开仓费" required prop="service_charge">
      <el-input v-model.number="form.service_charge"></el-input>
    </el-form-item>

    <el-form-item label="备注" prop="remark">
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="form.remark">
      </el-input>
    </el-form-item>

    <el-form-item label="配置选项" v-if="role=='SystemAdmin'">
      <el-checkbox v-if="role_group=='System' && (domain=='gubao68.com' || domain=='localhost')" v-model="form.is_independent" label="贴牌代理商" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox v-if="role_group=='System'" v-model="form.is_forbid_cash" label="禁止提现" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox v-if="role_group=='System'" v-model="form.is_lock_agent_cust" label="锁定代理商客户" :true-label="1" :false-label="0"></el-checkbox>
      <el-checkbox v-model="form.is_locked" label="禁用" :true-label=1 :false-label=0></el-checkbox>
    </el-form-item>

    <el-form-item label="计算利息成本方式" v-if="parent_agent_level==1" prop="interest_cost_type">
      <el-radio v-model="form.interest_cost_type" label=1>峰值计算</el-radio>
      <el-radio v-model="form.interest_cost_type" label=2>即时计算</el-radio>
      <span style="color:red">(请慎重选择计息方式,创建后每月只能修改一次且修改后次月才能生效)</span>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 @click.native.prevent="onSubmit">
        立即创建
      </el-button>
      <el-button @click.native.prevent="refresh=false;$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import {agentSelectorList, agentCreate, getAgentCapitalPoolListWithInfo, getAgentInfo} from '../../api/agent';
  import {convertLevel} from '../../common/tools';
  import {bankCardOptions} from '../../common/constData'

  export default {
    data() {
      let passwordConfirmCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let checkBankAccount = (rule, value, callback) => {
        if (value) {
          let reg = /^\d{15,19}$/;
          if (!reg.test(value)) {
            callback(new Error('请输入纯数字15~19位银行卡号'));
          }
        }
        callback();
      };
      return {
        parent_agent_level: '',
        refresh: true,
        bankCardOptions,
        poolList: [],
        selectorListData: [],
        loading: false,
        //代理商基本信息
        form: {
          parent_id: '',
          name: (Math.floor(Math.random() * 999999) + 1000000).toString(),
          capital_id: null,
          is_forbid_cash: 0,
          is_lock_agent_cust: 0,
          bank_name: '',
          bank_account: null,
          is_locked: 0,
          is_independent: 0,
          agent_name: '',
          owner_name: '',
          phone: '',
          password: '',
          confirm_password: '',
          day_percentage: '',
          month_percentage: '',
          commission_percentage: '',
          service_charge: '',
          remark: '',
          interest_cost_type: '',
        },
        formRule: {
          //TODO:blur 提示失败,升级到高版本的element-ui 可以解决,只能提交的时候 提示
          parent_id: [
            {required: true, message: '请选择代理商', trigger: 'blur', type: 'number'}
          ],
          name: [
            {
              required: true,
              message: '登陆用户名/代理商编号必须为6~12位数字',
              min: 6,
              max: 12,
              trigger: 'blur'
            },
          ],
          capital_id: [
            {
              required: true,
              message: '请选择默认资金池',
            },
          ],
          agent_name: [
            {
              required: true,
              message: '请填写代理商名称2~20个字符',
              min: 2,
              max: 20,
              trigger: 'blur'
            },
          ],
          owner_name: [
            {
              required: true,
              message: '经理姓名2~6个字符',
              trigger: 'blur'
            },
            {min: 2, max: 20, message: '姓名长度2~20个字符', trigger: 'blur'}

          ],
          phone: [
            {
              required: true,
              message: '手机号码是必填',
              trigger: 'blur'
            },
            {
              type: 'string',
              pattern: /^[*|#]{0,1}1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '请输入正确手机号码',
              trigger: 'blur'
            }
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '密码最短6位,最长20位',
              trigger: 'blur'
            }
          ],
          confirm_password: [
            {validator: passwordConfirmCheck, trigger: 'blur'}
          ],
          bank_account: [
            {
              validator: checkBankAccount,
              trigger: 'blur'
            }
          ],
          interest_cost_type: [
            {required: true, message: '请选择利息成本计算方式', trigger: 'blur'}
          ],
          bank_name: [
            {
              //required: true,
              message: '请输入提现银行卡开户行名称',
              trigger: 'blur'
            },
            {min: 3, max: 20, message: '长度在 3 到 20个字符', trigger: 'blur'}
          ],
          day_percentage: [
            {
              min: 0,
              max: 1,
              type: 'number',
              message: '比例在0~1之间',
              trigger: 'blur'
            }
          ],
          month_percentage: [
            {
              min: 0,
              max: 1,
              type: 'number',
              message: '比例在0~1之间',
              trigger: 'blur'
            }
          ],
          service_charge: [
            {
              min: 0,
              type: 'number',
              message: '大于0的整数',
              trigger: 'blur'
            }
          ],
        }
      }
    },
    created() {
      this.fetchAgentListData();
      this.fetchCapitalPoolsList();
    },
    beforeRouteLeave(to, from, next) {
      to.meta.refresh = this.refresh;
      next();
    },
    methods: {
      searchAgent(query) {
        if (!query || query == this.form.parent_id) return;
        let agent_id = query.toString();
        if (this.form.parent_id && agent_id.substr(0, agent_id.indexOf('-')) == this.form.parent_id) return;//如果正好是现在选择的值 则return
        this.search_agent = query;
        let check = () => {
          if (!this.search_agent || query != this.search_agent) return;
          agentSelectorList({search: query}).then(res => {
            this.selectorListData = res.data;
          }).catch(error => this.ezNotifyAxiosCatch(error));
        };
        setTimeout(check, 500);
      },
      fetchAgentListData() {
        agentSelectorList({parent_id: this.$route.query.parentId}).then((res) => {
          this.selectorListData = res.data;
          this.parent_agent_level = res.data[0]['agent_level']
          let id = this.$route.query.parentId ? this.$route.query.parentId : res.data[0].id;
          this.form.parent_id = Number(id);
        });
      },
      fetchCapitalPoolsList() {
        getAgentCapitalPoolListWithInfo().then(res => {
          this.poolList = res.data.list;
          this.form.capital_id = res.data.parent_agent_capital_id
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      onSubmit() {
          this.loading = true;

        this.$refs.agentForm.validate((valid) => {
          if (valid) {
            agentCreate(this.form).then((res) => {
              this.loading = false;
              this.ezNotifyAxiosThen(res);
              if (res.status > 0) {
                this.$router.push({path: '/agent'});
              }
            }).catch(error => this.ezNotifyAxiosCatch(error))
          }
        });
      },
      selectorChangeParentAgent(newValue) {
        let select = this.selectorListData.find((value, index, arr) => {
          return value.id == newValue;
        });
        if(select == undefined) return
        this.parent_agent_level = select.agent_level;
        this.selectorListData.forEach(item => {
          if (item.id === newValue) {
            this.form.capital_id = item.capital_id;
          }
        });
      },
    },
    computed: {
      options: function () {
        return this.selectorListData.map(value => {
          let rObj = {};
          rObj.id = value.id;
          rObj.label = value.id + `-『${convertLevel(value.agent_level)}级』${value.agent_name}`;
          return rObj;
        });
      }
    }
  }
</script>

<style scoped>


</style>
