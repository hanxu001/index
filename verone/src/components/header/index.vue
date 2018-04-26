<template>
  <div>
    <div :class="[bgTrue?'header1':'header2']">
      <div class="container" style="height: 100%">
        <div class="left">
          <div class="logo" @click="$router.push('/')">
            <img src="../../assets/imgs/logo.png" alt="">
          </div>
          <div class="item" v-for="(item,index) in tabList" @click="goTab(index)">
            <p :class="[index === outIndex?'cur':'']">{{item}}</p>
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
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  import {removeStore, isNull, httpGet, delCookie, getCookie, httpPost, getUesrInfo} from '../../utils/index'
  export default {

    data() {
      return {
        tabList: ['首页', '行情', '交易', '帮助中心', '公告','工单'],
        tabIndex: 0,
        toquit: false,
        userInfo: {},
        hasLogin: false
      }
    },
    props: {
      bgTrue: {
        default: true,
      },
      outIndex: {
        default: 0,
      }
    },
    computed: {},
    mounted() {
      var that=this;
      this.getUesrInfo();
      //this.$cookieStore.getUesrInfo(that.userInfo, that.hasLogin);
    },
    methods: {
     // ...mapMutations(['CHANGE_LOGIN', 'INIT_USER','EMPTY_USER']),
      getUesrInfo () {
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          this.userInfo = JSON.parse(initInfo);
          this.hasLogin = true;
        }
      },
      goTab(tab){
        this.tabIndex = tab;
        if (tab === 0) {
          this.$router.push('/home')
        }
        else if (tab === 1) {
          this.$router.push('/quot')
        }
        else if (tab === 2) {
          this.$router.push({name: 'trading', query: {pair: 'BTC_CNY'}})
        }
        else if (tab === 3) {
          this.$router.push('/help')
        }
        else if (tab === 4) {
          this.$router.push('/announcement')
        }
        else if (tab === 5) {
          this.$router.push('/work_orders')
        }
      },
      logout(){
        delCookie("userInfo");
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        var that = this;
        httpGet('/api/users/logout', {
        }, res => {
      if(res.data.error_code== -400||res.data.error_code== 0){
        loading.close();
        that.$router.push('/');
      }
        })
      },
    }
  }
</script>

<style scoped>
  .header1 {
    min-width: 1200px;
    display: flex;
    align-items: center;
    height: 90px;
    background: -webkit-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* Firefox 3.6 - 15 */
    background: linear-gradient(-180deg, #1C1E59 0%, #0C0D2D 27%); /* 标准的语法 */
  }

  .header2 {
    min-width: 1200px;
    display: flex;
    align-items: center;
    height: 90px;
  }

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /*border: 1px solid red;*/
  }

  .left {
    display: flex;
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

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0 22px;
    /*border: 1px solid red;*/
  }

  .item p {
    letter-spacing: 0;
    opacity: 0.38;
    font-family: PingFangSC-Medium;
    font-size: 26px;
    color: #fff;
  }

  .item p:hover {
    color: #fff;
    opacity: 1 !important;
  }

  .cur {
    color: #fff !important;
    opacity: 1 !important;
  }

  .account {
    width: 240px;
    height: 79px;
    /*background: rgba(0, 0, 0, .7);*/
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
  }

  .personal {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 100%;
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
</style>
