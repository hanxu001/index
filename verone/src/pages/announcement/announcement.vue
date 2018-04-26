<template>
  <div class="main">
      <div class="container">
        <div class="announcement-content">
          <div class="head">
            <span class="title">公告中心</span>
          </div>
          <div class="content-list">
            <div class="announcement-list new-annoucement-list">
              <div class="sub-head">
                <span>最新公告</span>
              </div>
              <ul class="list">
                <li v-for="(item, index) in NewAnnouncements" :key="item.id">
                  <span class="tip">{{index + 1}}</span>
                  <router-link :to="{name: 'announcement_details', params: {type: 'news', id: item.id}}" class="list-title">{{item.title}}</router-link>
                </li>
              </ul>
              <div class="more" v-if="newArticleLength > showArticleLength">
                <router-link class="more-link" :to="{name: 'announcement_list', params: {type: 'news'}}">查看{{newArticleLength}}篇文章</router-link>
              </div>
            </div>
            <div class="announcement-list new-currency-list">
              <div class="sub-head">
                <span>新币上线</span>
              </div>
              <ul class="list">
                <li v-for="(item, index) in NewCurrency" :key="item.id">
                  <span class="tip">{{index+1}}</span>
                  <router-link :to="{name: 'announcement_details', params: {type: 'coin', id: item.id}}" class="list-title">{{item.title}}</router-link>
                </li>
              </ul>
              <div class="more" v-if="newCurrencyLength > showArticleLength">
                <router-link class="more-link" :to="{name: 'announcement_list', params: {type: 'coin'}}">查看{{newCurrencyLength}}篇文章</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {httpGet} from '../../utils'
  export default {
    data () {
      return {
        NewAnnouncements: null, //最新公告数据
        NewCurrency: null, // 新币数据
        showArticleLength: 7, // 显示文章数量
        newArticleLength: 20, // 最新公告文章数量
        newCurrencyLength: 0 // 新币文章数量
      }
    },
    created () {
      this.getNewAnnouncements();
      this.getNewCurrency();
    },
    methods: {
      getNewAnnouncements () {
        httpGet('/api/announcements', {
          per_page: this.showArticleLength
        }, (res) => {
          if (res.data.error_code === 0) {
            this.NewAnnouncements = res.data.data;
            this.newArticleLength = res.data.total_entries;
          }
        })
      },
      getNewCurrency () {
        httpGet('/api/announcements', {
          per_page: this.showArticleLength,
          type: 1
        }, (res) => {
          if (res.data.error_code === 0) {
            this.NewCurrency = res.data.data;
            this.newCurrencyLength = res.data.total_entries;
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
  background:#fff;
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
  font-weight:bold;
  color:#000;
}
.content-list{
  overflow:hidden;
  padding-bottom:50px;
}
.content-list .announcement-list{
  padding:0 47px;
  width:50%;
  float:left;
  box-sizing:border-box;
}
.content-list .new-annoucement-list{
  padding-right:71px;
}
.content-list .new-currency-list{
  padding-left:71px;
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
.announcement-list.new-annoucement-list .list li:nth-child(1) .tip,.announcement-list.new-annoucement-list .list li:nth-child(2) .tip,.announcement-list.new-annoucement-list .list li:nth-child(3) .tip{
  text-align:center;
  background: #F5A623;
  color:#fff;
  border-radius: 2px;
}
.announcement-list .list li .list-title{
  display:block;
  width:100%;
  padding-left:27px;
  line-height:16px;
  color:#000;
  text-decoration: none;
  font-size:16px;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
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
