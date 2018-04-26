<template>
  <div class="footer">
    <div class="container">
      <div class="hang1" style="margin-top: 54px">
        <p>服务与支持</p>
        <p>关于</p>
        <p>法律</p>
        <p>联系我们</p>
      </div>
      <div class="hang" style="margin-top: 16px;">
        <p>帮助中心</p>
        <p>公告</p>
        <p>用户协议</p>
        <p>helloearly@126.com</p>
      </div>
      <div class="hang">
        <p></p>
        <p>关于我们</p>
        <p>隐私条款</p>
        <p>QQ 群</p>
      </div>
      <div class="hang">
        <p></p>
        <p></p>
        <p>法律声明</p>
        <p>telegtam</p>
      </div>
      <p class="text">@2018 COPY RIGHTS</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      // isCollapse: state => state.isCollapse
    })
  },
  methods: {
  }
}
</script>

<style scoped>
  .footer{
    width: 100%;
    height:340px;
    background-image: linear-gradient(180deg, #1C1E59 -80%, #0C0D2D 100%);
    display: flex;
    justify-content: center;
    color: #fff;
  }
  .hang,.hang1{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin-top: 14px;
  }
  .hang p{
    width: 140px;
    text-align: left;
    font-size:16px;
    color: #fff;
    cursor: pointer;
    /*border: 1px solid #fff;*/
  }
  .text{
    font-size:12px;
    color: #6285C7;
    margin-top: 110px;
  }
  .hang1 p{
    width: 140px;
    text-align: left;
    font-size:16px;
    opacity: 0.6;
    font-size:14px;
  }
  .hang p:hover{
    color: #6285C7;
  }
</style>
