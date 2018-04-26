<template>
  <div class="all">
    <div class="header">
      <div class="container" style="text-align: left;width: 800px;">
        <img src="../../assets/imgs/logo.png" alt="" class="logo" @click="$router.push('/')">
      </div>
    </div>
  <div class="content container">
    <div class="trigon">&#9670</div>
    <div v-if="!nextFlag">
      <p  class="type_title">{{isPhone ? '手机号找回':'邮箱找回'  }}</p>
      <p @click="changeType" class="type">{{isPhone ? '邮箱找回' : '手机号找回'}}</p>

      <div v-if="isPhone" class="form_input" style="margin-top: 30px">
        <div class="div_select">
          <select name="" >
            <option v-if="show" class="op_item clearfix">中国 +86</option>
            <option class="op_item clearfix" v-for="item in countrys" value="item.id">
              <span style="float: left">{{item.chinese_name}} </span>
              <span style="float: right"> +{{item.tel}}</span>
            </option>
          </select>
          <i class="el-icon-arrow-down icon"></i>
        </div>
        <div style="width: 1px;height: 40px;float: right;border-left: 1px solid rgba(196,199,255,0.15);margin-top: 10px"></div>
          <input v-model="mobile" @blur="verMobile" v-on:keyup="error_phone=''" class="input" maxlength="11" type="text" placeholder="请输入手机号">

      </div>
      <div class="error_tip"><span  title="点击消失" @click="error_phone='';">{{error_phone}}</span></div>
      <div v-if="!isPhone" class="" style="margin-top: 30px">
        <div class="div_input">
          <input v-model="email" class="email_input" type="text" @blur="verEamil" v-on:keyup="error_email=''" placeholder="请输入邮箱" >
        </div>
        <div class="error_tip"><span  title="点击消失" @click="error_email='';">{{error_email}}</span></div>
      </div>

      <div v-if="isPhone" class="">
        <div class="div_input">
          <div class="ver_input">
            <input v-model="vercode" v-on:keyup="error_code=''" @blur="ver_vercode" type="text" placeholder="6位短信验证码">
            <div @click="getVercode"  class="ver_btn">{{getVericode}}</div>
          </div>
        </div>
      </div>
      <div v-if="!isPhone" class="">
        <div class="div_input">
          <div class="ver_input">
            <input v-model="emailCode" v-on:keyup="error_code=''" @blur="ver_vercode" type="text" placeholder="邮箱验证码">
            <div @click="getEmailcode"  class="ver_btn">{{getVericode}}</div>
          </div>
        </div>
      </div>
      <div class="error_tip"><span  title="点击消失" @click="error_code=''">{{error_code}}</span></div>
      <div @click="nextBtn" class="next" ref="forget_btn">下一步</div>
    </div>
    <!--开始修改密码-->

    <div v-if="nextFlag" style="margin-top: 30px">
      <p  class="type_title">请输入新密码</p>
      <div v-if="isPhone" class="form_div" style="margin-top: 30px">
        <div class="div_input" >
          <input  v-on:keyup="error_password=''" @blur="verPassword" v-model="newPassword" class="input" type="password" placeholder="请输入6-12字符">
        </div>
      </div>
      <div class="error_tip"><span  title="点击消失" @click="error_password=''">{{error_password}}</span></div>
      <div v-if="isPhone" class="form_div" style="margin-top: 40px">
        <div class="div_input">
          <input v-on:keyup="error_password2=''" @blur="verPassword2" v-model="newPassword2" class="input" type="password" placeholder="请再次输入新登录密码">
        </div>
      </div>
      <div class="error_tip"><span  title="点击消失" @click="error_password2=''">{{error_password2}}</span></div>
      <div @click="complated_btn()" ref="btn" class="complated">完 成</div>
    </div>
  </div>
  </div>
</template>

<script>
  import {httpGet, httpPost,setStore} from '../../utils'
  import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        show:true,
        isPhone: true,//是否手机号找回
        vercode: '',//手机验证码
        emailCode: '',//邮箱验证码
        getVericode: '获取验证码',//获取验证码 倒计时
        vericodeCount: '60',//获取验证码 倒计时 60s
        mobile: '',//手机号
        email: '',//邮箱
        countrys: [],//国家列表
        em: '',//点击完成时所需的参数
        nextFlag: false,//下一步 手机或邮箱验证通过
        error_phone:'',
        error_code:'',
        error_password:'',
        error_password2:'',
        error_email:"",
        newPassword: '',//新密码
        newPassword2: '',//确认密码
        codeOpen:true,
      }
    },
    computed: {
    },
    mounted() {
      this.getCountry();
    },

    watch:{
      countrys:function () {
        this.show=false;
      }
    },
    methods: {
      //Eamil验证
      verEamil(){
        var code=this.emailCode;
        if(this.email&&code.length==6){
          this.$refs.forget_btn.style.color="#FFFFFF";
        }else{
          this.$refs.forget_btn.style.color="#9598CB";
        }
        var filter=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(!this.email){
          this.error_email=""
          return;
        }else if(!filter.test(this.email)){
          this.error_email="邮箱格式有误！"
          return;
        }else{
          this.error_email=""
          return true;
        }
      },
      //手机号验证
      verMobile() {
          var code=this.vercode;
        if(this.mobile&&code.length==6){
          this.$refs.forget_btn.style.color="#FFFFFF";
        }else{
          this.$refs.forget_btn.style.color="#9598CB";
        }
    this.mobile = parseInt(this.mobile);
    var regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    if(!this.mobile) {
      this.mobile = '';
      this.error_phone =  '';
      return;
    }else if(!regMobile.test(this.mobile)) {

      var phone=this.mobile.toString();
      this.mobile=phone.substring(0,11);
      this.error_phone = '请输入正确的手机号码';
      return;
    }else {
      this.error_phone  = '';
      return true;
    }
  },
      //获取手机验证码
      getVercode() {
        var that = this;
        if(!that.codeOpen) {
          return;
        }
        that.verMobile();
        if(!that.verMobile()){
          return;
        }
        httpGet('/api/users/send_auth_code', {
          mobile: that.mobile
        }, function (res) {
          if (res.data.error_code == 0) {
            that.codeOpen=false;
            //倒计时
            that.getVericode = that.vericodeCount+'s后重新获取';
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
                that.codeOpen=true;
                clearInterval(timer1);
                that.getVericode = '重新获取';
              }
            }
            var timer1 = setInterval(GetRTime,1000);

          }

        })
      },
      //获取邮箱验证码
      getEmailcode() {
        var that = this;
        if(!that.codeOpen) {
          return;
        }
        that.verEamil();
        if(!that.verEamil()){
          return;
        }
        httpGet('/api/users/send_email_auth_code', {
          email: that.email,
        }, function (res) {
          //console.log('邮箱验证码', res);
          if (res.data.error_code == 0) {
              that.codeOpen=false;
            //倒计时
            that.getVericode = that.vericodeCount+'s后重新获取';
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
                that.codeOpen=true;
                clearInterval(timer1);
                that.getVericode = '重新获取';
              }
            }
            var timer1 = setInterval(GetRTime,1000);

          }
        })
      },
      //改变密码找回方式
      changeType() {
        this.error_email='';
        this.error_phone='';
        this.error_code="";
        this.mobile='';
        this.email='';
        this.emailCode='';
        this.vercode='';
        this.getVericode="获取验证码";
        this.isPhone = !this.isPhone;
      },
      //找回密码 下一步
      nextBtn() {
        var that = this;


        if (this.isPhone) {
          that.verMobile();
          if(!that.verMobile()){
            return;
          }
          that.ver_vercode();
          if(!that.ver_vercode()){
            return;
          }
          httpPost("/api/users/check_mobile_req_passwd", {
            mobile: that.mobile,
            auth_code: that.vercode,
          }, function (res) {
            if (res.data.error_code == 0) {
              that.nextFlag = true;
              that.email = "";
            }
          })
        } else {
          that.verEamil();
          if(!that.verEamil()){
            return;
          }
          that.ver_vercode();
          if(!that.ver_vercode()){
            return;
          }
          httpPost("/api/users/check_email_req_passwd", {
            email: that.email,
            auth_code: that.emailCode,
          }, function (res) {
            if (res.data.error_code == 0) {
              that.nextFlag = true;
              that.mobile="";
            }
          })
        }
      },
      //完成密码修改
      complated_btn() {
        var that = this;
        that.verPassword();
        if(!that.verPassword()){
          return;
        }
        that.verPassword2();
        if(!that.verPassword2()){
          return;
        }



        httpGet('/api/users/reset_passwd', {
          password: that.newPassword,
          mobile: that.mobile,
          email:that.email,
        }, function (res) {
          //console.log('修改成功', res);
          if(res.data.error_code == 0) {
            that.$router.push('/login');
            that.$message({
              message: '你已成功修改密码！',
              type: 'success'
            });
            setStore('userInfo',{
              username: that.mobile,
              password: that.newPassword})
          }
        })
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
      //密码验证
      verPassword() {
        if(this.newPassword.length>=6&&this.newPassword==this.newPassword2){
          this.$refs.btn.style.color="#FFFFFF";
        }else{
          this.$refs.btn.style.color="#9598CB";
        }
        var regFilterChinese = /[\u4e00-\u9fa5]/;
        var regLetter = /[a-zA-Z]+/;
        var regNum = /\d+/;
        var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
        var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;

        if(!this.newPassword){
          this.error_password = '';
          return;
        }
        if(regEn.test(this.newPassword) || regCn.test(this.newPassword)) {
          this.error_password= '密码不能包含特殊字符';
          return false;
        }
        if(this.newPassword.length<6||this.newPassword.length>30){

          this.error_password = '密码长度在6-30位之间';
          return;
        }
        if (regFilterChinese.test(this.newPassword)){
          this.error_password = '密码不能有汉字';
          return;
        }
        if(/^\d+$/.test(this.newPassword))
        {
          this.error_password =  "密码只能由数字和字母组成";
          return ;
        };
        if(/^[a-z]+$/i.test(this.newPassword))
        {
          this.error_password =  "密码只能由数字和字母组成";
          return ;
        }
        if(!/^[A-Za-z0-9]+$/.test(this.newPassword))
        {
          this.error_password =  "密码只能由数字和字母组成";
          return ;
        }
        if(this.newPassword2&&this.newPassword2!==this.newPassword){
          this.error_password = '';
          this.error_password2 = '两次密码输入不一致';
          return;
        }else{
          this.error_password2='';
          this.error_password = '';
          return true;
        }
        //修改密码之后，调用下确认密码
      },
      //验证确认密码是否与密码相同
      verPassword2() {
        if(this.newPassword.length>=6&&this.newPassword==this.newPassword2){
          this.$refs.btn.style.color="#FFFFFF";
        }else{
          this.$refs.btn.style.color="#9598CB";
        }
        if(!this.newPassword2){
          this.error_password2 = '';
          return;
        }else if(this.newPassword&&this.newPassword !== this.newPassword2) {
          this.error_password2 = '两次密码输入不一致';
          return;
        }else{
          this.error_password2 = '';
          return true;}
      },
      ver_vercode() {
        if(this.isPhone){
          var code=this.vercode;
        }else{
          var code=this.emailCode;
        }
        if(this.mobile&&code.length==6){
          this.$refs.forget_btn.style.color="#FFFFFF";
        }else{
          this.$refs.forget_btn.style.color="#9598CB";
        }
        if(!code) {
          this.error_code = '';
          return
        }else if(code.length!==6) {
          this.error_code = '验证码输入有误!';
          return
        }else{
          this.error_code = '';
          return true;
        }
      },
    }
  }
</script>

<style scoped>
  @import "../../common.css";
  .all {
    width: 100%;
    height:980px;
    font-family: PingFangSC-Regular;
    /*height: 700px;*/
    padding-top: 100px;
    font-size: 20px;
    background-image: linear-gradient(180deg, #1C1E59 -20%,#0C0D2D 30%);
  }

  .header{
    min-width: 1200px;
    display: flex;
    align-items: center;
    height: 100px;
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
    height: auto;
    padding: 80px 26px;
    margin: 160px auto;
    background-color:rgba(28,29,66,0.79);
    color: #ffffff;
    position: relative;
    /*height: 100%;*/
    /*padding: 30px;*/
    /*box-sizing: border-box;*/
  }
  .trigon{
    position: absolute;
    left: 50px;
    height: 21px;
    overflow: hidden;
    color: rgba(28,29,66,0.79);
    top: -21px;
    font-size: 30px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
    text-align: left;
  }

  .form_input {
    width: 560px;
    height: 60px;
    color: #ffffff;
    line-height: 60px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
  }
  .form_input:hover,.email_input:hover,.form_div .div_input .input:hover{
    border-color: #C4C7FF;
  }
  .form_input .input::placeholder,.email_input::placeholder,.form_div .div_input .input::placeholder{
    color: rgb(64,66,92);
  }

  .icon{
    font-size: 20px;
    position: absolute;
    right:10px;
    top:20px;
  }
  .div_select{
    width: 160px;
    height: 60px;
    line-height: 60px;
    background: #1A1B3F;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }
  .div_select select{
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
  .div_select select .op_item{
    width: 580px;
    height: 200px;
    font-size: 18px;
    color: #FFFFFF;
    background: #070825;
    border: 1px solid rgba(196, 199, 255, 0.15);
    border-radius: 2px;
  }
  .form_input .input {
    flex: 1;
    outline: none;
    border: 0;
    padding-left: 38px;
    background: #1A1B3F;
    font-size: 20px;
    color: #ffffff;
  }

  .div_input .ver_input {
    display: flex;
    justify-content: space-between;
  }

  .div_input .ver_input input {
    height: 60px;
    width: 340px;
    padding-left: 10px;
    background: #1A1B3F;
    outline: none;
    border: 1px solid rgba(196,199,255,0.15);
    font-size: 20px;
    color: #FFFFFF
  }
  .ver_input input:hover{
    border-color: #C4C7FF;
  }
  .ver_input input::placeholder{
    color: rgb(64,66,92);
  }
  .div_input .ver_input .ver_btn {
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

  .div_input .error_tip {
    margin: 5px 0;
    text-align: left;
    color: red;
  }
  .email_input{
    width: 560px;
    height: 60px;
    color: #ffffff;
    line-height: 60px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 20px;
    padding-left: 15px;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
  }
  .form_div .div_input .input{
    width: 100%;
    height: 60px;
    padding-left: 38px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 20px;
    outline: none;
    color: #FFFFFF;
    background: #1A1B3F;
    border: 1px solid rgba(196,199,255,0.15);
    border-radius: 2px;
  }

  .type {
    position: absolute;
    top: -45px;
    right: 0;
    font-size: 14px;
    text-align: right;
    cursor: pointer;
  }
  .type_title{
    position: absolute;
    top: -60px;
    left: 0;
    font-size: 28px;
    text-align: left;
  }

  .next {
    width: 460px;
    height: 60px;
    background: rgba(50,51,91,0.5);
    font-size: 26px;
    color: #C4C7FF;
    border-radius: 2px;
    text-align: center;
    line-height: 60px;
    cursor: pointer;
    margin: 80px auto 30px;
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

  .complated {
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
</style>
