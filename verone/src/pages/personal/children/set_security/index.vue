<template>
  <div class="content">
    <p class="title"><span @click="setEmailFlag = false;google2faFalg = false;title_twoFlag = false">安全设置 </span><span v-if="title_twoFlag">> {{title_two}}</span></p>
    <hr color="#EEEEEE"/>
    <p v-if="errorTip" @click="errorTip = !errorTip" class="error_tip">{{errorMessage}}</p>
    <div v-if="show">
    <div v-if="!setEmailFlag && !google2faFalg" class="code_manage">
      <div class="code_set">
        <div class="left">
          <div class="img"><img src="../../../../assets/imgs/personal_s_email.png" alt=""></div>
          <div class="txt">
            <p class="img_title">绑定邮箱</p>
            <p class="title_tip">找回登录密码，资金密码，接受通知时使用</p>
          </div>
        </div>
        <div v-if='emailAuth == 1 &&isShow' class="right righted">已绑定</div>
        <div v-if='emailAuth == 0 &&isShow'  @click="setEmailFlag = true;title_twoFlag = true;title_two = '设置邮箱'" class="right">未设置</div>
        <div v-if='emailAuth == -1&&isShow'  @click="setEmailFlag = true;title_twoFlag = true;title_two = '设置邮箱'" class="right">认证失败</div>
        <!--<div @click="changeCodeFlag = true;title_twoFlag = true;title_two = '设置资金密码'" class="right">{{fundPwdTxt}}</div>-->
      </div>
      <div class="code_set">
        <div class="left">
          <div class="img"><img src="../../../../assets/imgs/personal_s_mobile.png" alt=""></div>
          <div class="txt">
            <p class="img_title">绑定手机</p>
            <p class="title_tip">登录账号，找回登录密码，资金密码，接受通知时使用</p>
          </div>
        </div>
        <div class="right righted">已验证</div>
      </div>
      <div class="code_set">
        <div class="left">
          <div class="img"><img src="../../../../assets/imgs/personal_s_google.png" alt=""></div>
          <div class="txt">
            <p class="img_title">google二次验证</p>
            <p class="title_tip">绑定后，可通过google二次验证进行辅助验证操作</p>
          </div>
        </div>
        <div v-if="enabledGoogle2fa == 1" @click="google2faFalg = true;title_twoFlag = true;title_two = '关闭谷歌二次验证'" class="right">已开启</div>
        <div v-if="enabledGoogle2fa == 0" @click="openVeri" class="right">未开启</div>
      </div>
       <div class="code_set">
        <div class="left">
          <div class="img"><img src="../../../../assets/imgs/personal_s_fish.png" alt=""></div>
          <div class="txt">
            <p class="img_title">防钓鱼码</p>
            <p v-if="fish_code" class="title_tip">设置后，BTCShanghai给您发送的邮件中包含此码，没有包含此码的为伪造诈骗邮件</p>
            <p v-if="!fish_code" class="title_tip">设置后，BTCShanghai给您发送的邮件中包含此码，<span style="color: red">没有包含此码的为伪造诈骗邮件</span></p>
          </div>
        </div>
        <div class="right_fishcode">
          <div v-if="fish_code" class="fiscode">{{fish_code}}</div>
          <div v-if="fish_code" @click="setFishcode" class="fiscode_action">修改</div>
          <div v-if="!fish_code" @click="setFishcode" class="fiscode_set">设置</div>
        </div>
      </div>
    </div>
    </div>
      <!--邮箱设置-->
      <div v-if="setEmailFlag" class="setEmail">
        <div class="form_div">
          <span class="form_txt">邮箱地址：</span>
          <input v-model="email" type="text" maxlength="30" class="form_input" placeholder="请输入邮箱地址">
        </div>
        <div class="form_div">
          <span class="form_txt">邮箱验证码：</span>
          <input v-model="emailVer" class="ver_input" type="text" placeholder="请输入验证码">
          <div @click="getEmailVer" :class="['ver_btn',noClick?'noClick':'']">{{getVericodeEmail}}</div>
        </div>
        <div @click="bindEmail" class="prove_btn">确认</div>
      </div>

      <div v-if="google2faFalg">
        <div class="get_goole_content" v-if="enabledGoogle2fa == 0">
        <!--<div class="get_goole_content">-->
          <div class="get_goole">
            <div class="google_left">
              <p class="g_title">每次登录时，输入一个一次性代码，这样可以保护您的用户账户</p>
              <p class="miyao">
                <span>密钥</span>
                <span class="miyao_txt"> {{googleVercode}}</span>
                <span v-clipboard:copy="googleVercode"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError" style="margin-left: 15px;color: #4A90E2;cursor: pointer;">复制</span>
              </p>
              <p class="g_tip">请在纸上写下这串代码，避免二次验证被删除或丢失后无法登录</p>
            </div>
            <div class="google_right">
              <img :src="qrcodeSrc" alt="二维码">
              <p>用验证器扫描此二维码</p>
            </div>
          </div>
          <hr color="#EEEEEE"/>
          <div class="form_div">
            <span class="form_txt">谷歌验证代码：</span>
            <input v-model="googleVeri" type="text" class="form_input" placeholder="请输入验证器上生成的6位验证码">
          </div>
          <div class="form_div">
            <span class="form_txt">手机：</span>
            <span>+86 {{usermobile}}</span>
          </div>
          <div class="form_div">
            <span class="form_txt">手机验证码：</span>
            <input class="ver_input" maxlength="6" type="text" placeholder="手机验证码">
            <div @click="getMobileVeri" :class="['ver_btn',noClick?'noClick':'']">{{getVericode}}</div>
          </div>
          <div class="prove_btn_wrap">
            <div @click="openVeri_btn" class="prove_btn">启用双重身份验证</div>
            <div class="google_load">
              <span>谷歌验证器下载地址</span>
              <span class="g_load_address">www.google.com</span>
            </div>
          </div>
        </div>

        <!--关闭谷歌验证器-->
        <div v-if="enabledGoogle2fa == 1">
        <!--<div>-->
          <div class="form_div">
            <span class="form_txt">谷歌验证代码：</span>
            <input v-model="googleVeri" type="text" class="form_input" placeholder="请输入验证器上生成的6位验证码">
          </div>
          <div @click="closeVeri_btn" class="prove_btn" style="padding: 0 10px">关闭双重身份验证</div>
        </div>
        <!---->
    </div>
    <!--成功提示-->
    <div @click="successTipBtn" v-if="successTip" class="success_tip">
     <img src="../../../../assets/imgs/Group.png" style="float: left;margin-left: 25%"/>
      <div style="float: left;margin-left: 40px">
      <p style="font-size: 20px;">{{successMessage}}</p>
      <p style="color: #3F3F3F;font-size: 16px;opacity: 0.7;margin-top: 20px"><span style="color: #4575BD">5</span>秒内将自动返回上一页面</p>
    </div>

    </div>
    <!---->
    <div v-if="fishFlag" class="modal"></div>
    <div v-if="fishFlag" class="fishAlert">
      <p class="fish_title">防钓鱼码设置</p>
      <input v-model="fishContent" class="input" maxlength="20" type="text" placeholder="4-20个字符，可使用 字母 数字 汉字 进行组合">
      <p class="fish_tip">
        <span>请输入您要设置的防钓鱼码内容，</span>
        <span class="tip_red">它将出现在"个人中心"以及"BTC上海"给您发送邮件中。如您在使用过程中发现防钓鱼码跟设置的不一致，请终止访问。</span>
      </p>
      <div @click="bindingFish" class="fish_btn">确认</div>
      <div @click="fishFlag = false;fishContent=''" class="fish_close">取消</div>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, getCookie} from '../../../../utils'
  //import {mapState, mapMutations} from 'vuex'
  import jrQrcode from 'jr-qrcode'

  export default {
    data() {
      return {
        show:false,
        title_twoFlag: false,//二级标题开关 默认不显示
        title_two: '',//二级标题内容
        setEmailFlag: false,//设置邮箱开关 设置邮箱
        google2faFalg: false,//设置google开关 设置谷歌二次验证

        googleVercode: '',//密钥
        usermobile: '',//用户手机号码 掩码
        googleVeri: '',//谷歌验证码
        qrcodeSrc: '',//谷歌验证器二维码
        errorTip: false,//错误提示开关
        errorMessage: '',//错误提示信息

        email: '',//邮箱
        emailVer: '',//邮箱验证码
        getVericode: '获取验证码',//手机验证 是否可点击
        getVericodeEmail: '获取验证码',//邮箱验证 是否可点击
        vericodeCount: '60',//验证码倒计时60s
        noClick: false,//是否不可点击

        successMessage: '恭喜邮箱绑定成功',//绑定成功提示信息
        successTip: false,//绑定成功提示信息
        fishFlag: false,//绑定钓鱼码模态
        fishContent: '',//钓鱼码
        fish_code:'',//后台返回的钓鱼吗内容

        emailAuth: '',//邮箱绑定状态
        enabledGoogle2fa: '',//google 身份认证状态 0未开启  1已开启

        isShow: false,//解决闪现

        userInfo: {}, //用户状态
        hasLogin: false, //登录状态
      }
    },
    computed: {
      //...mapState(["userInfo",'hasLogin'])
    },

    mounted() {
      this.getUesrInfo();
      this.getUserCode();

    },
    watch:{
      isShow:function () {
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

      //开启谷歌验证
      openVeri() {
          this.google2faFalg = true;
          this.title_twoFlag = true;
          this.title_two = '开启谷歌二次验证';

        var that = this;
        httpGet("/api/users/create_google2fa",{

        },function (res) {
          //console.log('开启谷歌验证',res);
          if(res.data.error_code == 0) {
            that.googleVercode = res.data.google2fa_secret;
            that.usermobile = res.data.mark_mobile;
            that.qrcodeSrc = jrQrcode.getQrBase64(res.data.google2fa_qrcode);
          }
        })
      },
      //获取手机验证码
      getMobileVeri() {
        var that = this;
        if(that.getVericode != '获取验证码') {
          return;
        }
        httpGet('/api/users/send_auth_code', {
          mobile: that.userInfo.username
        }, function (res) {
          //console.log('手机验证码', res);
          if (res.data.error_code == 0) {
            that.noClick = true;
            that.$message({
              showClose: true,
              message: '已发送至手机',
              type: 'success'
            });
            //倒计时
            that.getVericode = that.vericodeCount;
            function GetRTime() {
              that.getVericode = parseInt(that.getVericode)+'s后重新获取';
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

          } else {
            that.$message.error(res.data.error_reason);
          }
        })
      },
      //启用双重身份验证
      openVeri_btn() {
        var that = this;
        httpGet("/api/users/verify_google2fa",{
          g2fa_code: that.googleVeri
        },function (res) {
          //console.log("进行谷歌验证",res);
          if(res.data.error_code == 0) {
            //that.errorTip = false;
            //that.errorMessage = res.data.error_reason;

            that.successTip = true;
            that.show=false;
            that.google2faFalg=false;
            that.successMessage = 'google二次验证开启成功！';
            setTimeout(function () {
              window.location.reload();
            },5000);

          }
        })

      },
      //关闭双重身份验证
      closeVeri_btn() {
        var that = this;
        httpGet("/api/users/remove_google2fa",{
          g2fa_code: that.googleVeri
        },function (res) {
          if(res.data.error_code == 0) {
            that.successTip = true;
            that.show=false;
            that.google2faFalg=false;
            that.successMessage = 'google二次验证关闭成功！';
            setTimeout(function () {
              window.location.reload();
            },5000);
          }
        })
      },
      //获取邮箱验证码
      getEmailVer() {
        var that = this;
        if(that.getVericodeEmail != '获取验证码') {
          return;
        }
        httpGet('/api/users/send_email_auth_code', {
          email: that.email,
        }, function (res) {
          //console.log('邮箱验证码', res);
          if (res.data.error_code == 0) {
            that.noClick = true;
            that.errorTip = false;
            that.$message({
              showClose: true,
              message: '已发送至邮箱',
              type: 'success'
            });
            //倒计时
            that.getVericodeEmail = that.vericodeCount+'s后重新获取';
            function GetRTime() {
              that.getVericodeEmail = parseInt(that.getVericodeEmail);
              if(that.getVericodeEmail >0) {
                that.getVericodeEmail -= 1;
                if(that.getVericodeEmail<10) {
                  that.getVericodeEmail = '0'+ that.getVericodeEmail +'s后重新获取';
                }else{
                  that.getVericodeEmail = that.getVericodeEmail +'s后重新获取';
                }
              }else{
                clearInterval(timer1);
                that.getVericodeEmail = '获取验证码';
                that.noClick = false;
              }
            }
            var timer1 = setInterval(GetRTime,1000);

          } else {
            //that.errorTip = true;
            //that.errorMessage = res.data.error_reason;
            that.$message.error(res.data.error_reason);
          }
        })
      },
      //绑定邮箱地址
      bindEmail() {
        var that = this;

        return false;
        httpGet("/api/users/email_validated",{
          email: that.email,
          auth_code: that.emailVer
        },function (res) {
          if(res.data.error_code == 0) {
            that.show=false;
            that.setEmailFlag=false;
            that.successTip = true;
            that.successMessage = '恭喜邮箱绑定成功';
            setTimeout(function () {
              that.isShowSet = false;
              that.show=true;
              window.location.reload();
            },5000);
          }
        })
      },
      //绑定成功函数
      successTipBtn() {
        this.successTip = false;
        // this.$router.push(-1);
        window.location.reload();
      },
      //进来页面先判断下谷歌验证有没开启
      getUserCode() {
        var that = this;
        httpGet('/api/users',{},function (res) {
          if(res.data.error_code == 0) {
            that.enabledGoogle2fa = res.data.enabled_google2fa;
            that.emailAuth = res.data.email_auth;
            that.fish_code = res.data.anti_fishing_content;
            that.isShow = true;
          }
        })
      },
      //设置钓鱼码
      setFishcode() {
        this.fishFlag = true;

      },
      //设置钓鱼码
      bindingFish() {
          var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
          var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
          if(regEn.test(this.fishContent) || regCn.test(this.fishContent)) {
              this.$message.error('仅可输入4-20个字符，字母 数字 汉字组合');
              return false;
          };
          if(this.fishContent.length<4){
              this.$message.error('至少4个字符');
              return false;
          }
          var that = this;
          httpPost('/api/users/anti_fishing',{
              content: that.fishContent,
          },function (res) {
              if(res.data.error_code == 0) {

                that.fishFlag = false;
                that.successTip = true;
                that.show=false;
                that.successMessage = '防钓鱼码设置成功';
                setTimeout(function () {
                  that.isShowSet = false;

                  window.location.reload();
                },5000);
              }
          })
      },
      onCopy: function (e) {
        this.$message({
          message: '复制成功',
          type: 'success'
        });
      },
      onError: function (e) {
        this.$message({
          message: '复制失败,你的浏览器不支持！',
          type: 'error'
        });
      },
    }
  }
</script>

<style scoped>
  @import "../../../../common.css";

  .content .title{
    font-size: 20px;
    color: #000000;
    text-align: left;
    margin-bottom: 22px;
    cursor: pointer;
  }
  .code_manage{
    width: 600px;
    height: auto;
    margin: 0 auto;
    padding: 50px;
  }
  .code_manage .code_set{
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .code_manage .code_set .left{
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .code_set .img{
    width: 50px;
    height: 50px;
    margin-right: 20px;
  }
  .code_set .left .txt{
    height: 60px;
    text-align: left;
  }
  .code_set .left .txt .img_title{
    height: 30px;
    line-height: 30px;
    font-size: 18px;
    color: #000000;
  }
  .code_set .left .txt .title_tip{
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    color: #666666;
  }
  .code_set .right{
    font-size: 18px;
    color: #506BA6;
    cursor: pointer;
  }
  .code_set .righted{
    color: #A1A1A1;
  }
  .code_set .right_fishcode{
    text-align: right;
  }
  .code_set .right_fishcode .fiscode{
    font-size: 18px;
    color: #000;
    margin-bottom: 10px;
  }
  .code_set .right_fishcode .fiscode_action{
    min-width: 100px;
    font-size: 18px;
    color: #506BA6;
    cursor: pointer;
  }
  .code_set .right_fishcode .fiscode_set{
    width: 100px;
    font-size: 18px;
    color: #506BA6;
    cursor: pointer;
  }

  .get_goole_content .form_div{
    margin: 20px 0;
  }
  .form_div{
    width: 500px;
    line-height: 50px;
    margin: 20px auto 0;
    display: flex;
    align-items: center;
  }
  .form_div .form_txt{
    width: 150px;
    text-align: left;
    font-size: 18px;
    color: #000000;
  }
  .form_div .form_input{
    height: 40px;
    width: 360px;
    padding-left: 10px;
    box-sizing: border-box;
  }
  input::placeholder{
    font-size: 16px;
    color: #999999;
  }
  .form_div .ver_input{
    height: 40px;
    width: 240px;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .form_div .ver_btn{
    height: 40px;
    width: 120px;
    background: #506BA6;
    border-radius: 3px;
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }
  .form_div .noClick{
    background: #ddd;
    cursor: default;
  }

  .prove_btn{
    width: 120px;
    height: 40px;
    background: #506BA6;
    text-align: center;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    border-radius: 2px;
    margin: 30px auto;
    cursor: pointer;
  }

  /*google验证码*/
  .get_goole{
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .get_goole .google_right{
    width: 200px;
    height: auto;
  }
  .get_goole .google_right img{
    width: 120px;
    height: 120px;
    margin: 0 auto;
  }
  .get_goole .google_right p{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    color: #000000;
  }
  .get_goole .google_left .g_title{
    margin-bottom: 20px;
    text-align: left;
  }
  .google_left .miyao{
    padding: 20px 0;
    text-align: left;
  }
  .google_left .miyao .miyao_txt{
    font-size: 24px;
    font-weight: bold;
    margin-left: 20px;
  }
  .google_left .g_tip{
    font-size: 16px;
    color: #EC1212;
    text-align: left;
  }
  .google_load{
    /*text-align: left;*/
    font-size: 14px;
    color: #666666;
  }
  .google_load .g_load_address{
    font-size: 14px;
    color: #6285C7;
    cursor: pointer;
    margin-left: 20px;
  }
  .error_tip{
    margin: 10px 0;
    color: red;
    text-align: left;
    font-weight: bold;
    cursor: pointer;
  }
  .success_tip{
    width: 500px;
    padding: 10px;
   margin: 0px auto;
  }
  .success_tip .sTip_title{
    margin: 40px 0;
  }
  .success_tip .sTip_btn{
    width: 450px;
    height: 50px;
    margin: 20px auto;
    border-radius: 3px;
    text-align: center;
    line-height: 50px;
    background-color: #506BA6;
    color: #ffffff;
    font-weight: bold;
    cursor: pointer;
  }
  .modal{
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.4;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 998;
  }
  /**/

  .prove_btn_wrap{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .prove_btn_wrap .prove_btn{
    width: 160px;
    margin: 0;
  }
  /*钓鱼码弹窗*/
  .fishAlert{
    width: 456px;
    height: 446px;
    padding: 99px 72px 60px;
    background: #FFFFFF;
    color: #000000;
    border-radius: 2px;
    position: fixed;
    left: 50%;
    top:50%;
    transform: translate(-50%,-50%);
    z-index: 999;
  }
  .fishAlert .fish_title{
    margin-bottom: 37px;
    font-size: 22px;
  }
  .fishAlert .input{
    width: 440px;
    height: 46px;
    padding-left: 20px;
    margin-bottom: 25px;
    background: #F9F9F9;
    border-radius: 2px;
    border: 0;
    outline: none;
    font-size: 20px;
  }
  .fishAlert .fish_tip{
    font-size: 16px;
    line-height: 30px;
    text-align: left;
  }
  .fishAlert .fish_tip .tip_red{
    color: red;
  }
  .fishAlert .fish_btn{
    width: 452px;
    height: 50px;
    margin: 136px 0 30px;
    line-height: 50px;
    text-align: center;
    border-radius: 2px;
    background: #506BA6;
    cursor: pointer;
    font-size: 22px;
    color: #FFFFFF;
  }
  .fishAlert .fish_close{
    font-size: 18px;
    color: #4A90E2;
    cursor: pointer;
  }
  .setEmail{
    margin-top: 100px;
  }
</style>
