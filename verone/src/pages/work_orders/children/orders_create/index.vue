<template>
  <div v-loading="loading">
    <div class="title">
      <h2>提交请求</h2>
      <p></p>
    </div>
    <div class="list-option">
      <div class="search">
        <div class="imgbox" @click="goSearch()">
          <img src="../../../../assets/imgs/help_select.png" alt="">
        </div>
        <div style="height: 24px;border: 1px solid #D3D3D3"></div>
        <input type="text" placeholder="搜索" @keyup.enter="goSearch">
      </div>
      <div class="item">
        <h3>
          * 请选择您遇到的问题类型
        </h3>
        <div>
          <el-select
            @change="changeType()"
            v-model="type"
            style="width: 100%!important;">
            <el-option
              style="text-align: left!important;"
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="case1" v-if="this.type == 1">
        <div class="item">
          <h3>
            * 充值币种
          </h3>
          <div>
            <el-select v-model="coin_r"
                       @change="changeCoinR()"
                       placeholder="请选择"
                       style="width: 100%!important;">
              <el-option
                style="text-align: left!important;"
                v-for="item in coinListR"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item" v-if="this.coin_r == 10">
          <h3>
            * 银行订单流水号
          </h3>
          <div>
            <el-input v-model="bank_order_num" placeholder="请填写Txid这样可以快速帮您解决问题（如您没有Txid，请填“无”）"
                      style="width: 100%!important;"></el-input>
          </div>
        </div>
        <div class="item" v-if="this.coin_r != 10">
          <h3>
            * 充值Txid
          </h3>
          <div>
            <el-input v-model="tx_hash" placeholder="请填写Txid这样可以快速帮您解决问题（如您没有Txid，请填“无”）"
                      style="width: 100%!important;"></el-input>
          </div>
        </div>
      </div>

      <div class="case2" v-if="this.type == 2">
        <div class="item">
          <h3>
            * 提现币种
          </h3>
          <div>
            <el-select v-model="coin_w"
                       @change="changeCoinW()"
                       placeholder="请选择"
                       style="width: 100%!important;">
              <el-option
                style="text-align: left!important;"
                v-for="item in coinListW"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item" v-if="this.coin_w == 20">
          <h3>
            * 银行卡号
          </h3>
          <div>
            <el-input v-model="bank_card_num" placeholder="请填写银行卡号，这样可以帮你快速解决问题（如果没有请填写“无”）"
                      style="width: 100%!important;"></el-input>
          </div>
        </div>
        <div class="item" v-if="this.coin_w != 20">
          <h3>
            * 提现Txid
          </h3>
          <div>
            <el-input v-model="tx_hash" placeholder="请填写Txid这样可以快速帮您解决问题（如您没有Txid，请填“无”）"
                      style="width: 100%!important;"></el-input>
          </div>
        </div>
        <div class="item" v-if="this.coin_w != 20">
          <h3>
            * 提现地址
          </h3>
          <div>
            <el-input v-model="withdraw_addr" placeholder="请填写Txid这样可以快速帮您解决问题（如您没有Txid，请填“无”）"
                      style="width: 100%!important;"></el-input>
          </div>
        </div>
      </div>
      <div class="item" v-if="this.type == 5">
        <h3>
          * 谷歌验证（2FA) 问题类型
        </h3>
        <div>
          <el-select
            @change="changeType5()"
            v-model="sub_type5"
            style="width: 100%!important;">
            <el-option
              style="text-align: left!important;"
              v-for="item in sub_type_list5"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item" v-if="this.type == 6">
        <h3>
          * 账户问题类型
        </h3>
        <div>
          <el-select
            @change="changeType6()"
            v-model="sub_type6"
            style="width: 100%!important;">
            <el-option
              style="text-align: left!important;"
              v-for="item in sub_type_list6"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="item" v-if="this.type == 7">
        <h3>
          * 交易问题类型
        </h3>
        <div>
          <el-select
            @change="changeType7()"
            v-model="sub_type7"
            style="width: 100%!important;">
            <el-option
              style="text-align: left!important;"
              v-for="item in sub_type_list7"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <!--same-->
      <div class="item" v-if="this.toggleType">
        <h3 v-if="this.type != 4">
          <span v-if="this.type == 0 && this.toggleType">*</span> 您的BTC上海账号<span
          v-if="this.type == 0 && this.toggleType">（选填）</span>
        </h3>
        <h3 v-if="this.type == 4">
          * 手机号码
        </h3>
        <div>
          <el-input v-model="mobile"
                    @blur='formatMobile()'
                    :placeholder="type == 4?'':'填写账号后，此工单将会列入您的问题列表中，便于您下次查看或者继续回复。'"
                    style="width: 100%!important;"></el-input>
        </div>
      </div>
      <div class="item" v-if="this.toggleType">
        <h3>
          您接收回复的Email地址
        </h3>
        <div>
          <el-input v-model="email"
                    @blur='formatEmai()'
                    placeholder="" style="width: 100%!important;"></el-input>
        </div>
      </div>
      <div class="item" v-if="this.toggleType">
        <h3>
          * 标题
        </h3>
        <div>
          <el-input v-model="title" placeholder="" style="width: 100%!important;"></el-input>
        </div>
      </div>
      <div class="item" v-if="this.toggleType">
        <h3>
          * 问题描述
        </h3>
        <div>
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入您需要提交问题的描述信息，我们的支付人员将尽快回复。"
            v-model="description">
          </el-input>
        </div>
      </div>
      <div class="item" v-if="this.toggleType">
        <h3>
          附件
        </h3>
        <div style="background: #F9F9F9;">
          <el-upload
            class="avatar-uploader"
            ref="upload"
            name="image1"
            drag
            :action="baseUrl + '/upload_image/upload_image'"
            :limit="5"
            :auto-upload="true"
            :on-exceed="handleExceed"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <div style="display: flex;flex-direction: row;flex-wrap:wrap">
              <img v-if="imageList.length > 0" :src="item" class="avatar" v-for="item in imageList">
            </div>
            <div v-if="imageList.length === 0" class="upload-text">
              <p>添加附件 或把文件拖到这里（仅支持 jpg、png、pbm的文件 大小限制 4M)</p>
            </div>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="submit" v-if="this.toggleType">
      <el-button type="primary" style="width: 452px!important;" @click="ordersCreate">提交完成</el-button>
    </div>
  </div>
</template>

<script>
  import {httpGet, httpPost,getCookie} from '../../../../utils'
  import {baseUrl} from '../../../../utils/base'
  export default {
    data () {
      return {
        typeList: [
          {
            value: '0',
            label: '其他问题'
          },
          {
            value: '1',
            label: '充值问题'
          },
          {
            value: '2',
            label: '提现问题'
          },
          {
            value: '3',
            label: '安全问题'
          },
          {
            value: '4',
            label: '手机验证问题'
          },
          {
            value: '5',
            label: '谷歌二次验证问题'
          },
          {
            value: '6',
            label: '账户问题'
          },
          {
            value: '7',
            label: '交易问题'
          },
          {
            value: '8',
            label: '开发建议'
          }
        ],
        coinListR: [
          {
            value: '10',
            label: '人民币（CNY）'
          },
          {
            value: '11',
            label: '比特币（BTC）'
          },
          {
            value: '12',
            label: '以太坊（ETH）'
          },
          {
            value: '13',
            label: '莱特币（LTC）'
          },
          {
            value: '14',
            label: '比特现金（BCH）'
          },
          {
            value: '15',
            label: '以太经典（ETC）'
          }
        ],
        coinListW: [
          {
            value: '20',
            label: '人民币（CNY）'
          },
          {
            value: '21',
            label: '比特币（BTC）'
          },
          {
            value: '22',
            label: '以太坊（ETH）'
          },
          {
            value: '23',
            label: '莱特币（LTC）'
          },
          {
            value: '24',
            label: '比特现金（BCH）'
          },
          {
            value: '25',
            label: '以太经典（ETC）'
          }
        ],
        sub_type_list5: [
          {
            value: '50',
            label: '其他谷歌验证问题'
          },
          {
            value: '51',
            label: '谷歌验证绑定失败'
          },
          {
            value: '52',
            label: '谷歌验证绑定失败'
          },
          {
            value: '53',
            label: '重置谷歌二次验证'
          },
        ],
        sub_type_list6: [
          {
            value: '60',
            label: '其他问题'
          },
          {
            value: '61',
            label: '冻结账户'
          },
          {
            value: '62',
            label: '修改邮箱'
          },
          {
            value: '63',
            label: '实名认证'
          },
          {
            value: '64',
            label: '解锁账户'
          }
        ],
        sub_type_list7: [
          {
            value: '70',
            label: '其他问题'
          },
          {
            value: '71',
            label: '订单异常'
          },
          {
            value: '72',
            label: '如何交易'
          }
        ],
        coin_r: '',
        coin_w: '',
        sub_type5: '',
        sub_type6: '',
        sub_type7: '',
        mobile: '',
        email: '',
        title: '',
        type: '',
        sub_type: '',
        description: '',
        tx_hash: '',
        bank_order_num: '',
        bank_card_num: '',
        withdraw_addr: '',
        imageList: [],
        imageListUp: [],
        toggleType: false,
        coinType: false,
        loading: false,
        imageUrl: '',
        baseUrl: '',
        userInfo:{},
        hasLogin:false
      }
    },
    mounted() {
      this.baseUrl = baseUrl
      this.getUesrInfo()
    },
    methods: {
      getUesrInfo () {
        let initInfo = getCookie('userInfo');
        if (initInfo) {
          this.hasLogin = true
          httpGet('/api/users',{},res=>{
              if(res.data.error_code == 0){
                this.userInfo = res.data
                this.mobile = this.userInfo.mobile
                this.email = this.userInfo.email
              }
          })
        }
      },
      goSearch(){
        var that = this;
        httpGet('/api/faq', {
          keyword: that.input,
        }, function (res) {
          if (res.data.error_code == 0) {
            console.log('搜索')
          }
        })
      },
      changeType(e){
        this.toggleType = true;
        this.sub_type = ''
      },
      changeCoinR(){
        this.sub_type = this.coin_r
      },
      changeCoinW(){
        this.sub_type = this.coin_w
      },
      changeType5(){
        this.sub_type = this.sub_type5
      },
      changeType6(){
        this.sub_type = this.sub_type6
      },
      changeType7(){
        this.sub_type = this.sub_type7
      },
      ordersCreate(){
        var that = this;
        if (!this.type) {
          this.$message.error('请选择工单类型');
          return
        }
        if (!this.title) {
          this.$message.error('请输入工单标题');
          return
        }
        if (!this.description) {
          this.$message.error('请输入工单描述');
          return
        }
        if (!this.mobile && !this.email) {
          this.$message.error('请输入手机号或邮箱');
          return
        }
        if (that.type == 4) {
          if (!this.mobile) {
            this.$message.error('请输入手机号');
            return
          }
          if (!this.email) {
            this.$message.error('请输入邮箱');
            return
          }
          if(!this.formatMobile()){
            this.$message.error('请输入正确的手机号码');
            return
          }
          if(!this.formatEmai()){
            this.$message.error('请输入正确的邮箱地址');
            return
          }
        }
        if (that.type == 1 || that.type == 2) {
          if (!this.sub_type) {
            this.$message.error('请选择币种');
            return
          }
        }
        if (that.type == 5) {
          if (!this.sub_type) {
            this.$message.error('请选择谷歌验证问题类型');
            return
          }
        }
        if (that.type == 6) {
          if (!this.sub_type) {
            this.$message.error('请选择账户问题类型');
            return
          }
        }
        if (that.type == 7) {
          if (!this.sub_type) {
            this.$message.error('请选择交易问题类型');
            return
          }
        }
        httpPost('/api/work_orders/create', {
          mobile: that.mobile,
          email: that.email,
          title: that.title,
          type: that.type,
          sub_type: that.sub_type,
          description: that.description,
          image1: that.imageListUp[0],
          image2: that.imageListUp[1],
          image3: that.imageListUp[2],
          image4: that.imageListUp[3],
          image5: that.imageListUp[4],
          bank_card_num: that.bank_card_num,
          tx_hash: that.tx_hash,
          withdraw_addr: that.withdraw_addr,
          bank_order_num: that.bank_order_num
        }, res => {
          if (res.data.error_code == 0) {
            that.mobile = ''
            that.email = ''
            that.title = ''
            that.type = ''
            that.description = ''
            that.imageList = []
          }
        })
      },
      handleAvatarSuccess (res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.imageList.push(this.imageUrl);
        console.log(file.response)
        this.imageListUp.push(file.response.image1);
      },
      beforeAvatarUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isLt2M;
      },
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件`);
      },
      handleRemove(file, fileList){
        Array.prototype.remove = function(val) {
          var index = this.indexOf(val);
          if (index > -1) {
            this.splice(index, 1);
          }
        };
      },
      formatMobile(){
        var regMobile = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (!regMobile.test(this.mobile)) {
          this.$message.error('请输入正确的手机号码');
          return false;
        }
      },
      formatEmai(){
        var regEmai = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (!regEmai.test(this.email)) {
          this.$message.error('请输入正确的邮箱地址');
          return false;
        }
      },
    }
  }
</script>

<style scoped>
  .title {

  }

  .title h2 {
    font-size: 20px;
    color: #000000;
    font-weight: 100;
    width: 92%;
    margin: 0 auto;
    padding-left: 20px;
    height: 78px;
    line-height: 78px;
    text-align: left;
  }

  .title p {
    background: #EAEAEE;
    height: 1px;
    width: 92%;
    margin: 0 auto;
  }

  .list-option {
    width: 78%;
    margin: 0 auto;
  }

  .search {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 44px;
    background: #F9F9F9;
    border: 1px solid #F9F9F9;
    border-radius: 100px;
    margin-top: 60px;
    margin-bottom: 90px;
  }

  .search .imgbox {
    width: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    /*border: 1px solid red;*/
  }

  .search .imgbox img {
    width: 24px;
    height: 24px;
  }

  .search input {
    width: 100%;
    height: 24px;
    outline: none;
    border: none;
    background: #F9F9F9;
    padding-left: 10px;
    font-size: 18px;
    color: #8D8D8D;
  }

  .item {
    margin-top: 64px;
  }

  .item > h3 {
    text-align: left;
    font-size: 16px;
    color: #000000;
  }

  .item > div {
    border-radius: 2px;
    margin-top: 20px;
  }

  .submit {
    margin-top: 58px;
    margin-bottom: 52px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 210px;
    height: 210px;
    display: block;
  }
  .upload-text{
    height: 40px;
    line-height:40px;
  }
</style>
