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


})