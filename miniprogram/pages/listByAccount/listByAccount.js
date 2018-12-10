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
    res:null //结果集
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          console.log(res.result.data[i].jine);
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
        console.log(resArr);
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

  contains:function(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] == obj) {
        return true;
      }
    }
    return false;
  }

})