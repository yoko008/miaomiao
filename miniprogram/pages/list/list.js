// miniprogram/pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult:[],
    pagenum:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.queryAccountRecord("1900-01-01","3000-01-01");
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
    this.queryAccountRecord();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //查找最近记录
  queryAccountRecord: function (pagenum,startDate,endDate) {
    const db = wx.cloud.database()
    db.collection('accounts').where({
        _openid: this.data.openid
      })
      .orderBy('date', 'desc')
      .orderBy('time', 'desc')
      .skip((this.data.pagenum-1)*20)
      .get({
        success: res => {
          console.log('查找新进的记账记录成功，页数：' + this.data.pagenum, res);
          this.setData({
            queryResult: this.data.queryResult.push(res.data),
            pagenum:this.data.pagenum+1
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找新进的记账记录失败：', err)
        }
      })
  },
  //查找收支详情
  queryShouzhiDetail:function(pagenum){
    const db = wx.cloud.database()
    db.collection('accounts').where({
      _openid: this.data.openid
    })
      .get({
        success: res => {
          this.setData({
            queryResult: this.data.queryResult.push(res.data)
          })
          console.log('查找新进的记账记录成功: ', res);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找新进的记账记录失败：', err)
        }
      })
  }
})