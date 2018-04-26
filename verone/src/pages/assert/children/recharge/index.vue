<template>
  <div class="content">
    <p class="title">充值币种</p>
    <hr color="#EEEEEE"/>

    <div class="coin_content_wrap">
      <ul class="coin_content">
        <li v-for="item in coinlist" @click="changecoin(item.currency)" :class="['coin_item',itemSysmbol==item.currency?'active':'']">{{item.code}}</li>
      </ul>
      <!-- <hr class="coin_line" color="#eee"/> -->
    </div>
    <div v-if="itemSysmbol == 'CNY'" class="tip"><img src="../../../../assets/imgs/personal_p_Shape.png" alt="">单笔充值最高50,000 CNY,金额超出请联系客服充值</div>
    <div v-if="itemSysmbol != 'CNY'" class="tip"><img src="../../../../assets/imgs/personal_p_Shape.png" alt="">此地址仅接受 {{itemSysmbol}} 充值,任何非{{itemSysmbol}}的充值将不可找回</div>
    <!--如果是人民币充值-->
    <div v-if="itemSysmbol == 'CNY'">
      <div class="recharge_num">
        <p class="re_txt">充值金额（CNY）：</p>
        <input v-model="rechargeNum" class="re_input" @input="verRechargeNumInput" maxlength="10" type="text" placeholder="最少输入100.00">
        <div @click="$router.push('/help')" class="help">
          <img style="width: 20px;height: 20px" src="../../../../assets/imgs/recharge_help.png" alt="帮助">
          <span>如何充值？</span>
        </div>
      </div>
      <div @click="createIndent" :class="['re_btn',rechargeNum?'blue':'']">生成充值订单</div>
      <p class="assert_title">充值记录</p>
      <el-row class="record_title_txt">
        <el-col :span="6"><div class="item">时间</div></el-col>
        <el-col :span="6"><div class="item">金额（$）</div></el-col>
        <el-col :span="6"><div class="item">充值状态</div></el-col>
        <el-col :span="6"><div class="item">操作</div></el-col>
      </el-row>
      <ul class="record_content_wrap">
        <li v-for="item in cnyWithdrawsListPage">
          <el-row class="record_content">
            <!--<el-col :span="6"><div class="item">{{item.created_at}}</div></el-col>-->
            <el-col :span="6"><div class="item" @click="lookWithdraw(item.id,item.status)">{{item.createdAt}}</div></el-col>
            <el-col :span="6"><div class="item" @click="lookWithdraw(item.id,item.status)">{{item.amount}}</div></el-col>
            <el-col :span="6"><div class="item" @click="lookWithdraw(item.id,item.status)">{{item.status_text}}</div></el-col>
            <el-col v-if="item.status == 0" :span="6"><div class="item itemClose" @click="closeRecharge(item.currency,item.id)">取消</div></el-col>
            <el-col v-if="item.status != 0" :span="6"><div class="item" @click="lookWithdraw(item.id,item.status)">{{item.status_text}}</div></el-col>
          </el-row>
        </li>
      </ul>
      <!--分页-->
      <div v-if="totalcny>5">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="5"
          layout="prev, pager, next, jumper"
          :total=totalcny>
        </el-pagination>
      </div>
    </div>
    <!--生成充值页面-->
    <div v-if="indetFlag" class="modal"></div>
    <div v-if="indetFlag" class="indent_wrap">
      <div class="indent_title">
        <p class="in_title">订单详情</p>
        <p @click="close" class="close">X</p>
      </div>
      <div class="indent">
        <p class="in_code">
          请使用本人银行卡转账到一下账号，并将转账留言中备注识别码：
          <i class="red">{{indentCode}}</i>
        </p>
        <p class="in_tip">* 为保证尽快到账，请务必正确填写金额、识别码等信息。</p>
        <p class="red">请不要使用支付宝，ATM机汇款</p>
        <div class="card_info">
          <div class="ca_info_list">
            <span class="ca_list_txt">转账金额：</span>
            <span class="ca_list_content red" style="font-size: 20px;font-weight: bold">￥ {{amount}}</span>
          </div>
          <div class="ca_info_list">
            <span class="ca_list_txt">收款人：</span>
            <span class="ca_list_content">{{gather}}</span>
          </div>
          <div class="ca_info_list">
            <span class="ca_list_txt">开户行：</span>
            <span class="ca_list_content">{{openBank}}</span>
          </div>
          <div class="ca_info_list">
            <span class="ca_list_txt">账号：</span>
            <span class="ca_list_content red" style="font-size: 20px;font-weight: bold">{{account}}</span>
          </div>
          <div class="ca_info_list">
            <span class="ca_list_txt">转账备注：</span>
            <p class="ca_list_content">
              <span class="red">{{indentCode}}</span>
              <span class="red">（请勿备注其他内容）</span>
            </p>
          </div>
        </div>
        <div @click="payComplated" class="complated">完成支付</div>
        <div @click="payQuestion" class="question">支付中遇到问题</div>
      </div>
    </div>
    <!---->
    <!--如果是数字币充值-->
    <div v-if="itemSysmbol != 'CNY'">
      <div @click="$router.push('/help')" class="coin_help">
        <img src="../../../../assets/imgs/recharge_help.png" alt="帮助">
        <span>如何充值？</span>
      </div>
      <div class="coin_address_wrap">
        <p class="coin_address_txt">充值地址：</p>
        <input v-model="sigleCoinInfo.deposit_addresses" id="copy" value="sigleCoinInfo.deposit_addresses" type="text" class="coin_address">
        <p data-copytarget="#copy" @click="copyHadler" class="coin_address_cody">复制</p>
        <div class="ercord">
          <img :src="qrcodeSrc" alt="二维码">
          <p>使用{{sigleCoinInfo.currency}}钱包扫码支付</p>
        </div>
      </div>
      <p class="coin_re_tip_title">充值说明:</p>
      <p class="coin_re_tip red">此地址仅接受{{sigleCoinInfo.code}}充值，任何非{{sigleCoinInfo.code}}的充值将不可找回。</p>
      <p class="coin_re_tip2">由于{{sigleCoinInfo.code}}转账需要整个{{sigleCoinInfo.code}}网络节点的确认，故到账时间由网络的拥挤程度决定，1次确认后入账，6次确认后可提现。</p>
      <p class="re_record_txt">充值记录</p>
      <el-row class="record_title_txt">
        <el-col :span="6"><div class="item">时间</div></el-col>
        <el-col :span="6"><div class="item">数量</div></el-col>
        <el-col :span="8"><div class="item">收币地址</div></el-col>
        <el-col :span="4"><div class="item">状态</div></el-col>
      </el-row>
      <ul class="record_content_wrap">
        <li v-for="item in coinWithdrawsListPage">
          <el-row class="record_content">
            <el-col :span="6"><div class="item" >{{item.createdAt}}</div></el-col>
            <el-col :span="6"><div class="item" >{{item.amount}}</div></el-col>
            <el-col :span="8"><div class="item" >{{item.to_address}}</div></el-col>
            <el-col v-if="item.status == 0" :span="4"><div class="item itemClose" @click="closeRecharge(item.currency,item.id)">取消</div></el-col>
            <el-col v-if="item.status != 0" :span="4"><div class="item" >{{item.status_text}}</div></el-col>
          </el-row>
        </li>
      </ul>
      <!--分页-->
      <div v-if="totalbtc>5">
        <el-pagination
          background
          @current-change="handleCurrentChange2"
          :current-page.sync="currentPage2"
          :page-size="5"
          layout="prev, pager, next, jumper"
          :total=totalbtc>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, getTimeStr, getCookie} from '../../../../utils'
  //import {mapState, mapMutations} from 'vuex'
  import jrQrcode from 'jr-qrcode'

  export default {
    data() {
      return {
        coinlist: [],
        itemSysmbol: 'CNY',
        rechargeNum: '',//法币充值金额，默认100
        indetFlag: false,//充值订单页 默认不显示,
        now_at: 0,//订单页生成的时间戳,
        indentCode: '',//订单识别码
        gather: '',//订单收款人
        openBank: '',//订单开户支行
        account: '',//订单开户账号
        amount: '',//订单金额
        cnyWithdrawsList: [],//法币充值记录 列表
        cnyWithdrawsListPage: [],//法币充值记录 列表 分页
        coinWithdrawsList: [],//数字币充值记录 列表
        coinWithdrawsListPage: [],//数字币充值记录 列表 分页
        sigleCoinInfo: {},//单个资产详情
        qrcodeSrc: '',//数字币二维码充值地址

        currentPage1: 1,//分页
        currentPage2: 1,//分页
        totalcny: '',//cny记录总页
        totalbtc: '',//数字币记录总页

        blueFlag: false,//按钮颜色
        canRecharge: false,//是否可充值
        iskyc1: false,//kyc1 认证

        //userInfo: {}, //用户状态
        //hasLogin: false, //登录状态
      }
    },
    computed: {
      //...mapState(["userInfo"])
    },
    mounted() {

      this.getprove();
      //法币充值记录 进来先调一次
      //this.getWithdrawsData('CNY','1');
      this.getCoinList();//提现币种列表
      if(!this.$route.query.coin){
          this.itemSysmbol = 'CNY';
      }else{
          this.itemSysmbol = this.$route.query.coin;
      }
      this.getWithdrawsData(this.itemSysmbol,'1');
      this.sigleCoinDetail(this.itemSysmbol);//单个资产详情
    },
    methods: {
      //选择法币充值还是数字币的哪一个充值
      changecoin(sysmbol) {
       this.rechargeNum = '';
        this.itemSysmbol = sysmbol;
        this.getWithdrawsData(sysmbol,'1');//单个资产充值记录
        this.sigleCoinDetail(sysmbol);//单个资产详情
      },
      //验证充值金额
       verRechargeNumInput() {
          if(this.rechargeNum.length>2) {
             if(this.rechargeNum == parseFloat(this.rechargeNum)) {
                return;
             }
             this.rechargeNum = parseFloat(this.rechargeNum);
             if(isNaN(this.rechargeNum)) {
                this.rechargeNum = '';
             }
          }else if(parseFloat(this.rechargeNum) >= 0) {

          }else if(!parseFloat(this.rechargeNum)) {
             this.rechargeNum = '';
          }
          //this.canWithdraw = true;
       },
      verRechargeNum() {
         if(!this.rechargeNum) {
            this.$message.error('最少充值金额100');
            this.canRecharge = false;
            return;
         }
        if(this.rechargeNum<100) {
          this.$message.error('最少充值金额100');
          this.canRecharge = false;
          return;
        }
        if(this.rechargeNum>50000) {
          this.$message.error('最大充值金额50000');
          this.canRecharge = false;
          return;
        }
        this.canRecharge = true;
      },
      //法币充值 生成充值订单
      createIndent() {
        this.verRechargeNum();//验证充值金额
        if(!this.canRecharge) {
          return;
        }
        if(!this.iskyc1) {
            this.$message.error('请先去实名认证');
            return;
        }
        this.indetFlag = true;
        var that = this;
        httpPost("/api/deposit_withdraws/recharge",{
          currency: 'CNY',
          amount: that.rechargeNum
        },function (res) {
          //console.log('充值订单',res);
          if(res.data.error_code == 0){
            that.indentCode = res.data.remark;
            that.gather = res.data.name;
            that.openBank = res.data.address;
            that.account = res.data.account.replace(/(\d{4})(?=\d)/g,"$1 ");
            that.amount = res.data.amount;
            that.now_at = res.data.now_at;//时间戳

            that.getWithdrawsData('CNY',1)
          }else{
            that.$message.error(res.data.error_reason);
          }
        })
      },
      //取消充值
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
            that.getWithdrawsData(s,'1');
          }else {
            that.$message.error('取消失败');
          }
        })
      },
      //完成支付 充值完成
      payComplated() {
        this.indetFlag = false;
      },
      //支付中遇到问题
      payQuestion() {
        this.indetFlag = false;
         this.$router.push('/help');
      },
      //关闭订单页面
      close() {
        this.indetFlag = false;
      },
      //充值记录 法币 数字币
      getWithdrawsData(currency,type) {
        var that = this;
        httpGet("/api/deposit_withdraws",{
          currency: currency,
          type_status: type
        },function (res) {
          if(res.data.error_code == 0){
            //console.log(currency,res);
            if(currency == "CNY"){
              that.cnyWithdrawsList = res.data.data;
              that.cnyWithdrawsListPage = that.cnyWithdrawsList.slice(0,5);
              that.totalcny = res.data.data.length;
              for( var i=0,len=that.cnyWithdrawsList.length;i<len;i++) {
                var c = '';
                c = getTimeStr(that.cnyWithdrawsList[i].created_at);
                that.cnyWithdrawsList[i].createdAt = c;
              }
            }else{
              that.coinWithdrawsList = res.data.data;
              that.coinWithdrawsListPage = that.coinWithdrawsList.slice(0,5);
              that.totalbtc = res.data.data.length;
              for( var i=0,len=that.coinWithdrawsList.length;i<len;i++) {
                var c = '';
                c = getTimeStr(that.coinWithdrawsList[i].created_at);
                that.coinWithdrawsList[i].createdAt = c;
              }
            }
          }
        })
      },
      //单个资产详情
      sigleCoinDetail(sysmbol) {
        var that = this;
        httpGet('/api/balances/detail',{
          currency: sysmbol
        },function (res) {
          if(res.data.error_code == 0) {
            that.sigleCoinInfo = res.data;
            if(res.data.code != 'CNY') {
              that.qrcodeSrc = jrQrcode.getQrBase64(res.data.deposit_addresses);
            }
          }
        })
      },
      //充值币种列表
      getCoinList() {
        var that = this;
        httpGet("/api/balances/available_coins",{
        },function (res) {
          if(res.data.error_code == 0) {
            that.coinlist = res.data.data;
          }
        })
      },
      //点击充值记录显示订单
      lookWithdraw(id,status) {
        if(status != 0) {
            return;
        }
        this.indetFlag = true;
        var that = this;
        httpGet('/api/deposit_withdraws/detail',{
          id: id
        },function (res) {
          if(res.data.error_code == 0) {
            //var result = res.data.deposit_withdraw;
            var result = res.data;
            that.indentCode = result.remark;
            that.gather = result.merchant.name;
            that.openBank = result.merchant.address;
            //that.account = result.account.replace(/(\d{4})(?=\d)/g,"$1 ");
            that.account = result.merchant.account;
            that.amount = result.amount;
            //that.now_at = result.now_at;//时间戳
            that.now_at = result.created_at_text;//时间戳
          }
        })
      },
        //身份认证情况
        getprove: function() {
          var that = this;
          httpGet('/api/users/check_has_kyc1',{
          },function (res) {
              if(res.data.error_code == 0) {
                  if(res.data.status == 2){
                      that.iskyc1 = true;
                  }else{
                      that.iskyc1 = false;
                  }
              }
          })
        },
      //复制功能
      copyHadler: function(e) {

        'use strict';
        //var that = this;
        // 添加点击事件
        //document.body.addEventListener('click', copy, true);

        // copy事件
        //function copy(e) {

        // 找到要复制的区域
        var
          t = e.target,
          c = t.dataset.copytarget,
          inp = (c ? document.querySelector(c) : null);

        // 要复制的区域是否可以选中
        if (inp && inp.select) {

          // 选中
          inp.select();

          try {
            // 执行复制
            document.execCommand('copy');
            inp.blur();

            this.$message({
              message: '复制成功',
              type: 'success'
            });
          }
          catch (err) {
            this.$message.error('please press Ctrl/Cmd+C to copy');
          }

          //}

        }
      },
      //分页 cny
      handleCurrentChange(index) {
        //console.log(`当前页: `+ index);
        var start = (index-1)*5;
        var end = index*5;
        this.cnyWithdrawsListPage = this.cnyWithdrawsList.slice(start,end);
        //console.log(this.cnyWithdrawsListPage);
      },
      //分页 coin
      handleCurrentChange2(index) {
        //console.log(`当前页: `+ index);
        var start = (index-1)*5;
        var end = index*5;
        this.coinWithdrawsListPage = this.coinWithdrawsList.slice(start,end);
        //console.log(this.cnyWithdrawsListPage);
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
    border-top:1px solid #EEEEEE;
  }
  .tip img{
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }

  .assert_title{
    text-align: left;
    margin-bottom: 10px;
    font-size: 18px;
    color: #000000;
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
 /* .coin_content_wrap .coin_content{
    position: absolute;
    z-index: 2;
  }*/
 /* .coin_content_wrap .coin_line{
    width: 100%;
    position: absolute;
    left: 0;
    bottom: -1px;
  }*/
  .recharge_num{
    height: 60px;
    margin:60px 0;
    display: flex;
    align-items: center;
  }
  .recharge_num .help{
    margin-left: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .coin_help{
    width: 620px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    position: relative;
    bottom: -50px;
  }
  .coin_help img{
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
  .recharge_num .help img{
    margin-right: 12px;
  }
  .recharge_num .re_txt{
    font-size: 18px;
    color: #000000;
  }
  .recharge_num .re_input{
    width: 300px;
    height: 60px;
    padding-left: 25px;
    background: #F9F9F9;
    border: 0;
    outline: none;
    font-size: 32px;
  }
  .recharge_num .re_input::placeholder{
    color: #D4D4D4;
  }
  .re_btn{
    width: 452px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
    margin-bottom: 80px;
    background: #C8C8CB;
  }
  .blue{
    background:  #506BA6;
  }
  .record_title_txt .item{
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #666666;
    background: #F9F9F9;
  }
  .record_content_wrap{
    height: 250px;
    overflow-y: hidden;
    margin-bottom: 20px;
  }
  .record_content_wrap .record_content{
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    font-size: 16px;
  }
  .record_content .itemClose{
    cursor: pointer;
    color: #4A90E2;
  }
  .coin_address_wrap{
    height: 200px;
    display: flex;
    align-items: center;
  }
  .coin_address_wrap .coin_address_txt{
    margin-right: 10px;
    font-size: 18px;
    color: #000000;
  }
  .coin_address_wrap .coin_address{
    width: 434px;
    height: 38px;
    padding-left: 20px;
    margin-right: 20px;
    font-size: 16px;
    color: #000000;
    border: 1px solid #979797;
    background: #F9F9F9;
    outline: none;
  }
  .coin_address_wrap .coin_address_cody{
    cursor: pointer;
    font-size: 16px;
    color: #506BA6;
    margin-right: 30px;
  }
  .coin_address_wrap .ercord{
    width: 200px;
    height: auto;
    margin-left: 20px;
  }
  .coin_address_wrap .ercord img{
    display: block;
    width: 200px;
    height: 200px;
    background-color: gainsboro;
  }
  .coin_address_wrap .ercord p{
    font-size: 13px;
    text-align: center;
  }
  .coin_re_tip_title{
    text-align: left;
    margin: 30px 0;
    font-size: 18px;
    color: #000000;
  }
  .coin_re_tip{
    font-size: 16px;
    text-align: left;
    margin-bottom: 10px;
  }
  .coin_re_tip2{
    font-size: 12px;
    text-align: left;
    margin-bottom: 50px;
  }
  .re_record_txt{
    text-align: left;
    margin: 30px 0;
    font-size: 18px;
    color: #000000;
  }
  .modal{
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top:0;
    z-index: 998;
    background-color: #000000;
    opacity: 0.4;
  }
  .indent_wrap{
    background-color: #ffffff;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    z-index: 999;
  }
  .indent{
    padding: 20px 30px;
    font-size: 14px;
  }
  .indent_title{
    height: 54px;
    background: #F9F9F9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .in_title{
    font-size: 18px;
    color: #000000;
    margin-left: 30px;
  }
  .in_tip{
    margin: 20px 0;
  }
  .red{
    color: red;
  }
  .indent .card_info{
    width: 80%;
    margin: 10px auto;
  }
  .card_info .ca_info_list{
    display: flex;
    margin: 30px 0;
    font-size: 16px;
    color: #000000;
  }
  .card_info .ca_info_list .ca_list_txt{
    width: 80px;
    text-align: right;
    margin-right: 15px;
  }
  /*.count_down .cd_down{*/
    /*margin: 10px 0;*/
    /*color: #0a8415;*/
    /*font-weight: bold;*/
  /*}*/
  .complated,
  .question{
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-radius: 2px;
    color: #ffffff;
    font-weight: bold;
    cursor: pointer;
  }
  .complated{
    background: #506BA6;
    font-size: 20px;
  }
  .question{
    font-size: 16px;
    color: #4A90E2;
  }

  .close {
    margin-right: 30px;
    font-size: 26px;
    font-weight: bold;
    color: #999999;
    text-align: right;
    cursor: pointer;
  }
</style>

