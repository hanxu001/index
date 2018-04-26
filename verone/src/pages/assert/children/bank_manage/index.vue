<template>
  <div v-if="isShow" class="content">
    <p class="title">银行卡管理</p>
    <hr color="#EEEEEE"/>
    <div class="tip"><img src="../../../../assets/imgs/personal_p_Shape.png" alt="">请设置您的银行卡号，请务必使用本人的实名账号</div>
    <div v-if="errorTip" @click="errorTip = false" title="点击消失" class="error_tip">{{errorMessage}}</div>
    <div v-loading="loading1"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading">
      <!--银行卡未实名认证-->
      <div v-if="user.kyc1_status != 2" class="no_prove">
        <p class="no_prove_title">您还未完成实名认证，无法进行银行卡绑定操作</p>
        <p v-if="user.kyc1_status == 0" @click="$router.push('/my/user_profiles')" class="no_prove_btn">未认证</p>
        <p v-if="user.kyc1_status == 1" class="no_prove_btn">审核中</p>
        <p v-if="user.kyc1_status == -1" @click="$router.push('/my/user_profiles')" class="no_prove_btn">审核失败</p>
      </div>
      <!---->
      <div v-if="user.kyc1_status == 2">
        <!--绑定银行卡-->
        <div v-if="isNeedAuth" class="add_card">
          <div >
            <div class="form_div">
              <span class="form_txt">姓名：</span>
              <span class="form_txt">{{user.real_name}}</span>
            </div>
            <div class="form_div">
              <span class="form_txt">开户银行：</span>
              <input v-model="open_bank" maxlength="30" type="text" class="form_input" placeholder="请输入开户银行">
            </div>
            <div class="form_div">
              <span class="form_txt">开户支行：</span>
              <input v-model="subBranch" type="text" class="form_input" placeholder="请输入开户支行">
            </div>
            <div class="form_div">
              <span class="form_txt">银行卡号：</span>
              <input v-model="bankCard" maxlength="19" type="text" class="form_input" placeholder="请输入银行卡号">
            </div>
            <!-- <div class="form_div">
              <span class="form_txt">预留手机号：</span>
              <input v-model="mobile" type="text" class="form_input" placeholder="请输入本卡在银行预留的手机号">
            </div> -->
            <div class="form_div">
              <span class="form_txt">手机号：</span>
              <span class="form_txt">{{user.username}}</span>
            </div>
            <div class="form_div">
              <span class="form_txt">验证码：</span>
              <div class="form_input_ver">
                <input v-model="verCode" maxlength="6" type="text" class="ver_input" placeholder="请输入验证码">
                <div @click="getVerCode" :class="['ver_btn',noClick?'noClick':'']">{{getVericode}}</div>
              </div>
            </div>
            <div class="agreement">
              <input @click="isChecked=!isChecked" type="checkbox" checked="checked">
              <div class="agreement_txt">
                <span>我承诺提交信息属于本人所用，不存在盗用他人信息行为</span>
              </div>
            </div>
            <div @click="bindBank" :class="['tixian_btn',subBranch&&bankCard&&verCode?'blue':'']">完成绑定</div>
          </div>

          <!--<div v-if="bindSuccess" @click="bindSuccess = false" class="successTip">绑定成功，继续绑定</div>-->
        </div>
        <!--管理银行卡-->
        <div v-if="!isNeedAuth"  class="look_card">
          <div v-for="item in bankedCards" class="card_item">
            <div class="card_logo">
              <img :src="item.bank_image" alt="银行卡logo">
            </div>
            <div class="card_info">{{item.bank_name}}</div>
            <div class="card_info">{{item.mark_bank_card_num}}</div>
            <div @click="relieveBankCard(item.id)" class="delect_card">删除</div>
          </div>
          <p class="addCard" @click="isNeedAuth = !isNeedAuth">+新增银行卡</p>
        </div>
      </div>

    </div>


  </div>
</template>

<script>
  import {httpGet, httpPost, getCookie} from '../../../../utils'
  //import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        user: {},//用户信息
        bankCard: '',//银行卡号
        open_bank: '',//银行名称
        subBranch: '',//支行
        mobile: '',//银行预留手机号
        verCode: '',//手机号验证码
        errorTip: false,//错误提示
//        bindSuccess: false,//绑定成功提示提示
        bankedCards: [],//绑定成功的银行卡
        getVericode: '获取验证码',//获取验证码
        mobileCount: '60',//验证码倒计时 60s
        noClick: false,
        isChecked: true, //同意协议是否选中
        isNeedAuth: false, //是否需要绑定 默认不需要

        isShow: false, //解决闪现

        loading1: true, //登录状态
      }
    },
    computed: {
      //...mapState(["userInfo",'hasLogin'])
    },
    filters: {
      card_num: function(value) {
        return value.replace(/(\d{4})(?=\d)/g,'$1 ');
      }
    },
    mounted() {
      this.isProved();//判断是否实名认证
      this.getBankedCard();//获取已绑定的银行卡列表
    },
    methods: {
      //判断是否完成实名认证了
      isProved() {
        var that = this;
        httpGet('/api/users',{

        },function (res) {
          //console.log("用户验证情况",res);
          if(res.data.error_code == 0) {
            that.loading1 = false;
            that.user = res.data;
            if(res.data.bank_card_auth == 2) {
              that.isNeedAuth = false;
            }else{
              that.isNeedAuth = true;
            }

            that.isShow = true;
          }
        })
      },
      //银行卡实名认证 绑定银行卡
      bindBank() {
        if(!this.isChecked) {
          this.errorTip = true;
          this.errorMessage = '请先同意协议';
          return
        }else{
          this.errorTip = false;
        }
        if(!this.subBranch){
          this.errorTip = true;
          this.errorMessage = '开户支行不能为空';
          return
        }else{
          this.errorTip = false;
        }
        this.veriBankNum();//银行卡号校验
        var that = this;
        httpGet('/api/users/bank_card_auth',{
          bank_name: that.open_bank,
          bank_card: that.bankCard,
          sub_branch: that.subBranch,
          mobile_code: that.verCode
        },function (res) {
          if(res.data.error_code == 0) {
            that.isNeedAuth = false;
            that.$message({
              message: '银行卡绑定成功',
              type: 'success'
            });
            setTimeout(function () {
               window.location.reload();
            },300);
          }else{
            that.$message.error(res.data.error_reason);
          }
        })
      },
      getVerCode() {
        if(this.getVericode != '获取验证码') {
          return;//先判断是不是已经获取验证码了，如果是 就不执行下面的语句了
        }
        var that = this;
        //that.verMobile();//获取验证码的时候先验证手机号
        httpGet("/api/users/send_auth_code",{
          mobile: that.userInfo.username,
        },function (res) {
          if(res.data.error_code == 0) {
            that.noClick = true;
            that.$message({
              message: '已发送至手机',
              type: 'success'
            });
            that.errorTip = false;
            that.getVericode = that.mobileCount;
            function GetRTime() {
              that.getVericode = parseInt(that.getVericode);
              if(that.getVericode >0) {
                that.getVericode -= 1;
                if(that.getVericode<10) {
                  that.getVericode = '0'+ that.getVericode +'s后重新获取';
                }else{
                  that.getVericode = that.getVericode +'s后重新获取';
                }
              }else{
                clearInterval(timer1);
                that.getVericode = '获取验证码';
                that.noClick = false;
              }
            }
            var timer1 = setInterval(GetRTime,1000);
          }else{
            //that.errorTip = true;
            //that.errorMessage = res.data.error_reason;
            that.$message.error(res.data.error_reason);
          }
        })
      },
      //获取已绑定的银行卡
      getBankedCard() {
        var that = this;
        httpGet('/api/users/bound_bank_cards',{

        },function (res) {
          //console.log('已绑定的银行卡',res);
          if(res.data.error_code == 0) {
            if(!res.data.bank_cards){
              that.isNeedAuth = true;
            }
            that.bankedCards = res.data.bank_cards;
          }
        })
      },
      //银行卡解绑
      relieveBankCard(id) {
        this.$confirm('删除该银行卡, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          var that = this;
          httpGet('/api/users/delete_bank_card',{
            id: id,

          },function (res) {
            if(res.data.error_code == 0) {
              that.$message({
                message: '删除成功',
                type: 'success'
              });
              that.getBankedCard();
               setTimeout(function () {
                  window.location.reload();
               },300);
            }else{
              that.$message.error('删除失败');
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      //银行卡号校验
      veriBankNum() {
        this.bankCard = this.bankCard.trim();
        if(!this.bankCard) {
          this.errorTip = true;
          this.errorMessage = '请填写银行卡号';
          return
        }
        if(this.bankCard.length <16 || this.bankCard.length >19) {
          this.errorTip = true;
          this.errorMessage = '银行卡号长度必须在16到19之间';
          return
        }

        var num = /^\d*$/;
        if(!num.test(this.bankCard)) {
          console.log(this.bankCard,typeof this.bankCard);
          this.errorTip = true;
          this.errorMessage = '银行卡号必须为纯数字';
          return
        }

        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
        if(strBin.indexOf(this.bankCard.substring(0, 2)) == -1) {
          this.errorTip = true;
          this.errorMessage = '银行卡号开头6位不符合规范';
          return
        }

        this.errorTip = false;
      }
    }
  }
</script>

<style scoped>
  @import "../../../../common.css";
  .content{
    padding: 30px 50px;
  }
  .title{
    font-size: 20px;
    color: #000000;
    text-align: left;
    margin-bottom: 20px;
  }
  .tip{
    display: flex;
    align-items: center;
    height: 38px;
    background: #FFFBF4;
    line-height: 38px;
    font-size: 14px;
    color: #F7931A;
  }
  .tip img{
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  /*绑定银行卡*/
  .form_div{
    width: 500px;
    line-height: 50px;
    margin: 20px 0;
    display: flex;
    align-items: center;
  }
  .form_div .form_txt{
    width: 120px;
    text-align: left;
    font-size: 18px;
    color: #000000;
  }
  .form_div .form_input{
    height: 40px;
    width: 360px;
    padding-left: 10px;
    box-sizing: border-box;
    font-size: 16px;
  }
  .form_div .form_input_ver{
    width: 360px;
    height: 38px;
    display: flex;
    justify-content: space-between;
  }
  .form_div .form_input_ver .ver_input{
    width: 210px;
    height: 38px;
    padding-left: 10px;
    font-size: 16px;
  }
  .form_div .form_input_ver .ver_btn{
    width: 120px;
    height: 42px;
    line-height: 42px;
    background: #506BA6;
    color: #fff;
    cursor: pointer;
  }
  .form_div .form_input_ver .noClick{
    background: #C8C8CB;
    cursor: default;
  }
  .tixian_btn{
    width: 452px;
    height: 50px;
    background: #C8C8CB;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #FFFFFF;
    border-radius: 2px;
    margin: 30px;
    cursor: pointer;
  }
  .blue{
    background: #506BA6;
  }
  /**/
  .look_card .card_item{
    width: 600px;
    height: 50px;
    margin: 60px auto 0;
    line-height: 50px;
    border-bottom: 1px solid #EEEEEE;;
    display: flex;
    align-items: center;
    margin-bottom: 15px;
    font-size: 18px;
    color: #000000;
  }
  .look_card .card_item .card_logo{
    width: 116px;
    height: 36px;
  }
  .look_card .card_item .card_logo img{
    width: 116px;
    height: 36px;
  }
  .look_card .card_item .card_info{
    flex: 1;
  }
  .look_card .card_item .delect_card{
    width: 60px;
    color: coral;
    cursor: pointer;
  }
  .look_card .addCard{
    width: 600px;
    margin: 10px auto 0;
    font-size: 18px;
    color: #4A90E2;
    cursor: pointer;
    text-align: right;
  }
  /*未实名认证*/
  .no_prove{
    width: 500px;
    height: auto;
    margin: 100px auto 0;
    font-size: 20px;
    color: #F23757;
  }
  .no_prove .no_prove_title{
    margin-bottom: 60px;
  }
  .no_prove .no_prove_btn{
    width: 452px;
    height: 50px;
    margin: 0 auto;
    background: #506BA6;
    color: #FFFFFF;
    border-radius: 2px;
    text-align: center;
    line-height: 50px;
    cursor: pointer;
  }
  .error_tip{
    margin: 10px 0;
    color: red;
    cursor: pointer;
    text-align: left;
  }
  .successTip{
    cursor: pointer;
    font-size: 20px;
    color: green;
  }

  .agreement{
    display: flex;
    height: 30px;
    font-size: 14px;
    align-items: center;
  }
  .agreement input{
    width:15px;
    height: 15px;
    margin-right: 10px;
  }
  .agreement .agreement_txt{
    font-size: 12px;
    color: #666666;
  }
  /**/
</style>
