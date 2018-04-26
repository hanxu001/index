<template>
  <div class="content">
    <p class="title">流水查询</p>
    <div class="coins">
      <p class="coins_title">选择币种:</p>
      <p @click="changecoinAll" :class="['coins_all',isAllcoins?'coral':'']">全部</p>
      <ul class="coins_content">
        <li v-for="(item,index) in assertList" @click="changecoin(index,item.currency)" :class="['coins_item',index==itemIndex&&!isAllcoins?'active':'']">{{item.code}}</li>
      </ul>
    </div>
    <div class="coins_action">
      <p class="caction_title">选择类型:</p>
      <p @click="changeactionAll" :class="['caction_all',isAllactions?'coral':'']">全部</p>
      <ul class="caction">
        <li v-for="(item,index) in actionlist" @click="changeaction(index)" :class="['caction_item',index==itemIndex2&&!isAllactions?'active':'']">{{item}}</li>
      </ul>
    </div>
    
    <el-row class="assert_liushui_title">
      <el-col :span="5"><div class="item">时间</div></el-col>
      <el-col :span="1"><div class="item">类型</div></el-col>
      <el-col :span="2"><div class="item">币种</div></el-col>
      <el-col :span="3"><div class="item">数量</div></el-col>
      <el-col :span="3"><div class="item">手续费</div></el-col>
      <el-col :span="10"><div class="item">地址</div></el-col>
    </el-row>
    <ul class="assert_liushui">
      <li v-for="(item,index) in assertWaterListPage" :class="[index%2==0?'bg1':'','li_item']">
        <el-row class="assert_liushui_content">
          <el-col :span="5"><div class="item" style="text-align: left">{{item.createdAt}}</div></el-col>
          <el-col v-if="item.type_status == 0" :span="1"><div class="item">提现</div></el-col>
          <el-col v-if="item.type_status == 1" :span="1"><div class="item">充值</div></el-col>
          <el-col :span="2"><div class="item">{{item.name}}</div></el-col>
          <el-col :span="3"><div class="item">{{item.amount}}</div></el-col>
          <el-col :span="3"><div class="item">{{item.withdraw_fee}}</div></el-col>
          <el-col :span="10"><div class="item" >{{item.to_address}}</div></el-col>
        </el-row>
      </li>
    </ul>
    <!--分页-->
    <div v-if="totalPage>5">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="5"
        layout="prev, pager, next, jumper"
        :total=totalPage>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, getTimeStr} from '../../../../utils'
  //import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        itemIndex: 0,
        isAllcoins: true,
        actionlist: ["提现","充值"],
        itemIndex2: 0,
        isAllactions: true,
        totalBtc: 0,//总资产btc
        totalRmb: 0,//总资产人民币
        assertList: [],//资产明细列表
        assertWaterList: [],//资产明细流水
        assertWaterListPage: [],//资产明细流水 分页
        typeStatus: '',//记录类型 0 体现，1充值，''全选
        typeCurrency: '',//货币标识

        totalPage: '',//总页数
        currentPage: 1,//当前页
      }
    },
    computed: {
      //...mapState(["userInfo"])
    },
    mounted() {
      this.getAssertData();
      this.getAssertWater('','');
    },
    methods: {
      //资产明细流水 币种选择
      changecoin(index,sysmbol) {
        this.isAllcoins = false;
        this.itemIndex = index;
        this.typeCurrency = sysmbol;
        this.getAssertWater(sysmbol,this.typeStatus);
      },
      //资产明细流水 操作选择 是充 提还是交易
      changeaction(index) {
        this.isAllactions = false;
        this.itemIndex2 = index;
        this.typeStatus = index;
        this.getAssertWater(this.typeCurrency,index);
      },
      //操作点击 全部
      changeactionAll() {
        this.isAllactions = true;
        this.typeStatus = '';
        this.getAssertWater(this.typeCurrency,'');
      },
      //币种点击 全部
      changecoinAll() {
        this.isAllcoins = true;
        this.typeCurrency = '';
        this.getAssertWater('',this.typeStatus);
      },
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
      },
      //资产明细流水
      getAssertWater(sysmbol,type) {
        var that = this;
        httpGet("/api/deposit_withdraws",{
          currency: sysmbol,
          type_status: type
        },function (res) {
          that.assertWaterList = res.data.data;
          that.assertWaterListPage = res.data.data;
          that.totalPage = res.data.data.length;
          for( var i=0,len=that.assertWaterList.length;i<len;i++) {
            var c = '';
            c = getTimeStr(that.assertWaterList[i].created_at);
            that.assertWaterList[i].createdAt = c;
          }
        })
      },
      //分页 cny
      handleCurrentChange(index) {
        var start = (index-1)*5;
        var end = index*5;
        this.assertWaterListPage = this.assertWaterList.slice(start,end);
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

  .assert_action span{
    cursor: pointer;
  }

 .assert_liushui_title{
    height: 54px;
    line-height: 54px;
    margin-top: 30px;
    font-size: 16px;
    color: #787878;
  }
 .assert_liushui {
   height: 310px;
   overflow-y: hidden;
   margin-bottom: 20px;
 }
 .assert_liushui .li_item{
   height: 62px;
   line-height: 62px;
   font-size: 16px;
   color: #000000;
 }
 .bg1{
   background: #FBFBFB;
 }

  .coral{
    color: #506BA6;
    cursor: pointer;
  }
  .coins_content,
  .caction{
    flex: 1;
    display: flex;
  }
  .coins_content .coins_item{
    flex: 1;
  }
  .caction .caction_item{
    width: 25%;
    text-align: center;
  }
  .coins,.coins_action{
    display: flex;
    font-size: 18px;
    padding: 0 10px;
    height: 70px;
    line-height: 70px;
    background: #F9F9F9;
  }
  .coins_title,.caction_title{
    color: #000000;
    margin-right: 60px;
  }
  .coins_all,.caction_all{
    margin-right: 8px;
    cursor: pointer;
  }
  .coins_content .coins_item,.caction .caction_item{
    cursor: pointer;
  }
  .coins_content .coins_item.active,
  .caction .caction_item.active{
    color: #506BA6;
  }

</style>
