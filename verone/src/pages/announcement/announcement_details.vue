<template>
  <div class="main">
    <div class="container">
      <div class="article-content" v-if="articleInfo">
        <div class="article-title">{{articleInfo.title}}</div>
        <div class="content" v-html="articleInfo.content"></div>
      </div>
      <div class="sidebar">
        <div class="announcement-list" :class="{'new-annoucement-list': listType}">
          <div class="sub-head">
            <span>{{pageClassName}}</span>
          </div>
          <ul class="list">
            <li v-for="(item,index) in announcementData" :key="item.id">
              <span class="tip">{{index + 1}}</span>
              <router-link :to="{name: 'announcement_details', params: {type: typeName, id: item.id}}" class="list-title">{{item.title}}</router-link>
            </li>
          </ul>
          <div class="more" v-if="ArticleLength > showArticleLength">
            <router-link class="more-link" :to="{name: 'announcement_list', params: {type: typeName}}">查看{{ArticleLength}}篇文章</router-link>
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
        pageType: 0, // 类别id
        typeName: '', // 类别名称
        id: null, // 文章id
        pageClassName: '', // 区分两种类别的类名
        articleInfo: null, // 文章信息
        announcementData: null, // 右侧栏数据信息
        showArticleLength: 7, // 右侧栏显示数量
        listType: false, // 判断显示各自类别的类名
        ArticleLength: 0 // 右侧栏数据总数
      }
    },
    created () {
      this.getData();
    },
    watch: {
      $route(){
        this.getData();
      }
    },
    methods: {
      getData () {
        this.typeName = this.$route.params.type;
        if(this.typeName === 'news') {
          this.pageType = 0;
        }
        if(this.typeName === 'coin') {
          this.pageType = 1;
        }
        this.id = this.$route.params.id;
        if(this.pageType === 0) {
          this.pageClassName = "最新公告";
          this.listType = true;
        }
        if(this.pageType === 1) {
          this.pageClassName = "新币上线";
          this.listType = false;
        }
        httpGet('/api/announcements/detailed', {
          announcement_id: this.id
        }, (res) => {
          if (res.data.error_code === 0) {
            this.articleInfo = res.data;
          }
        })
        httpGet('/api/announcements', {
          type: this.pageType,
          per_page: this.showArticleLength,
        }, (res) => {
          if (res.data.error_code === 0) {
            this.announcementData = res.data.data;
            this.ArticleLength = res.data.total_entries;
          }
        })
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
  }
  .main .container{
    display:flex;
  }
  .article-content{
    flex:1;
    padding:0 50px;
    text-align:left;
    background:#fff;
  }
  .article-title{
    padding:30px 0 28px;
    font-size: 20px;
    color: #000000;
    line-height: 20px;
    border-bottom:1px solid #EAEAEE;
  }
  .article-content .content{
    padding: 50px 0;
  }
  .announcement-list .sub-head{
    padding:30px 0 27px;
    border-bottom:3px solid #EAEAEE;
    text-align:left;
  }
  .announcement-list .sub-head span{
    display:inline-block;
    position:relative;
    font-size:20px;
    line-height:20px;
  }
  .announcement-list .sub-head span:after{
    display:block;
    content:'';
    width:100%;
    height:3px;
    position:absolute;
    bottom:-32px;
    left:0;
    background:#506BA6;
  }
  .main .container .sidebar{
    width: 380px;
    margin-left:10px;
    padding:0 48px 120px 50px;
    box-sizing:content-box;
    background:#fff;
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
    font-size:12px;
    line-height:16px;
    color:#000;
  }
  .announcement-list.new-annoucement-list .list li:nth-child(1) .tip,.announcement-list.new-annoucement-list .list li:nth-child(2) .tip, .announcement-list.new-annoucement-list .list li:nth-child(3) .tip{
    width:16px;
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
