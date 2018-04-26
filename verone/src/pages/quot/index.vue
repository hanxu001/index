<template>
  <div class="all">
    <header-Top :bgTrue="false" :outIndex="1" style="border-bottom: 1px solid #03053D "></header-Top>
    <div class="container" style="min-height: 650px;margin-top:50px;">
      <div class="qheader">
        <p :class="[tabIndex==index?'cur':'']" v-for="(item,index) in tabList" @click="tabClick(index)">
          <i :class="[tabIndex?'el-icon-star-on':'el-icon-star-off']" style="margin-right: 6px" v-if="index > 0"></i>
          {{item.name}}</p>
      </div>
      <div class="qbody">
        <div class="qtitle">
          <p style="flex: 0.9;text-align: left">
            币种
          </p>
          <p style="flex: 1.2;">最新成交价</p>
          <p style="flex: 1">当日涨幅</p>
          <p style="flex: 1">24h最低价</p>
          <p style="flex: 1">24h最高价</p>
          <p style="flex: 1">24h量</p>
          <p style="flex: 1">7日价格趋势</p>
          <p style="flex: 1">操作</p>
        </div>
        <div class="qitem" v-for="(item,index) in coin_trade">
          <p style="flex: 0.9;text-align: left">
            <i :class="[item.is_follow?'el-icon-star-on':'el-icon-star-off','self']"
               @click="followStar(item.id,item.is_follow)"></i>
            <span style="cursor:pointer;" @click="gotoTrading(item.pair)">{{item.name}}</span>
          </p>
          <p style="flex: 1.2">￥{{item.cny_price}}</p>
          <p style="flex: 1" :class="[item.increase_status ==1?'color-up':'color-down']">{{item.increase_ratio}}</p>
          <p style="flex: 1">{{item.low}}</p>
          <p style="flex: 1">{{item.high}}</p>
          <p style="flex: 1">{{item.volume}}{{item.code}}</p>
          <svg style="flex: 1;" width="100%" height="60%" version="1.1"
               xmlns="http://www.w3.org/2000/svg">
            <polyline :points="item.polyline_data"
                      :class="[item.increase_status ==1?'l-up':'l-down']"
            />
          </svg>
          <p style="flex: 1;cursor: pointer" @click="gotoTrading(item.pair)">
            <img src="../../assets/imgs/goquot.png" alt="" style="width: 22px;height: 20px;">
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {httpGet, httpPost} from '../../utils/index'
  export default {
    data() {
      return {
        tabList: [{name: 'CNY 交易区'}, {name: '自选'}],
        tabIndex: 0,
        dataInfo: [],
        data: [],
        pair: 'BTC_CNY',
        ticker_filter: 'cny',
        // 普通接口值 ws接口值
        coin_trade: [],
        web_coin_trade: [],
        //ws
        lockReconnect: false,
        wsUrl: "wss://websocket.haobtc.io:9502",
        ws: null,
        tt: null,
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted() {
      this.coinTradesList()
      this.createWebSocket(this.wsUrl)
    },
    methods: {
      createWebSocket(){
        var that = this
        try {
          that.ws = new WebSocket(that.wsUrl);
          that.init();
        } catch (e) {
          console.log('catch');
          that.reconnect(that.wsUrl);
        }
      },
      init(){
        var that = this
        that.ws.onclose = function () {
          console.log('链接关闭');
          that.reconnect(that.wsUrl);
        };
        that.ws.onerror = function () {
          console.log('发生异常了');
          that.reconnect(that.wsUrl);
        };
        that.ws.onopen = function () {
          //心跳检测重置
          that.sendHeart()
          that.ws.send(JSON.stringify({
            event: 'web_coin_trade'
          }));
        };
        that.ws.onmessage = function (res) {
          //拿到任何消息都说明当前连接是正常的
          var daAll_json = JSON.parse(res.data)
          //web_coin_trade 交易对列表
          if (daAll_json.event === 'web_coin_trade') {
             that.web_coin_trade = daAll_json.data
            setTimeout(that.filterData(that.coin_trade, that.web_coin_trade), 300)
          }
          else {
//              console.log('数据不对应')
          }
        }
      },
      reconnect(url){
        var that = this
        if (that.lockReconnect) {
          return;
        };
        that.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        that.tt && that.clearTimeout(tt);
        that.tt = setTimeout(function () {
          that.createWebSocket(url);
          that.lockReconnect = false;
        }, 4000);
      },
      sendHeart(){
        var that = this
        that.ws.send("ping");
        setTimeout(() => {
          that.sendHeart()
        }, 60000)
      },
      tabClick(tab) {
        this.tabIndex = tab;
        this.ticker_filter = tab ? 'optional' : 'cny'
        this.coin_trade = []
        this.coinTradesList()
      },
      coinTradesList(){
        const that = this
        httpGet('/api/coin_trades', {
          ticker_filter: that.ticker_filter,
          page: 1,
          per_page: 10,
        }, res => {
          if (res.data.error_code === 0) {
            that.coin_trade = res.data.data
          }
        })
      },
      gotoTrading(pair){
        this.$router.push({ name: 'trading', query: { pair: pair }})
      },
      followStar(id, is_follow){
        if (is_follow) {
          this.unfollow(id)
        }
        else {
          this.follow(id)
        }
      },
      follow(id){
        var that = this
        httpGet('/api/coin_trades/follow', {
          coin_trade_id: id
        }, res => {
          if (res.data.error_code == 0) {
            that.coinTradesList()
            that.web_coin_trade = []
            that.$message({
              message: '关注成功',
              type: 'success'
            });
          }
        })
      },
      unfollow(id){
        var that = this
        httpGet('/api/coin_trades/unfollow', {
          coin_trade_id: id
        }, res => {
          if (res.data.error_code == 0) {
            that.coinTradesList()
            that.web_coin_trade = []
            that.$message({
              message: '取消成功',
              type: 'success'
            });
          }
        })
      },
      listNew(list1, list2){
        let returnl = [];
        list2.forEach((item2) => {
          var res = list1.filter((item1) => {
            return item1.pair == item2.pair
          })
          returnl.push.apply(returnl, res)
        })
        return returnl;
      },
      filterData(arr1, arr2){
        arr1.forEach(function (item1) {
          arr2.forEach(function (item2) {
            if (item1.pair === item2.pair) {
               item1.cny_price = item2.cny_price
               item1.usd_price = item2.usd_price
               item1.increase_ratio = item2.increase_ratio
               item1.increase_status = item2.increase_status
               item1.low = item2.low
               item1.high = item2.high
               item1.volume = item2.volume
               item1.trade_status = item2.trade_status
              return item1
            }
          })
        })
      },
    }
  }
</script>

<style scoped>
  .all {
    width: 100%;
    height: 100%;
    background: -webkit-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Firefox 3.6 - 15 */
    background: linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* 标准的语法 */
    padding-bottom: 80px;
  }

  .qheader {
    display: flex;
    align-items: center;
  }

  .qheader p {
    margin-top: 20px;
    margin-right: 106px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    font-weight: bold;
    color: #6D6F93;
    display: flex;
    flex-direction: row;
    /*justify-content: center;*/
    align-items: center;
    font-size: 20px;
    /*border: 1px solid red;*/
  }

  .cur {
    border-bottom: 2px solid #fff;
    color: #fff!important;
  }

  .qtitle {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    border-bottom: 1px solid #222;
  }

  .qtitle p {
    text-align: center;
    color: #6D6F93;
    height: 60px;
    line-height: 60px;
    font-size: 16px;
  }

  .qitem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90px;
    line-height: 90px;
    border-bottom: 1px solid #222;
  }
  .qitem:hover{
    background: #070825;
  }

  .qitem p {
    text-align: center;
    color: #C4C7FF;
    font-size: 20px;
  }

  .self {
    color: #52547C;;
    cursor: pointer;
    margin-right: 4px;
  }
  .el-icon-star-on{
    color: #fff;
  }

  .l-up {
    stroke: #00B76F;
    fill: white;
    stroke-width: 2;
    /*background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.00) 0%, #00B76F 100%);*/
  }

  .l-down {
    stroke: #F23757;
    fill: white;
    stroke-width: 2;
  }
</style>
