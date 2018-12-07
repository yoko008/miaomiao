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
    openid: '' //用户id
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
        console.log(res.result) // 3
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

  }
})