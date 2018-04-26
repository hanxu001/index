<template>
  <div style="padding-bottom: 100px;" v-loading="loading">
    <div class="title">
      <h2 v-if="!isDetails">问题列表</h2>
      <h2 v-if="isDetails">
        <span style="cursor: pointer" @click="titleToggle">问题列表</span>
        > 问题详情
      </h2>
      <p class="line"></p>
    </div>
    <div class="search" v-if="!isDetails">
      <div class="imgbox" @click="goSearch()">
        <img src="../../../../assets/imgs/help_select.png" alt="">
      </div>
      <div style="height: 24px;border: 1px solid #D3D3D3"></div>
      <input type="text" placeholder="搜索" @keyup.enter="goSearch">
    </div>
    <div class="qheader" v-if="!isDetails">
      <p :class="[tabIndex==index?'cur':'']" v-for="(item,index) in tabList" @click="tabClick(index)">
        {{item.name}}</p>
    </div>
    <div class="item" v-if="!isDetails" v-for="item in ordersList">
      <div class="hang" style="margin-top: 40px">
        <h3>工单编号：</h3>
        <div>
          <p>{{item.work_order_no}}</p>
        </div>
      </div>
      <div class="hang" style="margin-top: 20px">
        <h3>问题类型：</h3>
        <div>
          <p>{{item.type}}</p>
        </div>
      </div>
      <div class="hang" style="margin-top: 36px">
        <h3><span style="margin-right: 34px;">状</span>态：</h3>
        <div style="display: flex;flex-direction: row;align-items: center">
          <p>{{item.status}}</p>
          <h4 class="details" @click="goDetails(item.work_order_no)">查看详情</h4>
        </div>
      </div>
      <div class="hang" style="margin-top: 50px;">
        <p>更新时间：</p>
        <div>
          <p style="font-size: 18px;color: #666">{{getTimeStr(item.updated_at)}}</p>
        </div>
      </div>
    </div>
    <div class="pagination" v-if="total_entries > 5 && !isDetails">
      <el-pagination
        @current-change="handleCurrentChange"
        small
        background
        layout="prev, pager, next"
        :total="Number(total_entries)">
      </el-pagination>
    </div>
    <div class="details-con" v-if="isDetails">
      <p class="title">{{ordersDetaile.title}}</p>
      <div class="ctem" style="margin-top: 24px;">
        <h3>工单编号：</h3>
        <div>
          <p>{{ordersDetaile.work_order_no}}</p>
        </div>
      </div>
      <div class="line" style="width: 100%;margin-top: 20px;"></div>
      <div class="ctem" style="margin-top: 24px;">
        <h3>问题类型：</h3>
        <div>
          <p>{{ordersDetaile.type}}</p>
        </div>
      </div>
      <div class="ctem" style="margin-top:18px;">
        <h3>银行卡号：</h3>
        <div>
          <p>{{ordersDetaile.bank_card_num}}</p>
        </div>
      </div>
      <div class="ctem" style="margin-top:18px;">
        <h3>邮箱地址：</h3>
        <div>
          <p>{{ordersDetaile.email}}</p>
        </div>
      </div>
      <div class="ctem" style="margin-top:18px;">
        <h3>问题描述：</h3>
        <div>
          <p>{{ordersDetaile.description}}</p>
        </div>
      </div>
      <div class="ctem" style="margin-top:50px;align-items: flex-start">
        <h3>附    件：</h3>
        <div style="flex-wrap: wrap;">
          <img :src="img.image"
               alt=""
               style="width: 90px;height: 90px;margin-right: 40px;cursor: pointer"
               v-for="img in ordersDetaile.images">
        </div>
      </div>
      <div class="reply_content" v-if="ordersDetaile.reply_content">
        <div :class="['reply_item',item.type == 'staff'?'staff':'customer']"
             v-for="item in ordersDetaile.reply_content">
          <img src="../../../../assets/imgs/staff.png" alt="" v-if="item.type == 'staff'">
          <p class="con">{{item.reply}}</p>
          <p class="time">{{getTimeStr(item.reply_time)}}</p>
        </div>
      </div>
      <div class="send_reply">
        <input type="text" v-model="user_reply" class="input_reply" placeholder="请输入内容">
        <el-button type="primary" icon="el-icon-search" @click="work_orders_reply(ordersDetaile.work_order_no)"> 发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, getCookie} from '../../../../utils'
  export default {
    data () {
      return {
        tabList: [{name: '未解决'}, {name: '已解决'}],
        tabIndex: 0,
        query_status: 1,
        isDetails: false,
        ordersList: [],
        ordersDetaile: {},
        loading: false,
        user_reply: '',
        total_entries: '',
      }
    },
    mounted() {
      this.getUesrInfo()

    },
    methods: {
      getUesrInfo () {
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.work_orders(1)
          }, 500);
        } else {
          this.$router.push('/login')
          return
        }
      },
      goSearch(){

      },
      titleToggle(){
        this.isDetails = false;
        this.loading = true;
        this.tabIndex = 0
        setTimeout(() => {
          this.loading = false;
          this.work_orders()
        }, 500);
      },
      tabClick(tab) {
        this.tabIndex = tab;
        this.query_status = tab ? '2' : '1';
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.total_entries = 0
          this.work_orders(1)
        }, 500);
      },
      goDetails(id){
        this.ordersDetaile = []
        this.ordersList = []
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.isDetails = true
          this.work_orders_detailed(id)
        }, 500);
      },
      work_orders(page){
        httpGet('/api/work_orders', {
          page:page,
          per_page: 5,
          status: this.query_status
        }, res => {
          this.ordersList = []
          if (res.data.error_code == 0) {
            this.ordersList = res.data.work_orders
            this.total_entries = res.data.total_entries
          }
        })
      },
      work_orders_detailed(id){
        httpGet('/api/work_orders/detailed', {
          work_order_no: id
        }, res => {
          if (res.data.error_code == 0) {
            this.ordersDetaile = res.data
          }
        })
      },
      work_orders_reply(id){
          if(!this.user_reply){
            return
          }
          httpPost('/api/work_orders/reply',{
            work_order_no:id,
            user_reply:this.user_reply,
          },res=>{
              if(res.data.error_code == 0){
                this.user_reply = ''
                this.work_orders_detailed(id)
              }
          })
      },
      getTimeStr(time){
        var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = date.getDate() + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m
      },
      handleCurrentChange(val) {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.work_orders(val)
        }, 500);
      },
    }
  }
</script>

<style scoped>
  .title {

  }

  .title h2 {
    font-size: 20px;
    color: #000000;
    font-weight: 100;
    width: 92%;
    margin: 0 auto;
    padding-left: 20px;
    height: 78px;
    line-height: 78px;
    text-align: left;
  }

  .line {
    background: #EAEAEE;
    height: 1px;
    width: 92%;
    margin: 0 auto;
  }

  .search {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 78%;
    margin: 0 auto;
    height: 44px;
    background: #F9F9F9;
    border: 1px solid #F9F9F9;
    border-radius: 100px;
    margin-top: 60px;
    margin-bottom: 90px;
  }

  .search .imgbox {
    width: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    /*border: 1px solid red;*/
  }

  .search .imgbox img {
    width: 24px;
    height: 24px;
  }

  .search input {
    width: 100%;
    height: 24px;
    outline: none;
    border: none;
    background: #F9F9F9;
    padding-left: 10px;
    font-size: 18px;
    color: #8D8D8D;
  }

  .qheader {
    display: flex;
    align-items: center;
    width: 92%;
    margin: 0 auto;
    border-bottom: 1px solid #EAEAEE;
  }

  .qheader p {
    margin-top: 10px;
    margin-right: 30px;
    width: 117px;
    height: 30px;
    line-height: 40px;
    cursor: pointer;
    font-weight: 100;
    font-size: 18px;
    color: #000000;
    letter-spacing: 0;
    line-height: 18px;
    letter-spacing: 0;
    border-bottom: 2px solid transparent;
  }

  .cur {
    border-bottom: 2px solid #506BA6 !important;
    color: #506BA6 !important;
  }

  .item {
    width: 92%;
    margin: 0 auto;
    border-bottom: 1px solid #EAEAEE;
    padding-bottom: 25px;
  }

  .hang {
    display: flex;
    flex-direction: row;
  }

  .hang > h3 {
    font-size: 18px;
    color: #000000;
    flex: 3;
    text-align: right;
    padding-left: 20px;
    /*border:1px solid red;*/
  }

  .hang > p {
    flex: 3;
    padding-left: 20px;
    text-align: right;
    font-size: 18px;
    color: #666666;
  }

  .hang > div {
    flex: 7;
    text-align: left;
    padding-left: 30px;
    /*border:1px solid red;*/
  }

  .hang > div p {
    font-size: 18px;
    color: #000000;
  }

  .details {
    font-size: 14px !important;
    color: #4A90E2;
    letter-spacing: 0;
    line-height: 18px;
    border-bottom: 1px solid #4A90E2;
    margin-left: 40px;
    font-weight: 100;
    cursor: pointer;
  }

  .details-con {
    text-align: left;
    width: 92%;
    margin: 0 auto;
    padding-left: 16px;
    padding-bottom: 43px;
    /*border: 1px solid red;*/
  }

  .details-con .title {
    font-size: 20px;
    color: #000000;
    letter-spacing: 0;
    line-height: 18px;
    margin-top: 30px;
  }

  .details-con .ctem {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .details-con .ctem > h3 {
    font-size: 18px;
    color: #000000;
    /*border:1px solid red;*/
    width: 90px;
    text-align:justify;
  }

  .details-con .ctem > p {

    padding-left: 20px;
    text-align: right;
    font-size: 18px;
    color: #666666;
  }

  .details-con .ctem > div {
    flex: 7;
    text-align: left;
    padding-left: 30px;
    /*border:1px solid red;*/
  }

  .details-con .ctem > div p {
    font-size: 18px;
    color: #000000;
  }

  .reply_content {
    background: #F9F9F9;
    margin-top: 24px;
    padding: 64px 20px;
    height: 300px;
    overflow-y: scroll;
  }

  .send_reply {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #000;
    padding-bottom: 12px;
  }

  .input_reply {
    font-size: 20px;
    color: #666666;
    border: 0 !important;
    outline: 0 !important;
    margin-right: 20px;
    width: 100%;
    height: 34px;
  }

  .reply_item {
    display: flex;
    flex-direction: row;
    flex-direction: row;
    align-items: center;
    margin-top: 20px;
    width: 100%;
  }
  .staff{

  }
  .staff .con{
    margin-left: 12px;
    margin-right: 12px;
    background: #506BA6;
    border-radius: 24px 24px 24px 0;
    padding: 10px;
    font-size: 16px;
    color: #FFFFFF;
  }
  .customer{
    flex-direction: row-reverse!important;
    align-items: center;
  }
  .customer .con{
    margin-left: 12px;
    background: #EAEAEA;
    border-radius: 24px 24px 24px 0;
    padding: 10px;
    font-size: 16px;
    color: #000000;
  }
  .reply_item .time{
    font-size: 16px;
    color: #CBCBCB;
  }
  .reply_item > img{
    width: 30px;
    height: 30px;
  }
  .reply_item .con{
    max-width: 300px;
  }
  .pagination{
    margin-top: 40px;
  }
</style>
