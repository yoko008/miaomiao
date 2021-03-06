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
      queryResultLength: -1,
      activeAccountBook: app.globalData.userInfo.accountBookId
    })
    this.queryAccountRecord();
  },
  //点击问号显示帮助
  touchHelp: function(e) {
    wx.showToast({
      icon: "none",
      title: '最多可设置5个账本。',
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
  //成员编辑
  touchGroup: function(e) {
    var obj = e.currentTarget.dataset.obj;
    wx.navigateTo({
      url: './group/group?obj=' + JSON.stringify(obj),
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
    db.collection('account_book').where({
        'users.openid': app.globalData.userInfo._openid
      })
      .orderBy('creatTime', 'asc')
      .get({
        success: res => {
          console.log("查询到的账本：", res.data);
          if (app.globalData.userInfo.accountBookId=="0"){
            for (var i = 0; i < res.data.length;i++){
              if(res.data[i].isBasic){
                this_.setData({
                  activeAccountBook:res.data[i]._id
                })
                break;
              }
            }
          }
          this_.setData({
            queryResult: res.data
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
    db.collection('account_book').doc(id).remove({}).then(
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
  touchChangeUserAccountBook: function(e) {
    var obj = e.currentTarget.dataset.obj;
    console.log(obj);
    if (obj._id != app.globalData.userInfo.accountBookId) {
      const this_ = this;
      const db = wx.cloud.database();
      db.collection('user_info').doc({}).update({
        data: {
          accountBookId: obj._id,
          accountBookName: obj.accountBookName,
          isBasic: obj.isBasic,
          databaseName: obj.isBasic?"accounts":"accounts_love"
        }
      }).then(
        res => {
          app.globalData.userInfo.accountBookId = obj._id;
          app.globalData.userInfo.accountBookName = obj.accountBookName;
          app.globalData.userInfo.isBasic = obj.isBasic;
          app.globalData.userInfo.databaseName= obj.isBasic ? "accounts" : "accounts_love";
          this_.setData({
            activeAccountBook: obj._id
          })
          wx.showToast({
            icon: 'success',
            title: '切换成功'
          })
        }
      )
    }
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