<template>
  <div>
    <div class="banner_content">
      <div class="banner">
        <p @click="$router.push('/')" class="b_title"><img src="../../assets/imgs/logo.png" alt=""></p>
        <div class="input">
          <div @click="selectHandle" class="img"><img src="../../assets/imgs/help_select.png" alt=""></div>
          <span style="margin: 0 13px;font-size: 50px;">|</span>
          <input v-model="selectMessage" @keyup.enter="selectHandle" maxlength="50" type="text" placeholder="搜索">
        </div>
      </div>
    </div>
    <div style="background: #F6F6FB; min-height: 700px;display: flex;align-items: center">
      <div v-if="!selectFlag" class="content_wrap">
        <p class="c_title" @click="guardFlag = true;coin_introduceFlag = false">帮助中心</p>
        <div v-if="!coin_introduceFlag" class="content">
          <div class="item item1">
            <div class="left">快速交易指南</div>
            <div v-if="guardFlag" @click="guardFlag = !guardFlag" class="right">简单四步，快速交易 <span style="font-size: 26px;color: #2D4473">></span></div>
          </div>
          <!--交易指南1-->
          <div v-if="guardFlag">
            <div class="item">
              <p class="i_title">新手引导</p>
              <div class="i_content">
                <p v-for="item in newUserGuide" :class="item == '→'?'i_arrow':'i_item'">{{item}}</p>
              </div>
            </div>
            <div class="item">
              <p class="i_title">挂单交易</p>
              <div class="i_content">
                <p v-for="item in userOrder" :class="item == '→'?'i_arrow':'i_item'">{{item}}</p>
              </div>
            </div>
            <div class="item item3">
              <p class="i_title">账户安全</p>
              <div class="i_content">
                <p v-for="item in accountSatey" :class="item == '→'?'i_arrow':'i_item'">{{item}}</p>
              </div>
            </div>
            <div class="item item1">
              <div class="left">币种介绍</div>
              <div @click="coin_introduceFlag = !coin_introduceFlag" class="right">
                <span style="font-size: 26px;color: #2D4473">></span>
              </div>
            </div>
          </div>
          <!--交易指南2-->
          <ul class="guard2" v-if="!guardFlag">
            <li class="g2_item">1.注册登录： <i @click="$router.push('/register')">【注册】</i>支持手机或邮箱 快速 安全 便捷。</li>
            <li class="g2_item">2.安全验证： 完成<i>【身份认证】</i>设置 <i>【数字货币充值】</i>,确保账户资金安全。</li>
            <li class="g2_item">3.开始充值： 使用<i>【银行卡汇款】</i>或<i>【数字货币充值】</i>,加入交易资金。</li>
            <li class="g2_item">4.开始交易： 点击<i @click="$router.push('/trading')">【交易】</i>，即可使用<i @click="$router.push('/trading')">【市价委托】</i>或 <i @click="$router.push('/trading')">【限价委托】</i>,进行交易。</li>
          </ul>
        </div>
        <!--币种介绍-->
        <div v-if="coin_introduceFlag" class="coin_intro">
          <el-collapse v-model="activeName" accordion>
            <el-collapse-item class="intro_item" title="什么是BTC" name="1">
              <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
              <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
            </el-collapse-item>
            <el-collapse-item class="intro_item" title="什么是LTC" name="2">
              <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作；</div>
              <div>页面反馈：操作后，通过页面元素的变化清晰地展现当前状态。</div>
            </el-collapse-item>
            <el-collapse-item class="intro_item" title="什么是ETC" name="3">
              <div>简化流程：设计简洁直观的操作流程；</div>
              <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
              <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item class="intro_item" title="什么是BTG" name="4">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
            <el-collapse-item class="intro_item" title="什么是ETH" name="5">
              <div>简化流程：设计简洁直观的操作流程；</div>
              <div>清晰明确：语言表达清晰且表意明确，让用户快速理解进而作出决策；</div>
              <div>帮助用户识别：界面简单直白，让用户快速识别而非回忆，减少用户记忆负担。</div>
            </el-collapse-item>
            <el-collapse-item class="intro_item" title="什么是BTM" name="6">
              <div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
              <div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <!--搜索-->
      <div v-if="selectFlag" class="content_wrap">
        <p v-if="selectData.length >0" class="c_title">搜获结果- <span>{{selectData[0].title}}的{{selectData.length}}条结果</span></p>
        <p v-if="selectData.length == 0" class="c_title">搜获结果- <span>{{selectMessage}}的0条结果</span></p>
        <ul class="s_content">
          <li v-for="item in selectData" class="sc_item">
            <p class="i_item_title">{{item.title}} <span>{{item.updatedAt}}更新</span></p>
            <p class="i_item_content">{{item.content}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, getTimeStr} from '../../utils'
  //import {mapState } from 'vuex'

  import ElSlPanel from "../../../node_modules/element-ui/packages/color-picker/src/components/sv-panel.vue";

  export default {
    components: {ElSlPanel},
    data() {
      return {
        newUserGuide:['注册 >','→','登录 >','→','认证 >','→','充值 >','→','交易 >','→','提现 >'],
        userOrder: ['买入/卖出 >','→','限价委托 >','→','市价委托 >'],
        accountSatey: ['登录密码 >','→','限价委托 >','→','资金密码 >','→','身份验证 >','→','二次验证 >','→','手机绑定 >','→','邮箱绑定 >','→','提现限制 >'],
        guardFlag: true, //交易指南 开关
        selectFlag: false, //搜索 开关 默认关闭
        selectMessage: '', //搜索内容
        selectData: [], //搜索返回的Flag内容
        coin_introduceFlag: false, //币种介绍
        activeName: '1',//币种介绍 展开

      }
    },
    computed: {
      //...mapState(['userInfo'])
    },
    mounted() {

    },
    methods: {
      //点击搜索的时候
      selectHandle() {
        this.selectFlag = true;

        var that = this;
        httpGet('/api/faq',{
          keyword: that.selectMessage
        },function (res) {
          if(res.data.error_code == 0) {
            that.selectData = res.data.data;
            for(var i=0,len=that.selectData.length;i<len;i++) {
              that.selectData[i].updatedAt = getTimeStr(that.selectData[i].updated_at);
            }
          }
        })
      }
    }
  }
</script>
<style scoped>
  @import "../../common.css";
  .banner_content{
    padding: 107px 0 56px;
    background: url("../../assets/imgs/help_banner_bg.png") no-repeat;
    background-size: 100% 100%;
  }
  .banner{
    width: 920px;
    margin: 0 auto;
  }
  .banner .b_title{
    width: 114px;
    height: 37px;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .banner .b_title img{
    width: 100%;
    height: 100%;
  }
  .banner .input{
    height: 80px;
    padding-left: 13px;
    display: flex;
    align-items: center;
    background: #7375A3;
    border-radius: 2px;
    font-size: 26px;
    color: #D3D3D3;
  }
  .banner .input .img{
    width: 34px;
    height: 34px;
    cursor: pointer;
  }
  .banner .input .img img{
    width: 100%;
    height: 100%;
  }
  .banner .input input{
    flex: 1;
    height: 60px;
    padding-left: 10px;
    background-color: #7375A3;
    border: 0;
    outline: none;
    color: #D3D3D3;
    font-size: 26px;
  }
  .banner .input input::placeholder{
    font-size: 26px;
    color: #D3D3D3;
    line-height: 60px;
  }

  .content_wrap{
    width: 900px;
    height: auto;
    margin: 0 auto;
    padding: 42px 0;
  }
  .content_wrap .c_title{
    font-size: 18px;
    color: #575974;
    text-align: left;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .content{
    background: #FDFDFF;
    border: 1px solid #EAEAEE;
    border-left: none;
    border-bottom: none;
    border-radius: 2px;
  }
  .content .item1{
    padding: 51px 32px;
    display: flex;
    justify-content: space-between;
  }
  .content .item1 .left{
    font-size: 24px;
    color: #0B0D32;
  }
  .content .item1 .right{
    font-size: 18px;
    color: #A1A1A1;
    cursor: pointer;
  }
  .content .item{
    padding: 28px 32px;
    background: #FDFDFF;
    border-bottom: 1px solid #EAEAEE;
    border-radius: 2px;
  }
  .content .item .i_title{
    font-size: 24px;
    color: #0B0D32;
    margin-bottom: 24px;
    text-align: left;
  }
  .content .item .i_content{
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .content .item .i_content .i_item{
    padding: 0 22px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #C4C7FF;
    border-radius: 2px;
  }
  .content .item .i_content .i_arrow{
    margin: 0 18px;
  }
  .content .item3 .i_content .i_item,
  .content .item3 .i_content .i_arrow{
    margin-bottom: 25px;
  }

  .content .item:nth-of-type(1) {
    border-left: 9px solid #79C1FC;
  }
  .content .item:nth-of-type(2) {
    border-left: 9px solid #C4C7FF;
  }
  .content .item:nth-of-type(3) {
    border-left: 9px solid  #4AEED5;
  }
  .content .item:nth-of-type(4) {
    border-left: 9px solid #00B76F;
  }

  /*guard2*/
  .guard2{
    padding: 20px 35px;
  }
  .guard2 .g2_item{
    height: 62px;
    line-height: 62px;
    font-size: 18px;
    color: #000000;
    text-align: left;
  }
  .guard2 .g2_item i{
    color: #3e98cd;
    cursor: pointer;
  }
  /*select*/
  .content_wrap .c_title{
    font-size: 18px;
    color: #575974;
    margin-bottom: 10px;
  }
  .content_wrap .c_title span{
    color: #989898;
  }
  .content_wrap .s_content{
    border: 1px solid #EAEAEE;
    border-bottom: none;
  }
  .content_wrap .s_content .sc_item{
    border-bottom: 1px solid #EAEAEE;
    background: #FFFFFF;
    border-radius: 2px;
    padding: 26px 30px;
    text-align: left;
  }
  .s_content .sc_item .i_item_title{
    font-size: 18px;
    color: #0B0D32;
    margin-bottom: 14px;
  }
  .s_content .sc_item .i_item_title span{
    font-size: 14px;
    color: #C4C7FF;
  }
  .s_content .sc_item .i_item_content{
    font-size: 16px;
    color: #757575;
  }
  /*币种介绍*/
  .coin_intro{
    min-height: 700px;
    background: #ffffff;
    text-align: left;
    padding: 0 20px;
  }
</style>
