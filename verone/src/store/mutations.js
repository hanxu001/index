import {getCookie, delCookie} from "../utils/index";
const CHANGE_LOGIN = 'CHANGE_LOGIN'
const INIT_USER = 'INIT_USER'
const EMPTY_USER = 'EMPTY_USER'

export default {
  //  改变登录状态
  [CHANGE_LOGIN] (state, Boolean) {
    state.hasLogin = Boolean
  },
  //  网页初始化时从本地缓存获取用户登录信息
  [INIT_USER] (state) {
    let initInfo = getCookie('userInfo');
    if (initInfo) {
      state.userInfo = JSON.parse(initInfo)
    }
  },
  //  清空登录信息
  [EMPTY_USER] (state) {
    state.userInfo = ''
    delCookie('userInfo')
  }
}
