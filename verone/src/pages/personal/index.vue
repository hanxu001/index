<template>
  <div style="height: auto;min-height:80%;background: #F6F6FB;">
    <header-Top :outIndex="10"></header-Top>
    <div style="height: 100%;padding: 30px 0;display: flex;align-items: center">
      <div class="container content_wrap">
        <ul class="nav">
          <li @click="navSelect(index)" v-for="(item,index) in navlist" :class="['nav_item',index==navIndex?'current':'']">{{item}}</li>
        </ul>
        <router-view class="content"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  import {httpGet, httpPost , getCookie} from '../../utils'
  //import {mapState, mapMutations} from 'vuex'

  export default {
    data() {
      return {
        navlist: ['基本信息','身份认证','密码管理','安全设置','API管理'],
        navIndex: '0',
        userName: '',//账号信息
        emailAuth: '',//邮箱认证状态
        kycStatus: '',//身份认证状态
        bankAuth: '',//银行卡认证状态

        userInfo: {}, //用户状态
        hasLogin: false, //登录状态
      }
    },
    mounted() {
      this.getUesrInfo();
    },
    watch: {
      '$route': 'getnavIndex'
    },
    computed: {
      //...mapState(['hasLogin','userInfo'])
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
            this.$router.push('/my/user_info');
            break;
          case 1:
            this.$router.push('/my/user_profiles');
            break;
          case 2:
            this.$router.push('/my/user_password');
            break;
          case 3:
            this.$router.push('/my/user_security');
            break;
          case 4:
            this.$router.push('/my/user_api');
            break;
          default:
            this.$router.push('/my/user_info');
        }
      },
      //获取 路由中的 nvaIndex
      getnavIndex() {
        // this.navIndex = this.$route.params.id;
        var url = this.$route.path;
        if(url == '/my/user_info' || url == '/my') {
          this.navIndex = 0;
          return;
        }
        if(url == '/my/user_profiles') {
          this.navIndex = 1;
          return;
        }
        if(url == '/my/user_password') {
          this.navIndex = 2;
          return;
        }
        if(url == '/my/user_security') {
          this.navIndex = 3;
          return;
        }
        if(url == '/my/user_api') {
          this.navIndex = 4;
          return;
        }
        //console.log(this.$route.params.id);
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
    /*margin-top: 30px;*/
    /*margin-bottom: 30px;*/
    /*min-height: 600px;*/
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
    background: #FAFAFE;
    position: relative;
    left: -15px;
  }
  .content{
    flex: 1;
    background-color: #ffffff;
    min-height: 700px;
    height: auto;
    padding: 30px 50px;
  }
</style>
