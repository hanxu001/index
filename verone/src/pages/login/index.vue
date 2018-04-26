<template>
  <div class="all">
    <div class="header">
      <div class="container" style="text-align: left;width: 800px;">
        <img src="../../assets/imgs/logo.png" alt="" class="logo" @click="$router.push('/')">
      </div>
    </div>
    <div class="content">
      <div class="trigon">&#9670</div>
      <div class="title">
        <div class="title_left">登录</div>
        <div @click="$router.push('register')" class="title_right">手机注册</div>
      </div>

      <div class="userinfo">
        <div class="username_content">
          <div class="county">
            <select >
              <option v-if="show" class="op_item clearfix">中国 +86</option>
              <option class="op_item clearfix" v-for="item in countrys" value="item.id">
                <span style="float: left">{{item.chinese_name}} </span>
                 <span style="float: right"> +{{item.tel}}</span>
              </option>
            </select>
            <i class="el-icon-arrow-down icon"></i>
          </div>

          <div style="width: 1px;height: 40px;float: right;border-left: 1px solid rgba(196,199,255,0.15);margin-top: 10px"></div>
          <input v-model="username"
                 @blur='formatInputPhone()'
                 v-on:keyup="lightPhone"
                 maxlength="11"
                 type="text"
                 class="iphone"
                 placeholder='手机号'>
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_phone='';">{{error_phone}}</span></div>

        <div class="verification" v-if="modelVer">
          <input v-model="vercode" maxlength="6" type="text"  placeholder="6位短信验证码">
          <div @click="getVerCode" :class="['ver_btn',noClick?'noClick':'']">{{getVericode}}</div>
        </div>
        <input v-model="password"
               maxlength="30"
               class="password"
               type="password"
               v-on:keyup="lightPassword"
               @blur='verPassword'
               @keyup.enter='gotoLogin'
               placeholder="请输入登录密码">
      </div>
      <div class="error_tip"><span  title="点击消失" @click="error_password=''">{{error_password}}</span></div>
      <p class="forgetPassword">
        <span class="forgetSpan" @click="$router.push('/resetpw')">忘记密码？</span>
      </p>
      <div @click="gotoLogin" class="login_btn" ref="login_btns">登 录</div>
    </div>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="616px"
      class="dialog"
      append-to-body

    >
      <!--:before-close="close"-->
      <div class="contents">
        <div class="googleVer" v-if="!way">
          <div class="form_div">
            <input v-model="googleCode"  type="text" class="form_input" @blur='ver_vercode' v-on:keyup="error_code=''" placeholder="请输入谷歌二次验证码">
          </div>

        </div>

        <div class="phoneCode" v-if="way">
          <div class="form_div">
            <div class="form_txt">{{phone}}</div></div>

          <div class="form_div">
            <input v-model="vercode"  type="text" class="form_input"   @blur='ver_vercode' v-on:keyup="error_code=''" placeholder="请输入手机验证码">
            <div @click="getVerCode"  class="code">{{getVericode}}</div>
          </div>
        </div>
        <p  class="error_tip" title="点击消失" @click="error_code=''">{{error_code}}</p>
        <div @click="studyVer" class="prove_btn" ref="codeBtn">确定</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {httpGet, httpPost, setStore, setCookie, getCookie, getStore, veriMobile} from '../../utils'

  export default {
    data() {
      return {
        show:true,
        title:"登录验证",
        value:"中国 +86",
        dialogVisible:false,
        loginType: '使用邮箱登录',
        isIpone: true,
        username: '',
        password: '',
        googleCode:"",
        vercode: '',
        error_password:'',
        error_phone:"",
        error_code:'',
        way:true,
        country: '',//国家
        countrys: [],//国家列表
        getVericode: '获取验证码',//获取验证码
        mobileCount: '60',//倒计时
        noClick: false,
        modelVer:false,
        data:"",
        phone:"",
        vers:true,
      }
    },
    computed: {

    },
    mounted() {
      this.getStore();
      this.getCountry();
    },
    watch:{
      dialogVisible:function (val,oldVal) {
        if(this.dialogVisible){
          this.$nextTick(function () {
            var dialog=document.getElementsByClassName("el-dialog");
            dialog[0].style.backgroundColor="#17183C";

            document.getElementsByClassName("el-dialog__title")[0].style.color="#ffffff";
            document.getElementsByClassName("el-dialog__title")[0].style.fontsize="26px";
          })
        }
      },
      countrys:function () {
        if(this.countrys){
        this.show=false;
        }
      }
    },
    methods: {
      //切换手机号登录还是邮箱登录
      changeLoginType() {
        this.isIpone = !this.isIpone;
        if (this.isIpone) {
          this.loginType = '使用邮箱登录';
        } else {
          this.loginType = '使用手机号登录';
        }
        this.username = '';
        this.password = '';
      },
      gotoLogin(){
        var that = this;
          that.formatInputPhone();
          if(!that.formatInputPhone()){
            return;
          }

        that.verPassword();
        if(!that.verPassword()){
          return;
        }
        httpPost("/api/users/login", {
          mobile: that.username,
          password: that.password
        }, function (res) {
          if (res.data.error_code == 0) {
            that.data = res.data.user;
            let expireDays = 1;
            setCookie('userInfo', {
              username: that.username,
              password: that.password,
              sid: res.data.sid,
            }, expireDays);
            setStore('userInfo',{
              username: that.username,
              password: that.password,
            });
            that.$router.push("/");
          } else if(res.data.error_code == -105){
            that.title="手机验证";
            that.phone=res.data.mark_mobile;
            that.dialogVisible=true;
            that.mobileVer=true;
            that.way=true;

          }else if(res.data.error_code == -104){
            that.title="谷歌验证";
            that.phone=res.data.mark_mobile;
            that.dialogVisible=true;
            that.mobileVer=true;
            that.way=false;

          }
        })
      },
      //获取验证码
      getVerCode() {
        if(!this.vers){
          return;
        }
        var that = this;
        that.formatInputPhone();//获取验证码的时候先验证手机号
        if (!that.formatInputPhone()){
          return
        }
        httpGet("/api/users/send_auth_code", {
          mobile: that.username
        }, function (res) {
          if (res.data.error_code == 0) {
            that.vers=false;
            that.getVericode = that.mobileCount + 's后重新获取';
            that.noClick = true;
            that.$message({
              message: '已发送至手机',
              type: 'success'
            });
            function GetRTime() {
              that.getVericode = parseInt(that.getVericode);
              if (that.getVericode > 0) {
                that.getVericode -= 1;
                if (that.getVericode < 10) {
                  that.getVericode = '0' + that.getVericode + 's后重新获取';
                } else {
                  that.getVericode = that.getVericode + 's后重新获取';
                }
              } else {
                that.vers=true;
                clearInterval(timer1);
                that.getVericode = '重新获取';
                that.noClick = false;
              }
            }
            var timer1 = setInterval(GetRTime, 1000);
          }
        })
      },

      //
      studyVer(){
        var that = this;
        if(that.way){
          that.ver_vercode();
          if(!that.ver_vercode()){
            return;
          }
        //that.verMobile();//获取验证码的时候先验证手机号
        httpPost("/api/users/verify_mobile2fa", {
          mobile: that.username,
          auth_code :that.vercode,
        }, function (res) {
          if (res.data.error_code == 0) {
            let expireDays = 1;
            setCookie('userInfo', {
              username: that.username,
              password: that.password,
               sid: res.data.sid,
            }, expireDays);
            setStore('userInfo',{
              username: that.username,
              password: that.password,
            });
            that.$message({
              message: '登录成功！',
              type: 'success'
            });
            that.$router.push("/");
          }})
        }else{
          if(!that.googleCode){
            that.$message({
              message: '验证码为空！',
              type: 'error'
            });
            return;
          }
          httpPost("/api/users/verify_google2fa", {
            mobile: that.username,
            g2fa_code :that.googleCode,
          }, function (res) {
            if (res.data.error_code == 0) {
              let expireDays = 1;
              setCookie('userInfo', {
                username: that.username,
                password: that.password,
                sid: res.data.sid,
              }, expireDays);
              setStore('userInfo',{
                username: that.username,
                password: that.password,
              });
              that.$message({
                message: '登录成功！',
                type: 'success'
              });
              that.$router.push("/");
            }})
        }
      },
      getStore(){
        let initInfo = getStore('userInfo');
        initInfo = JSON.parse(initInfo)
        if (initInfo) {
          this.username = initInfo.username
          this.password = initInfo.password
        }
        if(this.username&&this.password.length>=6){
          this.$refs.login_btns.style.color="#FFFFFF";
        }else{
          this.$refs.login_btns.style.color="#9598CB";
        }
      },
      getCountry() {
        var that = this;
        httpGet('/api/countries/countries', {}, function (res) {
          if (res.data.error_code == 0) {
            that.countrys = res.data.user_login_histories.countory;
          }
        })
      },
      formatInputPhone(){
          if(this.username&&this.password.length>=6){
                this.$refs.login_btns.style.color="#FFFFFF";
          }else{
            this.$refs.login_btns.style.color="#9598CB";
          }
          var regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
          if(!this.username) {
            if(this.phone_input){
              this.error_phone =  '请输入手机号码';
            }else{
              this.error_phone =  '';
            }
            this.username = '';
            return;
          }else if(!regMobile.test(this.username)) {
            this.username=this.username;
            this.error_phone = '请输入正确手机号码';
            return;
          }else {
            this.error_phone  = '';
            return true;
          }
      },
      //密码进行验证格式
      verPassword() {
        if(!this.password){
          if(this.password_input){
            this.error_password = '请输入密码';
          }else{
            this.error_password = '';
          }

          return;
        }else if(this.password.length<6||this.password.length>20){
          this.error_password = '请输入6-20位密码';
          return;
        }else{
          this.error_password = '';
          return true;
        }
      },
      //验证码进行验证格式
      ver_vercode() {
        if(this.way){
          var code=this.vercode;
        }else{
          var code=this.googleCode
        }
        if(!code) {
          this.error_code = '';
          return
        }else if(code.length!==6) {
          this.vercode=code.substring(0,6);
          this.error_code = '验证码输入有误!';
          return
        }else{
          this.error_code = '';
          return true;
        }
      },
      lightPhone(){
        this.error_phone='';
        this.error_password='';
        if(this.username){
          this.phone_input=true;
        }
        if(this.username&&this.password.length>=6){
          this.$refs.login_btns.style.color="#FFFFFF";
        }else{
          this.$refs.login_btns.style.color="#9598CB";
        }
      },
      lightPassword(){
        this.error_password='';
        this.error_phone='';
        if(this.password){
          this.password_input=true;
        }
        if(this.username&&this.password.length>=6){
          this.$refs.login_btns.style.color="#FFFFFF";
        }else{
          this.$refs.login_btns.style.color="#9598CB";
        }
      }
    }
  }
</script>

<style scoped>
  .all {
    width: 100%;
    height:980px;
    font-family: PingFangSC-Regular;
    /*height: 700px;*/
    padding-top: 100px;
    background-image: linear-gradient(180deg, #1C1E59 -20%,#0C0D2D 30%);
  }

  .header {
    min-width: 1200px;
    margin-top: -100px;
    display: flex;
    align-items: center;
    height:200px;
  }

  .logo {
    width: 115px;
    height: 37px;
    margin-left: 20px;
    margin-right: 22px;
    cursor: pointer;
  }

  .content {
    width: 560px;
    height: 388px;
    padding: 102px 28px 96px 28px;
    margin: 100px auto;
    margin-top: 81px;
    margin-bottom: 100px;
    background-color:rgba(28,29,66,0.79);
    color: #ffffff;
    position: relative;
  }
  .trigon{
    position:absolute;
    left:20px;
    height: 21px;
    overflow: hidden;
    color:rgba(28,29,66,0.79);
    top:-21px;
    font-size:30px;
  }
  .title {
    line-height: 80px;
    display: flex;
    justify-content: space-between;
  }
  .title .title_left{
    position: absolute;
    top: -92px;
    left: 0px;
    font-size: 38px;
  }
  .title .title_right{
    position: absolute;
    top: -70px;
    right: 0;
    font-size: 22px;
    color: #C4C7FF;
    cursor: pointer;
  }


  .forgetPassword {
    display: flex;
    flex-direction: row-reverse;
    text-align: right;
    color: magenta;
    margin-top: 20px;

  }

  .forgetPassword .forgetSpan {
    color: #C4C7FF;
    border-bottom: 1px solid #C4C7FF;
    width: 100px;
    cursor: pointer;
    font-size: 20px;
    opacity: 0.7;
  }

  .userinfo {
  font-size: 20px;
    text-align: right;
  }

  .username_content {
    width: 560px;
    height: 60px;
    color: #ffffff;
    line-height: 60px;
    display: flex;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
  }
  .username_content .iphone::placeholder{
    color: rgb(64,66,92);
  }
  .username_content:hover{
    border-color: #C4C7FF;
  }
  .username_content .county {
    width: 160px;
    height: 60px;
    line-height: 60px;
    background: #1A1B3F;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowraz;
    position: relative;
  }
  .icon{
    font-size: 20px;
    position: absolute;
    right:10px;
    top:20px;
  }

  .county select {
    width: 160px;
    height: 60px;
    line-height: 60px;
    padding-left: 35px;
    border-style: none;
    outline: none;
    background: #1A1B3F;
    font-size: 20px;
    color: #FFFFFF;
  }

  .county select .op_item {
    width: 580px;
    height: 200px;
    font-size: 18px;
    color: #FFFFFF;
    background: #070825;
    border: 1px solid rgba(196, 199, 255, 0.15);
    border-radius: 2px;
  }

  .username_content .iphone {
    flex: 1;
    outline: none;
    border: 0;
    padding-left: 38px;
    background: #1A1B3F;
    font-size: 20px;
    color: #ffffff;

  }

  .userinfo .password {
    width: 100%;
    height: 60px;
    padding-left: 35px;
    box-sizing: border-box;
    font-size: 20px;
    outline: none;
    color: #FFFFFF;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
  }
  .userinfo .password:hover{
    border-color: #C4C7FF;
  }
  .userinfo .password::placeholder{
    color: rgb(64,66,92);
   }
  .login_btn {
    width: 500px;
    height: 56px;
    text-align: center;
    line-height: 56px;
    background: rgba(50,51,91,0.5);
    border-radius: 4px;
    font-size: 26px;
    color: #9598CB;
    font-weight: lighter;
    margin-top: 91px;
    margin-left: 27px;
    margin-bottom: 30px;
    cursor: pointer;
  }

  .login_btn:hover {
    opacity: 1;

  }

  /*获取手机验证码*/
  .verification {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
  }

  .verification input {
    height: 60px;
    width: 340px;
    padding-left: 10px;
    background: #1A1B3F;
    outline: none;
    border: 1px solid rgba(196, 199, 255, 0.15);
    font-size: 20px;
    color: #FFFFFF;
  }

  .verification .ver_btn {
    width: 190px;
    height: 60px;
    line-height: 60px;
    opacity: 0.45;
    background: #C4C7FF;
    border-radius: 2px;
    color: #ffffff;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
  }

  .verification .ver_btn .noClick {
    background: #ddd;
    cursor: default;
  }

  .form_div{
    text-align: center;
    width: 500px;
    line-height: 60px;
    margin: 20px auto;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
  }
  .form_div:first-child{
    margin-top: 90px;
  }
.googleVer .form_div{
  margin-bottom: 0px;
}
.contents{
  color: white;
  padding:0 38px;
  font-size: 24px;
}
  .form_div .form_txt{
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.28);
    border-radius: 2px;
    width: 500px;
    height: 60px;
    padding-left: 35px;
    text-align: left;

  }
  .form_div .form_input{
    height: 56px;
    width: 330px;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
    color: white;
    padding-left: 35px;
    font-size: 24px;

  }
  .form_div .form_input::placeholder{
    color: rgb(64,66,92);
  }
  .googleVer .form_div .form_input:hover{
    border-color:#C4C7FF;
  }
  .code{
    width: 160px;
    margin-left: 10px;
    height: 60px;
    font-size: 20px;
    line-height: 60px;
    background: #32335B;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
  }
  .prove_btn{
    width: 500px;
    height: 56px;
     margin-top: 70px;
    margin-bottom: 90px;
    background: #32335B;
    border-radius: 2px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: bold;
    cursor: pointer;
  }
  .look_btn{
    width: 500px;
    height: 56px;
    margin-top: 70px;
    margin-bottom: 90px;
    background: rgba(80, 107, 166);
    border-radius: 2px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: bold;
    cursor: pointer;
  }
  .googleVer .form_div .form_input{
    width: 100%;
  }
  .toggleVer{
    margin-top: 18px;
    font-size: 15px;
    color: #4A90E2;
    text-align: left;
    cursor: pointer;
  }
  .error_tip>span{
    cursor: pointer;
  }
  .error_tip{
    height: 40px;
    text-align: right;
    font-size: 18px;
    color: #F23757;
  }

</style>
