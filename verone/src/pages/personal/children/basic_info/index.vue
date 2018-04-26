<template>
    <div class="content">
      <p class="title">基本信息</p>
      <hr color="#EEEEEE"/>
      <div v-if="show">
      <ul class="userinfo">
        <li class="userinfo_item">
          <span class="item_txt">账号信息：</span>
          <span class="item_txt2">{{userName}}</span>
        </li>
        <li class="userinfo_item">
          <span class="item_txt">手机号码：</span>
          <span class="item_txt2">已验证</span>
        </li>
        <li class="userinfo_item">
          <span class="item_txt">身份验证：</span>
          <span v-if="kycStatus == 0" @click="proveNo" class="item_txt2 blue">未验证</span>
          <span v-if="kycStatus == -1" @click="proveNo" class="item_txt2 blue">认证失败</span>
          <span v-if="kycStatus == 1" @click="proveNo" class="item_txt2 blue">待审核</span>
          <span v-if="kycStatus == 2" class="item_txt2">已认证</span>
        </li>
        <li class="userinfo_item">
          <span class="item_txt">邮箱：</span>
          <span v-if="emailAuth == 0" @click="emailNo" class="item_txt2 blue">未验证</span>
          <span v-if="emailAuth == -1" @click="emailNo" class="item_txt2 blue">验证失败</span>
          <span v-if="emailAuth == 1" class="item_txt2">已验证</span>
        </li>
      </ul>
      </div>
    </div>
</template>
<script>
  import {httpGet, httpPost, getCookie} from '../../../../utils'
  //mport {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        show:false,
        userName: '',//账号信息
        emailAuth: '',//邮箱认证状态
        kycStatus: '',//身份认证状态
        bankAuth: '',//银行卡认证状态

        userInfo: {}, //用户状态
        hasLogin: false, //登录状态
      }
    },
    mounted() {
      this.getUesrInfo();
      this.checkUserStatus();
    },
    computed: {
      //...mapState(['hasLogin','userInfo'])
    },
    watch:{
      userName:function () {
    this.show=true;
  }
    },
    methods: {
      getUesrInfo () {
          let initInfo = getCookie('userInfo');
          if (initInfo) {
              this.userInfo = JSON.parse(initInfo)
              this.hasLogin = true
          }
      },
      //身份未验证 点击跳转身份验证页
      proveNo() {
        this.$router.push('/my/user_profiles')
      },
      //邮箱未验证 点击跳转 邮箱验证页
      emailNo() {
        this.$router.push('/my/user_security')
      },
      //认证前先获取 用户验证情况
      checkUserStatus() {
        var that = this;
        httpGet('/api/users',{

        },function (res) {
          if(res.data.error_code == 0) {
            that.userName = res.data.username;
            that.emailAuth = res.data.email_auth;
            that.bankAuth = res.data.bank_card_auth;
            that.kycStatus = res.data.kyc1_status;
          }
        })
      }
    }
  }
</script>
<style scoped>
  @import "../../../../common.css";
  /*.content{*/
    /*flex: 1;*/
    /*background-color: #ffffff;*/
    /*padding: 30px 50px;*/
  /*}*/
  .content .title{
    font-size: 20px;
    color: #000000;
    text-align: left;
    margin-bottom: 29px;
  }
  .userinfo{
    padding-top: 36px;
  }
  .userinfo .userinfo_item{
    display: flex;
    font-size: 18px;
    margin-bottom: 34px;
  }
  .userinfo .userinfo_item .item_txt{
    width: 100px;
    text-align: left;
    color: #666666;
    margin-right: 65px;
  }
  .userinfo .userinfo_item .item_txt2{
    color: #000000;
  }
  .userinfo .userinfo_item .blue{
    color: #506BA6;
    cursor: pointer;
  }
</style>

