<template>
  <div style="position: relative;width: 100%">
    <header-Top :outIndex="0" :bgTrue="false"
                style="position: absolute;left: 0;top: 0;width: 100%;height: 90px;z-index: 999"></header-Top>
    <div class="banner">
      <el-carousel height="668px" indicator-position="none">
        <el-carousel-item v-for="(item,index) in list" :key="index">
          <img :src="item.img" style="height: 668px">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!--跑马灯-->
    <div class="marqueBox_wrap">
      <div class="marqueBox">
        <p class="marque_title" style="font-size:20px;">最新公告:</p>
        <ul class="con1" ref="con1" :class="{anim:animate==true}">
          <li v-for='item in items'>{{item.name}}</li>
        </ul>
      </div>
    </div>
    <!---->
    <div class="coins">
      <ul class="coin_list container">
        <li v-for="item in coinData" class="c_item" @click="gotoTrading(item.pair)">
          <div class="c_item_code">
           {{item.trade_coin_code}}
          </div>
          <div class="c_item_else">
            <p
              :class="[item.increase_status == '1'?'color-up':'color-down','else1']">{{item.increase_ratio}}</p>
            <p class="else2">￥{{item.cny_price}}</p>
            <p class="else3">成交量 {{item.volume}}</p>
          </div>
        </li>
      </ul>
      <ul class="intro_content">
        <div class="container" style="display: flex;flex-direction: row;align-items: center;justify-content: center">
          <li class="item">
            <div class="img">
              <img src="../../assets/imgs/home1.png"/>
            </div>
            <p class="img_txt">全方位安全保护</p>
          </li>
          <li class="item">
            <div class="img">
              <img src="../../assets/imgs/home2.png"/>
            </div>
            <p class="img_txt">100%备付金</p>
          </li>
          <li class="item">
            <div class="img">
              <img src="../../assets/imgs/home3.png"/>
            </div>
            <p class="img_txt">极速充值提现</p>
          </li>
        </div>
      </ul>
      <div class="s_login">
        <p class="title">欢迎使用BTC上海</p>
        <p class="title_tip"><span style="color: rgb(140,228,205)">安全·可靠·便捷 </span>的数字资产交易平台</p>
        <div v-if="!hasLogin" class="s_btn">
          <span @click="$router.push('/login')" class="item">登录</span>
          <span @click="$router.push('/register')" class="item">注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, setCookie, getCookie} from '../../utils/index'
  import banner1 from '@/assets/imgs/banner.png'
  import banner2 from '@/assets/imgs/banner2.png'
  export default {
    data() {
      return {
        list: [
          {img: banner1},
          {img: banner2}
        ],
        hasLogin:false,
        banner_height: "500px",
        coinData: [],//币种信息
        animate: false,
        user:"",
        items: [  //消息列表对应的数组
          {name: "BTC上海最新上线全场手续费1折"},
          {name: "BTC上海最新上线全场手续费10折"},
          {name: "BTC上海最新上线全场手续费100折"},
          {name: "BTC上海最新上线全场手续费1000折"}
        ],
      }
    },
    computed: {
      height300: {
        get: function () {
          return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        }
      },
    },
    mounted() {
      this.getUesrInfo ();
      this.getData();
      setInterval(this.marque, 2000);
    },
    methods: {
      getUesrInfo (){
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          this.user = JSON.parse(initInfo);
          this.hasLogin = true;
        }
      },

      //进入页面先获取下 数据信息
      getData() {

        var that = this;


        httpGet("/api/coin_trades", {
          per_page: 5
        }, function (res) {
          //console.log('home', res);
          if (res.data.error_code == 0) {
            that.coinData = res.data.data;
          }
        });

      },
      //跑马灯
      marque() {
        this.animate = true
        setTimeout(() => {
          this.items.push(this.items[0]);
          this.items.shift();
          this.animate = false;  // 这个地方如果不把animate 取反会出现消息回滚的现象，此时把ul 元素的过渡属性取消掉就可以完美实现无缝滚动的效果了
        }, 1500)
      },
      gotoTrading(pair){
        this.$router.push({ name: 'trading', query: { pair: pair }})
      },

    }
  }
</script>

<style scoped>
  @import "../../common.css";

  .banner {
    width: 100%;
    height: 668px;
    /*border: 1px solid red;*/
  }

  .banner img {
    width: 100%;
    height: auto;
    height: 668px;
  }

  .coins {
    background: #0F1035;
  }

  .coin_list {
    padding-top: 20px;
    display: flex;
    flex-wrap: wrap;
  }

  .coin_list .c_item {
    width: 50%;
    padding: 0 30px;
    height: 300px;
    color: #ffffff;
    box-sizing: border-box;
    /*border: 1px solid red;*/
    display: flex;
    flex-direction: row;
    align-self: center;
    justify-content: center;
    cursor: pointer;
  }

  .c_item:hover {
    opacity: 0.5;
    background: #090A2B;
  }
  .c_item_code{
    flex: 1;
    text-align: right;
    padding-top: 95px;
    font-size: 38px;
    color: #FFFFFF;
  }
  .c_item_else{
    flex:2;
    text-align: center;
    /*padding-left: 22px;*/
    padding-right: 50px;
  }
  .c_item_else .else1{
    font-size: 80px;
    color: #00B76F;
    margin-top: 54px;
    /*border: 1px solid red;*/
  }
  .c_item_else .else2{
    font-size: 30px;
    color: #FFFFFF;
    margin-top: 12px;
    /*border: 1px solid red;*/
  }
  .c_item_else .else3{
    font-size: 22px;
    color: #FFFFFF;
    margin-top: 8px;
    /*border: 1px solid red;*/
  }

  .intro_content {
    width: 100%;
    height: 580px;
    background: url("../../assets/imgs/Rectangle.png") no-repeat 100%;
    /*border: 1px solid red;*/
  }

  .intro_content .item {
    width: 280px;
    height: auto;
    flex: 1;
    text-align: center;
    margin-top: 140px;
    /*border: 1px solid red;*/
  }

  .intro_content .item .img {
    width: 88px;
    height: 88px;
    margin: 0 auto 20px;
  }

  .intro_content .item .img img {
    width: 100%;
    height: 100%;
  }

  .intro_content .item .img_txt {
    background: linear-gradient(to bottom, #00C6EF, #017CC9);
    -webkit-background-clip: text;
    color: transparent;
    font-size: 32px;
    letter-spacing: 3.76px;
  }

  .s_login {
    /*padding: 60px 0;*/
    height: 332px;
    text-align: center;
    background: #0F1035;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .s_login .title {
    font-size: 32px;
    background: linear-gradient(to bottom, #06BBE1, #017CC9);
    -webkit-background-clip: text;
    color: transparent;
  }

  .s_login .title_tip {
    font-size: 24px;
    background: linear-gradient(to bottom, #06BBE1, #017CC9);
    -webkit-background-clip: text;
    color: transparent;
    margin: 10px 0 50px;
  }

  .s_login .s_btn {
    width: 408px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
  }

  .s_login .s_btn .item {
    width: 176px;
    height: 56px;
    border: 1px solid #046A8F;
    font-size: 28px;
    text-align: center;
    line-height: 56px;
    cursor: pointer;
    border-radius: 3px;
    color: #0669A1;
  }

  .s_login .s_btn .item:hover {
    background-color: rgb(18, 136, 208);
    color: #ffffff;
  }

  /*跑马灯  通知信息*/
  .marqueBox_wrap {
    position: absolute;
    left: 0;
    top: 610px;
    width: 100%;
    z-index: 998;
    padding: 20px 0;
    background-image: linear-gradient(-180deg, rgba(11, 13, 47, 0.00) 0%, #0B0D2F 100%);
  }

  .marqueBox {
    width: 500px;
    height: 26px;
    margin: 0 auto;
    display: flex;
    line-height: 28px;
    font-family: PingFangSC-Regular;
    font-size: 22px;
    color: #FFFFFF;
    overflow: hidden;
    transition: all 0.5s;
  }

  .marqueBox .marque_title {
    margin-right: 6px;
    font-size: 20px;
    letter-spacing: 2px;
  }

  .anim {
    transition: all 1.5s;
    margin-top: -28px;
  }

  .con1 li {
    line-height: 28px;
    height: 28px;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: 300;
    letter-spacing: 2px;
  }

</style>

