<template>
  <div class="all1">
    <div class="header">
      <div class="left">
        <div class="logo" @click="$router.push('/')">
          <img src="../../assets/imgs/logo.png" alt="">
        </div>
        <div class="lefi-box">
          <div class="lefi-par">
            <div class="lefi">
              <h3>{{coin_name}}<i class="el-icon-arrow-down" style="font-weight: bold;margin-left: 4px;"></i></h3>
              <p>交易对</p>
            </div>
            <div class="lefi-alert">
              <div class="alert-top"></div>
              <div class="alert-title">
                <div>币种</div>
                <div>价格</div>
                <div>涨跌</div>
              </div>
              <div style="width: 80%;border: 1px solid #070825;;margin: 0 auto"></div>
              <div class="alert-item" v-for="item in web_coin_trade_list" @click="optionsChange(item)">
                <div style="text-align: left;">
                  <span style="margin-left: 30px">{{item.trade_coin_code}}</span>
                </div>
                <div>{{item.cny_price}}</div>
                <div :class="[item.increase_status == '-1'?'color-down':'color-up']">
                  {{item.increase_ratio}}
                </div>
              </div>
            </div>
          </div>
          <div class="lefi">
            <h3>￥{{web_coin_trade.cny_price}}</h3>
            <p>当前价格</p>
          </div>
          <div class="lefi">
            <h3 :class="[web_coin_trade.increase_status == '-1'?'color-down':'color-up']">
              {{web_coin_trade.increase_ratio}}</h3>
            <p>涨跌幅</p>
          </div>
          <div class="lefi">
            <h3>{{web_coin_trade.high}}</h3>
            <p>高</p>
          </div>
          <div class="lefi">
            <h3>{{web_coin_trade.low}}</h3>
            <p>低</p>
          </div>
          <div class="lefi">
            <h3>{{web_coin_trade.volume}}  {{web_coin_trade.code}}</h3>
            <p>24小时成交量</p>
          </div>
        </div>
      </div>
      <div class="account">
        <div class="signIn" v-if="!hasLogin">
          <router-link to="/login" tag="p" class="router-link" style="border-right: 1px solid #fff">登录</router-link>
          <router-link to="/register" tag="p" class="router-link">注册
          </router-link>
        </div>
        <div class="personal" v-if="hasLogin">
          <div class="pitem" @click="$router.push('/balances/balances_snapshot')">资产管理</div>
          <div class="addbox">
            <div class="pitem">
              个人中心
              <i class="el-icon-caret-bottom"></i>
            </div>
            <div class="pbox">
              <div class="pbox-p" @click="$router.push('/my');toquit = false">资料信息</div>
              <div class="pbox-s" @click="$router.push('/my/user_security');toquit = false">安全设置</div>
              <div class="pbox-q" @click="logout();toquit = false">退出登录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="main-t">
        <div class="main-l">
          <div class="tv">
            <div class="k-line-area">
              <div id="tv_chart_container" style="height: 500px!important;"></div>
            </div>
          </div>
          <div class="price">
            <div class="money">
              <div class="mtitle">
                <p>我的余额</p>
                <div>
                  <span class="recharge" @click="gotoRecharge">充值</span>
                  <span class="recharge" @click="gotoWithdraw">提现</span>
                </div>
              </div>
              <div class="mbodyf" v-if="hasLogin">
                <p>{{currency_detail.code}}</p>
                <p>
                  <span style="color: #575974;">可用余额</span>
                  <span>{{Number(currency_detail.available_amount).toFixed(volume_precision)}}</span>
                </p>
                <P>
                  <span style="color: #575974;">可卖CNY</span>
                  <span>{{maxSell}}</span>
                </P>
              </div>
              <div class="mbodyf" v-if="hasLogin">
                <p>CNY</p>
                <p>
                  <span style="color: #575974;">可用余额</span>
                  <span>{{Number(money_detail.available_amount).toFixed(price_precision)}}</span>
                </p>
                <P>
                  <span style="color: #575974;">可买{{currency_detail.code}}</span>
                  <span>{{maxBuy}}</span>
                </P>
              </div>
              <div class="please" v-if="!hasLogin">
                <p @click="$router.push('/login')">登录后查看</p>
              </div>
            </div>
            <div class="buysell">
              <div class="buy">
                <div class="buyt1">
                  <div class="inputbox" v-if="toogleTrans1">
                    <input type="text" v-model="price_buy" maxlength="10"
                           v-on:keyup='formatInput1(price_precision)'
                    >
                    <p>价格<span style="font-size:12px;">(CNY)</span></p>
                  </div>
                  <div class="inputbox-no" v-if="!toogleTrans1">
                    以市场上最优价格买入 {{currency}}
                  </div>
                  <div class="textbox" style="position: relative">
                    <p @click="tTrans1 = !tTrans1">{{toogleTrans1 ? '限价' : '市价'}}
                      <i :class="tTrans1?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
                    </p>
                    <div class="textbox" style="position: absolute;left: -1px;top: 38px;width: 100%" v-if="!tTrans1"
                         @click="toogleTrans1 = !toogleTrans1;tTrans1 = !tTrans1">
                      <p>{{toogleTrans1 ? '市价' : '限价'}}
                        <i class="el-icon-arrow-down" style="visibility: hidden"></i>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="buyt1" style="margin-top: 36px;">
                  <div class="inputbox" v-if="toogleTrans1">
                    <input type="text" v-model="input_num_buy" maxlength="10"
                           v-on:keyup='formatInput2(volume_precision)'>
                    <p>数量<span style="font-size:12px;">({{currency}})</span></p>
                  </div>
                  <div class="inputbox" v-if="!toogleTrans1">
                    <input type="text" v-model="amount_buy" maxlength="10"
                           v-on:keyup='formatInput3(volume_precision)'>
                    <p>交易额(CNY)</p>
                  </div>
                  <div class="textbox" v-if="toogleTrans1">
                    <p @click="toggleText1 = false">{{valueText1}}%
                      <i class="el-icon-arrow-right"></i>
                    </p>
                    <div class="textbox2" v-if="!toggleText1 && hasLogin">
                      <i class="el-icon-arrow-down box2icon" @click="toggleText1 = true"></i>
                      <div class="box2num">
                        <p>100%</p>
                        <p>0.0%</p>
                      </div>
                      <el-slider
                        @change="changeSlider1"
                        class="textbox2-con"
                        v-model="valueText1"
                        vertical
                        stops
                        :step="25"
                        show-stops
                        height="132px">
                      </el-slider>
                    </div>
                  </div>
                  <div class="textbox" v-if="!toogleTrans1">
                    <p @click="toggleText2 = false">{{valueText2}}%
                      <i class="el-icon-arrow-right"></i>
                    </p>
                    <div class="textbox2" v-if="!toggleText2 && !hasLogin">
                      <i class="el-icon-arrow-down box2icon" @click="toggleText2 = true"></i>
                      <div class="box2num">
                        <p>100%</p>
                        <p>0.0%</p>
                      </div>
                      <el-slider
                        @change="changeSlider2"
                        class="textbox2-con"
                        v-model="valueText2"
                        vertical
                        stops
                        :step="25"
                        show-stops
                        height="132px">
                      </el-slider>
                    </div>
                  </div>
                </div>
                <p class="buyt2">
                  <span>{{toogleTrans1 ? '交易总额' : ''}}</span>{{toogleTrans1 ? (price_buy * input_num_buy).toFixed(price_precision) : ''}}
                </p>
                <div class="buybtn" @click="ordersCreateBuy()">
                  买入 {{currency}}
                </div>
                <p class="buyt2" style="margin-top: 12px;"><span>交易手续费</span>{{buy_fee * 100}}%</p>
              </div>
              <!--sell-->
              <div class="sell">
                <div class="buyt1">
                  <div class="inputbox" v-if="toogleTrans2">
                    <input type="text" v-model="price_sell" maxlength="10"
                           v-on:keyup='formatInput4(price_precision)'>
                    <p>价格<span style="font-size:12px;">(CNY)</span></p>
                  </div>
                  <div class="inputbox-no" v-if="!toogleTrans2">
                    以市场上最优价格卖出 {{currency}}
                  </div>
                  <div class="textbox" style="position: relative">
                    <p @click="tTrans2 = !tTrans2">{{toogleTrans2 ? '限价' : '市价'}}
                      <i :class="tTrans2?'el-icon-arrow-right':'el-icon-arrow-down'"></i>
                    </p>
                    <div class="textbox" style="position: absolute;left: -1px;top: 38px;width: 100%" v-if="!tTrans2"
                         @click="toogleTrans2 = !toogleTrans2;tTrans2 = !tTrans2">
                      <p>{{toogleTrans2 ? '市价' : '限价'}}
                        <i class="el-icon-arrow-down" style="visibility: hidden"></i>
                      </p>
                    </div>
                  </div>
                </div>
                <div class="buyt1" style="margin-top: 36px;">
                  <div class="inputbox" v-if="toogleTrans2">
                    <input type="text" placeholder="数量" v-model="input_num_sell" maxlength="10"
                           v-on:keyup='formatInput5(volume_precision)'>
                    <p>数量<span style="font-size:12px;">({{currency}})</span></p>
                  </div>
                  <div class="inputbox" v-if="!toogleTrans2">
                    <input type="text" v-model="amount_sell" maxlength="10"
                           v-on:keyup='formatInput6(volume_precision)'>
                    <p>卖出量({{currency_detail.code}})</p>
                  </div>
                  <div class="textbox" v-if="toogleTrans2">
                    <p @click="toggleText3 = false">{{valueText3}}%
                      <i class="el-icon-arrow-right"></i>
                    </p>
                    <div class="textbox2" v-if="!toggleText3 && hasLogin">
                      <i class="el-icon-arrow-down box2icon" @click="toggleText3 = true"></i>
                      <div class="box2num">
                        <p>100%</p>
                        <p>0.0%</p>
                      </div>
                      <el-slider
                        @change="changeSlider3"
                        class="textbox2-con"
                        v-model="valueText3"
                        vertical
                        stops
                        :step="25"
                        show-stops
                        height="132px">
                      </el-slider>
                    </div>
                  </div>
                  <div class="textbox" v-if="!toogleTrans2">
                    <p @click="toggleText4 = false">{{valueText4}}%
                      <i class="el-icon-arrow-right"></i>
                    </p>
                    <div class="textbox2" v-if="!toggleText4 && hasLogin">
                      <i class="el-icon-arrow-down box2icon" @click="toggleText4 = true"></i>
                      <div class="box2num">
                        <p>100%</p>
                        <p>0.0%</p>
                      </div>
                      <el-slider
                        @change="changeSlider4"
                        class="textbox2-con"
                        v-model="valueText4"
                        vertical
                        stops
                        :step="25"
                        show-stops
                        height="132px">
                      </el-slider>
                    </div>
                  </div>
                </div>
                <p class="buyt2">
                  <span>{{toogleTrans2 ? '交易总额' : ''}}</span>{{toogleTrans2 ? (price_sell * input_num_sell).toFixed(price_precision) : ''}}
                </p>
                <div class="buybtn" style="background: #F23757;" @click="ordersCreateSell()">
                  卖出 {{currency}}
                </div>
                <p class="buyt2" style="margin-top: 12px;"><span>交易手续费</span> {{sell_fee * 100}}%</p>
              </div>
            </div>
          </div>
        </div>
        <div class="main-r">
          <div class="tra-l">
            <h2>
              交易深度
              <!--<span @click="wssend(n)" v-for="(i,n) in 4" :class="[tabs === n?'cur':'']">{{i}}</span>-->
            </h2>
            <div class="tra-title">
              <p>价格(CNY)</p>
              <p>数量({{currency}})</p>
              <p>累计({{currency}})</p>
            </div>
            <div class="tra-box">
              <div class="tra-up">
                <div class="tra-up-div"
                     v-if="index<10"
                     v-for="(item,index) in web_depth.asks"
                     @click="optional(item,tabToggle)">
                  <p v-for="(li,n) in item" :class="[n?'':'color-down']">{{li.toLocaleString()}}</p>
                </div>
              </div>
              <div class="tra-center">
                <p :class="web_coin_trade.is_increase > 0?'color-up':'color-down'">
                  {{web_coin_trade.cny_price}}</p>
                <img src="../../assets/imgs/grad.png" alt="">
              </div>
              <div class="tra-down">
                <div class="tra-up-div"
                     v-if="index<10"
                     v-for="(item,index) in web_depth.bids"
                     @click="optional(item,tabToggle)">
                  <p v-for="(li,n) in item" :class="[n?'':'color-up']">{{li.toLocaleString()}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="tra-r">
            <h2>近期成交</h2>
            <div class="tra-title">
              <p>价格(CNY)</p>
              <p>数量({{currency}})</p>
              <p style="margin-right: 4px;">时间</p>
            </div>
            <div class="tra-time">
              <div class="tra-time-box">
                <div v-for="(item,index) in web_ticker" class="tra-time-item">
                  <p :class="item.type === 'buy'?'color-up':'color-down'"
                     style="text-align: left;padding-left: 6px;">
                    {{item.price.toLocaleString()}}</p>
                  <p style="text-align: right;flex: 0.6;"
                  >{{item.num.toLocaleString()}}</p>
                  <p style="text-align: right;padding-right: 10px;">{{getTimeStr(item.date_at)}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-b">
        <div class="main-b-box">
          <div class="qheader">
            <p :class="[tabIndex==index?'cur':'']" v-for="(item,index) in tabList" @click="tabClick(index)">
              {{item.name}}</p>
          </div>
          <div class="qbody">
            <div class="qtitle">
              <p style="flex: 1.4;margin-left: 20px">时间</p>
              <p style="flex: 0.6">类型</p>
              <p style="flex: 1">交易对</p>
              <p style="flex: 1">委托价格</p>
              <p style="flex: 1">委托数量</p>
              <p style="flex: 1">交易总额</p>
              <p style="flex: 1">成交均价</p>
              <p style="flex: 1">已成交</p>
              <p style="flex: 1">未成交</p>
              <p style="flex: 1;text-align: center;">操作/状态</p>
            </div>
            <div style="height: 220px;" v-if="hasLogin">
              <div class="qitem" v-for="(item,index) in orders">
                <p style="flex: 1.4;margin-left: 20px">{{item.created_at_text}}</p>
                <p style="flex: 0.6" :class="[item.type === 'buy'?'color-up':'color-down']">{{item.type_text}}</p>
                <p style="flex: 1">{{item.name}}</p>
                <p style="flex: 1">{{item.price}}</p>
                <p style="flex: 1">{{item.volume}}</p>
                <p style="flex: 1">{{item.amount}}</p>
                <p style="flex: 1">{{item.avg_price}}</p>
                <p style="flex: 1" class="color-up">{{item.deal_volume}}</p>
                <p style="flex: 1" class="color-down">{{item.unfinish_volume}}</p>
                <div style="flex: 1;" class="orders-cancel" v-if="!tabIndex" @click="ordersCancel(item.order_no)">
                  <p>撤单</p>
                </div>
                <p style="flex: 1;text-align: center;" v-if="tabIndex">{{item.status_text}}</p>
              </div>
              <div v-if="orders.length==0" class="orders-zero">暂无记录</div>
            </div>
            <div class="please" v-if="!hasLogin">
              <p @click="$router.push('/login')">登录后查看</p>
            </div>
            <div class="pagination" v-if="hasLogin && total_entries">
              <el-pagination
                @current-change="handleCurrentChange"
                small
                background
                layout="prev, pager, next"
                :total="Number(total_entries)">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Datafeeds from "assets/js/datafeed";
  const TradingView = require("static/charting_library/charting_library.min");
  //  const TradingView = require("assets/charting_library/charting_library.min");
  import {httpGet, httpPost, getTimeStr, isNull, getCookie,delCookie,removeStore} from '../../utils/index'
  import {mapState, mapMutations} from 'vuex'
  export default {
    data() {
      return {
        userInfo:{},
        hasLogin:false,
        pair: 'BTC_CNY',
        coin_name: '',
        depth: 1,
        id: "DKLine",
        chart: null,
        currentSymbol: null,
        tabList: [{name: '当前委托'}, {name: '历史委托'}],
        tabList2: [{name: '限价交易'}, {name: '市价交易'}],
        tabIndex: 0,
        tabIndex2: 0,
        tabs: 0,
        input: '',
        orders: [],
        type: '',
        trade_type: 'limit',
        tTrans1: true,
        tTrans2: true,
        toogleTrans1: true,
        toogleTrans2: true,
        input_num_buy: 0,
        input_num_sell: 0,
        price_buy: 0,
        price_sell: 0,
        price_default: 0,
        amount_buy: 0,
        amount_sell: 0,
        query_type: '0',
        web_depth: [],// 深度
        web_ticker: [],// 最新成交
        web_coin_trade: {}, // 交易对
        web_coin_trade_list: [], // 交易对列表
        buy_fee: 0,
        sell_fee: 0,
        total_entries: '',
        value_buy: 0,
        value_sell: 0,
        time: '',
        currency: 'BTC',
        currency_detail: {},
        money_detail: {},
        saber_amount: 0,
        tabToggle: true,
        toquit: false,
        timer1: null,
        timer2: null,
        timer3: null,
        price_precision: false,
        fix_max_volume: 0.2,
        fix_min_volume: 0.001,
        market_max_volume: 0.4,
        market_min_volume: 0.3,
        market_max_amount: 4,
        market_min_amount: 3,
        price_precision: 2,
        volume_precision: 4,
        valueText1: 0.0,
        valueText2: 0.0,
        valueText3: 0.0,
        valueText4: 0.0,
        toggleText1: true,
        toggleText2: true,
        toggleText3: true,
        toggleText4: true,
        //ws
        lockReconnect: false,
//        wsUrl: "wss://ex.haobtc.io:9502",
        wsUrl: "wss://websocket.haobtc.io:9502",
        ws: null,
        tt: null,
        zero: 0
      }
    },
    computed: {
      symbol() {
        return `AAPL`;
      },
      maxBuy () {
        var num1 = this.saber_amount
        var num3 = this.price_buy
        if (isNaN(num1 / num3) || num3 == '' || num3 == 0) {
          return this.zero.toFixed(this.volume_precision)
        }
        else {
//          return (num1 / num3).toFixed(this.volume_precision)
          return Number((num1 / num3).toString().match(/^\d+(?:\.\d{0,4})?/))
        }
      },
      maxSell(){
        var num1 = this.currency_detail.available_amount
        var num3 = this.price_sell
        if (num3 == '' || isNaN(num3)) {
          return this.zero.toFixed(this.price_precision)
        }
        else {
//          return (num1 * num3).toFixed(this.price_precision)
          return Number((num1 * num3).toString().match(/^\d+(?:\.\d{0,2})?/))
        }
      },
    },
    mounted() {
      this.getUesrInfo()
      this.refresh()
      this.toggleCoin()
    },
    watch: {
      symbol() {
        this.refresh();
      }
    },
    methods: {
//      ...mapMutations(['CHANGE_LOGIN', 'INIT_USER','EMPTY_USER']),
      getUesrInfo () {
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          this.userInfo = JSON.parse(initInfo)
          this.hasLogin = true
        }
      },
      toggleCoin(){
        this.pair = this.$route.query.pair ? this.$route.query.pair : 'BTC_CNY'
        this.currency = this.pair.substring(0, this.pair.indexOf('_'))
        this.coin_name = this.pair.substring(0, this.pair.indexOf('_')) + '/CNY'
        this.ordersDepth()       //深度
        this.ordersTrades()      //近期成交
        this.coinTradesPair()    //交易对信息
        this.coinTradesList()    //交易对列表
        this.createWebSocket()   //ws推送
        if (this.hasLogin) {
          this.getOrders(1);
          setTimeout(this.getBalancesDetail(this.currency), 300)
          this.getBalancesMoney()
        }
      },
      logout(){
        var that = this;
        httpGet('/api/users/logout', {
        }, res => {
          delCookie("userInfo");
          removeStore("userInfo");
          window.location.reload();
          this.$router.push('/')
        })
      },
      createChart() {
        var widget = this.chart = new window.TradingView.widget({
          autosize: true,
          symbol: 'BTC_CNY',
          interval: "1",
          container_id: "tv_chart_container",
          custom_css_url: "../../../static/chart-v3-white-theme.css",
          timezone: 'Asia/Shanghai',
          //	BEWARE: no trailing slash is expected in feed URL
          datafeed: new Datafeeds.UDFCompatibleDatafeed(),
          library_path: "static/charting_library/",
          locale: "zh",
          favorites: {
            move_logo_to_main_pane: "on",
            chartTypes: ["Line"],
            intervals: ["D", "720", "360", "240", "120", "60", "30", "15", "5", "1"]
          },
          time_frames: [
            {text: "1day", resolution: "D", description: "1分"},
            {text: "12h", resolution: "720", description: "12小时"},
            {text: "6h", resolution: "360", description: "6小时"},
            {text: "4h", resolution: "240", description: "4小时"},
            {text: "2h", resolution: "120", description: "2小时"},
            {text: "1h", resolution: "60", description: "1小时"},
            {text: "30m", resolution: "30", description: "30分"},
            {text: "15m", resolution: "15", description: "15分"},
            {text: "5m", resolution: "5", description: "5分"},
            {text: "1m", resolution: "1", description: "1分"},
          ],
          //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
          disabled_features: [
            "header_resolutions",
            "header_chart_type",
            "display_market_status",
            "use_localstorage_for_settings",
            "header_compare",
            "header_symbol_search",
            "symbol_info",
            "symbol_search_hot_key",
            "compare_symbol",
            // "border_around_the_chart",
            "header_interval_dialog_button",
            "show_interval_dialog_on_key_press",
            "remove_library_container_border",
            "left_toolbar",
            "header_undo_redo",
            "header_screenshot",
            "header_saveload",
            "timeframes_toolbar",
            "volume_force_overlay",
            "context_menus"
          ],
          studies_overrides: {
            "volume.volume.color.0": "#F23757",
            "volume.volume.color.1": "#00B76F",
            "volume.volume.linewidth.0": 5,
            "volume.volume.transparency": 65,
            "volume.show ma": false
          },
          overrides: {
            //涨跌柱颜色
            "mainSeriesProperties.candleStyle.upColor": "#00B76F",
            "mainSeriesProperties.candleStyle.downColor": "#F23757",
            "mainSeriesProperties.candleStyle.wickUpColor": 'rgba( 0, 183, 111, 1)',
            "mainSeriesProperties.candleStyle.wickDownColor": 'rgba( 242, 55, 87, 1)',
            "mainSeriesProperties.candleStyle.drawBorder": false,
            "paneProperties.background": "#070825",
            //背景网格线的颜色
            "paneProperties.vertGridProperties.color": "#28343C",
            "paneProperties.horzGridProperties.color": "#28343C",
            //鼠标十字线的颜色
            "paneProperties.crossHairProperties.color": "#E03353",
            "paneProperties.size": "small",
            "scalesProperties.backgroundColor": "#070825",
            //x,y轴边线的颜色
            "scalesProperties.lineColor": "#2F4370",
            //x,y轴文字的颜色
            "scalesProperties.textColor": "#575974",
            //背景logo显示样式
            "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
            "mainSeriesProperties.style": 1,

            "volumePaneSize": "small",

            // "mainSeriesProperties.style": 9,
            // "mainSeriesProperties.showPriceLine": false,
            // "mainSeriesProperties.priceLineWidth": 1,

          },
          save_image: false
        });
        widget.onChartReady(function () {
          widget.chart().createStudy("Moving Average", false, false, [7], null, {
            "plot.color.0": "#ff9524",
            "plot.linewidth": 2
          });
          widget.chart().createStudy("Moving Average", false, false, [30], null, {
            "plot.color.0": "#1cade4",
            "plot.linewidth": 2
          });
          widget.createButton()
            .attr('title', "realtime")
            .on('click', function (e) {
              widget.chart().setResolution('1');
              widget.chart().setChartType(2);
              $(this).parent().siblings().children().removeClass("selected");
              $(this).addClass('selected')
            })
            .append($('<span>分时</span>'));

          var resolution = {
            '1min': '1',
            '5min': '5',
            '15min': '15',
            '30min': '30',
            '1hour': '60',
            '2hour': '120',
            '4hour': '240',
            '6hour': '360',
            '8hour': '480',
            '12hour': '720',
            '1day': 'D'
          };
          for (var key in resolution) {
            widget.createButton()
              .attr('title', key)
              .on('click', function (e) {
                widget.chart().setResolution(resolution[$(this).attr('title')]);
                widget.chart().setChartType(1);
                $(this).parent().siblings().children().removeClass("selected");
                $(this).addClass('selected')
              })
              .append($('<span>' + key + '</span>'));
          }
        })
      },
      refresh() {
        if (!window.TradingView) {
          console.log("Waiting for TV");
          setTimeout(() => {
            this.refresh();
          }, 2000);
          return;
        }
        if (!this.chart || this.symbol != this.currentSymbol) {
          this.createChart();
        }
      },
      createWebSocket(){
        var that = this
        try {
          that.ws = new WebSocket(that.wsUrl);
          that.init();
        } catch (e) {
//          console.log('catch');
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
            event: 'web_depth', 'pair': that.pair, 'depth': 1
          }));
          that.ws.send(JSON.stringify({
            event: 'web_ticker', 'pair': that.pair
          }));
          that.ws.send(JSON.stringify({
            event: 'web_coin_trade'
          }));
        };
        that.ws.onmessage = function (res) {
          //拿到任何消息都说明当前连接是正常的
          var daAll_json = JSON.parse(res.data)
          //web_depth 深度
          //web_ticker 最新成交
          //web_coin_trade 交易对列表
          if (daAll_json.event === 'web_depth') {
            if (daAll_json.data.pair === that.pair) {
              that.web_depth = daAll_json.data
            }
          } else if (daAll_json.event === 'web_ticker') {
            if (daAll_json.data.pair === that.pair) {
              that.web_ticker = daAll_json.data.data;
            }
          } else if (daAll_json.event === 'web_coin_trade') {
            var also = daAll_json.data
            that.web_coin_trade = that.listNew(also)[0]?that.listNew(also)[0]:{}
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
        }
        ;
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
        that.ws.send(JSON.stringify({
          event: 'ping'
        }));
        setTimeout(() => {
          that.sendHeart()
        }, 60000)
      },
      wssend(n){
        this.tabs = n;
        this.ws.send(JSON.stringify({
          event: 'web_depth', 'pair': this.pair, 'depth': n
        }));
      },
      tabClick(tab) {
        this.tabIndex = tab;
        this.query_type = tab ? '1' : '0';
        if (this.hasLogin) {
          this.orders = []
          this.total_entries = 0
          this.getOrders(1)
        }
      },
      ordersCreateBuy(){
        var that = this;
        if (!that.hasLogin) {
          that.$router.push('/login')
          return
        }
        //限价
        if (that.toogleTrans1) {
          if (!that.tabToggle) {
            if (Number(that.input_num_buy) <= 0) {
              that.$message.error('数量不能为空');
              return
            }
          } else {
            if (Number(that.input_num_buy) <= 0 || Number(that.price_buy) <= 0) {
              that.$message.error('价格或数量不能为空');
              return
            }
          }
          if (Number(that.input_num_buy) > Number(that.fix_max_volume)) {
            that.$message.error('最大交易量不能超过' + that.fix_max_volume);
            return
          }
          if (Number(that.input_num_buy) < Number(that.fix_min_volume)) {
            that.$message.error('最小交易量不能低于' + that.fix_min_volume);
            return
          }
          if (Number(that.money_detail.available_amount) < Number(that.input_num_buy * that.price_buy)) {
            that.$message.error('余额不足');
            return
          }
        }
        //市价
        else {
          if (Number(that.amount_buy) <= 0) {
            that.$message.error('交易额不能为空或0');
            return
          }
          if (Number(that.amount_buy) < Number(that.market_min_amount)) {
            that.$message.error('最小买入额不能低于' + that.market_min_amount);
            return
          }
          if (Number(that.amount_buy) > Number(that.market_max_amount)) {
            that.$message.error('最大买入额不能高于' + that.market_max_amount);
            return
          }
        }
        httpPost('/api/orders/create', {
          type: 'buy',
          trade_type: that.toogleTrans1 ? 'limit' : 'market',
          pair: that.pair,
          price: that.toogleTrans1 ? that.price_buy : '',
          volume: that.toogleTrans1 ? that.input_num_buy : '',
          amount: that.toogleTrans1 ? that.price_buy * that.input_num_buy : that.amount_buy,
        }, (res) => {
          if (res.data.error_code === 0) {
            that.input_num_buy = 0
            that.amount_buy = 0
//            that.price_buy = that.price_default
            that.tabIndex = 0
            that.query_type = 0
            that.getOrders(that.page)
            that.getBalancesDetail(this.currency)
            that.getBalancesMoney()
            that.$message({
              message: '挂单成功',
              type: 'success'
            });
          } else {
            console.log(res.data.error_reason)
          }
        })
      },
      ordersCreateSell(){
        var that = this;
        if (!that.hasLogin) {
          that.$router.push('/login')
          return
        }
        //限价
        if (that.toogleTrans2) {
          if (!that.tabToggle) {
            if (Number(that.input_num_sell) <= 0) {
              that.$message.error('数量不能为空');
              return
            }
          } else {
            if (Number(that.input_num_sell) <= 0 || Number(that.price_sell) <= 0) {
              that.$message.error('价格或数量不能为空');
              return
            }
          }
          if (Number(that.input_num_sell) > Number(that.fix_max_volume)) {
            that.$message.error('最大交易量不能超过' + that.fix_max_volume);
            return
          }
          if (Number(that.input_num_sell) < Number(that.fix_min_volume)) {
            that.$message.error('最小交易量不能低于' + that.fix_min_volume);
            return
          }
          if (Number(that.currency_detail.available_amount) < Number(that.input_num_sell)) {
            that.$message.error('余额不足');
            return
          }
        }
        //市价
        else {
          if (Number(that.amount_sell) <= 0) {
            that.$message.error('卖出量不能为空或0');
            return
          }
          if (Number(that.amount_sell) < Number(that.market_min_volume)) {
            that.$message.error('最小卖出量不能低于' + that.market_min_volume);
            return
          }
          if (Number(that.amount_sell) > Number(that.market_max_amount)) {
            that.$message.error('最大卖出量不能高于' + that.market_max_amount);
            return
          }
        }
        httpPost('/api/orders/create', {
          type: 'sell',
          trade_type: that.toogleTrans2 ? 'limit' : 'market',
          pair: that.pair,
          price: that.toogleTrans2 ? that.price_sell : '',
          volume: that.toogleTrans2 ? that.input_num_sell : '',
          amount: that.toogleTrans2 ? that.price_sell * that.input_num_sell : that.amount_sell,
        }, (res) => {
          console.log(res.data.error_reason)
          if (res.data.error_code === 0) {
            that.input_num_sell = 0
            that.amount_sell = 0
//            that.price_sell = that.price_default
            that.tabIndex = 0
            that.query_type = 0
            that.getOrders(that.page)
            that.getBalancesDetail(this.currency)
            that.getBalancesMoney()
            that.$message({
              message: '挂单成功',
              type: 'success'
            });
          } else {
//            console.log(res.data)
          }
        })
      },
      getOrders(page){
        var that = this
        clearInterval(that.timer1)
        httpGet('/api/orders', {
          query_type: that.query_type,
          page: page,
          per_page: 5
        }, (res) => {
          if (res.data.error_code === 0) {
            that.orders = res.data.orders
            that.total_entries = res.data.total_entries
//            console.log(1)
          } else if (res.data.error_code === -1) {
            clearInterval(that.timer1)
          }
          else {
//              console.log(res.data)
          }
        })
        that.timer1 = setInterval(function () {
          var path = that.$route.fullPath
          if (path.indexOf('/trading') >= 0) {
            httpGet('/api/orders', {
              query_type: that.query_type,
              page: page,
              per_page: 5
            }, (res) => {
              if (res.data.error_code === 0) {
                that.orders = res.data.orders
                that.total_entries = res.data.total_entries
//              console.log(1)
              } else {
//              console.log(res.data)
              }
            })
          }
        }, 5000);
      },
      handleCurrentChange(val) {
//        console.log(`当前页: ${val}`);
        this.getOrders(val)
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
        return h + m + s;
      },
      getBalancesDetail(currency){
        var that = this
        clearInterval(that.timer2)
        httpGet('/api/balances/detail', {
          currency: currency
        }, res => {
          if (res.data.error_code === 0) {
            that.currency_detail = res.data
          } else if (res.data.error_code === -1) {
            clearInterval(that.timer2)
          }
        })
        that.timer2 = setInterval(function () {
          var path = that.$route.fullPath
          if (path.indexOf('/trading') >= 0) {
            httpGet('/api/balances/detail', {
              currency: currency
            }, res => {
              if (res.data) {
                that.currency_detail = res.data
              }
            })
          }
        }, 5000);
      },
      getBalancesMoney(){
        var that = this
        clearInterval(that.timer3)
        httpGet('/api/balances/detail', {
          currency: 'CNY'
        }, res => {
          if (res.data.error_code === 0) {
            that.money_detail = res.data
//            console.log(that.money_detail.available_amount + 'saber')
            that.saber_amount = that.money_detail.available_amount
//            that.coinTradesPair()
          } else if (res.data.error_code === -1) {
            clearInterval(that.timer3)
          }
          else {
//            console.log('没获得Money detail')
          }
        })
        that.timer3 = setInterval(function () {
          var path = that.$route.fullPath
          if (path.indexOf('/trading') >= 0) {
            httpGet('/api/balances/detail', {
              currency: 'CNY'
            }, res => {
              if (res.data) {
                that.money_detail = res.data
//            console.log(that.money_detail.available_amount + 'saber')
                that.saber_amount = that.money_detail.available_amount
              }
              else {
//              console.log('没获得Money detail')
              }
            })
          }
        }, 5000);
      },
      gotoRecharge(){
        if (this.hasLogin) {
          this.$router.push('/balances/deposit')
        } else {
          this.$router.push('/login')
        }
      },
      gotoWithdraw(){
        if (this.hasLogin) {
          this.$router.push('/balances/withdraw')
        } else {
          this.$router.push('/login')
        }
      },
      optional(e, t){
        if (t) {
          this.price_buy = this.clearStr(e[0])
          this.price_sell = this.clearStr(e[0])
          if (Number(this.clearStr(e[1])) < Number(this.maxBuy)) {
            this.input_num_buy = this.clearStr(e[1])
          }
          else {
            this.input_num_buy = this.maxBuy ? this.maxBuy : this.zero.toFixed(this.volume_precision)
          }
          if (Number(this.clearStr(e[1])) < Number(this.currency_detail.available_amount)) {
            this.input_num_sell = this.clearStr(e[1])
          }
          else {
            this.input_num_sell = this.currency_detail.available_amount ? this.currency_detail.available_amount : this.zero.toFixed(this.volume_precision)
          }
          if (this.hasLogin) {
            if (this.maxBuy == 0) {
              this.valueText1 = 0
            } else {
              this.valueText1 = ((this.input_num_buy / this.maxBuy) * 100).toFixed(0)
            }
            if (this.currency_detail.available_amount == 0) {
              this.valueText3 = 0
            } else {
              this.valueText3 = ((this.input_num_sell / this.currency_detail.available_amount) * 100).toFixed(0)
            }
          }
        } else {
          this.price_buy = 0
          this.price_sell = 0
        }
      },
      clearStr(str){
        str = str.replace(/,/g, "");//取消字符串中出现的所有逗号
        return str;
      },
      ordersCancel(order_no){
        var that = this
        httpPost('/api/orders/cancel', {
          order_no: order_no
        }, res => {
          if (res.data.error_code === 0) {
            that.$message({
              message: '撤单成功',
              type: 'success'
            });
            this.getOrders(1)
            this.getBalancesDetail(this.currency)
            this.getBalancesMoney()
          }
        })
      },
      coinTradesPair(){
        const that = this
        httpGet('/api/coin_trades', {
          pair: that.pair,
          page: 1,
          per_page: 10,
        }, res => {
          if (res.data.error_code === 0) {
            that.web_coin_trade = res.data.data[0]
            that.buy_fee = res.data.data[0].buy_fee
            that.sell_fee = res.data.data[0].sell_fee
            //配置限制输入
            that.fix_max_volume = res.data.data[0].fix_max_volume
            that.fix_min_volume = res.data.data[0].fix_min_volume
            that.market_max_volume = res.data.data[0].market_max_volume
            that.market_min_volume = res.data.data[0].market_min_volume
            that.market_max_amount = res.data.data[0].market_max_amount
            that.market_min_amount = res.data.data[0].market_min_amount
            that.price_precision = res.data.data[0].price_precision
            that.volume_precision = res.data.data[0].volume_precision
            that.initPrice()
          }
        })
      },
      ordersDepth(){
        const that = this
        httpGet('/api/orders/depth', {
          pair: that.pair,
          per_page: 10,
          merge: 1
        }, res => {
          that.web_depth = res.data
        })
      },
      ordersTrades(){
        const that = this
        httpGet('/api/orders/trades', {
          pair: that.pair,
          per_page: 50,
        }, res => {
          if (res.data.error_code === 0) {
            that.web_ticker = res.data.data
          }
        })
      },
      coinTradesList(){
        const that = this
        httpGet('/api/coin_trades', {
          ticker_filter: 'CNY',
          page: 1,
          per_page: 10,
        }, res => {
          if (res.data.error_code === 0) {
            that.web_coin_trade_list = res.data.data
          }
        })
      },
      optionsChange(e){
//        console.log(e.replace(/\//g, '_'))
        this.coin_name = e.name
        this.$router.push({name: 'trading', query: {pair: e.pair}})
        window.location.reload();
//        setTimeout(this.toggleCoin(), 300)
      },
      listNew(list){
        var that = this
        if (list.length) {
          return list.filter(function (item) {
            return item.pair === that.pair
          })
        }
      },
      initPrice(){
        this.price_buy = this.web_coin_trade.cny_price ? this.web_coin_trade.cny_price : 0
        this.price_sell = this.web_coin_trade.cny_price ? this.web_coin_trade.cny_price : 0
      },
      formatInput1(price_precision){
        var that = this
        this.price_buy = this.price_buy.replace(/[^\d.]/g, '');
        this.price_buy = this.price_buy.replace(/\.{2,}/g, '.');
        this.price_buy = this.price_buy.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        if (this.price_buy.indexOf('.') > 0) {
          setTimeout(function () {
            that.price_buy = that.price_buy.substring(0, that.price_buy.indexOf('.') + price_precision + 1);
          }, 300)
        }
        else {
          return
        }
        if (this.price_buy.indexOf('.') < 0 && this.price_buy != '') {
          this.price_buy = parseFloat(this.price_buy);
        }
      },
      formatInput2(price_precision){
        var that = this
        this.toggleText1 = true
        if (that.hasLogin) {
          if (this.input_num_buy == '' || isNaN(this.input_num_buy)) {
            this.valueText1 = 0
          } else if ((this.input_num_buy / this.maxBuy) > 1) {
            this.valueText1 = 100
          } else {
            this.valueText1 = ((this.input_num_buy / this.maxBuy) * 100).toFixed(0)
          }
        } else {
          this.valueText1 = 0
        }
        this.input_num_buy = this.input_num_buy.replace(/[^\d.]/g, '');
        this.input_num_buy = this.input_num_buy.replace(/\.{2,}/g, '.');
        this.input_num_buy = this.input_num_buy.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        if (this.input_num_buy.indexOf('.') > 0) {
          setTimeout(function () {
            that.input_num_buy = that.input_num_buy.substring(0, that.input_num_buy.indexOf('.') + price_precision + 1);
          }, 300)
        }
        else {
          return
        }
        if (this.input_num_buy.indexOf('.') < 0 && this.price_buy != '') {
          this.input_num_buy = parseFloat(this.input_num_buy);
        }
      },
      formatInput3(price_precision){
        var that = this
        this.toggleText2 = true
        if (that.hasLogin) {
          if (this.amount_buy == '' || isNaN(this.amount_buy)) {
            this.valueText2 = 0
          } else if ((this.amount_buy / this.money_detail.available_amount) > 1) {
            this.valueText2 = 100
          } else {
            this.valueText2 = ((this.amount_buy / this.money_detail.available_amount) * 100).toFixed(0)
          }
        } else {
          this.valueText2 = 0
        }
        this.amount_buy = this.amount_buy.replace(/[^\d.]/g, '');
        this.amount_buy = this.amount_buy.replace(/\.{2,}/g, '.');
        this.amount_buy = this.amount_buy.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        if (this.amount_buy.indexOf('.') > 0) {
          setTimeout(function () {
            that.amount_buy = that.amount_buy.substring(0, that.amount_buy.indexOf('.') + price_precision + 1);
          }, 300)
        }
        else {
          return
        }
        if (this.amount_buy.indexOf('.') < 0 && this.amount_buy != '') {
          this.amount_buy = parseFloat(this.amount_buy);
        }
      },
      formatInput4(price_precision){
        var that = this
        this.price_sell = this.price_sell.replace(/[^\d.]/g, '');
        this.price_sell = this.price_sell.replace(/\.{2,}/g, '.');
        this.price_sell = this.price_sell.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        if (this.price_sell.indexOf('.') > 0) {
          setTimeout(function () {
            that.price_sell = that.price_sell.substring(0, that.price_sell.indexOf('.') + price_precision + 1);
          }, 300)
        }
        else {
          return
        }
        if (this.price_sell.indexOf('.') < 0 && this.price_sell != '') {
          this.price_sell = parseFloat(this.price_sell);
        }
      },
      formatInput5(price_precision){
        var that = this
        this.toggleText3 = true
        if (that.hasLogin) {
          if (this.input_num_sell == '' || isNaN(this.input_num_sell)) {
            this.valueText3 = 0
          } else if ((this.input_num_sell / this.currency_detail.available_amount) > 1) {
            this.valueText3 = 100
          } else {
            this.valueText3 = ((this.input_num_sell / this.currency_detail.available_amount) * 100).toFixed(0)
          }
        } else {
          this.valueText3 = 0
        }
        this.input_num_sell = this.input_num_sell.replace(/[^\d.]/g, '');
        this.input_num_sell = this.input_num_sell.replace(/\.{2,}/g, '.');
        this.input_num_sell = this.input_num_sell.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        if (this.input_num_sell.indexOf('.') > 0) {
          setTimeout(function () {
            that.input_num_sell = that.input_num_sell.substring(0, that.input_num_sell.indexOf('.') + price_precision + 1);
          }, 300)
        }
        else {
          return
        }
        if (this.input_num_sell.indexOf('.') < 0 && this.input_num_sell != '') {
          this.input_num_sell = parseFloat(this.input_num_sell);
        }
      },
      formatInput6(price_precision){
        var that = this
        this.toggleText4 = true
        if (that.hasLogin) {
          if (this.amount_sell == '' || isNaN(this.amount_sell)) {
            this.valueText4 = 0
          } else if ((this.amount_sell / this.currency_detail.available_amount) > 1) {
            this.valueText4 = 100
          } else {
            this.valueText4 = ((this.amount_sell / this.currency_detail.available_amount) * 100).toFixed(0)
          }
        } else {
          this.valueText4 = 0
        }
        this.amount_sell = this.amount_sell.replace(/[^\d.]/g, '');
        this.amount_sell = this.amount_sell.replace(/\.{2,}/g, '.');
        this.amount_sell = this.amount_sell.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
        if (this.amount_sell.indexOf('.') > 0) {
          setTimeout(function () {
            that.amount_sell = that.amount_sell.substring(0, that.amount_sell.indexOf('.') + price_precision + 1);
          }, 300)
        }
        else {
          return
        }
        if (this.amount_sell.indexOf('.') < 0 && this.amount_sell != '') {
          this.amount_sell = parseFloat(this.amount_sell);
        }
      },
      changeSlider1(e){
        this.toggleText1 = true
        if (this.hasLogin) {
          this.input_num_buy = (e * this.maxBuy * 0.01).toFixed(this.volume_precision)
        } else {
          this.input_num_buy = 0
        }
      },
      changeSlider2(e){
        this.toggleText2 = true
        if (this.hasLogin) {
          this.amount_buy = (e * this.money_detail.available_amount * 0.01).toFixed(this.price_precision)
        } else {
          this.amount_buy = 0
        }
      },
      changeSlider3(e){
        this.toggleText3 = true
        if (this.hasLogin) {
          this.input_num_sell = (e * this.currency_detail.available_amount * 0.01).toFixed(this.volume_precision)
        } else {
          this.input_num_sell = 0
        }
      },
      changeSlider4(e){
        this.toggleText4 = true
        if (this.hasLogin) {
          this.amount_sell = (e * this.currency_detail.available_amount * 0.01).toFixed(this.volume_precision)
        } else {
          this.amount_sell = 0
        }
      },
    }
  }
</script>

<style scoped>
  .all1 {
    background: -webkit-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Firefox 3.6 - 15 */
    background: linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* 标准的语法 */
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-right: 90px;
  }

  .myselect {
    background: transparent;
    border: none;
    outline: none;
    font-size: 20px;
    color: #C4C7FF;
    /*background: url("arrow.png") no-repeat scroll right center transparent;*/
    /*padding-right: 14px;*/
  }

  .left {
    display: flex;
    flex-direction: row;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    cursor: pointer;
  }

  .logo img {
    width: 115px;
    height: 37px;
    margin-left: 20px;
    margin-right: 22px;
  }

  .lefi-box {
    display: flex;
    flex-direction: row;
  }

  .lefi-par {
    position: relative;
  }

  .lefi-alert {
    position: absolute;
    left: -140px;
    top: 60px;
    width: 300px;
    padding: 10px 0;
    opacity: 0.9;
    background: #12133C;
    border-radius: 2px 0 0 0 2px 2px 2px;
    display: none;
  }

  .alert-top {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #12133C;
    position: absolute;
    top: -10px;
    left: 254px;
  }

  .alert-title, .alert-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .alert-item {
    cursor: pointer;
  }

  .alert-item:hover {
    background: #1C1E59;
  }

  .alert-title > div, .alert-item > div {
    flex: 1;
    height: 40px;
    line-height: 40px;
    /*border: 1px solid red;*/
  }

  .alert-title > div {
    font-size: 16px;
    color: #C4C7FF;
    letter-spacing: 0;
  }

  .alert-item > div {
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
  }

  .lefi-par:hover .lefi-alert {
    display: block;
  }

  .lefi {
    /*margin: 0 24px;*/
    width: 160px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /*border: 1px solid red;*/
  }

  .lefi h3 {
    font-size: 20px;
    color: #C4C7FF;
  }

  .lefi p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #C4C7FF;
    margin-top: 6px;
    font-weight: 100;
  }

  .account {
    width: 240px;
    height: 79px;
  }

  .signIn {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .signIn .router-link {
    width: 62px;
    height: 14px;
    line-height: 14px;
    color: #bbb;
    font-size: 22px;
    cursor: pointer;
  }

  .signIn .router-link:hover {
    color: #fff;
    opacity: 1;
  }

  .personal {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    /*border: 1px solid red;*/
  }

  .addbox {
    height: 80px;
    line-height: 80px;
  }

  .pitem {
    letter-spacing: 0;
    opacity: 0.38;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #FFFFFF;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    /*border: 1px solid red;*/
  }

  .pitem:hover {
    color: #fff;
    opacity: 1;
  }

  .pbox {
    display: none;
  }

  .pbox div {
    text-align: center;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
  }

  .pbox div:hover {
    background: #1C1E59;
  }

  .pbox-p {
    margin-top: 60px;
    width: 80%;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #1C1E59;
  }

  .pbox-s {
    width: 80%;
    height: 60px;
    line-height: 60px;
    margin: 10px 0;
  }

  .pbox-q {
    width: 70%;
    height: 40px;
    line-height: 40px;
    background: #1C1E59;
    margin-bottom: 60px;
  }

  .addbox:hover .pbox {
    position: absolute;
    left: 80px;
    top: 60px;
    /*border: 1px solid red;*/
    width: 260px;
    z-index: 999;
    background: url("../../assets/imgs/slice.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .qheader {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .qheader p {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 30px;
    width: 100px;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    font-weight: bold;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: #C4C7FF;
    letter-spacing: 0;
  }

  .cur {
    border-bottom: 2px solid #fff;
    color: #fff !important;
  }

  .qtitle {
    display: flex;
    justify-content: space-between;
    margin: 0px auto;
    margin-top: 30px;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #575974;
  }

  .qtitle p {
    text-align: left;
  }

  .qitem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px auto;
    margin-top: 10px;
    height: 30px;
    font-size: 18px;
    color: #C4C7FF;
    /*border: 1px solid red;*/
  }

  .qitem p {
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .orders-zero{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size:20px;
    color: #575974;
  }
  .tra-l {
    width: 50%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #070825;
    margin-right: 10px;
  }

  .tra-r {
    width: 50%;
    display: flex;
    flex-direction: column;
    /*overflow: hidden;*/
    background: #070825;
  }

  .main-r h2 {
    text-align: left;
    font-size: 20px;
    color: #C4C7FF;
    padding-left: 6px;
    height: 40px;
    line-height: 40px;
  }

  .tra-title {
    height: 24px;
    line-height: 24px;
    display: flex;
    justify-content: space-between;
    padding: 0 6px;
    align-items: center;
    font-size: 14px;

  }

  .tra-title p {
    font-size: 14px;
    color: #575974;
    flex: 1;
  }

  .tra-title p:first-child {
    text-align: left;
  }

  .tra-title p:last-child {
    text-align: right;
  }

  .tra-box {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .tra-up, .tra-down {
    font-size: 12px;
    height: 370px;
    color: #C4C7FF;
    display: flex;
    flex-direction: column;
    /*border: 1px solid red;*/
  }

  .tra-up {
    justify-content: flex-end;
  }

  .tra-center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-left: 6px;
    height: 80px;
  }

  .tra-center p {
    font-size: 25px;
    color: #C4C7FF;
  }

  .tra-center img {
    width: 34px;
    height: 34px;
  }

  .tra-up div, .tra-down div {
    width: 100%;
    height: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    /*border: 1px solid red;*/
  }

  .tra-up-div {
    cursor: pointer;
  }

  .tra-up-div:hover {
    background: #16193E;
  }

  .tra-up-div p {
    flex: 1;
    text-align: center;
    font-size: 16px;
    /*border:1px solid red;*/
  }

  .tra-up-div p:first-child {
    text-align: left;
    padding-left: 6px;
  }

  .tra-up-div p:last-child {
    text-align: right;
    padding-right: 6px;
  }

  .tra-time {
    /*height: 740px;*/
    height: 100%;
    overflow-y: scroll;
    /*border: 1px solid red;*/
  }

  .tra-time-box {
    height: auto;
  }

  .tra-time-item {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    /*align-items: center;*/
    height: 32px;
  }

  .tra-time-item p {
    flex: 1;
    font-size: 16px;
    color: rgb(196, 199, 255);
    /*border: 1px solid red;*/
  }

  .recharge {
    color: #fff;
    cursor: pointer;
    margin-left: 6px;
    margin-right: 2px;
    border-bottom: 1px solid #fff;
    font-size: 20px;
  }

  .pagination {
    margin-top: 6px;
    /*background: red;*/
  }

  .k-title > div {
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .k-title > div > p {
    margin-left: 80px;
  }

  .k-title > div > p:first-child {
    margin-left: 20px;
  }

  .please {
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    /*border:1px solid red;*/
  }

  .please p {
    width: 120px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    background-color: #fc4038;
    color: #fff;
    cursor: pointer;
  }

  .tra-item {
    align-items: center;
    height: 24px;
    line-height: 24px;
  }
  .orders-cancel{
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .orders-cancel p {
    color: cornflowerblue;
    cursor: pointer;
    border: 1px solid #494B6A;
    border-radius: 2px;
    width: 72px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
  }

  .traing h2 span {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid red;
    line-height: 20px;
    text-align: center;
    cursor: pointer;
  }

  .main {

  }

  .main-t {
    width: 100%;
    height: 820px;
    box-sizing: border-box;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    /*align-items: center*/
  }

  .main-l {
    width: 66%;
    /*border: 1px solid red;*/
    margin-right: 10px;
    height: 820px;
    display: flex;
    flex-direction: column;
    background: -webkit-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Firefox 3.6 - 15 */
    background: linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* 标准的语法 */
  }

  .main-r {
    width: 34%;
    display: flex;
    justify-content: space-between;
    background: -webkit-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Firefox 3.6 - 15 */
    background: linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* 标准的语法 */
    /*border: 1px solid red;*/
  }

  .main-b {
    width: 100%;
    /*border: 1px solid red;*/
  }

  .main-b-box {
    margin: 0 10px;
    height: 400px;
    margin-top: 10px;
    background: #070825;
  }

  .price {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /*border: 1px solid red;*/
    margin-top: 10px;
    height: 100%;
    background: #0C0D2D;
  }

  .money {
    width: 28%;
    padding: 0 10px;
    background: #070825;
    /*border: 1px solid red;*/
  }

  .mtitle {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 30px;
  }

  .mtitle p {
    color: #fff;
    font-size: 20px;
  }

  .mbodyf {
    margin-top: 14px;
  }

  .mbodyf p {
    color: #C4C7FF;;
    line-height: 1.6em;
    font-size: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .buysell {
    width: 69%;
    display: flex;
    flex-direction: row;
    background: #070825;
  }

  .buy, .sell {
    width: 50%;
    padding: 0 10px;
    /*border: 1px solid red;*/
  }

  .buyt1 {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /*align-items: center;*/
    padding: 0 10px;
    margin-top: 24px;
  }

  .inputbox {
    width: 74%;
    height: 40px;
    position: relative;
  }

  .inputbox-no {
    width: 74%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #464863;
    border-radius: 2px;
    font-size: 14px;
    color: #FFFFFF;
  }

  .inputbox input {
    box-sizing: border-box;
    border: 1px solid #464863;
    border-radius: 2px;
    height: 40px;
    width: 100%;
    background: #090A2E;
    padding-left: 100px;
    outline: none;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #fff;
  }

  .inputbox p {
    position: absolute;
    left: 0;
    top: 10px;
    font-size: 14px;
    color: #C2C5FC;
    width: 94px;
    height: 20px;
    line-height: 20px;
    border-right: 1px solid #464864;
  }

  input:focus {
    border: 1px solid #00B76F;
  }

  .textbox {
    background: #090A2E;
    border: 1px solid #464863;
    border-radius: 2px;
    width: 22%;
    height: 38px;
    line-height: 38px;
    cursor: pointer;
    position: relative;
    /*overflow: hidden;*/
  }

  .textbox p {
    height: 38px;
    line-height: 38px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
    letter-spacing: 0;
  }

  .textbox2 {
    background: #090A2E;
    border: 1px solid #464863;
    border-radius: 2px;
    width: 22%;
    height: 198px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: -1px;
    top: 0px;
    width: 100%;
    z-index: 998;
  }

  .box2num {
    display: flex;
    flex-direction: column;
    height: 130px;
    align-items: center;
    justify-content: space-between;
  }

  .box2num p {
    font-size: 14px;
    color: #C4C7FF;
  }

  .textbox2-con {
    /*translate3d:rotate(180deg);*/
    /*-ms-transform:rotate(180deg); 	!* IE 9 *!*/
    /*-moz-transform:rotate(180deg); 	!* Firefox *!*/
    /*-webkit-transform:rotate(180deg); !* Safari 和 Chrome *!*/
    /*-o-transform:rotate(180deg); 	!* Opera *!*/
  }

  .box2icon {
    position: absolute;
    right: 4px;
    top: 10px;
    color: #fff;
    font-size: 14px;
  }

  .buyt2 {
    padding: 0 10px;
    text-align: left;
    margin-top: 18px;
    font-size: 12px;
    color: #C4C7FF;
    letter-spacing: 0;
  }

  .buyt2 span {
    color: #575974;
    margin-right: 2px;
  }

  .buybtn {
    width: 96%;
    height: 40px;
    margin: 0px auto;
    margin-top: 43px;
    background: #00B76F;
    border-radius: 2px;
    font-size: 22px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 40px;
    cursor: pointer;
  }


</style>
