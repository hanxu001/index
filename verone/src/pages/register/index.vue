<template>
    <div class="all">
      <div class="header">
        <div class="container" style="text-align: left;width: 800px;">
          <img src="../../assets/imgs/logo.png" alt="" class="logo" @click="$router.push('/')">
        </div>
      </div>
      <div class="content"  >
        <div class="trigon">&#9670</div>
        <div class="title">
          <div class="title_left">手机注册</div>
          <div @click="gotoLogin" class="title_right">登录</div>
        </div>
        <div class="username">
          <div class="country">
            <select name="">
              <option v-if="show" class="op_item clearfix">中国 +86</option>
              <option class="op_item clearfix" v-for="item in countrys" :value="item.id">
                <span style="float: left">{{item.chinese_name}}</span>
                <span style="float: right"> +{{item.tel}}</span>
              </option>
            </select>
            <i class="el-icon-arrow-down icon"></i>
          </div>
          <div style="width: 1px;height: 40px;float: right;border-left: 1px solid rgba(196,199,255,0.15);margin-top: 10px"></div>
          <input  v-model="username"
                  @blur="verMobile"
                  maxlength="11"
                  v-on:keyup="phoneOpen"
                  class="phone" type="text" placeholder="手机号">
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_phone='';">{{error_phone}}</span></div>
        <div class="verification">
          <input v-model="vercode" @blur="ver_vercode" v-on:keyup="codeOpen" maxlength="6" type="text" placeholder="6位短信验证码">
          <div @click="getVercode" class="ver_btn">{{getVericode}}</div>
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_code=''">{{error_code}}</span></div>
        <div class="code">
          <input v-model="password" @blur="verPassword" v-on:keyup="codePass" type="password" placeholder="密码">
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_password=''">{{error_password}}</span></div>
        <div class="code2">
          <input v-model="password2" @blur="verPassword2" v-on:keyup="codePass2" type="password" placeholder="确认密码">
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_password2=''">{{error_password2}}</span></div>
        <div class="agreement">
          <input @click="isChecked=!isChecked" type="checkbox" checked="checked">
          <div class="agreement_txt">
            <span>已阅读并同意</span>
            <span class="xieyi">《狮子用户服务协议》</span>
          </div>
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_check=''">{{error_check}}</span></div>
        <div @click="gotoRegister" ref="logon_btn" :class="['register_btn',username&&ver_vercode&&password&&password2?'blue':'']">注 册</div>
      </div>
    </div>
</template>

<script>
    import { httpGet, httpPost, setStore, setCookie, getCookie,getStore} from '../../utils'
    import {mapState, mapMutations} from 'vuex'

    export default {
        data() {
            return {
              vers:true,
              show:true,
              username: '',
              password: '',
              password2: '',
              vercode: '', //验证码
              error_phone:'',
              error_code:'',
              error_password:'',
              error_password2:'',
              error_check:"",
              isChecked: true, //同意协议是否选中
              getVericode: '获取短信验证码', //获取短信验证码倒计时60秒
              mobileCount: 60, //短信验证码倒计时60秒
              noClick: false,
              country: '中国 +86',//国家
              countrys: [],//国家列表
            }
        },
        computed: {
        },
        mounted() {
          this.getCountry();
        },
      watch:{
        countrys:function () {
          if(this.countrys){
            this.show=false;
          }
        }
      },
        methods: {
          //已有账户，点击登录 跳转至登录页
          gotoLogin() {
            this.$router.push('login');
          },
          //注册
          gotoRegister() {
            var that = this;
            that.verMobile();
          if(!that.verMobile()){
            return;
          }
            that.ver_vercode();
            if(!that.ver_vercode()){
              return;
            }
            that.verPassword();
            if(!that.verPassword()){
              return;
            }
            that.verPassword2();
            if(!that.verPassword2()){
              return;
            }
            if(!that.isChecked){
              that.error_check = '请先同意服务协议';
              return;
            };
            httpPost("/api/users/register",{
              mobile: that.username,
              password: that.password,
              auth_code: that.vercode
            },function (res) {
              if(res.data.error_code == 0){
                setStore('userInfo', {
                  username: that.username,
                  password: that.password
                });
                let expireDays = 1;
                setCookie('userInfo', {
                  username: that.username,
                  password: that.password,
                  sid: res.data.sid,
                }, expireDays);
                that.$message({
                  message: '恭喜你，注册成功',
                  type: 'success'
                });
                that.$router.push('/')
              }
            })
          },
          //获取手机验证码
          getVercode() {
              if(!this.vers){
                return;
              }
            var that = this;
            that.verMobile();//获取验证码的时候先验证手机号
            console.log(that.verMobile());
            if (!that.verMobile()){
              return
            }
            httpGet("/api/users/send_auth_code",{
              mobile: that.username,
              auth_type:"register"
            },function (res) {
              if(res.data.error_code == 0) {
                that.vers=false;
                that.getVericode = that.mobileCount+'s后重新获取';
                that.$message({
                  message: '已发送至手机',
                  type: 'success'
                });
                function GetRTime() {
                  that.getVericode = parseInt(that.getVericode);
                  if(that.getVericode >1) {
                    that.getVericode -= 1;
                    if(that.getVericode<10) {
                      that.getVericode = '0'+ that.getVericode +'s后重新获取';
                    }else{
                      that.getVericode = that.getVericode +'s后重新获取';
                    }
                  }else{
                    clearInterval(timer1);
                    that.vers=true;
                    that.getVericode = '重新获取';
                    that.noClick = false;
                  }
                }
                var timer1 = setInterval(GetRTime,1000);
              }
            })
          },
          //手机号验证
          verMobile() {
            if(this.username&&this.vercode&&this.password.length>=6&&this.password==this.password2){
              this.$refs.logon_btn.style.color="#FFFFFF";
            }else{
              this.$refs.logon_btn.style.color="#C4C7FF";
            }
            this.username = parseInt(this.username);
            var regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
            if(!this.username) {
              this.username = '';
              this.error_phone =  '';
              return;
            }else if(!regMobile.test(this.username)) {
              this.error_phone = '请正确输入手机号码';
              return;
            }else {
              this.error_phone  = '';
              return true;
            }
          },
          //密码验证
          verPassword() {
            if(this.username&&this.vercode&&this.password.length>=6&&this.password==this.password2){
              this.$refs.logon_btn.style.color="#FFFFFF";
            }else{
              this.$refs.logon_btn.style.color="#C4C7FF";
            }
            var regFilterChinese = /[\u4e00-\u9fa5]/;
            var regLetter = /[a-zA-Z]+/;
            var regNum = /\d+/;
            var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
            var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

            if(!this.password){
              this.error_password = '';
              return;
            }
              if(regEn.test(this.password) || regCn.test(this.password)) {
              this.error_password= '密码不能包含特殊字符';
              return false;
            }
            if(this.password.length<6||this.password.length>30){

              this.error_password = '密码长度在6-30位之间';
              return;
            }
            if (regFilterChinese.test(this.password)){
              this.error_password = '密码不能有汉字';
              return;
            }
            if(/^\d+$/.test(this.password))
            {
              this.error_password =  "密码只能由数字和字母组成";
              return ;
            };
            if(/^[a-z]+$/i.test(this.password))
            {
              this.error_password =  "密码只能由数字和字母组成";
              return ;
            }
            if(!/^[A-Za-z0-9]+$/.test(this.password))
            {
              this.error_password =  "密码只能由数字和字母组成";
              return ;
            }
            if(!this.password2&&this.password2!==this.password){
              this.error_password = '';
                this.error_password2 = '两次密码输入不一致';
                return;
            }else{
              this.error_password = '';
              return true;
            }
            //修改密码之后，调用下确认密码
          },
          //验证确认密码是否与密码相同
          verPassword2() {
            if(this.username&&this.vercode&&this.password.length>=6&&this.password==this.password2){
              this.$refs.logon_btn.style.color="#FFFFFF";
            }else{
              this.$refs.logon_btn.style.color="#C4C7FF";
            }
            if(!this.password2){
              this.error_password2 = '';
              return;
            }else if(this.password !== this.password2) {
              this.error_password2 = '两次密码输入不一致';
              return;
            }else{
            this.error_password2 = '';
            return true;}
          },
          //验证短信验证码
          ver_vercode() {
            var number=/^\d{6}$/;
            var code=this.vercode;
              if(this.username&&this.vercode&&this.password.length>=6&&this.password==this.password2){
               this.$refs.logon_btn.style.color="#FFFFFF";
              }else{
                this.$refs.logon_btn.style.color="#C4C7FF";
              }
            if(!this.vercode) {
              this.error_code = '';
              return
            }else if(!number.test(this.vercode)) {
              this.error_code = '验证码输入有误!';
              return
            }else{
              this.error_code = '';
              return true;
            }
          },
          //获取国家列表
          getCountry() {
            var that = this;
            httpGet('/api/countries/countries',{},function (res) {
              if(res.data.error_code == 0) {
                that.countrys = res.data.user_login_histories.countory;
              }
            })
          },
          codePass(){
            this.error_code = '';
            this.error_phone  = '';
            this.error_password='';
            this.error_password2='';
            var regFilterChinese = /[\u4e00-\u9fa5]/;
            var regLetter = /[a-zA-Z]+/;
            var regNum = /\d+/;
            var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
            var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

            if(!this.password){
              this.error_password = '请输入密码';
              return;
            }
            if(regEn.test(this.password) || regCn.test(this.password)) {
              this.error_password= '密码不能包含特殊字符';
              return false;
            }
            if(this.password.length<6||this.password.length>30){

              this.error_password = '密码长度在6-30位之间';
              return;
            }
            if (regFilterChinese.test(this.password)){
              this.error_password = '密码不能有汉字';
              return;
            }
            if(/^\d+$/.test(this.password))
            {
              this.error_password =  "密码只能由数字和字母组成";
              return ;
            };
            if(/^[a-z]+$/i.test(this.password))
            {
              this.error_password =  "密码只能由数字和字母组成";
              return ;
            }
            if(!/^[A-Za-z0-9]+$/.test(this.password))
            {
              this.error_password =  "密码只能由数字和字母组成";
              return ;
            }
            if(!this.password2&&this.password2!==this.password){
              this.error_password = '';
              this.error_password2 = '两次密码输入不一致';
              return;
            }else{
              this.error_password = '';
              return true;
            }
          },
          codePass2(){
            this.error_code = '';
            this.error_phone  = '';
            this.error_password='';
            this.error_password2='';
            if(this.password2.length<6){
              this.error_password2 = '';
              return;
            }
            if(this.password&&this.password !== this.password2) {
              this.error_password2 = '两次密码输入不一致';
              return;
            }else{
              this.error_password2 = '';
              return true;}
          },
          codeOpen(){
            var number=/[1-9]\d*/;
            var code=this.vercode;
            this.error_code = '';
            this.error_phone  = '';
            this.error_password='';
            this.error_password2='';
            if(!this.vercode) {
              this.vercode='';
              return
            }else if(!number.test(this.vercode)) {
              this.vercode=code.substring(0,6);
              this.vercode=code.substring(0,code.length-1);
              return
            }else{
              this.error_code = '';
              return true;
            }
          },
          phoneOpen(){
            this.error_code = '';
            this.error_phone  = '';
            this.error_password='';
            this.error_password2='';
            this.username = parseInt(this.username);
            var regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
            if(!this.username) {
              this.username = '';
              return;
            }else if(!regMobile.test(this.username)) {
              var phone=this.username.toString();
              this.username=phone.substring(0,11);
              return;
            }else {
              this.error_phone  = '';
              return true;
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
    font-size: 20px;
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
  .logo{
    width: 115px;
    height: 37px;
    margin-left: 20px;
    margin-right: 22px;
    cursor: pointer;
  }
  .content {
    width: 560px;
    padding: 65px 28px 56px 28px;
    margin: 100px auto;
    margin-top: 81px;
    margin-bottom: 100px;
    background-color:rgba(28,29,66,0.79);
    color: #ffffff;
    position: relative;
  }
  .trigon{
    position:absolute;
    left:50px;
    height: 21px;
    overflow: hidden;
    color:rgba(28,29,66,0.79);
    top:-21px;
    font-size:30px;
  }
  .title{
    line-height: 80px;
    display: flex;
    justify-content: space-between;
  }
  .title .title_left{
    position: absolute;
    top: -80px;
    left: 0;
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

  .username{
    width: 560px;
    height: 60px;
    color: #ffffff;
    line-height: 60px;
    display: flex;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
  }
  .username .phone::placeholder,.verification input::placeholder,.code input::placeholder,.code2 input::placeholder{
    color: rgb(64,66,92);
  }
  .username:hover,.verification input:hover,.code input:hover,.code2 input:hover{
    border-color: #C4C7FF;
  }
  .username .country {
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

  .country select {
    width: 160px;
    height: 60px;
    line-height: 60px;
    padding-left: 15px;
    border: 0;
    outline: none;
    background: #1A1B3F;
    font-size: 20px;
    color: #FFFFFF;
  }

  .country select .op_item {
    width: 580px;
    height: 200px;
    font-size: 18px;
    color: #FFFFFF;
    background: #070825;
    border: 1px solid rgba(196, 199, 255, 0.15);
    border-radius: 2px;
  }

  .username .phone {
    flex: 1;
    outline: none;
    border: 0;
    padding-left: 38px;
    background: #1A1B3F;
    font-size: 20px;
    color: #ffffff;

  }
  .verification{
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .verification input{
    height: 60px;
    width: 340px;
    padding-left: 10px;
    background: #1A1B3F;
    outline: none;
    border: 1px solid rgba(196,199,255,0.15);
    font-size: 20px;
    color: #FFFFFF;
  }
  .verification .ver_btn{
    width: 190px;
    height: 60px;
    line-height: 60px;
    background-color: rgba(196,199,255,0.13);
    border-radius: 2px;
    color: #ffffff;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
  }
  .code,.code2{
    height: 60px;
  }
  .code input,.code2 input{
    height: 58px;
    width: 550px ;
    padding-left: 10px;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 3px;
    outline: none;
    font-size: 20px;
    color: #ffffff;
  }
  .agreement{
    display: flex;
    justify-content: center;
    height: 30px;
    font-size: 14px;
    color: #C4C7FF;
    align-items: center;
    margin-top: 60px;
  }
  .agreement input{
    width:16px;
    height: 16px;
    margin-right: 10px;
  }
  .agreement .agreement_txt .xieyi{
    font-size: 14px;
    color: #4A90E2;
    cursor: pointer;
  }
  .register_btn{
    width: 460px;
    height: 60px;
    background: rgba(50,51,91,0.5);
    font-size: 26px;
    color: #C4C7FF;
    border-radius: 2px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    margin: 0 auto 30px;
  }
  .register_btn:hover{
    opacity: 1;
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
