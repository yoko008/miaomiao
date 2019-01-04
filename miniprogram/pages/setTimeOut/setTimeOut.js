// miniprogram/pages/setTimeOut/setTimeOut.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: 0,
    queryResult: [],
    array: ['每天', '每周', '每月', '每年'],
    arrayWeek: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一至周五', '周末'],
    arrayMonth: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号', '最后一天'],
    arrayYear: [
      ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号']
    ],
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
    this.setData({
      queryResult: []
    })
    this.queryAccountRecord();
  },
  //点击右上角开启修改新增页面
  touchAdd: function() {
    wx.navigateTo({
      url: './add/add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //查询记录
  queryAccountRecord: function() {
    const this_ = this;
    const db = wx.cloud.database()
    db.collection('set_time_out').where({
        _openid: this.data.openid
      })
      .orderBy('creatTime', 'desc')
      .get({
        success: res => {
          var queryResult = this.data.queryResult;
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].jineStr == undefined) {
              res.data[i].jineStr = app.numberFormat(res.data[i].jine, 2, ".", ",");
            }
            queryResult.push(res.data[i]);
          }


          this.setData({
            queryResult: queryResult
          })
          console.log('查找记录成功: ', this.data.queryResult);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找记录失败：', err)
        }
      })
  },
  touchClose(e) {
    var id = e.currentTarget.dataset.id;
    wx.showToast({
      icon: 'loading',
      title: '删除中'
    })
    const db = wx.cloud.database();
    db.collection('set_time_out').doc(id).remove({}).then(
      res => {
        var queryResult = this.data.queryResult;
        queryResult.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          queryResult: queryResult
        });


        wx.showToast({
          icon: 'success',
          title: '删除成功'
        })
      }
    )
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