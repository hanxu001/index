<template>
  <div>
  <div class="add_api">
    <p class="title">API管理</p>
    <hr color="#EEEEEE"/>
    <p style="margin:50px 0px;font-size: 18px">新建API</p>
    <div class="form_div">
      <span class="form_txt">备注：</span>
      <input v-model="remarks"  type="text" v-on:keyup='setBtnColor()' class="form_input"  placeholder="">
    </div>
    <div class="form_div">
      <span class="form_txt">绑定IP地址：</span>
      <input v-model="ip_binding"  type="text" v-on:keyup='setBtnColor()' class="form_input"   placeholder="(选填)">
    </div>
    <div @click="dialog" ref="addBtn" class="prove_btn">立即创建</div>

   <div>
     <div class="explanation">
       <strong>提现说明:</strong>
       <p>我们为您提供了强大的API，您可以通过 API 使用行情查询、自动交易等服务。<span>通过 API 文档</span> 查看如何使用。每个用户最多创建5对密钥。<span>请不要泄露您的密钥，以免造成资产损失。</span>出于安全考虑，建议为密钥绑定IP，每个密钥最多绑定4个IP。单个地址直接填写，多个IP地址用半角逗号分隔，如：192.168.1.1,&nbsp;192.168.1.2,&nbsp;192.168.1.3</p>
     </div>
   </div>

  </div >

    <div class="myApi">
      <p class="title">API管理</p>
      <table border="1" cellpadding="0" cellspacing="0">
        <thead>
        <tr>
          <td>备注</td>
          <td>创建时间</td>
          <td>API Key</td>
          <td>绑定IP地址</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="items in content">
          <!--<td>items</td>-->
          <td style="width: 10%">{{items.remarks}}</td>
          <td style="width: 18%">{{items.created_at}} </td>
          <td style="width: 42%">{{items.access_key}}</td>
          <td style="width: 20%"><div v-for="aip in items.ip" class="ip">{{aip}}</div></td>
           <td style="width: 10%"><span class="apiBtn" @click="edit(items.id)">编辑 </span><span class="apiBtn" @click="dele(items.id)"> 删除</span></td>
        </tr>
      </tbody>
      </table>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="close"
      >
      <!--修改spi-->
      <div class="editApi" v-if="editApi">
      <div class="form_div">
        <span class="form_txt">备注：</span>
        <input v-model="editRemarks"  type="text" class="form_input" v-on:keyup='setBtnColor()' placeholder="">
      </div>
      <div class="form_div">
        <span class="form_txt">绑定IP地址：</span>
        <input v-model="editIp"  type="text" class="form_input"  v-on:keyup='setBtnColor()' placeholder="(选填)">
      </div>
      <div @click="editVerify" ref="editBtn" class="prove_btn">保存</div>
      </div>
      <!--添加完成后产看API-->
      <div class="viewApis" v-if="lookApi">
        <div class="form_div">
          <span class="form_txt">apiKey：</span>
          <div class="form_txt"><span id="copyApi">{{viewApiKey}}</span>
            <div  class="copy"  v-clipboard:copy="viewApiKey"
                  v-clipboard:success="onCopy"
                  v-clipboard:error="onError">复制</div>
            <div style="width: 1px;height: 30px;float: right;border-left: 1px solid #979797;margin-top: 5px"></div></div></div>
        <div class="form_div">
          <span class="form_txt">secretKey：</span>
          <div class="form_txt"><span id="copeySecret">{{viewSecret}}</span>
            <div class="copy" v-clipboard:copy="viewSecret"
                 v-clipboard:success="onCopy"
                 v-clipboard:error="onError">复制</div>
            <div style="width: 1px;height: 30px;float: right;border-left: 1px solid #979797;margin-top: 5px"></div></div></div>
        <div class="form_div">
          <span class="form_txt">备注：</span>
          <span class="form_txt">{{viewRemarks}}</span></div>

        <div @click="[dialogVisible=false,lookApi=false,addOpen=false]" class="look_btn">确 定</div>
      </div>
      <!--API验证-->
      <div class="contents" v-if="addApi">
      <div class="googleVer" v-if="!way">
        <div class="form_div">
          <span class="form_txt">二次验证码：</span>
          <input v-model="googleCode"  type="text" class="form_input"  v-on:keyup='setBtnColor()' placeholder="请输入谷歌二次验证码">
        </div>

      </div>

      <div class="phoneCode" v-if="way">
        <div class="form_div">
          <span class="form_txt" style="margin-right:10px">手机：</span>
          <span class="form_txt">{{mobilePhone}}</span></div>

        <div class="form_div">
          <span class="form_txt">手机验证码：</span>
          <input v-model="veriCode"  type="text" class="form_input" v-on:keyup='setBtnColor()'  placeholder="">
         <div @click="getVeriCode"  class="code">{{codeName}}</div>
        </div>
      </div>
      <div @click="addApiCode" class="prove_btn" ref="codeBtn">{{btnNanme}}</div>
      <div class="toggleVer" @click="codeWay">{{wayName}}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {httpGet, httpPost, getUesrInfo,getCookie} from '../../../../utils'


  export default {
    data() {
      return {
        wayName:"切换谷歌二次验证",
        way:true,
        btnNanme:"保存",
        viewApiKey:"",
        viewSecret:"",
        viewRemarks:"",
        lookApi:false,//查看api的弹窗
        editApi:false,//编辑api的弹窗
        deleApi:false,//删除api的弹窗
        addApi:false,//新增api的弹窗
        codeName:"获取验证码",
        veriCode:"",//验证码
        dialogTitle:"",//弹窗标题
        dialogVisible: false,//弹窗的开关
        remarks:"",//api备注
        ip_binding:"",//IP地址
        mobilePhone:"",//手机号
        phone:"",//手机号
        editRemarks:"",//修改中的备注
        editIp:"",//修改中的Ip
        addOpen:false,
        editOpen:false,
        deleOpen:false,
        content:[],

        userInfo: {}, //用户状态
        hasLogin: false, //登录状态
      }
    },
     computed: {
      //...mapState(["userInfo",'hasLogin'])
     },
    mounted() {
        this.getUesrInfo();
        this.viewApi();
    },
    watch:{
      editRemarks:function () {
        if(this.editRemarks){
          this.dialogVisible=true;
          this.editApi=true;
        }
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
      //添加api
      dialog(){
        if (!this.remarks){
          this.$message.error('备注为空！');
          return;
        }
         this.addOpen=true;
        var that=this;
        httpGet('/api/api_keys/new', {
          remarks: that.remarks,
          ip:that.ip_binding,
        }, function (res) {
          if(res.data.error_code == 0) {
            var phone=res.data.data.mobile;
            that.remarks=res.data.data.remarks;
            that.ip_binding=res.data.data.ip;
            that.phone=phone;
            that.mobilePhone=phone.replace(phone.substring(3,9),"*******");
            that.dialogTitle="创建API";
            that.addApi=true;
            that.dialogVisible=true;
            var div=document.getElementsByClassName("el-dialog__header");
            div[0].style.background="#f9f9f9";
          }
        })
      },
      //提交验证码
      addApiCode(){
        if(!this.veriCode){
          this.$message({
            message: '验证码为空！',
            type: 'error'
          });
          return;
        }
        var that = this;
        httpPost("/api/api_keys/checkMessage", {
            mobile: that.phone,
            msg_code:that.veriCode
          }, function (res) {
          if (res.status== 200) {
            if(that.deleOpen){
              that.setDele();
            }else if(that.addOpen){
              that.setApi();
            }else if(that.editOpen){
              that.setEdit();
            }
            that.veriCode="";
          }
      })
      },

      //执行创建API
      setApi(){
        var that = this;
        httpPost("/api/api_keys/create", {
          remarks: that.remarks,
          ip:that.ip_binding,
        }, function (res) {
          if (res.data.error_code == 0) {
            that.addApi=false;
            that.lookApi=true;
            that.viewApiKey=res.data.data.access_key,
              that.viewSecret=res.data.data.access_secret,
              that.viewRemarks=res.data.data.remarks,
              that.dialogTitle="查看API";
              that.viewApi();
              that.$message({
              message: '已成功创建！',
              type: 'success'
            });
          }

        })
      },
      //获得验证码
      getVeriCode(){
        if (this.codeName != '获取验证码') {
          return;//先判断是不是已经获取验证码了，如果是 就不执行下面的语句了
        }
        var that = this;
        //that.verMobile();//获取验证码的时候先验证手机号
        httpGet("/api/api_keys/sendMessage", {
          mobile: that.phone
        }, function (res) {
          if (res.data.error_code == 0) {
            that.$message({
              message: '已发送至手机',
              type: 'success'
            });
            that.codeName="60s后重新获取";
            function GetRTime() {
              that.codeName= parseInt(that.codeName);
              if (that.codeName > 0) {
                that.codeName -= 1;
                if (that.codeName < 10) {
                  that.codeName = '0' + that.codeName+ 's后重新获取';
                } else {
                  that.codeName = that.codeName + 's后重新获取';
                }
              } else {
                clearInterval(timer1);
                that.codeName= '获取验证码';
              }
            }

            var timer1 = setInterval(GetRTime, 1000);
          } else {
            that.errorMessage = res.data.error_reason;
          }
        })
      },
      //切换验证方式
      codeWay(){
        if(this.way){
          this.way=false;
          this.wayName="切换手机短信";
        }else{
          this.way=true;
          this.wayName="切换谷歌二次验证";
        }
      },
      //查看当前账户的api
      viewApi(){
        var that=this;
        httpGet('/api/api_keys/index', {
        }, function (res) {
          if(res.data.error_code == 0) {
            var time=res.data.data;
            for(var i in time){
              time[i].created_at=that.getTimeStr(time[i].created_at);
            }
            that.content=time;
          }
        })
      },
      //编辑api
      edit(data){
        this.editOpen=true;
        this.id=data;
        this.dialogTitle="修改API";
        var that=this;
        httpGet('/api/api_keys/edit', {
          id:that.id
        }, function (res) {
          if(res.data.error_code == 0) {
           that.editRemarks=res.data.data.remarks;
            that.editIp=res.data.data.ip;
            that.dialogVisible=true;
            that.editApi=true;
          }
        })
      },
      editVerify(){
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          var phone = JSON.parse(initInfo).username;
          this.phone=phone;
          this.mobilePhone=phone.replace(phone.substring(3,9),"*******");
        }
        this.editApi=false;
        this.addApi=true;
      },
      setEdit(){
        var that=this;
        httpPost('/api/api_keys/update', {
          id:that.id,
          remarks:that.editRemarks,
          ip:that.editIp,
        }, function (res) {
          if(res.data.error_code == 0) {
            that.dialogVisible=false;
            that.addApi=false;
            that.editOpen=false;
            that.viewApi();
            that.$message({
              message: '已成功修改',
              type: 'success'
            });

          }
        })

      },
      dele(data){
        this.deleOpen=true;
        this.addApi=true;
        this.dialogTitle="删除API";
        this.btnNanme="确定";
        this.id=data;
        var that=this;
        httpGet('/api/api_keys/mobile', {

        }, function (res) {
          if(res.data.error_code == 0) {
             that.phone=res.data.mobile;
            var phone=that.phone;
            that.mobilePhone=phone.replace(phone.substring(3,9),"*******");
            that.dialogVisible=true;
          }
        })
      },
      setDele(){
        var that=this;
        httpPost('/api/api_keys/delete', {
          id:that.id
        }, function (res) {
          console.log(res);
          if(res.data.error_code == 0) {
            that.dialogVisible=false;
            that.deleOpen=false;
            that.addApi=false;
            that.viewApi();
            that.$message({
              message: '已成功删除',
              type: 'success'
            });

          }
        })

      },
      close(done){
        done();
        this.dialogVisible=false;
        this.addApi=false;
        this.lookApi=false;
        this.addOpen=false;
        this.way=true;
        this.googleCode="";
        this.veriCode="";
        this.editApi=false;
        this.editOpen=false;
        this.deleOpen=false;
      },
      getTimeStr(time){
        var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = date.getHours() + ':';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+h + m + s;
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
      //输入后按钮变色
      setBtnColor(){
        if(this.remarks||this.ip_binding){
          this.$refs.addBtn.style.background="#506BA6";
        }else{
          this.$refs.addBtn.style.background="#C8C8CB";
        }
        // if(this.addOpen){
        //   if(this.addApi){
        //     if(this.way){
        //       if(this.veriCode){
        //
        //         console.log(this.$refs.codeBtn);
        //         this.$refs.codeBtn.style.background="#506BA6";
        //       }else{
        //         this.$refs.codeBtn.style.background="#C8C8CB";
        //       }
        //     }else{
        //       if(this.googleCode){
        //         this.$refs.codeBtn.style.background="#506BA6";
        //       }else{
        //         this.$refs.codeBtn.style.background="#C8C8CB";
        //       }
        //     }
        //   }
        // }
        // else if(this.editApi){
        //   if(this.editRemarks||this.editIp){
        //     this.$refs.editBtn.style.background="#506BA6";
        //   }else{
        //     this.$refs.editBtn.style.background="#C8C8CB";
        //   }
        // }
      },
    }
//查看API信息

  }
</script>

<style scoped>
  @import "../../../../common.css";
 .add_api{
   background-color: #ffffff;
   padding: 30px 50px;
 }
  .add_api .title{
    font-size: 20px;
    color: #000000;
    text-align: left;
    margin-bottom: 22px;
    cursor: pointer;
  }
  .form_div{
    text-align: center;
    width: 500px;
    padding-left: 42px;
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
    background-color:#F9F9F9 ;
    height: 36px;
    width: 326px;
    border-radius: 3px;
    outline:none;
    border: 1px solid #dcdfe6;
    padding-left: 10px;

  }
  .form_div .form_input::placeholder{
    font-size: 16px;
    color: #999999;
  }
  .prove_btn{
    width: 460px;
    height: 50px;
    margin: 50px auto;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: bold;
    cursor: pointer;
    background: #C8C8CB;
    border-radius: 2px;
  }
  .explanation{
    margin-top: 90px;
    padding: 20px 25px;
    background-color: #F9F9F9;;
    font-size: 14px;
    line-height: 27px;
    text-align: left;
    color: #000000;
  }
  .explanation strong{
    font-size: 18px;
  }
  .explanation span{

    color: #4A90E2;
  }
  .myApi{
    background-color: #FFFFFF;
    margin-top: 10px;
    text-align: left;
    padding: 30px 50px;
  }
  .myApi table{
    width: 100%;
    font-size: 14px;
      text-align: center;
      border-style: none;
    }

  .myApi table thead tr{
    background: #F9F9F9;
    height: 40px;
  }
  .myApi table thead tr td{
    border-style: none;

  }
  .myApi table tbody tr{
 height: 40px;
  }
  .myApi table tbody tr td{
    border-bottom-color: #eeeeee;
    border-style: none none solid none;
  }
  .myApi .apiBtn{
    color: #4A90E2 ;
    cursor: pointer;
  }
  .myApi .title{
    font-size: 18px;
    color: #000000;
    text-align: left;
    margin-bottom: 22px;
    cursor: pointer;
  }

  .phoneCode .form_div{
    width: 100%;
    padding-left: 0px;
    margin: 0px auto;
    margin-top: 20px;
  }
  .phoneCode .form_div:nth-child(2){
    margin: 20px auto;
  }
  .phoneCode .form_div input{
    width: 200px;
    font-size: 18px;
  }
  .phoneCode .form_div .form_txt{
    width: 110px;
    text-align: right;
  }
  .phoneCode .form_div .form_txt:nth-child(2){
    text-align: left;
    width: 260px;
   margin-right: 10px;
  }

  .phoneCode>.form_div>.code{
    width: 120px;
    margin-left: 10px;
    line-height: 36px;
    background-color: #C8C8CB;
    border-radius: 2px;
    text-align: center;
    cursor: pointer;
  }
  .contents .prove_btn{
    width: 100%;
    margin-top: 90px;
    margin-bottom: 0px;
  }
  .contents{
  }
  .toggleVer{
    margin-top: 18px;
    font-size: 15px;
    color: #4A90E2;
    text-align: left;
    cursor: pointer;
  }
  .el-dialog__header{
    background: #f9f9f9;
  }
  .googleVer .form_div{
    padding: 0px 10px;
  }
  .googleVer .form_input{
    width: 300px;
  }
  .viewApis .form_div{
  padding: 0px;
  }
  .viewApis .form_div .form_txt{
  width: 100px;
    text-align: right;
    height: 40px;
    line-height: 40px;
  }
  .viewApis .form_div .form_txt:nth-child(2){
    padding-left: 10px;
    text-align: left;
    font-size: 16px;
    width: 70%;
  }
  .viewApis .form_div>div{
    background: #F9F9F9;
    border: 1px solid #E5E5E5;
    border-radius: 2px;
  }
  .editApi .form_div{
    padding-left: 0px;
  }
  .editApi .form_div .form_txt:first-child{
    text-align: right;
  }
  .look_btn{
    width: 460px;
    height: 50px;
    margin: 50px auto;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: bold;
    cursor: pointer;
    background: rgba(80, 107, 166);;
    border-radius: 2px;
  }
  .copy{
    color: #4A90E2;
    cursor: pointer;
    float: right;
    text-align: center;
    width:11%;
  }
</style>
