// miniprogram/pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult: [],
    pagenum: 1,
    bottomMessage: "",
    startDate: 0,
    endDate: 9999999999999
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

    this.queryAccountRecord();

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
    if (!this.data.noMore) {
      this.queryAccountRecord();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  clickDate: function(e) {
    this.setData({
      weekStyle: "",
      monthStyle: "",
      yearStyle: "",
      allStyle: ""
    })
    switch (e.target.dataset.hi) {
      case "本周":
        this.setData({
          weekStyle: "background: #ADD8E6;color:#ffffff;"
        })
        break;
      case "本月":
        this.setData({
          monthStyle: "background: #ADD8E6;color:#ffffff;"
        })
        break;
      case "本年":
        this.setData({
          yearStyle: "background: #ADD8E6;color:#ffffff;"
        })
        break;
      case "全部":
        this.setData({
          allStyle: "background: #ADD8E6;color:#ffffff;"
        })
        break;
      default:
        break;
    }
  },
  //查找最近记录
  queryAccountRecord: function(startDate, endDate) {
    this.setData({
      bottomMessage: "数据加载中..."
    })
    const db = wx.cloud.database()
    const _ = db.command;
    db.collection('accounts').where({
        _openid: this.data.openid,
        datetime: _.gte(this.data.startDate).and(_.lte(this.data.endDate))
      })
      .orderBy('datetime', 'desc')
      .skip((this.data.pagenum - 1) * 20)
      .get({
        success: res => {
          console.log("查到的条数:" + res.data.length);
          if (res.data.length < 20) {
            console.log('查找记账记录成功，页数：' + this.data.pagenum, res);
            this.setData({
              queryResult: this.data.queryResult.concat(res.data),
              bottomMessage: "没有更多了",
              noMore: true
            })
          }
          if (res.data.length == 20) {
            console.log('查找记账记录成功，页数：' + this.data.pagenum, res);
            this.setData({
              queryResult: this.data.queryResult.concat(res.data),
              pagenum: this.data.pagenum + 1,
              bottomMessage: "下拉加载更多"
            })
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找记账记录失败：', err)
        }
      })
  },
  //查找收支详情
  queryShouzhiDetail: function(pagenum) {
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