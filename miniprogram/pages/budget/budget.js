
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    left: 0,
    queryResult: [],
    queryResultLength: -1
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
      queryResult: [],
      queryResultLength: -1
    })
    this.queryAccountRecord();
  },
  //点击问号显示帮助
  touchHelp: function(e) {
    wx.showToast({
      icon: "none",
      title: '最多可设置10条预算/目标。预算/目标只适用于基础个人账本。',
      duration: 3000
    })
  },
  //点击右上角开启新增页面
  touchAdd: function() {
    wx.navigateTo({
      url: './add/add',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //开启修改页面
  touchEdit: function(e) {
    var obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: './add/add?id=' + obj._id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  //查询记录
  queryAccountRecord: function() {
    wx.showToast({
      icon: 'loading',
      title: '加载中'
    })
    const this_ = this;
    const db = wx.cloud.database()
    db.collection('budget').where({
        _openid: this.data.openid
      })
      .orderBy('shouzhi', 'asc')
      .orderBy('creatTime', 'desc')
      .get({
        success: res => {
          //先处理一下数据，找到有没有年度预算
          var queryResult = this.data.queryResult;
          var dateSize = "月度";
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].jineStr == undefined) {
              res.data[i].jineStr = app.numberFormat(res.data[i].jine, 2, ".", ",");
            }
            if (res.data[i].zhouqi == "年度") {
              dateSize = "年度";
            }
            queryResult.push(res.data[i]);
          }
          //根据有没有年度预算来判断查询起止日期，减少数据量
          var date = new Date();
          var startDate;
          var endDate;
          switch (dateSize) {
            case "月度":
              date.setDate(1);
              startDate = app.getDateTimeMill(date, "00:00:00.0");
              var y = date.getFullYear(),
                m = date.getMonth();
              var lastDay = new Date(y, m + 1, 0);
              endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
              break;
            case "年度":
              date.setDate(1);
              date.setMonth(0);
              startDate = app.getDateTimeMill(date, "00:00:00.0");
              date.setDate(31);
              date.setMonth(11);
              endDate = app.getDateTimeMill(date, "23:59:59.9");
              break;
            default:
              break;
          }
          //开始查询需要的记账数据
          wx.cloud.callFunction({
            // 需调用的云函数名
            name: 'getListByAccounts',
            // 传给云函数的参数
            data: {
              startDate: startDate.toString(),
              endDate: endDate.toString()
            },
            // 成功回调
            success: function(res) {
              console.log("查询到的记账的数据", res.result)
              var accounts = res.result.data;
              for (var j = 0; j < queryResult.length; j++) {
                queryResult[j].currJine = 0;
                var startDate;
                var endDate;
                //判断需要累加的起止时间
                var date = new Date();
                switch (queryResult[j].zhouqi) {
                  case "月度":
                    date.setDate(1);
                    startDate = app.getDateTimeMill(date, "00:00:00.0");
                    var y = date.getFullYear(),
                      m = date.getMonth();
                    var lastDay = new Date(y, m + 1, 0);
                    endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
                    break;
                  case "年度":
                    date.setDate(1);
                    date.setMonth(0);
                    startDate = app.getDateTimeMill(date, "00:00:00.0");
                    date.setDate(31);
                    date.setMonth(11);
                    endDate = app.getDateTimeMill(date, "23:59:59.9");
                    break;
                  default:
                    break;
                }
                //开始累加金额
                for (var i = 0; i < accounts.length; i++) {
                  if (startDate > accounts[i].datetime || endDate < accounts[i].datetime) {
                    continue;
                  }
                  if (accounts[i].shouzhi == queryResult[j].shouzhi.slice(0, 2)) {
                    if (queryResult[j].accountType1 == "全部" || (accounts[i].accountType1 == queryResult[j].accountType1 && queryResult[j].accountType2 == "全部") || (accounts[i].accountType1 == queryResult[j].accountType1 && queryResult[j].accountType2 == accounts[i].accountType2)) {
                      queryResult[j].currJine += accounts[i].jine;
                    }
                  }
                }
                queryResult[j].currJineStr = app.numberFormat(queryResult[j].currJine, 2, ".", ",");
                queryResult[j].currPercent = Math.floor(queryResult[j].currJine / queryResult[j].jine * 100);
              }
              this_.setData({
                queryResult: queryResult,
                queryResultLength: queryResult.length
              })
              wx.hideToast();
              console.log('最后的数据: ', this_.data.queryResult);
            }
          })

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
    db.collection('budget').doc(id).remove({}).then(
      res => {
        var queryResult = this.data.queryResult;
        queryResult.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          queryResult: queryResult,
          queryResultLength: queryResult.length
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