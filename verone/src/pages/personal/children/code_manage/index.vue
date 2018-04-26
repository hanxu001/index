<template>
  <div class="content">
    <p class="title"><span @click="changeCodeFlag = false;changeCodeFlag_logo = false;title_twoFlag = false,errorTip=false,getCnyCodeFlag=false">密码管理 </span><span style="color:#D8D8D8"> > </span>
      <span v-if="title_twoFlag" @click="cnyCode1='',verCode='',cnyCode2='',cnyCodeOld='',cnyCodeNew='',cnyCodeNew2='',errorTip=false">{{title_two}}</span></p>
    <hr color="#EEEEEE"/>
    <div v-if="changeCodeFlag" class="tip"><img src="../../../../assets/imgs/personal_p_Shape.png" alt="">资金密码修改后，24小时内限制提现</div>
    <p v-if="errorTip" @click="errorTip = !errorTip" class="error_tip">{{errorMessage}}</p>
    <div v-if="show">
    <div v-if="!changeCodeFlag && !changeCodeFlag_logo && !getCnyCodeFlag" class="code_manage">
      <div class="code_set code_set1">
        <div class="left">
          <div class="img"><img src="../../../../assets/imgs/personal_m_z.png" alt=""></div>
          <div class="txt">
            <p class="img_title">资金密码</p>
            <p class="title_tip">提现时使用资金密码</p>
          </div>
        </div>
        <div @click="changeCodeFlag = true;title_twoFlag = true;title_two = '设置资金密码'" class="right">{{fundPwdTxt}}</div>
      </div>
      <div class="code_set">
        <div class="left">
          <div class="img"><img src="../../../../assets/imgs/personal_m_l.png" alt=""></div>
          <div class="txt">
            <p class="img_title">登录密码</p>
            <p class="title_tip">登录账户时输入</p>
          </div>
        </div>
        <div @click="changeCodeFlag_logo = true;title_twoFlag = true;title_two = '修改登录密码'" class="right">修改</div>
      </div>
    </div>
    </div>
    <!--设置资金密码-->
    <div v-if="changeCodeFlag && !fundPwd" class="cnyCode">
      <div class="form_div">
        <span class="form_txt">新资金密码：</span>
        <input v-model="cnyCode1" type="password" @blur="cnyPassword(cnyCode1,cnyCode2)" class="form_input" maxlength="16" placeholder="请输入新资金密码">
      </div>
      <div class="form_div">
        <span class="form_txt">确认资金密码：</span>
        <input v-model="cnyCode2" type="password" class="form_input" @blur="cnyPassword2(cnyCode2,cnyCode1)" maxlength="16" placeholder="请再次输入资金密码">
      </div>
      <div class="form_div">
        <span class="form_txt">验证码：</span>
        <input v-model="verCode" class="ver_input" @blur="verCodes(verCode)" type="text" placeholder="短信验证码">
        <div @click="getVercode" :class="['ver_btn',noClick?'noClick':'']">{{getVericode}}</div>
      </div>
      <div @click="setCnyCode" :class="['prove_btn',cnyCode1&&cnyCode2&&verCode?'blue':'']">确认</div>
    </div>
    <!--修改资金密码-->
    <div v-if="changeCodeFlag && fundPwd" class="cnyCode">
      <div class="form_div">
        <span class="form_txt">原资金密码：</span>
        <input v-model="cnyCodeOld" type="password" maxlength="16" @blur="cnyPass" class="form_input" placeholder="请输入原资金密码">
      </div>
      <div class="form_div">
        <span class="form_txt">新资金密码：</span>
        <input v-model="cnyCodeNew" type="password" maxlength="16" @blur="cnyPassword(cnyCodeNew,cnyCodeNew2)" class="form_input" placeholder="请输入新资金密码">
      </div>
      <div class="form_div">
        <span class="form_txt">确认资金密码：</span>
        <input v-model="cnyCodeNew2" type="password"  maxlength="16" @blur="cnyPassword2(cnyCodeNew2,cnyCodeNew)" class="form_input" placeholder="请再次输入新资金密码">
      </div>
      <p @click="getCnyCodeFlag = true;changeCodeFlag = false" class="cnyCode_forgte">忘记资金密码?</p>
      <div @click="modifyCnyCode" :class="['prove_btn',cnyCodeOld&&cnyCodeNew&&cnyCodeNew2?'blue':'']">确认</div>
    </div>
    <!--修改登录密码-->
    <div v-if="changeCodeFlag_logo" class="cnyCode">
      <div class="form_div">
        <span class="form_txt">原登录密码：</span>
        <input v-model="logoCodeOld" type="password" @blur="verPassold" maxlength="20" class="form_input" placeholder="请输入原登录密码">
      </div>
      <div class="form_div">
        <span class="form_txt">新登录密码：</span>
        <input v-model="logoCodeNew" @blur="verPassword" maxlength="20" type="password" class="form_input" placeholder="8-20位数字与字母组合">
      </div>
      <div class="form_div">
        <span class="form_txt">确认密码：</span>
        <input v-model="logoCodeNew2" @blur="verPassword2" maxlength="20" type="password" class="form_input" placeholder="请再次输入登录密码">
      </div>
      <div @click="modifyLogoCode" :class="['prove_btn',logoCodeOld&&logoCodeNew&&logoCodeNew2?'blue':'']">确认</div>
    </div>
    <!--忘记资金密码-->
    <div v-if="getCnyCodeFlag">
      <div v-if="!nextFlag">
        <p @click="changeType" class="type">{{isPhone ? '邮箱找回' : '手机号找回'}}</p>
        <div v-if="isPhone" class="form_div">
          <span class="form_txt">手机号</span>
          <!--<input v-model="mobile" class="form_input" type="text" placeholder="请输入手机号">-->
          <span class="form_input" style="text-align: left;padding-left:0">{{mark_mobile}}</span>
        </div>
        <div v-if="!isPhone" class="form_div">
          <span class="form_txt">邮箱</span>
          <!--<input v-model="email" class="form_input" type="text" placeholder="请输入邮箱">-->
          <span class="form_input">{{email}}</span>
        </div>
        <div v-if="isPhone" class="form_div">
          <span class="form_txt">请输入验证码</span>
          <input v-model="vercode" class="ver_input" @blur="verCodes(vercode)" type="text" placeholder="短信验证码">
          <div @click="getVercode" class="ver_btn">{{getVericode}}</div>
        </div>
        <div v-if="!isPhone" class="form_div">
          <span class="form_txt">请输入验证码：</span>
          <input v-model="emailCode" class="ver_input" @blur="verCodes(emailCode)" type="text" placeholder="邮箱验证码">
          <div @click="getEmailcode" :class="['ver_btn',noClick?'noClick':'']">{{getVericode}}</div>
        </div>
        <div @click="nextBtn" :class="['prove_btn',vercode||emailCode?'blue':'']">下一步</div>
      </div>
      <!--开始修改密码-->
      <div v-if="nextFlag">
        <div v-if="isPhone" class="form_div">
          <span class="form_txt">新资金密码：</span>
          <input v-model="newPassword" class="form_input" maxlength="16"  @blur="cnyPassword(newPassword,newPassword2)" type="password" placeholder="请输入8-20字符">
        </div>
        <div v-if="isPhone" class="form_div">
          <span class="form_txt">确认密码：</span>
          <input v-model="newPassword2" class="form_input" maxlength="16"  @blur="cnyPassword2(newPassword2,newPassword)" type="password" placeholder="请再次输入新密码">
        </div>
        <div @click="complated_btn(em)" :class="['prove_btn',newPassword&&newPassword2?'blue':'']">完成</div>
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
              setCodeList: [{
                txt:'资金密码',
                action: '设置'
              },{
                txt:'登录密码',
                action: '修改'
              }],

              show:false,
              changeCodeFlag: false, //设置 修改 资金密码
              changeCodeFlag_logo: false, //修改登录密码
              errorMessage: '',//错误提示信息
              errorTip: false,//错误提示信息 默认不显示
              verCode: '',//手机验证码
              cnyCode1: '',//资金密码新
              cnyCode2: '',//资金密码确认
              cnyCodeOld: '',// 老资金密码  修改资金密码
              cnyCodeNew: '',//新资金密码 修改资金密码
              cnyCodeNew2: '',//确认新资金密码 修改资金密码
              logoCodeOld: '',//老登录密码 修改登录密码
              logoCodeNew: '',//新登录密码 修改登录密码
              logoCodeNew2: '',//确认登录密码 修改登录密码
              title_two: '',//标题 二级标题
              title_twoFlag: false,//二级标题开关
              fundPwd: false,//资金密码是否设置  默认为设置
              fundPwdTxt: '',//资金密码设置/修改
              getCnyCodeFlag: false,//找回资金密码 开关  默认为false  找回资金密码
              isPhone: true,//是否手机号找回  找回资金密码
              vercode: '',//手机验证码  找回资金密码
              emailCode: '',//邮箱验证码  找回资金密码
              getVericode: '获取验证码',//获取验证码 倒计时  找回资金密码
              noClick: false,//是否不可点击
              vericodeCount: '60',//获取验证码 倒计时 60s  找回资金密码
              mobile: '',//手机号  找回资金密码
              mark_mobile: '',//手机号掩码  找回资金密码
              email: '',//邮箱  找回资金密码
              email_auth: '',//邮箱验证情况  找回资金密码
              em: '',//点击完成时所需的参数  找回资金密码
              nextFlag: false,//下一步 手机或邮箱验证通过  找回资金密码
              newPassword: '',//新密码  找回资金密码
              newPassword2: '',//确认密码  找回资金密码

              canRegister: false,//是否可以修改登录密码

              userInfo: {}, //用户状态
              hasLogin: false, //登录状态
            }
        },
        computed: {
          //...mapState(["userInfo","hasLogin"])
        },
        mounted() {
          this.getUesrInfo();
          this.getUserProve();
        },
      watch:{
        fundPwdTxt:function () {
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
          //设置资金密码
          setCnyCode() {
              // if(this.cnyCode1 != this.cnyCode2) {
              //     this.$message.error('两次密码输入不一致');
              //     return;
              // }
              this.cnyPassword(this.cnyCode1,this.cnyCode2)
            if(!this.canRegister){
                return;
            }
            this.cnyPassword2(this.cnyCode2,this.cnyCode1)
            if(!this.canRegister){
              return;
            }
            this.verCodes(this.verCode);
            if(!this.canRegister){
              return;
            }
            var that = this;
            httpPost("/api/users/create_fund_password",{
              password: that.cnyCode1,
              mobile_code: that.verCode
            },function (res) {
              if(res.data.error_code === 0){

                that.$message({
                  showClose: true,
                  message: '恭喜你，设置成功',
                  type: 'success'
                });
                 window.location.reload();
              }
            })
          },
          //修改资金密码
          modifyCnyCode() {
            this.cnyPass();
            if(!this.canRegister){
              return;
            }
            this.cnyPassword(this.cnyCodeNew,this.cnyCodeNew2)
            if(!this.canRegister){
              return;
            }
            this.cnyPassword2(this.cnyCodeNew2,this.cnyCodeNew)
            if(!this.canRegister){
              return;
            }
            var that = this;

            if(that.cnyCodeNew !== that.cnyCodeNew2){
              that.errorTip = true;
              that.errorMessage = '两次新密码输入不一致';
              return;
            }else {
              that.errorTip = false;
            }
            httpPost("/api/users/change_fund_password",{
              old_password: that.cnyCodeOld,
              new_password: that.cnyCodeNew
            },function (res) {
              if(res.data.error_code == 0) {
                that.$message({
                  showClose: true,
                  message: '恭喜你，修改成功',
                  type: 'success',
                  duration:2000,
                  onClose:function () {
                    window.location.reload();
                  }
                });

              }else{
                that.$message.error(res.data.error_reason);
              }
            })
          },
          //修改登录密码
          modifyLogoCode() {
              this.verPassword();
            if(!this.canRegister){
              return;
            }
            this.verPassword2();
            if(!this.canRegister){
              return;
            }
              if(this.logoCodeNew !== this.logoCodeNew2) {
                  this.$message.error('两次密码输入不一致');
                  return;
              }
              if(this.logoCodeNew == this.logoCodeOld) {
                  this.$message.error('新密码不能与原密码相同');
                  return;
              }
            var that = this;
            httpGet("/api/users/change_password",{
              old_password: that.logoCodeOld,
              new_password: that.logoCodeNew
            },function (res) {
              //console.log(res);
              if(res.data.error_code == 0) {
                that.errorTip = false;
                that.logoCodeOld = '';
                that.logoCodeNew = '';
                that.logoCodeNew2 = '';
                that.$message({
                  showClose: true,
                  duration:2000,
                  type: 'success',
                  message: '成功修改密码!',
                  onClose:function () {
                    window.location.reload();
                  }
                });
              }
            })
          },
          //认证前先获取 用户验证情况
          getUserProve() {
            var that = this;
            httpGet('/api/users',{

            },function (res) {
              //console.log('用户验证情况',res);
              if(res.data.error_code == 0) {
                that.mobile = res.data.mobile;
                that.mark_mobile = res.data.mark_mobile;
                that.email = res.data.email;
                that.email_auth = res.data.email_auth;
                if(res.data.is_need_fund_pwd == 0) {
                  that.fundPwd = true //资金密码已设置
                  that.fundPwdTxt = '修改' //资金密码已设置 即修改
                }else {
                  that.fundPwd = false //资金密码未设置
                  that.fundPwdTxt = '设置' //资金密码未设置 即设置
                }

                //console.log(that.mark_mobile);
              }
            })
          },
          //找回资金密码
          //获取手机验证码
          getVercode() {
            var that = this;
            if(that.getVericode != '获取验证码') {
              return;
            }
            httpGet('/api/users/send_auth_code', {
              mobile: that.mobile
            }, function (res) {
              //console.log('手机验证码', res);
              if (res.data.error_code == 0) {
                that.errorTip = false;
                that.noClick = true;
                that.$message({
                  showClose: true,
                  message: '已发送至手机',
                  type: 'success'
                });
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
          //获取邮箱验证码
          getEmailcode() {
            var that = this;
            if(that.getVericode != '获取验证码') {
              return;
            }
            httpGet('/api/users/send_email_auth_code', {
              email: that.email,
            }, function (res) {
              //console.log('邮箱验证码', res);
              if (res.data.error_code == 0) {
                that.errorTip = false;
                 that.noClick = true;
                that.$message({
                  showClose: true,
                  message: '已发送至邮箱！',
                  type: 'success'
                });
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
                    clearInterval(timer1);
                    that.getVericode = '获取验证码';
                    that.noClick = false;
                  }
                }
                var timer1 = setInterval(GetRTime,1000);

              }
            })
          },
          //改变密码找回方式
          changeType() {
            if(this.email_auth == 2) {
              this.errorTip = false;
              this.isPhone = !this.isPhone;
            }else{
              //this.errorTip = false;
              //this.isPhone = !this.isPhone;
               this.$message.error('邮箱未验证！请先绑定邮箱');
              //this.$router.push('/personal/setsecurity/3');
            }
          },
          //找回密码 下一步
          nextBtn() {
            var that = this;
            if (this.isPhone) {
              this.verCodes(this.vercode);
              if(!this.canRegister){
                return;
              }
              httpPost("/api/users/check_auth_code", {
                mobile: that.mobile,
                mobile_code: that.vercode,
              }, function (res) {
                //console.log('手机号', res);
                if (res.data.error_code == 0) {
                  that.errorTip = false;
                  that.nextFlag = true;
                  that.em = that.mobile;

                  //var mobile = that.mobile;
                  //console.log(mobile);
                  //that.complated_btn('0', mobile);
                }
              })
            } else {
              this.verCodes(this.emailCode);
              if(!this.canRegister){
                return;
              }
              httpPost("/api/users/check_email_code", {
                email: that.email,
                email_code: that.emailCode,
              }, function (res) {
                //console.log('邮箱', res);
                if (res.data.error_code == 0) {
                  that.errorTip = false;
                  that.isPhone=true;
                  that.nextFlag = true;
                  that.em = that.email;
                  //var email = that.email;
                  //that.complated_btn(email, '0');
                } else {
                  that.nextFlag = false;
                  that.errorTip = true;
                  that.errorMessage = res.data.error_reason;
                }
              })
            }
          },
          //完成资金密码修改 即 重新设置
          complated_btn(em) {
            this.cnyPassword(this.newPassword,this.newPassword2);
            if(!this.canRegister){
              return;
            }
            this.cnyPassword2(this.newPassword2,this.newPassword);
            if(!this.canRegister){
              return;
            }
            this.verPassold();
            if(!this.canRegister){
              return;
            }
            var that = this;
            httpPost('/api/users/create_fund_password', {
              password: that.newPassword
            }, function (res) {
              //console.log('修改成功', res);
              if(res.data.error_code == 0) {
                that.$message({
                  message: '恭喜你，密码修改成功',
                  type: 'success',
                  duration:2000,
                  onClose:function () {
                    window.location.reload();
                  }
                });
              }
            })
          },
          //登录密码验证
          //密码验证
          verPassword() {
            var regFilterChinese = /[\u4e00-\u9fa5]/;
            var regLetter = /[a-zA-Z]+/;
            var regNum = /\d+/;
            var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
            var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            if(regEn.test(this.logoCodeNew) || regCn.test(this.logoCodeNew)) {
              this.errorTip = true;
              this.errorMessage = '密码不能包含特殊字符';
              this.canRegister = false;
              return;
            };
            if(!this.logoCodeNew){
              this.errorTip = true;
              this.errorMessage = '密码不能为空';
              this.canRegister = false;
              return;
            }else if(this.logoCodeNew.length<6||this.logoCodeNew.length>20){
              this.errorTip = true;
              this.errorMessage = '密码长度在6-20位之间';
              this.canRegister = false;
              return;
            }else if (regFilterChinese.test(this.logoCodeNew)){
              this.errorTip = true;
              this.errorMessage = '密码不能有汉字';
              this.canRegister = false;
              return;
            }else {
              this.errorTip = false;
              this.errorMessage = '';
              this.canRegister = true;
            }
            //修改密码之后，调用下确认密码
          },
          verPassold() {
            var code=/^[A-Za-z0-9]+$/;
            var letter=/^[A-Za-z]+$/;
            var number=/^[0-9]*$/;
           if(!this.logoCodeOld){
             this.errorTip = true;
             this.errorMessage = '请输入原密码!';
             this.canRegister = false;
             return;
            }
            if(this.logoCodeOld.length<6||this.logoCodeOld.length>20){
              this.errorTip = true;
              this.errorMessage = '原密码输入有误！';
              this.canRegister = false;
              return;
            }else if(number.test(this.logoCodeOld)){
             this.errorTip = true;
             this.errorMessage = '原密码输入有误！';
             this.canRegister = false;
             return;
           }else if(letter.test(this.logoCodeOld)){
              this.errorTip = true;
              this.errorMessage = '原密码输入有误！';
              this.canRegister = false;
              return;
            }else if(!code.test(this.logoCodeOld)) {
              this.errorTip = true;
              this.errorMessage = '原密码输入有误！';
              this.canRegister = false;
              return;
            }else{
              this.errorTip = false;
              this.errorMessage = '';
              this.canRegister = true;
            }
            //修改密码之后，调用下确认密码
          },
          //验证确认密码是否与密码相同
          verPassword2() {
            if(!this.canRegister) {
              return;
            }
            if(!this.logoCodeNew2){
              this.errorTip = true;
              this.errorMessage = '请正确输入确认密码';
              this.canRegister = false;
              return;
            }
            if(this.logoCodeNew !== this.logoCodeNew2) {
              this.errorTip = true;
              this.errorMessage = '两次密码输入不一致';
              this.canRegister = false;
              return;
            }else{
              this.errorTip = false;
              this.errorMessage = '';
              this.canRegister = true;
            }

          },
          cnyPass(){
            var code=/^[A-Za-z0-9]+$/;
            var letter=/^[A-Za-z]+$/;
            var number=/^[0-9]*$/;
            if(!this.cnyCodeOld){
              this.errorTip = true;
              this.errorMessage = '请输入资金密码';
              this.canRegister = false;
              return;
            }
            if(this.cnyCodeOld.length>=6&&this.cnyCodeOld.length<=16){
              if(number.test(this.cnyCodeOld)||letter.test(this.cnyCodeOld)||code.test(this.cnyCodeOld)){
                this.errorTip = false;
                this.errorMessage = '';
                this.canRegister = true;
              }else{
                this.errorTip = true;
                this.errorMessage = '原密码输入错误！';
                this.canRegister = false;
                return;
              }
            }else{
              this.errorTip = true;
              this.errorMessage = '原密码输入错误!';
              this.canRegister = false;
              return;
            }
          },
          cnyPassword(cnyCode1,cnyCode2){
              console.log(cnyCode1);
            var code=/^[A-Za-z0-9]+$/;

            if(!cnyCode1){
              this.errorTip = true;
              this.errorMessage = '请输入资金密码';
              this.canRegister = false;
              return;
            }
            if(cnyCode1.length>=6&&cnyCode1.length<=16){
              if(code.test(cnyCode1)){
                this.errorTip = false;
                this.errorMessage = '';
                this.canRegister = true;
              }else{
                this.errorTip = true;
                this.errorMessage = '请输入6-16位字母|数字|字母+数字的密码组合';
                this.canRegister = false;
                return;

              }
              if(cnyCode2&&cnyCode2!==cnyCode1){
                this.errorTip = true;
                this.errorMessage = '密码输入不一致';
                this.canRegister = false;
                return;
              }else{
                this.errorTip = false;
                this.errorMessage = '';
                this.canRegister = true;

              }
            }else{
              this.errorTip = true;
              this.errorMessage = '请输入6-16位字母|数字|字母+数字的密码组合';
              this.canRegister = false;
              return;
            }
          },
          cnyPassword2(cnyCode2,cnyCode1){

            if(!cnyCode2){
              this.errorTip = true;
              this.errorMessage = '请输入资金密码';
              this.canRegister = false;
              return;
            }
            if(cnyCode2.length<6||cnyCode2.length>16){
              this.errorTip = true;
              this.errorMessage = '请输入6-16位字母|数字|字母+数字的密码组合';
              this.canRegister = false;
              return;
            }
            if(cnyCode1&&cnyCode2!==cnyCode1){
              this.errorTip = true;
              this.errorMessage = '密码输入不一致';
              this.canRegister = false;
              return;
            }else{
              this.errorTip = false;
              this.errorMessage = '';
              this.canRegister = true;
            }
          },
          verCodes(code) {
            var number=/^[0-9]*$/;
            if(!code) {
              this.errorTip = true;
              this.errorMessage = '请输入验证码!';
              this.canRegister = false;
              return
            }else if(code.length!==6||!number.test(code)){
              this.errorTip = true;
              this.errorMessage = '验证码输入有误!';
              this.canRegister = false;
              return
            }else{
              this.errorTip = false;
              this.errorMessage = '';
              this.canRegister = true;
            }
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
    margin-bottom: 29px;
    cursor: pointer;
  }

  .code_manage{
    width: 600px;
    height: auto;
    margin: 0 auto;
    padding: 50px;
  }
  .code_manage .code_set{
    height: 80px;
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
  .code_set1{
    margin-bottom: 30px;
  }

  /*设置资金密码*/
  .cnyCode{

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
    text-align: left;
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
    color: #ffffff;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
    background: #506BA6;
    border-radius: 2px;
  }
   .form_div .noClick{
    background: #ddd;
    cursor: default;
  }
  .prove_btn{
    width: 452px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    margin: 60px auto 0;
    cursor: pointer;
    background: #C8C8CB;
    border-radius: 2px;
  }
  .blue{
    background: #506BA6;
  }
  .tip{
    display: flex;
    align-items: center;
    justify-content: center;
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
  /*修改资金密码*/
  .cnyCode_forgte{
    width: 500px;
    margin: 20px auto 0;
    text-align: right;
    font-size: 16px;
    color: #4575BD;
    cursor: pointer;
  }
  .error_tip{
    margin: 20px 0;
    text-align: left;
    color: red;
    font-weight: bold;
    cursor: pointer;
  }
  /*找回资金密码*/
  .type {
    text-align: right;
    cursor: pointer;
    margin: 5px auto;
    width: 500px;
    font-size: 20px;
    color: #506BA6;
  }
</style>
