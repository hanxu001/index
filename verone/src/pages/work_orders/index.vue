<template>
  <div>
    <header-Top :outIndex="5" :bgTrue="true"
                ></header-Top>
    <div class="main">
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
  export default {
    data () {
      return {
        navlist: ['工单请求','问题列表'],
        navIndex: '0',
      }
    },
    methods: {
      navSelect(index) {
        this.navIndex = index;
        switch (index) {
          case 0:
            this.$router.push('/work_orders/orders_create');
            break;
          case 1:
            this.$router.push('/work_orders/orders_list');
            break;
          default:
            this.$router.push('/work_orders/orders_create');
        }
      },
    }
  }
</script>

<style scoped>
.main{
  width: 100%;
  min-height: 500px;
  background: #F9F9F9;
  height: 100%;
  padding: 20px 0
}
.content_wrap{
  display: flex;
}
.nav{
  width: 129px;
  height: 600px;
  padding: 0 15px;
  margin-right: 20px;
  background: #FFFFFF;
  border: 1px solid #EAEAEE;
  border-radius: 2px;
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
  background: #F9F9F9;
  position: relative;
  left: -15px;
}
.content{
  flex: 1;
  background-color: #ffffff;
  height: auto;
  min-height: 600px;
  border: 1px solid #EEEEEE;
  border-radius: 2px;
}
</style>
