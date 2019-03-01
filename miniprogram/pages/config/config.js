//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    hello: ""
  },

  onLoad: function() {
    var date = new Date();
    var hour = date.getHours();
    var hello = "";
    if ((hour >= 0 && hour < 6) || hour >= 18) {
      hello = "晚上好。"
    }
    if (hour >= 6 && hour < 8) {
      hello = "早上好。"
    }
    if (hour >= 8 && hour < 12) {
      hello = "上午好。"
    }
    if (hour >= 12 && hour < 14) {
      hello = "中午好。"
    }
    if (hour >= 14 && hour < 18) {
      hello = "下午好。"
    }
    this.setData({
      hello: hello
    })
  },
  //点击设置账本
  tapAccBook: function() {
    if (app.globalData.userInfo == undefined) {
      wx.login({
        success(res) {
          if (res.code) {
            console.log("登陆成功:", res.code);
            // 发起网络请求
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx816c56c0993f9c2f&secret=366e2fc6f39b20d7637d4cfaf7172616&js_code=' + res.code + '&grant_type=authorization_code',
              success(res) {
                console.log(res);
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  }

})