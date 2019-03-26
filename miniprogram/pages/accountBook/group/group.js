// miniprogram/pages/accountBook/group/group.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    users: [],
    userFull: false,
    added: false,
    showEditNickName: false
  },
  touchEdit: function(e) {
    var obj = e.currentTarget.dataset.obj;
    var index = e.currentTarget.dataset.index;
    console.log(obj);
    if (obj.openid == this.data.openid) {
      this.setData({
        showEditNickName: !this.data.showEditNickName
      })
    }

  },
  touchSaveEdit: function(e) {
    for (var i = 0; i < this.data.users.length; i++) {
      if (this.data.users[i].openid == this.data.openid) {
        var users = this.data.users;
        users[i].nickName = this.data.nickName;
        this.setData({
          users: users
        })
        break;
      }
    }
    console.log(this.data.users);
    const db = wx.cloud.database();
    const this_ = this;
    var users = this_.data.users;
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updateAccountBookUser',
      // 传给云函数的参数
      data: {
        id: this_.data.id,
        users: users
      },
      // 成功回调
      success: function(resCloud) {
        console.log("云函数的返回:", resCloud.result);
        this_.setData({
          users: users,
          showEditNickName: false
        })
        wx.showToast({
          title: '修改昵称成功',
        })
      }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const this_ = this;
    var obj = JSON.parse(options.obj);
    this.setData({
      id: obj._id,
      accountBookName: obj.accountBookName
    });
    if (app.globalData.userInfo._openid == undefined || app.globalData.userInfo._openid == null) {
      wx.cloud.callFunction({
        // 需调用的云函数名
        name: 'getOpenid',
        // 传给云函数的参数
        data: {},
        // 成功回调
        success: function(resCloud) {
          console.log("云函数查找到的openId为：", resCloud.result.openid);
          this_.setData({
            openid: resCloud.result.openid
          })
          this_.addUser();
        }
      })
    } else {
      this.setData({
        openid: app.globalData.userInfo._openid
      })
      this_.addUser();
    }

  },
  addUser: function() {
    var needAdd = true;
    const db = wx.cloud.database();
    const this_ = this;
    db.collection('account_book').doc(this_.data.id).get().then(res => {
      console.log("当前账本信息：", res)
      this.setData({
        users: res.data.users
      });
      if (res.data.users.length < 5) {
        for (var i = 0; i < res.data.users.length; i++) {
          if (this_.data.openid == res.data.users[i].openid) {
            needAdd = false;
            this.setData({
              added: true
            })
          }
        }
      } else {
        needAdd = false;
        this.setData({
          userFull: true
        })
      }
      if (needAdd) {
        var users = this_.data.users;
        users.push({
          nickName: "萌新成员",
          openid: this_.data.openid
        })
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'updateAccountBookUser',
          // 传给云函数的参数
          data: {
            id: this_.data.id,
            users: users
          },
          // 成功回调
          success: function(resCloud) {
            console.log("云函数的返回:", resCloud.result);
            this_.setData({
              users: users
            })
            wx.showToast({
              title: '加入账本成功',
            })
          }
        })
      }
    })
  },
  quitAccountBook: function(e) {
    const this_ = this;
    var users = this.data.users;
    for (var i = 0; i < this.data.users.length; i++) {
      if (this.data.users[i].openid == this.data.openid) {
        users.splice(i, 1);
        break;
      }
    }
    console.log(users);
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'updateAccountBookUser',
      // 传给云函数的参数
      data: {
        id: this_.data.id,
        users: users
      },
      // 成功回调
      success: function(resCloud) {
        console.log("云函数的返回:", resCloud.result);
        this_.setData({
          users: users
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
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