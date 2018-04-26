<template>
  <div class="content">
    <p class="title">全部委托</p>
    <div class="select_wrap">
      <div class="s_date s_item">
        <span class="s_txt">时间</span>
        <div class="s_con">
          <!--<el-date-picker-->
            <!--class="s_picker"-->
            <!--v-model="valueDate"-->
            <!--type="daterange"-->
            <!--value-format="timestamp"-->
            <!--range-separator="至"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期">-->
          <!--</el-date-picker>-->
          <el-date-picker
              class="s_picker"
              v-model="startTime"
              value-format="timestamp"
              type="date"
              placeholder="开始日期"
              :picker-options="pickerOptions0">
          </el-date-picker>
          <span style="margin: 0 8px">-</span>
          <el-date-picker
              class="s_picker"
              v-model="endTime"
              value-format="timestamp"
              align="right"
              type="date"
              placeholder="结束日期"
              :picker-options="pickerOptions1">
          </el-date-picker>
        </div>
      </div>
      <div class="s_type s_item">
        <span class="s_txt">类型</span>
        <div class="s_con">
          <el-select class="s_option" clearable v-model="type" placeholder="请选择">
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="s_coin s_item">
        <span class="s_txt">币种</span>
        <div class="s_con">
          <el-select class="s_option" clearable v-model="coin" placeholder="请选择">
            <el-option
              v-for="item in coinData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="s_status s_item">
        <span class="s_txt">状态</span>
        <div class="s_con">
          <el-select class="s_option" clearable v-model="status" placeholder="请选择">
            <el-option
              v-for="item in statusData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div @click="getEntrust" class="s_btn">查询</div>
    </div>
    <div class="record_content">
      <el-row class="record_de_title">
        <el-col :span="3"><div class="item">时间</div></el-col>
        <el-col :span="1"><div class="item">类型</div></el-col>
        <el-col :span="2"><div class="item">交易对</div></el-col>
        <el-col :span="3"><div class="item">委托价格</div></el-col>
        <el-col :span="4"><div class="item">委托数量</div></el-col>
        <el-col :span="3"><div class="item">交易总额</div></el-col>
        <el-col :span="2"><div class="item">成交均价</div></el-col>
        <el-col :span="2"><div class="item">已成交</div></el-col>
        <el-col :span="2"><div class="item">未成交</div></el-col>
        <el-col :span="2"><div class="item">操作/状态</div></el-col>
      </el-row>
      <ul class="record_de_con">
        <li v-for="(item,index) in recordsPage" :class="['re_item',index%2==0?'bg1':'']">
          <el-row>
            <el-col :span="3"><div class="item">{{item.created_at_text}}</div></el-col>
            <el-col :span="1"><div :class="[item.type == 'buy'?'item_buy':'item_sell']">{{item.type_text}}</div></el-col>
            <el-col :span="2"><div class="item">{{item.name}}</div></el-col>
            <el-col :span="3"><div class="item">{{item.price}}</div></el-col>
            <el-col :span="4"><div class="item">{{item.volume}}</div></el-col>
            <el-col :span="3"><div class="item">{{item.amount}}</div></el-col>
            <el-col :span="2"><div class="item">{{item.avg_price}}</div></el-col>
            <el-col :span="2"><div class="item">{{item.deal_volume}}</div></el-col>
            <el-col :span="2"><div class="item">{{item.unfinish_volume}}</div></el-col>
            <el-col :span="2"><div class="item">{{item.status_text}}</div></el-col>
          </el-row>
        </li>
      </ul>
    </div>
    <!--分页-->
    <div style="margin-bottom: 10px" v-if="totalPage>20">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="20"
        layout="prev, pager, next, jumper"
        :total=totalPage>
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost, getCookie} from '../../../../utils'
  //import {mapState } from 'vuex'

  export default {
        data() {
            return {
              typeData: [],//类型
              type: '',
              coinData: [],//币种类
              coin: '',
              statusData: [],//状态
              status: '',
              //valueDate: '',//日期
              records: [],//委托记录
              recordsPage: [],//委托记录 分页

              totalPage: '',//总页
              currentPage: 1,//当前页

              userInfo: {}, //用户状态
              hasLogin: false, //登录状态

                pickerOptions0: {
                    disabledDate: (time) => {
                        if (this.endTime != "") {
                            //return time.getTime() > Date.now() || time.getTime() > this.endTime;
                            return time.getTime() > Date.now() ;
                        } else {
                            return time.getTime() > Date.now();
                        }

                    }
                },
                pickerOptions1: {
                    disabledDate: (time) => {
                        //return time.getTime() < this.startTime || time.getTime() > Date.now();
                        return time.getTime() < this.startTime;
                    }
                },
              startTime: new Date().setDate(new Date().getDate() -7),//开始时间
              endTime: new Date(),//结束时间
            }
        },
        computed: {
          //...mapState(["userInfo",'hasLogin'])
        },
        mounted() {
          this.getUesrInfo();

          this.getData();
          this.getEntrust();
        },
        methods: {
          getUesrInfo () {
              let initInfo = getCookie('userInfo');
              if (initInfo) {
                  this.userInfo = JSON.parse(initInfo)
                  this.hasLogin = true
              }
          },
          //先获取类型 币种 状态 订单搜索条件数据
          getData() {
            var that = this;
            httpGet('/api/orders/init_options',{},function (res) {
              if(res.data.error_code == 0) {
                var sData = res.data;
                var cData = res.data.coin_options;

                t(that.typeData,sData.type_options);
                t(that.statusData,sData.status_options);

                function t(newItem,item) {
                  for( var key in item) {
                    var obj ={};
                    obj.label = item[key];
                    obj.value = key;
                    newItem.push(obj);
                  }
                }

                for(var i=0,len = cData.length;i<len;i++) {
                  var obj = {};
                  obj.label = cData[i].code;
                  obj.value = cData[i].code;
                  that.coinData.push(obj);
                }
              }
            })
          },
          //委托记录
          getEntrust() {
            var gte;
            var ltq;
            if(!this.startTime){
                gte = '';
            }else {
                gte = parseInt(this.startTime/1000);
            }
            if(!this.endTime){
                ltq = '';
            }else {
                ltq = parseInt(this.endTime/1000);
            }
            var that = this;
            httpGet('/api/orders',{
              query_type: '2',
              page: '1',
              per_page: '20',
              created_at_gte: gte,
              created_at_ltq: ltq,
              type: that.type,
              currency: that.coin,
              status: that.status
          },function (res) {
              if(res.data.error_code == 0) {
                that.records = res.data.orders;
                that.totalPage = res.data.orders.length;
                that.recordsPage = res.data.orders;
              }
            })
          },
          //分页 cny
          handleCurrentChange(index) {
            var start = (index-1)*5;
            var end = index*5;
            this.recordsPage = this.records.slice(start,end);
          },
        }
    }
</script>

<style scoped>
  @import "../../../../common.css";
  .content{

  }
  .title{
    font-size: 20px;
    color: #000000;
    text-align: left;
    height: 60px;
    line-height: 60px;
    margin-left: 50px;
  }
  .select_wrap{
    padding: 0 50px;
    height: 100px;
    background: #F9F9F9;
    display: flex;
    align-items: center;
  }
  .select_wrap .s_item{
    display: flex;
    height: 40px;
    margin-right: 10px;
    align-items: center;
  }
  .select_wrap .s_item .s_txt{
    width: 50px;
    font-size: 16px;
    color: #000000;
  }
  .select_wrap .s_item .s_con{

  }
  .select_wrap .s_date .s_con{
     width: 300px;
    display: flex;
    align-items: center;
   }
  .select_wrap .s_date .s_con .s_picker{
    width: 135px;
    font-size: 12px;
  }
  .select_wrap .s_item .s_con .s_option{
    width: 100px;
    font-size: 12px;
  }
  .s_btn{
    width: 110px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background: #506BA6;
    border-radius: 2px;
    color: #ffffff;
    cursor: pointer;
  }

  .record_content{
    padding: 30px 0;
  }
  .record_content .record_de_title{
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #787878;
  }
  .record_content .record_de_con{
    max-height: 1200px;
    overflow-y: hidden;
  }
  .record_de_con .re_item{
    height: 60px;
    line-height: 60px;
    font-size: 12px;
    color: #000000;
  }
  .bg1{
    background: #FBFBFB;
  }
  .item_buy{
    color: #5AC47A;
  }
  .item_sell{
    color: #F05D5D;
  }
</style>
