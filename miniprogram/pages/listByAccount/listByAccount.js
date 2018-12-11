// miniprogram/pages/listByAccount/listByAccount.js
const APP_ID = 'wx816c56c0993f9c2f';//输入小程序appid  
const APP_SECRET = 'b91adafeab42321890c347a9ecfae37c';//输入小程序app_secret  
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key  
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res:null ,//结果集
    zhichuTotal:0,
    shouruTotal:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const this_ = this;
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getListByAccounts',
      // 传给云函数的参数
      data: {
        
      },
      // 成功回调
      success: function (res) {
        console.log(res.result)
        var resArr = new Array();
        var arrLength = 0;
        for(var i=0;i<res.result.data.length;i++){
          var itHas = false;
          for(var j=0;j<resArr.length;j++){
            if (resArr[j].acc1 == res.result.data[i].accountType1 && resArr[j].shouzhi == res.result.data[i].shouzhi){
              itHas = true;
              resArr[j].jine += res.result.data[i].jine;
              break;
            }
          }
          if(!itHas){
            var obj ={};
            obj.acc1 = res.result.data[i].accountType1;
            obj.shouzhi = res.result.data[i].shouzhi;
            obj.jine = res.result.data[i].jine;
            resArr.push(obj);
          }
        }
        var zhichuTotal =0;
        var shouruTotal =0;
        for(var i=0;i<resArr.length;i++){
          resArr[i].jineStr = this_.numberFormat(resArr[i].jine,2,".",",");
          if (resArr[i].shouzhi=="支出"){
            zhichuTotal += resArr[i].jine;
          }
          if (resArr[i].shouzhi == "收入") {
            shouruTotal += resArr[i].jine;
          }
        }
        console.log("转换后的数组：");
        console.log(resArr);
        this_.setData({
          res: resArr,
          zhichuTotal:zhichuTotal,
          shouruTotal:shouruTotal
        })
      },
      complete: console.log
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  numberFormat: function (number, decimals, dec_point, thousands_sep) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec);
        return '' + Math.ceil(n * k) / k;
      };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, "$1" + sep + "$2");
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
  }

})