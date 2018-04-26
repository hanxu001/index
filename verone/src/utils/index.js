import axios from 'axios'
import {baseUrl} from './base'
import {md5} from './md5'
import Vue from 'vue'

/**
 *url上加参数  支持中文
 * @param url
 * @param obj
 * @returns {string}
 */
function getUrlJoinParams(url, obj) {
  var result = url + '?';
  var userInfo;
  let initInfo = getCookie('userInfo');
  if (initInfo) {
    userInfo = JSON.parse(initInfo)
    obj.sid = userInfo.sid;
  }
  obj.code = 'test';
  obj.client = 'web';
  for (var p in obj) {
    if (typeof ( obj[p]) == 'function') {
      continue;
    } else {
      result += encodeURI(p) + '=' + encodeURI(obj[p]) + '&';
    }
  }
  //result = result.substring(0, result.length - 1);
  result += getUrlJoinParamsMD5(obj);

  return result;
};
function getUrlJoinParamsMD5(obj) {
  var result =  '';

  var arr = [];
  for(var key in obj) {
    arr.push(key);
  }
  var newArr = arr.sort();
  var objstr = '';
  for(var i =0,len =newArr.length;i<len;i++) {
    // if(obj[newArr[i]]) {
      objstr += newArr[i] + '=' + obj[newArr[i]] + '&';
    // }
  }
  objstr = objstr.substring(0,objstr.length-1);
  var md5str = md5(md5(objstr));
  result ='h=' + md5str;
  return result;
};

/**
 * {a:1,c:2,b:3} => a=1&c=2&b=3
 * 对象转string objectToString(obj,[separator]) ;//separator默认是& 分隔符
 * @param obj
 * @returns {string}
 */
function objectToString(obj) {
  var separator = arguments[1] || '&';
  var result = '';
  for (var p in obj) {
    if (typeof ( obj[p]) == 'function') {
      continue;
    } else {
      result += p + '=' + obj[p] + separator;
    }
  }
  result = result.substring(0, result.length - 1);
  return result;
};

/**
 *  a=1&c=2&b=3 =>{a:1,c:2,b:3}
 * @param str
 * @returns {{}}
 */
function stringToObject(str) {
  var paramters = {};
  var separator = arguments[1] || '&';
  var paramterStr = str.split(separator); //字符分割

  paramterStr.forEach(function (item, index) {
    var obj = item.split('=');
    if (obj.length == 2) {
      paramters[obj[0]] = obj[1];
    }
  });
  return paramters;
};

/**
 * httpGet
 */
function httpGet(url, parameters, callback) {
  url = getUrlJoinParams(url, parameters);
  axios.get(baseUrl + url).then(function (res) {
    callback(res)
    if(res.data.error_code === -1) {
      Vue.prototype.$message.error(res.data.error_reason);
    }else if(res.data.error_code === -100){
      delCookie("userInfo");
      Vue.prototype.$message.error(res.data.error_reason);
      window.location.reload();
      window.location.href = '/';
    }
      // Vue.prototype.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   this.$message({
      //     type: 'success',
      //     message: '删除成功!'
      //   });
      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消删除'
      //   });
      // });

  })
}
/**
 * httpPost
 */
function httpPost(url, parameters, callback) {
  url = getUrlJoinParams(url, parameters);
  axios.post(baseUrl + url).then(function (res) {
    callback(res)
    if(res.data.error_code === -1){
      Vue.prototype.$message.error(res.data.error_reason);
    }else if(res.data.error_code === -100){
      delCookie("userInfo");
      Vue.prototype.$message.error(res.data.error_reason);
      window.location.reload();
      window.location.href = '/';
    }
  })
}

/**
 * 存储localStorage
 */
function setStore(name, content) {
  if (!name) return;
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */
function getStore(name) {
  if (!name) return;
  return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */
function removeStore(name) {
  if (!name) return;
  window.localStorage.removeItem(name);
}
/**
 * 判断为空
 */
function isNull(p) {
  if (!p || p === undefined || p === '' || p === [] || p === {} || p === 0 || p === NaN) {
    return true;
  }
  return false;
};

//设置cookie
function setCookie(c_name, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}
//获取cookie
function getCookie(name) {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg))
    return (arr[2]);
  else
    return null;
}
//删除cookie
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
//时间戳转为时间格式
function getTimeStr(time) {
  var date = new Date(time * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y+M+D+h+m+s;
}
//手机号验证
function veriMobile(mobile) {
  var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
  if(!reg.test(mobile)) {
    return false;
  }else{
    return true;
  }
}
//获取本地状态
function getUesrInfo (u,h) {
  let initInfo = getCookie('userInfo');
  if (initInfo) {
    u = JSON.parse(initInfo)
    h = true
  }
}

export {
  getUrlJoinParams,
  objectToString,
  stringToObject,
  httpGet,
  httpPost,
  setStore,
  getStore,
  removeStore,
  isNull,
  getTimeStr,
  getCookie,
  setCookie,
  delCookie,
  veriMobile,
  getUesrInfo
}

