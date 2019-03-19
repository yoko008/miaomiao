// miniprogram/pages/accountBook/group/group.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    users: []
  },

  addUser: function() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var obj = JSON.parse(options.obj);
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updateAccountBookUser',
      // 传给云函数的参数
      data: {
        id: obj._id,
        users: obj.users,
        nickName: "萌新成员"
      },
      // 成功回调
      success: function(resCloud) {
        console.log(resCloud.result);
      }
    })
    this.setData({
      id: obj._id,
      users: obj.users,
      accountBookName: obj.accountBookName,
      openid: app.globalData.userInfo._openid
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})