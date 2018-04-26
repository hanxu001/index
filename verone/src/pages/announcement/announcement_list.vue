<template>
  <div class="main">
      <div class="container">
        <div class="announcement-content">
          <div class="head">
            <router-link to="/announcement" class="title title-link">公告中心 /</router-link>
            <span class="title"> {{pageClassName}}</span>
          </div>
          <div class="content-list">
            <div class="announcement-list" :class="{'new-annoucement-list': listType}">
              <ul class="list">
                <li v-for="(item, index) in announcementData" :key="item.id">
                  <span class="tip" :class="{'active': setListTipBg(index)}">{{(page - 1) * pageSize + index + 1}}</span>
                  <router-link :to="{name: 'announcement_details', params: {type: typeName, id: item.id}}" class="list-title">{{item.title}}</router-link>
                  <span class="time">{{item.updated_at | setTime}}</span>
                </li>
              </ul>
            </div>
            <div id="page" v-if="total_page > 1">
              <el-pagination
                small
                layout="prev, pager, next"
                :page-size="pageSize"
                :total="Number(total_entries)" @current-change="changePage">
              </el-pagination>

            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {httpGet, getTimeStr} from '../../utils'
  export default {
    data () {
      return {
        announcementData: null,
        pageClassName: '', // class类区分最新和新币
        pageTypeId: null, // 类别id
        listType: false,
        typeName: '', // 类别名称
        pageSize: 10, // 默认显示一页数量
        page: 1, // 当前也
        total_page: null, // 分页数量
        total_entries: null // 总数量
      }
    },
    created () {
      this.getData();
    },
    computed: {
    },
    watch: {
    },
    methods: {
      changePage (e){
        this.getData(e);
        this.page = e;
      },
      getData (page=1) {
        this.typeName = this.$route.params.type;
        if(this.typeName === 'news') {
          this.pageTypeId = 0;
        }
        if(this.typeName === 'coin') {
          this.pageTypeId = 1;
        }

        if(this.pageTypeId === 0) {
          this.pageClassName = "最新公告";
          this.listType = true;
        }
        if(this.pageTypeId === 1) {
          this.pageClassName = "新币上线"
        }
        httpGet('/api/announcements', {
          type: this.pageTypeId,
          page: page,
          per_page: this.pageSize

        }, (res) => {
          if (res.data.error_code === 0) {
            this.announcementData = res.data.data;
            this.total_entries = res.data.total_entries;
            this.total_page = res.data.total_page;
          }
        })
      },
      // 判断是否是前三个
      setListTipBg (index) {
        let tump = (this.page - 1) * this.pageSize + index + 1;
        if(tump < 4 && tump > 0) {
          return true;
        } else {
          return false;
        }
      }
    },
    filters: {
      setTime (val) {
        let time = getTimeStr(val);
        return time.split(' ')[0];
      }
    }
  }
</script>

<style scoped lang="scss">
  .main{
    min-height:500px;
    height:100%;
    padding:20px;
    background:#f9f9f9;
    .container{
      background:#fff;
    }
  }
  .main .announcement-content{
    width:820px;
    margin: 0 auto;
  }
  .main .announcement-content .head{
    padding:32px 0 28px;
    border-bottom:1px solid #EAEAEE;
    text-align:left;
  }
  .main .announcement-content .head  .title{
    display:inline-block;
    font-size:20px;
    line-height:20px;
    font-family:'ingFangSC-Medium';
    color:#000;
  }
  .title-link{
    color:#496CAB !important;
    text-decoration:none;
  }
  .content-list{
    overflow:hidden;
    padding-bottom:50px;
  }
  .content-list .announcement-list{
    padding:0 47px;
    width:100%;
    box-sizing:border-box;
  }
  .content-list .new-annoucement-list{
    padding-right:71px;
  }
  .content-list .new-currency-list{
    padding-left:71px;
  }
  .content-list .announcement-list .sub-head{
    padding:30px 0 27px;
    border-bottom:3px solid #EAEAEE;
    text-align:left;
  }
  .content-list .announcement-list .sub-head span{
    display:inline-block;
    position:relative;
    font-size:20px;
    line-height:20px;
  }
  .content-list .announcement-list .sub-head span:after{
    display:block;
    content:'';
    width:100%;
    height:3px;
    position:absolute;
    bottom:-32px;
    left:0;
    background:#506BA6;
  }
 .announcement-list .list{
    margin-bottom:24px;
    min-height:357px;
  }
 .announcement-list .list li{
    padding:17px 0;
    position:relative;
    text-align:left;
    border-bottom:1px solid #EAEAEE;
  }
 .announcement-list .list li .tip{
    display:inline-block;
    position:absolute;
    top:17px;
    left:5px;
    padding:0 4px;
    font-size:12px;
    line-height:16px;
    color:#000;
  }
 .announcement-list.new-annoucement-list .list li .tip.active{
    text-align:center;
    background: #F5A623;
    color:#fff;
    border-radius: 2px;
  }
 .announcement-list .list li .list-title{
    display:block;
    width:55%;
    padding-left:25px;
    line-height:16px;
    color:#000;
    text-decoration: none;
    font-size:16px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .announcement-list .list li .time{
    position:absolute;
    right:8px;
    top:17px;
    font-size: 14px;
    line-height:16px;
    display:inline-block;
    color: #999999;
  }
  .announcement-list .list li:hover .list-title{
    color: #4A90E2;
  }
  .more{
    text-align:left;
  }
  .more .more-link{
    font-family: PingFangSC-Regular;
    font-size: 18px;
    color: #4A90E2;
    line-height: 17px;
  }

</style>
