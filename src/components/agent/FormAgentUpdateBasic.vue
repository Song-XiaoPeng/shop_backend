<template>
  <el-form :model="basic"
           label-width="180px"
           @submit.prevent="onSubmit"
           :rules="basicRules"
           ref="basicForm"
           style="margin:20px;width:60%;min-width:600px;">

    <el-form-item label="父级代理商名称">
      <el-input v-model.number="parent_agent_name" disabled></el-input>
    </el-form-item>

    <el-form-item
      v-if="role=='SystemAdmin'"
      required
      label="默认资金池"
      prop="capital_id">
      <el-select
        style="width:360px"
        v-model.number="basic.capital_id"
        placeholder="请选择默认资金池">
        <el-option
          v-for="item in poolList"
          :key="item.id"
          :label="item.capital_name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>


    <el-form-item label="代理商名称" required prop="agent_name">
      <el-input v-model="basic.agent_name"></el-input>
    </el-form-item>
    <el-form-item label="联系人" required prop="owner_name">
      <el-input v-model="basic.owner_name"></el-input>
    </el-form-item>

    <el-form-item label="银行户名" v-if="role_group=='System'">
      <el-input v-model="basic.bank_account_name"></el-input>
    </el-form-item>
    <el-form-item label="开户银行"
                  v-if="role_group=='System'"
                  prop="bank_name">
      <!--<el-input v-model="basic.bank_name"></el-input>-->
      <el-select v-model="basic.bank_name" placeholder="请选择类型" filterable clearable>
        <el-option v-for="item in bankCardOptions" :label="item.bankName" :value="item.bankName" :key="item.bankCode"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="开户支行" v-if="role_group=='System'">
      <el-input v-model="basic.bank_branch" placeholder="格式：XX省XX市XX支行"></el-input>
    </el-form-item>
    <el-form-item label="提现账号"
                  v-if="role_group=='System'"
                  prop="bank_account">
      <el-input v-model="basic.bank_account"></el-input>
    </el-form-item>
    <el-form-item label="联系人手机号码" required prop="phone">
      <el-input v-model="basic.phone"></el-input>
    </el-form-item>

    <el-form-item label="备注">

      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="basic.remark">
      </el-input>

    </el-form-item>
    <el-form-item label="配置选项">
      <el-checkbox v-model="basic.is_independent"
                   label="贴牌代理商"
                   :true-label="1"
                   :false-label="0"
                   v-if="role_group=='System' && domain=='gubao68.com'">
      </el-checkbox>
      <el-checkbox v-model="basic.is_forbid_cash"
                   v-if="role_group=='System'"
                   label="禁止提现"
                   :true-label="1"
                   :false-label="0">
      </el-checkbox>
      <el-checkbox v-model="basic.is_lock_agent_cust"
                   v-if="role_group=='System'"
                   label="锁定代理商客户" :true-label="1" :false-label="0">
      </el-checkbox>
      <el-checkbox v-model="basic.is_locked" label="禁用" :true-label=1 :false-label=0></el-checkbox>
    </el-form-item>

    <el-form-item label='计算利息成本方式' v-if="basic.agent_level==2">
      <el-radio v-model="basic.interest_cost_type" :label=1 :disabled="basic.cost_type_changed">峰值计算</el-radio>
      <el-radio v-model="basic.interest_cost_type" :label=2 :disabled="basic.cost_type_changed">即时计算</el-radio>
      <span v-if="!basic.cost_type_changed" style="color:red">&nbsp&nbsp&nbsp&nbsp注意:(此项一个月仅能修改一次!)</span>
      <span v-else style="color:red">&nbsp&nbsp&nbsp&nbsp注意:(此项此月已修改过! {{basic.interest_cost_type_effective_date}} 生效!)</span>
    </el-form-item>

    <el-form-item label="期权业务" v-if="basic.agent_level==2">
      <el-switch :width="60"
                 @change="switchChange()"
                 v-model="basic.is_option_open">
      </el-switch>
      <span style="color:red">(选择关，您的直客与代理商均无期权业务权限)</span>
    </el-form-item>

    <el-form-item label="直客期权">
      <el-switch :width="60"
                 @change="switchChange1()"
                 :disabled="basic.agent_level==1 ? false: !basic.is_option_open"
                 v-model="basic.is_option_open_trading">
      </el-switch>
      <span style="color:red" v-if="basic.agent_level!=5">(选择关，您的直客无期权业务权限，不影响代理商)</span>
      <span style="color:red" v-if="basic.agent_level==5">(选择关，您的直客无期权业务权限)</span>
    </el-form-item>

    <el-form-item>
      <el-button type="primary"
                 :loading="loading"
                 @click.native.prevent="submitBasicForm">
        修改基本信息
      </el-button>
      <el-button @click.native.prevent="$emit('changeRefresh',false);$router.go(-1)">返回</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

  import {agentChangeBasicInfo, getAgentCapitalPoolListWithInfo} from '../../api/agent';
  import {bankCardOptions} from '../../common/constData'

  export default {
    data() {
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
        bankCardOptions,
        poolList: [],
        loading: false,
        basicRules: {
          //TODO:blur 提示失败,升级到高版本的element-ui 可以解决,只能提交的时候 提示
          parent_id: [
            {required: true, message: '请选择活上级代理商', trigger: 'blur', type: 'number'},
          ],
          agent_name: [
            {
              required: true,
              min: 2,
              max: 20,
              message: '请填写代理商名称2~20字符',
              trigger: 'blur',
            },
          ],
          owner_name: [
            {
              required: true,
              min: 2,
              max: 8,
              message: '必填经理姓名2~8字符',
              trigger: 'blur',
            },
          ],
          phone: [
            {
              required: true,
              pattern: /^[*|#]{0,1}1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: '(必填)请输入正确手机号码',
              trigger: 'blur',
            },
          ],

          bank_account: [
            {
              validator: checkBankAccount,
              trigger: 'blur'
            }
          ],
          bank_name: [
            {
              min: 3,
              max: 20,
              message: '请输入提现银行卡账号,长度在 3 到 20个字符',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    computed: {
      basic: function () {
        let basic = this.infoData.basic;
        if (!basic) {
          basic = {
            agent_level: '',
            id: 0,
            parent_id: null,
            is_forbid_cash: 0,
            is_lock_agent_cust: 0,
            is_option_open: 0,
            is_option_open_trading:0,
            bank_name: '',
            agent_number: null,
            bank_account: null,
            is_locked: 0,
            is_independent: 1,
            name: '',
            capital_id: null,
            owner_name: '',
            phone: '',
            password: '',
            confirm_password: '',
            remark: '',
            interest_cost_type: '',
            cost_type_changed: false,
          };
        }
        basic.is_option_open = Boolean(basic.is_option_open);
        basic.is_option_open_trading = Boolean(basic.is_option_open_trading);
        return basic;
      },
      parent_agent_name: function () {
        try {
          return this.infoData.parent.agent_name;
        } catch (e) {
          return '无父级代理商';
        }
      },
    },

    methods: {
      fetchCapitalPoolsList() {
        getAgentCapitalPoolListWithInfo().then(res => {
          this.poolList = res.data.list;
        }).catch(error => this.ezNotifyAxiosCatch(error));
      },
      submitBasicForm() {
        this.$refs.basicForm.validate((valid) => {
          if (valid) {
            this.loading = true;
            agentChangeBasicInfo(this.basic).then(res => {
              this.loading = false;
              this.ezNotifyAxiosThen(res);
              //向父组件发送数据  更新显示附加信息tab
              this.$bus.$emit('refresh-agent-info-update', {basic: this.basic});
              if (res.status > 0) {
                this.$router.go(-1);
              }
            }).catch(error => this.ezNotifyAxiosCatch(error));
          }
        });
      },
        switchChange() {
            if (!Boolean(this.basic.is_option_open)) {
                this.basic.is_option_open_trading = false
            }
        },
        switchChange1() {
            if (Boolean(this.basic.is_option_open_trading)) {
                this.basic.is_option_open = true
            }
        }
    },
    created() {
      this.fetchCapitalPoolsList();
    },
    props: ['agent_id', 'infoData'],
  };


</script>

