<template>
  <div v-if="isShow" class="content">
    <p class="title">身份认证</p>
    <hr color="#EEEEEE"/>
    <div v-if="show">
    <div v-if="kycStatus != 2" class="tip"><img src="../../../../assets/imgs/personal_p_Shape.png" alt="">根据国家监管要求，需要实名认证才能提现，请您完成身份验证！请使用真实姓名，否则将无法提现</div>
    <!--未认证-->
    <div v-if="kycStatus == 0" class="no_prove">
      <div class="form_div">
        <span class="form_txt">国籍：</span>
        <div class="form_input form_input_select">
          <el-select class="form_select" v-model="country" >
            <el-option
              v-for="item in countrys"
              :key="item.id"
              :label="item.chinese_name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form_div">
        <span class="form_txt">证件类型：</span>
        <div class="form_input form_input_select">
          <el-select class="form_select" v-model="IDType" placeholder="请选择">
            <el-option
              v-for="item in IDTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="form_div">
        <span class="form_txt">姓名：</span>
        <input v-model="realName" type="text" class="form_input" maxlength="10" @blur="name" placeholder="请输入真实姓名">
      </div>
      <div class="form_div">
        <span class="form_txt">证件号码：</span>
        <input v-model="idCard" type="text" class="form_input" maxlength="30" @blur="cardCode" placeholder="请输入证件号码">
      </div>
      <div class="agreement">
        <input @click="isChecked = !isChecked" type="checkbox" checked="checked">
        <span>我承诺提交信息属于本人所用，不存在盗用他人信息行为</span>
      </div>
      <p v-if="errorTip" class="error_tip">{{errorMessage}}</p>
      <div @click="getProve" :class="['prove_btn',country&&IDType&&realName&&idCard&&isChecked?'blue':'']">提交认证</div>
    </div>
    </div>
    <!--审核中-->
    <div v-if="kycStatus == 1" class="proveing">
      <img src="../../../../assets/imgs/personal_p_proving.png" alt="审核中">
      <p class="txt">审核中...</p>
      <p class="txt_tip">提现，绑定银行卡操作需要进行身份验证</p>
    </div>
    <!--审核失败-->
    <div v-if="kycStatus == -1" class="proveing prove_fail">
      <img src="../../../../assets/imgs/personal_p_fial.png" alt="审核失败">
      <p class="txt">审核未通过</p>
      <p class="txt_tip">提现，绑定银行卡操作需要进行身份验证</p>
      <p class="again_prove" @click="kycStatus=0">重新验证</p>
    </div>
    <!--认证通过-->
    <div v-if="kycStatus == 2" class="proved">
      <img src="../../../../assets/imgs/personal_p_proved.png" alt="审核失败">
      <p class="txt">身份验证已通过</p>
      <div class="info_list">
        <span class="info_list_txt">国籍：</span>
        <span class="info_list_state">{{countryName}}({{countryNameEn}})</span>
      </div>
      <div class="info_list">
        <span class="info_list_txt">姓名：</span>
        <span class="info_list_state">{{realName}}</span>
      </div>
     <!--  <div class="info_list">
        <span class="info_list_txt">账号：</span>
        <span class="info_list_state">{{userName}}</span>
      </div> -->
      <div class="info_list">
        <span class="info_list_txt">证件号码：</span>
        <span class="info_list_state">{{cardNum}}</span>
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
            show:false,
            countrys: [],
            country: '中国',//国籍
            IDTypes: [{
              value: '1',
              label: '身份证'
            }, {
              value: '2',
              label: '护照'
            }],
            IDType: '1',//证件类型
            realName: '',//用户真实姓名
            idCard: '',//身份证号
            userName: '',//用户
            countryName: '',//国籍
            countryNameEn: '',//国籍 英文
            kycStatus: false,//身份验证情况 状态

            isShow: true,//解决闪现

            isChecked: true,//是否同意协议
            errorTip: false,//错误提示开关
            errorMessage: '',//错误提示信息
            pass:true,
            cardNum: '',//证件号

            userInfo: {}, //用户状态
            hasLogin: false, //登录状态
          }
      },
      computed: {
        //...mapState(['userInfo','hasLogin'])
      },
      mounted() {
        this.getUesrInfo();

        this.checkUserStatus();
        this.getCountry();
      },
      methods: {
          getUesrInfo () {
              let initInfo = getCookie('userInfo');
              if (initInfo) {
                  this.userInfo = JSON.parse(initInfo)
                  this.hasLogin = true
              }
          },
        //获取国家
        getCountry() {
          var that = this;
          httpGet("/api/countries/countries",{

          },function (res) {
            //console.log('国家接口',res)
            if(res.data.error_code == 0) {
              that.countrys = res.data.user_login_histories.countory;
            }
          })
        },
        //提交认证
        getProve() {
          if(!this.isChecked) {
            this.errorMessage = '请先同意协议!';
            this.errorTip = true;
            return false;
          }
          this.name();
          if(!this.pass){
            return;
          }
          this.cardCode();
          if(!this.pass){
            return;
          }
          var that = this;
          httpPost("/api/users/kyc1",{
            country_id: that.country,
            real_name: that.realName,
            id_card_num: that.idCard,
            type: that.IDType
          },function (res) {
            //console.log("提交认证",res);
            if(res.data.error_code == 0) {
              that.$message({
                message: '认证成功',
                type: 'success'
              });
              //that.errorTip = false;
              window.location.reload();
            }else{
              //that.errorTip = true;
              //that.errorMessage = res.data.error_reason;
              that.$message.error('身份认证失败');
            }
          })
        },
        //认证前先获取 用户验证情况
        checkUserStatus() {
          var that = this;
          httpGet('/api/users/user_code',{
          },function (res) {
            if(res.data.error_code == 0) {
              console.log(res);
              that.show=true;
              that.userName = res.data.username;
              that.kycStatus = res.data.kyc1_status;
              console.log(res);
              if(res.data.kyc1_status == 2) {
                that.show=false;
                that.realName = res.data.real_name;
                that.cardNum = res.data.id_card_num;
                that.countryName = res.data.country_chinese_name;
                that.countryNameEn = res.data.country_english_name;
              }
              that.isShow  = true
            }
          })
        },
        name(){
          var regName =/^[\u4e00-\u9fa5]{2,4}$/;
          if(!this.realName){
            this.errorMessage="请输入姓名！";
            this.errorTip=true;
            this.pass=false;
            return;
          }
          if(!regName.test(this.realName)){
            this.errorMessage="您的姓名输入有误！";
            this.errorTip=true;
            this.pass=false;
            return;
          }else{
            this.errorMessage="";
            this.errorTip=false;
            this.pass=true;
          }
        },
        cardCode(){
          if(!this.idCard){
            this.errorMessage="请输入身份证！";
            this.errorTip=true;
            this.pass=false;
            return;
          }
          var idCard=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
          if(!idCard.test(this.idCard)){
            this.errorMessage="您的身份证输入有误！";
            this.pass=false;
            this.errorTip=true;
            return;
          }else{
            this.errorMessage="";
            this.errorTip=false;
            this.pass=true;
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
    margin-bottom: 22px;
  }
  .error_tip{
    margin: 20px 0;

    color: red;
    font-weight: bold;
    cursor: pointer;
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
  /*未认证*/
  .no_prove{

  }
  .form_div{
    width: 500px;
    line-height: 50px;
    margin: 20px auto;
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
    height: 36px;
    width: 326px;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .form_div .form_input::placeholder{
    font-size: 16px;
    color: #999999;
  }
  .form_input_select{
    position: relative;
  }
  .form_select{
    height: 36px;
    width: 326px;
    position: absolute;
    left: 0;
    top: -3px;
  }

  .agreement{
    display: flex;
    justify-content: center;
    height: 30px;
    font-size: 12px;
    color: #666666;
    align-items: center;
  }
  .agreement input{
    width:12px;
    height: 12px;
    margin-right: 10px;
  }

  .prove_btn{
    width: 452px;
    height: 50px;
    margin: 30px auto;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: bold;
    cursor: pointer;
    background: #C8C8CB;
    border-radius: 2px;
  }
  .blue{
    background: #506BA6;
  }
  /*审核中*/
  .proveing{

  }
  .proveing img{
    width: 69px;
    height: 72px;
    margin: 130px auto 36px;
  }
  .proveing .txt{
    font-size: 22px;
    color: #000000;
    margin-bottom: 20px;
  }
  .proveing .txt_tip{
    font-size: 18px;
    color: #666666;
  }
  /*未通过*/
  .prove_fail img{
    margin-top: 86px;
  }
   .proveing .again_prove{
     width: 160px;
     height: 38px;
     line-height: 38px;
     text-align: center;
     background: #506BA6;
     border-radius: 2px;
     font-size: 16px;
     color: #FFFFFF;
     margin: 54px auto 0;
     cursor: pointer;
   }
  /*验证通过*/
  .proved img{
    width: 66px;
    height: 66px;
    margin: 88px auto 28px;
  }
  .proved .txt{
    font-size: 20px;
    color: #000000;
    margin-bottom: 46px;
  }
  .info_list{
    width: 280px;
    margin: 0 auto 26px;
    display: flex;
    font-size: 18px;
    color: #666666;
  }
  .info_list_txt{
    width: 100px;
    text-align: left;
    margin-right: 10px;
  }
 /* .info_list .no_ver{
    color: coral;
    cursor: pointer;
  }*/
</style>
