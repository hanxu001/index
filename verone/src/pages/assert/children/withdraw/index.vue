<template>
  <div v-if="isShow" class="content">
    <p class="title">提现</p>
    <hr color="#EEEEEE"/>
    <div v-if="!successTip">

        <div class="coin_content_wrap">
          <ul class="coin_content">
            <!--<li v-for="(item,index) in coinlist" @click="changecoin(index,item.currency)" :class="['coin_item',index==itemIndex?'active':'']">{{item.code}}</li>-->
            <li v-for="(item,index) in coinlist" @click="changecoin(index,item.currency)" :class="['coin_item',item.currency==currency?'active':'']">{{item.code}}</li>
          </ul>
          <!-- <hr class="coin_line" color="#eee"/> -->
        </div>
      <!--<div class="tip">{{currentData.currency}}今日可提现总额为{{currentData.available_amount}}{{currentData.code}}，单笔提现上限{{currentData.withdraw_max}}{{currentData.code}}</div>-->
      <div class="tip">
        <img src="../../../../assets/imgs/personal_p_Shape.png" alt="">
        {{currentData.currency}}今日可提现总额为{{currentData.available_amount}}{{currentData.code}}，单笔提现上限{{currentData.withdraw_max}}{{currentData.code}}
      </div>

        <!--未认证，未设置资金密码-->
        <div v-if="!userData.bank_card_auth && btcFlag" class="no_prove">
          <div class="no_prove_item">
            <span class="p_item_txt">资金密码设置</span>
            <span v-if="userData.is_need_fund_pwd" @click="$router.push('/my/user_password')" class="p_item_btn">去设置</span>
            <span v-if="!userData.is_need_fund_pwd" class="p_item_btn2">已设置</span>
          </div>
          <div class="no_prove_item">
            <span v-if="userData.kyc1_status != 2" class="p_item_txt">身份认证未通过</span>
            <span v-if="userData.kyc1_status == 2" class="p_item_txt">身份认证已通过</span>
            <span v-if="userData.kyc1_status == 0" @click="$router.push('/my/user_profiles')" class="p_item_btn">去认证</span>
            <span v-if="userData.kyc1_status == 1" class="p_item_btn2">审核中</span>
            <span v-if="userData.kyc1_status == -1" @click="$router.push('/my/user_profiles')" class="p_item_btn2">认证失败</span>
            <span v-if="userData.kyc1_status == 2" class="p_item_btn2">已认证</span>
          </div>
          <div class="no_prove_item">
            <span v-if="!userData.bank_card_auth" class="p_item_txt">银行卡未绑定</span>
            <span v-if="userData.bank_card_auth" class="p_item_txt">银行卡已绑定</span>
            <span v-if="!userData.bank_card_auth" @click="$router.push('/balances/bank_cards')" class="p_item_btn">去绑定</span>
            <span v-if="userData.bank_card_auth" class="p_item_btn2">已绑定</span>
          </div>
        </div>
        <!---->

        <!--法币提现-->
      <div v-if="(itemIndex == 0 && userData.bank_card_auth) || (itemIndex == 1 && !btcFlag)">
        <div class="cny">
          <!--<div v-if="cnyFlag" class="tip">今日可提现总额 100，000CNY，单笔提现上限 50，000CNY</div>-->
          <div class="form_div">
            <span class="form_txt">可提余额：</span>
            <span>{{currentData.available_amount}}</span>
          </div>
          <div class="form_div">
            <span v-if="itemIndex == 0" class="form_txt">提现金额：</span>
            <span v-if="itemIndex == 1" class="form_txt">提现数量：</span>
            <input v-model="withdrawNum" @input="veriWithdrawNum2" type="text" class="form_input" placeholder="请输入数量">
          </div>
          <div v-if="!btcFlag" class="form_div">
            <span class="form_txt">提现地址：</span>
            <input v-model="toAddress" type="text" class="form_input" placeholder="请输入提现地址">
          </div>
          <div class="form_div">
            <span class="form_txt">提现手续费：</span>
            <span v-if='currentData.withdraw_fee_type == 0'>{{currentData.withdraw_fee}} {{currentData.code}}</span>
            <span v-if='currentData.withdraw_fee_type == 1'>{{fee_precent}} {{currentData.code}}</span>
          </div>
          <div v-if="cnyFlag" class="form_div">
            <span class="form_txt">实际到账金额：</span>
            <span v-if='currentData.withdraw_fee_type == 0'>{{(withdrawNum-currentData.withdraw_fee)<0?'0':withdrawNum-currentData.withdraw_fee}} {{currentData.code}}</span>
            <span v-if='currentData.withdraw_fee_type == 1'>{{(withdrawNum-fee_precent)<0?'0':withdrawNum-fee_precent}} {{currentData.code}}</span>
          </div>
          <div v-if="cnyFlag" class="form_div">
            <span class="form_txt">选择银行：</span>
            <div class="form_input form_input_select">
              <el-select class="form_select" v-model="bank" placeholder="请选择">
                <el-option
                  v-for="item in bankCards"
                  :key="item.id"
                  :label="item.mark_bank_card_num"
                  :value="item.id">
                  <div style="float: left">
                    <img :src="item.bank_image" style="float: left"/>
                    <span style="float: right">{{item.bank_name}}</span>
                  </div>
                  <span style="float: right; color: #8492a6;">{{item.mark_bank_card_num}}</span>
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="form_div">
            <span class="form_txt">资金密码：</span>
            <input v-model="fundPassword" type="password" maxlength="20" class="form_input" placeholder="请输入资金密码">
          </div>
          <div v-if="userData.enabled_google2fa == 0" class="form_div">
            <span class="form_txt">验证码：</span>
            <div class="form_input_ver">
              <input v-model="authCode" type="text" class="ver_input" maxlength="6" placeholder="请输入短信验证码">
              <div @click="getVerCode" :class="['ver_btn',noClick?'noClick':'']">{{getVericode}}</div>
            </div>
          </div>
          <div v-if="userData.enabled_google2fa == 1" class="form_div">
            <span class="form_txt">谷歌验证码：</span>
            <input v-model="googleCode" type="text" class="form_input" maxlength="9" placeholder="请输入谷歌验证码">
          </div>
        </div>
        <!---->
        <!--错误提示-->
        <p v-if="errorTip" @click="errorTip = false" class="error_tip">{{errorMessage}}</p>
        <!---->
        <!--数字币提现-->
        <div @click="gotoWithdraw" :class="['tixian_btn',withdrawNum&&(toAddress||bank)&&fundPassword&&authCode?'blue':'']">立即提现</div>
        <!---->
        <div class="tixian_tip">
          <p class="t_title">提现说明：</p>
          <p v-if="cnyFlag" class="t_item">支持金额：单笔提现最低金额为 <i class="blues">￥2</i> ，单日最高提现金额为 <i class="blues">￥1000，000</i> ，单笔提现大于<i class="blues">￥30，000</i>提现订单系统会自动进行拆分。</p>
          <p v-if="!cnyFlag" class="t_item">支持金额：单笔提现数量最少为 <i class="blues">฿0.0001</i> ,单日最高限额为 <i class="blues">฿1，000</i> 。</p>
          <p v-if="cnyFlag" class="t_item">费率标准：提现金额2%手续费，若不满足￥2则收取最低金额￥2。</p>
          <p v-if="cnyFlag" class="t_item">到账时间：提现审核通过后一般为24小时内到账，具体到账时间因收款银行略有不同，节假日到账时间略有延迟。</p>
          <p v-if="!cnyFlag" class="t_item">到账时间：提现审核后将尽快汇出，到账时间取决于收款方所需要的确认数。</p>
        </div>
        <p class="tixian_record_title">提现记录</p>
        <el-row class="record_title_txt">
          <el-col :span="5"><div class="item">时间</div></el-col>
          <el-col :span="5"><div class="item">{{tixianNum}}</div></el-col>
          <el-col :span="8"><div class="item">{{tixianAdress}}</div></el-col>
          <el-col :span="3"><div class="item">状态</div></el-col>
          <el-col :span="3"><div class="item">操作</div></el-col>
        </el-row>
        <ul class="record_content_wrap">
          <li  v-for="item in withdrawRecord">
            <el-row class="record_content">
              <el-col :span="5"><div class="item">{{item.createdAt}}</div></el-col>
              <el-col :span="5"><div class="item">{{item.amount}}</div></el-col>
              <el-col :span="8"><div class="item" style="font-size: 12px">{{item.to_address}}</div></el-col>
              <el-col :span="3"><div class="item">{{item.status_text}}</div></el-col>
              <el-col v-if="item.status == 0" :span="3"><div class="item itemClose" @click="closeRecharge(item.currency,item.id)">取消</div></el-col>
              <el-col v-if="item.status != 0" :span="3"><div class="item">{{item.status_text}}</div></el-col>
            </el-row>
          </li>
        </ul>
      </div>
    </div>

    <!--提现成功提示-->
    <div @click="successTipBtn" v-if="successTip" class="success_tip">
      <p class="sTip_title">您的提现申请提交成功，待审核！</p>
      <p class="sTip_btn">确定</p>
    </div>
    <!---->
  </div>
</template>

<script>
  //import {mapState, mapMutations} from 'vuex'
  import {httpGet, httpPost, getTimeStr} from '../../../../utils'

  export default {
    data() {
      return {
        coinlist:[],
        currency: 'CNY',//提现币种 默认 人民币
        itemIndex: 0,
        cnyFlag: true,
        btcFlag: true,//数字币的时候 提示认证的框要不要弹出来， 默认true
        tixianNum: '金额（$）',
        tixianAdress: '提现银行卡',
        //proveFlag: true,//是否需要认证
        cnycodeIsApproved: true,//资金密码是否认证
        bankIsApproved: true,//银行卡是否认证
        kyc1IsApproved: true,//kyc1是否认证

        userData: {},//用户认证信息 对象

        sysmbol: 'CNY',//提现的货币符号
        withdrawNum: '',//提现数量
        //withdrawFee: '1',//提现手续费
        fundPassword: '',//资金密码
        authCode: '',//短信验证码
        googleCode: '',//谷歌验证码
        currentData: {},//提现之前 当前页面信息
        bankCards: [],//提现之前 当前页面信息 若是CNY的话  提现银行卡地址列表
        bank: '',//提现法币 银行卡
        toAddress: '',//提现数字币 地址
        errorTip: false,//提现错误提示开关 默认不显示
        errorMessage: '',//提现错误提示内容
        successTip: false,//提现成功提示

        withdrawRecord: [],//提现记录
        getVericode: '获取验证码',//验证码
        mobileCount: '60',//验证码倒计时 60s
        noClick: false,

        isShow: false,//解决闪现问题
        canWithdraw: false,//是否能提现
      }
    },
    computed: {
      //...mapState(["userInfo"]),

      fee_precent: function() {
        var fee1 = this.withdrawNum*this.currentData.withdraw_fee;
        if(fee1<this.currentData.min_withdraw_fee) {
          fee1 = this.currentData.min_withdraw_fee;
        }
        return fee1;
      }
    },
    mounted() {
      this.isNeedProve();//判断是否全部认证
      //this.getWithdrawData();//进入页面之前先获取下提现需要的数据
      this.getCoinList();//提现币种列表
      //this.withdrawRecordData();//提现记录
      if(!this.$route.query.coin){
          this.currency = 'CNY';
      }else{
          this.currency = this.$route.query.coin;
      }

      this.getWithdrawData();//调一下提现页相应币种的数据信息
      this.withdrawRecordData();//提现记录 相应改变
      if(this.currency == 'CNY') {
          this.cnyFlag = true;
          this.tixianNum = '金额（$）';
          this.tixianAdress = '提现银行卡';

          this.btcFlag = true;
      }else {
          this.cnyFlag = false;
          this.tixianNum = '数量';
          this.tixianAdress = '提币地址';

          if(this.userData.is_need_fund_pwd || this.userData.kyc1_status != 2) {
              this.btcFlag = true;
          }else{
              this.btcFlag = false;
          }
      }
    },
    methods: {
      //前端验证
      veriWithdrawNum2() {
         if(this.withdrawNum.length>2) {
            if(this.withdrawNum == parseFloat(this.withdrawNum)) {
               return;
            }
            this.withdrawNum = parseFloat(this.withdrawNum);
            if(isNaN(this.withdrawNum)) {
               this.withdrawNum = '';
            }
         }else if(parseFloat(this.withdrawNum) >= 0) {

         }else if(!parseFloat(this.withdrawNum)) {
            this.withdrawNum = '';
         }

        if(parseFloat(this.withdrawNum) > parseFloat(this.currentData.available_amount)) {
          this.$message.error('余额不足');
          this.withdrawNum = this.currentData.available_amount;
          this.canWithdraw = false;
          return;
        }
        this.canWithdraw = true;
      },
//      veriWithdrawNum() {
//         var numReg = /^d*(?:.d{0,4})?$/;
//         if(!numReg.test(this.withdrawNum)) {
//            this.$message.error('只能输入数字，小数点后只能保留四位');
//            this.canWithdraw = false;
//            return;
//         }
//        this.canWithdraw = true;
//      },

      changecoin(index,coin) {
        this.withdrawNum = '';//提现金额
        this.fundPassword = '';
        this.authCode = '';

        this.currency = coin;//提现币种
        this.getWithdrawData();//调一下提现页相应币种的数据信息
        this.withdrawRecordData();//提现记录 相应改变
        this.getVericode = '获取验证码';//重置验证码

        this.errorTip = false;
        this.itemIndex = index;
        if(index == 0) {
          this.cnyFlag = true;
          this.tixianNum = '金额（$）';
          this.tixianAdress = '提现银行卡';

          this.btcFlag = true;
        }else {
          this.cnyFlag = false;
          this.tixianNum = '数量';
          this.tixianAdress = '提币地址';

          if(this.userData.is_need_fund_pwd || this.userData.kyc1_status != 2) {
            this.btcFlag = true;
          }else{
            this.btcFlag = false;
          }
        }
      },
      //先判断是否需要认证
      isNeedProve() {
        var that = this;
        httpGet("/api/users",{
        },function (res) {
          if(res.data.error_code == 0) {
             //that.loading1 = false;
            that.userData = res.data;
            that.isShow = true;
          }
        })
      },
      //提现币种列表
      getCoinList() {
        var that = this;
        httpGet("/api/balances/available_coins",{
        },function (res) {
          if(res.data.error_code == 0) {
            that.coinlist = res.data.data;
          }
        })
      },
      //提现
      gotoWithdraw() {
        //this.veriWithdrawNum();
        if(!this.canWithdraw) {
          return;
        }
        if(this.withdraw_fee_type = 0) {
          var fee = this.withdrawNum - this.currentData.withdraw_fee
        }else{
          var fee = ((this.withdrawNum*this.currentData.withdraw_fee)<(this.currentData.min_withdraw_fee))?this.currentData.min_withdraw_fee:(this.withdrawNum*this.currentData.withdraw_fee);
        }
        var that = this;
         httpPost("/api/deposit_withdraws/withdraw",{
            currency : that.currency,
            amount : that.withdrawNum,
            to_address: that.toAddress,
            remark:'',
            bank_card_id: that.bank,
            fund_password: that.fundPassword,
            auth_code: that.authCode,
            google_code: that.googleCode
          },function (res) {
            if(res.data.error_code == 0) {
              that.errorTip = false;
              that.successTip = true;
              that.$message({
                message: '提现成功',
                type: 'success'
              });
            }else{
              that.$message.error(res.data.error_reason);
              that.successTip = false;
            }
          })
//        if(that.currency == "CNY") {//提现 法币
//          httpPost("/api/deposit_withdraws/withdraw",{
//            currency : that.currency,
//            amount : that.withdrawNum,
//            withdraw_fee: fee,
//            real_amount: that.withdrawNum - fee,
//            remark:'',
//            bank_card_id: that.bank,
//            fund_password: that.fundPassword,
//            auth_code: that.authCode
//          },function (res) {
//            //console.log("提现人民币",res);
//            if(res.data.error_code == 0) {
//              that.errorTip = false;
//              that.successTip = true;
//              that.$message({
//                message: '提现成功',
//                type: 'success'
//              });
//            }else{
//              //that.errorTip = true;
//              //that.errorMessage = res.data.error_reason;
//              that.$message.error(res.data.error_reason);
//              that.successTip = false;
//            }
//          })
//        }else{//提现 数字币
//          httpPost("/api/deposit_withdraws/create",{
//            currency : that.currency,
//            real_amount : that.withdrawNum-fee,
//            withdraw_fee: fee,
//            remark:'',
//            deposit_address: that.depositAddress,
//            fund_password: that.fundPassword,
//            auth_code: that.authCode
//          },function (res) {
//            //console.log("提现数字币",res);
//            if(res.data.error_code == 0) {
//              //that.errorTip = false;
//              that.successTip = true;
//              that.$message({
//                message: '提现成功',
//                type: 'success'
//              });
//            }else{
//              //that.errorTip = true;
//              //that.errorMessage = res.data.error_reason;
//              that.$message.error(res.data.error_reason);
//              that.successTip = false;
//            }
//          })
//        }
      },
      //进入提现页面， 提现之前先获取下 提现页面的用户信息
      getWithdrawData() {
        var that = this;
        httpGet("/api/deposit_withdraws/preview",{
          currency: that.currency
        },function (res) {
          if(res.data.error_code == 0) {
            that.currentData = res.data;
            if(that.currency == 'CNY') {
              that.bankCards = res.data.bank_cards;
            }
          }
        })
      },
      //提现记录
      withdrawRecordData() {
        var that = this;
        httpGet("/api/deposit_withdraws",{
          currency: that.currency,
          type_status: '0'
        },function (res) {
          //console.log("提现记录",res);
          if(res.data.error_code == 0) {
            that.withdrawRecord = res.data.data;
            for( var i=0,len=that.withdrawRecord.length;i<len;i++) {
              var c = '';
              c = getTimeStr(that.withdrawRecord[i].created_at);
              that.withdrawRecord[i].createdAt = c;
            }
          }
        })
      },
      //取消提现
      closeRecharge(s,id) {
        var that = this;
        httpPost('/api/deposit_withdraws/cancel',{
          id: id
        },function (res) {
          if(res.data.error_code == 0) {
            that.$message({
              message: '取消成功',
              type: 'success'
            });
            that.withdrawRecordData(s,'0');
          }else {
            that.$message.error('取消失败');
          }
        })
      },
      //提现成功弹框
      successTipBtn() {
        this.successTip = false;
        this.$router.push('/quot');
      },
      //获取验证码
      getVerCode() {
        if(this.getVericode != '获取验证码') {
          return;//先判断是不是已经获取验证码了，如果是 就不执行下面的语句了
        }
        var that = this;
        //that.verMobile();//获取验证码的时候先验证手机号
        httpGet("/api/users/send_auth_code",{
          mobile: that.userInfo.username
        },function (res) {
          if(res.data.error_code == 0) {
            that.noClick = true;
            that.getVericode = that.mobileCount;
            that.$message({
              message: '已发送至手机',
              type: 'success'
            });
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
            that.errorMessage = res.data.error_reason;
          }
        })
      },

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


  .coin_content{
    display: flex;
  }
  .coin_content .coin_item{
    width: 183px;
    height: 38px;
    line-height: 38px;
    font-size: 18px;
    cursor: pointer;
  }
  .coin_content .coin_item.active{
    border-bottom: 2px solid #506BA6;
    color: #506BA6;
  }
  .coin_content_wrap{
    margin-top: 50px;
  }
  /*.tip{*/
    /*height: 40px;*/
    /*background-color: gainsboro;*/
    /*line-height: 40px;*/
    /*font-size: 12px;*/
    /*text-align: left;*/
    /*padding-left: 20px;*/
  /*}*/
  .tip{
    display: flex;
    align-items: center;
    height: 38px;
    background: #FFFBF4;
    line-height: 38px;
    font-size: 14px;
    color: #F7931A;
    border-top:1px solid #EEEEEE;
  }
  .tip img{
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
  .cny .form_div{
    width: 500px;
    line-height: 50px;
    margin: 20px 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #000000;
  }
  .cny .form_div .form_txt{
    width: 130px;
    text-align: left;
  }
  .cny .form_div .form_input{
    height: 40px;
    width: 360px;
    padding-left: 10px;
    box-sizing: border-box;
    background: #F9F9F9;
    border-radius: 2px;
    border: 0;
    outline: none;
  }
  input::placeholder{
    font-size: 16px;
    color: #999999;
  }
  .cny .form_div .form_input_ver{
    width: 360px;
    display: flex;
  }
  .cny .form_div .form_input_ver .ver_input{
    height: 38px;
    padding-left: 10px;
    flex: 1;
    background: #F9F9F9;
    border-radius: 2px;
    border: 0;
    outline: none;
  }
  .cny .form_div .form_input_ver .ver_btn{
    width: 120px;
    height: 38px;
    line-height: 38px;
    background: #506BA6;
    color: #fff;
    cursor: pointer;
    font-size: 16px;
    border-radius: 2px;
  }
  .cny .form_div .form_input_ver .noClick{
    background: #C8C8CB;
    cursor: default;
    font-size: 14px;
  }
  .form_input_select{
    position: relative;
  }
  .form_select{
    height: 40px;
    width: 360px;
    position: absolute;
    left: 0;
    top: -3px;
  }
  .tixian_btn{
    width: 452px;
    height: 50px;
    margin: 70px 20px 60px;
    background: #C8C8CB;
    text-align: center;
    line-height: 50px;
    color: #fff;
    font-size: 20px;
    border-radius: 2px;
    cursor: pointer;
  }
  .blue{
    background: #506BA6;
  }
  .tixian_tip{
    padding: 10px 20px;
    border-radius: 2px;
    background-color: #F9F9F9;
    text-align: left;
    margin-bottom: 60px;
  }
  .tixian_tip .t_title{
    margin-bottom: 20px;
  }
  .tixian_tip .t_item{
    margin-bottom: 12px;
  }
  .tixian_record_title{
    margin-bottom: 10px;
    text-align: left;
    font-size: 18px;
    color: #000000;
  }

  .record_title_txt .item{
    height: 40px;
    line-height: 40px;
    background: #F9F9F9;
    font-weight: bold;
    font-size: 16px;
    color: #666666;
  }
  .record_content_wrap{
    height: auto;
  }
  .record_content_wrap .record_content{
    height: 50px;
    line-height: 50px;
    font-size: 12px;
  }
  .record_content .itemClose{
    cursor: pointer;
    color: #4A90E2;
  }

  /*资金密码未设置，身份未认证*/
  .no_prove{
    width: 360px;
    height: auto;
    margin: 100px;
    padding: 20px 40px;
    background: rgba(255,76,87,0.03);
    border: 1px solid #F05D5D;
  }
  .no_prove .no_prove_item{
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #999999;
  }
  .no_prove .no_prove_item .p_item_btn{
    color: red;
    cursor: pointer;
  }
  .no_prove .no_prove_item .p_item_btn2{
    color: green;
    cursor: pointer;
  }
  .error_tip{
    margin: 10px 0;
    text-align: left;
    color: red;
    font-weight: bold;
    cursor: pointer;
  }
  .success_tip{
    width: 400px;
    padding: 10px;
    border: 1px solid #dddddd;
  }
  .success_tip .sTip_title{
    margin: 40px 0;
  }
  .success_tip .sTip_btn{
    width: 100px;
    height: 40px;
    margin: 20px auto;
    border-radius: 3px;
    text-align: center;
    line-height: 40px;
    background-color: coral;
    color: #ffffff;
    font-weight: bold;
    cursor: pointer;
  }

  .blues{
    color: #506BA6;
  }
  /**/
</style>

