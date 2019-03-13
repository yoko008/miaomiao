// miniprogram/pages/setTimeOut/add/add.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: "1",
    accountBookName: "",
    nickName: "",
  },
  //点击右上角关闭页面
  touchAdd: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //账本名称
  nameInput: function(e) {
    var name = e.detail.value; 
    if(name.length>10){
      wx.showToast({
        icon: "none",
        title: '(=^x^=)名字取太长不容易记住哦',
        duration: 2000
      })
    }
    this.setData({
      accountBookName: name.substring(0,10)
    })
  },
  //昵称输入框输入
  nickNameInput: function(e) {
    var name = e.detail.value;
    if (name.length > 10) {
      wx.showToast({
        icon: "none",
        title: '(=^x^=)昵称太长我存不下',
        duration: 2000
      })
    }
    this.setData({
      nickName: name.substring(0, 10)
    })
  },
  
  addOne: function(e) {
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    })

    const db = wx.cloud.database()
    var datas = {
      accountBookName: this.data.accountBookName,
      isBasic: false,
      users: [app.globalData.userInfo._openid],
      nickNames: [this.data.nickName],
      createTime: new Date().getTime(),
      updateTime: new Date().getTime()
    }
    console.log(datas);
    if (this.data.pageTitle == 1) {
      db.collection('account_book').add({
        data: datas,
        success: res => {
          wx.navigateBack({
            delta: 1,
          })
          console.log('新增账本成功，记录 _id: ', res._id);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增账本失败'
          })
          console.error('新增账本失败：', err)
        }
      })
    }
    // if (this.data.pageTitle == 2) {
    //   db.collection('budget').doc(this.data.id).set({
    //     data: datas,
    //     success: res => {
    //       wx.navigateBack({
    //         delta: 1,
    //       })
    //       console.log('更新成功，记录 _id: ', res._id);
    //     },
    //     fail: err => {
    //       wx.showToast({
    //         icon: 'none',
    //         title: '新增记录失败'
    //       })
    //       console.error('新增一条记账失败：', err)
    //     }
    //   })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.id != undefined) {
      var id = options.id;
      const this_ = this;
      const db = wx.cloud.database()
      this.setData({
        pageTitle: "2",
        id: id
      })
      db.collection('account_book').where({
        _id: id
      }).get({
        success: res => {
          var obj = res.data[0];
          this.setData({
            accountBookName: obj.accountBookName,
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
    }
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