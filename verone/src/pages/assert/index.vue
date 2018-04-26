<template>
  <div style="height: auto;min-height:80%;background: #F9F9F9;">
    <header-Top></header-Top>
    <div style="height: 100%;padding: 30px 0">
      <div class="container content_wrap">
        <ul class="nav">
          <li @click="navSelect(index)" v-for="(item,index) in navlist" :class="['nav_item',index==navIndex?'current':'']">{{item}}</li>
        </ul>
        <router-view class="content"></router-view>
      </div>
    </div>
    <!--<footer-Bottom></footer-Bottom>-->
  </div>
</template>
<script>
  import {httpGet, httpPost,getCookie} from '../../utils'
  //import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        navlist: ['资产明细','银行卡管理','充值','提现','流水查询','委托记录'],
        navIndex: '0',

        userInfo: {}, //用户状态
        hasLogin: false, //登录状态
      }
    },
    mounted() {
        this.getUesrInfo()
    },
    watch: {
      '$route': 'getnavIndex'
    },
    methods: {
      getUesrInfo () {
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          this.userInfo = JSON.parse(initInfo)
          this.hasLogin = true
          this.getnavIndex();
        } else {
          this.$router.push('/home')
        }
      },
      //导航点击时的效果
      navSelect(index) {
        this.navIndex = index;
        switch (index) {
          case 0:
            this.$router.push('/balances/balances_snapshot');
            break;
          case 1:
            this.$router.push('/balances/bank_cards');
            break;
          case 2:
            this.$router.push('/balances/deposit');
            break;
          case 3:
            this.$router.push('/balances/withdraw');
            break;
          case 4:
            this.$router.push('/balances/finances');
            break;
          case 5:
            this.$router.push('/balances/order_records');
            break;
          default:
            this.$router.push('/balances/balances_snapshot');
        }
      },
      //获取 路由中的 nvaIndex
      getnavIndex() {
        //this.navIndex = this.$route.params.id;
        //console.log(this.$route.params.id);
        var url = this.$route.path;
        if(url == '/balances/balances_snapshot' || url == '/balances') {
          this.navIndex = 0;
          return;
        }
        if(url == '/balances/bank_cards') {
          this.navIndex = 1;
          return;
        }
        if(url == '/balances/deposit') {
          this.navIndex = 2;
          return;
        }
        if(url == '/balances/withdraw') {
          this.navIndex = 3;
          return;
        }
        if(url == '/balances/finances') {
          this.navIndex = 4;
          return;
        }
        if(url == '/balances/order_records') {
          this.navIndex = 5;
          return;
        }
      }
    }
  }
</script>
<style scoped>
  @import "../../common.css";
  .content_wrap{
    display: flex;
    min-height: 700px;
    height: auto;
  }
  .nav{
    width: 129px;
    padding: 0 15px;
    margin-right: 20px;
    background-color: #ffffff;
  }
  .nav .nav_item{
    height: 69px;
    line-height: 69px;
    font-size: 18px;
    border-bottom: 1px solid #F6F8FA;
    color: #333333;
    cursor: pointer;
  }
  .nav .nav_item.current{
    width: 149px;
    border-left: 5px solid #506BA6;
    border-right: 5px solid #FAFAFE;
    color: #000000;
    background: #F9F9F9;
    position: relative;
    left: -15px;
  }
  .content{
    flex: 1;
    background-color: #ffffff;
    height: auto;
    min-height: 700px;
    /*padding: 30px 50px;*/
  }
</style>
