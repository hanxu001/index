<template>
  <div class="content">
    <div class="total_money">
      <p>资产市值</p>
      <p class="assert">
        <span class="usd">฿ {{totalBtc}}</span>
        <span>≈</span>
        <span class="cny">￥ {{totalRmb}}</span>
      </p>
    </div>
    <el-row class="assert_de_title">
      <el-col :span="3"><div class="item">币种</div></el-col>
      <el-col :span="6"><div class="item">可用</div></el-col>
      <el-col :span="6"><div class="item">冻结</div></el-col>
      <el-col :span="9"><div class="item">操作</div></el-col>
    </el-row>
    <ul class="assert_detail">
      <li v-for="item in assertList">
        <el-row class="assert_de_content">
          <el-col :span="3"><div class="item">{{item.code}}</div></el-col>
          <el-col :span="6">
            <div class="item item_num">
              <span class="item_total">{{item.available_amount}}</span>
            </div>
          </el-col>
          <el-col :span="6"><div class="item">{{item.block_amount}}</div></el-col>
          <el-col class="last_item" :span="9">
            <div class="item item_action">
              <!--<span @click="$router.push('/balances/deposit')" v-if="item.deposit_status == 1">充值</span>-->
              <span @click="$router.push({path:'/balances/deposit',query:{coin:item.code}})" v-if="item.deposit_status == 1">充值</span>
              <!--<span @click="$router.push('/balances/withdraw')" v-if="item.withdraw_status == 1" class="tixian">提现</span>-->
              <span @click="$router.push({path:'/balances/withdraw',query:{coin:item.code}})" v-if="item.withdraw_status == 1" class="tixian">提现</span>
              <span @click="$router.push('/trading')" v-if="item.trade_status == 1">交易</span>
            </div>
          </el-col>
        </el-row>
      </li>
    </ul>
  </div>
</template>

<script>
  import {httpGet, getCookie } from '../../../../utils'
  export default {
    data() {
      return {
        totalBtc: 0,//总资产btc
        totalRmb: 0,//总资产人民币
        assertList: [],//资产明细列表
      }
    },
    computed: {
      //...mapState(["userInfo"])
    },
    mounted() {
      this.getAssertData();
    },
    methods: {
      //获取个人资产数据
      getAssertData() {
        var that = this;
        httpGet("/api/balances/index",{},function (res) {
          if(res.data.error_code == 0) {
            that.totalBtc = res.data.total_btc;
            that.totalRmb = res.data.total_rmb_price;
            that.assertList = res.data.data;
          }
        })
      }
    }
  }
</script>

<style scoped>
  @import "../../../../common.css";
  .content{
    padding: 30px 50px;
  }
  /*.title{*/
    /*font-size: 20px;*/
    /*color: #000000;*/
    /*text-align: left;*/
    /*margin-bottom: 20px;*/
  /*}*/
  .total_money{
    display: flex;
    font-size: 20px;
    color: #000000;
    margin-bottom: 20px;
  }
  .assert{
    margin-left: 10px;
  }
  .assert_action span{
    cursor: pointer;
  }
  .assert_de_title{
    height: 40px;
    line-height: 40px;
    color: #666666;
    background: #F9F9F9;
    font-size: 16px;
  }
  .assert_de_content{
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    color: #000;
    border-bottom: 1px solid #EEEEEE;;
  }
  .assert_de_content .last_item{

  }
  .assert_de_content .last_item .item_action{
    display: flex;
    justify-content: flex-start;
    padding-left: 100px;
  }
  .assert_de_content .item_num{
    height: 60px;
  }
  .assert_de_content .item_action span{
    font-size: 18px;
    color: #506BA6;
    cursor: pointer;
  }
  .assert_de_content .item_action .tixian{
    margin: 0 50px;
  }
  .assert_detail{
    margin-bottom: 20px;
  }
</style>

