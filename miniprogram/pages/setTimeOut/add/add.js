// miniprogram/pages/setTimeOut/add/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['每天', '每周', '每月', '每年'],
    index: 0,
    arrayWeek: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一至周五', '周末'],
    indexWeek: 0,
    arrayMonth: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号', '最后一天'],
    indexMonth: 0,
    arrayYear: [
      ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号']
    ],
    indexYear: [0, 0],
    month: "1月",
    day: "1号",
    arrayShouzhi: ['支出', '收入'],
    indexShouzhi: 0,
    title:"",
    beizhu:"",
    jine:""
  },
  //点击右上角关闭页面
  touchAdd: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerWeekChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexWeek: e.detail.value
    })
  },
  bindPickerMonthChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexMonth: e.detail.value
    })
  },
  
//转动类型选择器的事件
  bindPickerYearColumnChange: function(e) {
    console.log('现在选中的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      arrayYear: this.data.arrayYear,
      indexYear: this.data.indexYear
    };
    //设置选择的下标
    data.indexYear[e.detail.column] = e.detail.value;
    //如果转动的是第一列
    if (e.detail.column == 0) {
      if (e.detail.value == 0 || e.detail.value == 2 || e.detail.value == 4 || e.detail.value == 6 || e.detail.value == 7 || e.detail.value == 9 || e.detail.value == 11 ){
        data.arrayYear[1] = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号'];
      }
      if (e.detail.value == 2 || e.detail.value == 5 || e.detail.value == 8 || e.detail.value == 10) {
        data.arrayYear[1] = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号'];
      }
      if (e.detail.value == 1) {
        data.arrayYear[1] = ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号'];
      }
      data.indexYear[1] = 0;
    }
    this.setData(data);
  },
  //确认每年日期的事件
  bindPickerYearChange: function (e) {
    this.setData({
      month: this.data.arrayYear[0][this.data.indexYear[0]],
      day: this.data.arrayYear[1][this.data.indexYear[1]],
    })
  },
  bindPickerShouzhiChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexShouzhi: e.detail.value
    })
    this.queryAccountType();
  },
  //转动收支类型选择器的事件
  bindMultiPickerColumnChange: function (e) {
    console.log('现在选中的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    //设置选择的下标
    data.multiIndex[e.detail.column] = e.detail.value;
    //如果转动的是第一列
    if (e.detail.column == 0) {
      data.multiArray[1] = this.data.accountTypeArray.level2[e.detail.value];
      data.multiIndex[1] = 0;
    }
    this.setData(data);
  },
  //确认选择收支类型选择器的事件
  bindMultiPickerChange: function (e) {
    this.setData({
      accountType1: this.data.accountTypeArray.level1[this.data.multiIndex[0]],
      accountType2: this.data.accountTypeArray.level2[this.data.multiIndex[0]][this.data.multiIndex[1]],
    })
  },
  //金额输入框四舍五入保留两位小数
  jineInput: function (e) {
    var jine = e.detail.value; //金额
    console.log(jine)
    var pointNum = jine.toString().split(".").length - 1; //小数点个数
    //没有小数点的情况下
    if (pointNum == 0) {
      this.setData({
        jine: parseInt(jine)
      })
    }
    //有一个小数点的情况下，删除超过小数点后2位的数字
    else if (pointNum == 1) {
      if (jine.toString().split(".")[1].length > 2) {
        this.setData({
          jine: jine.substring(0, jine.length - (jine.toString().split(".")[1].length - 2))
        })
      } else {
        this.setData({
          jine: jine
        })
      }
    }
    //有多个小数点的情况下，删除多的小数点
    else if (pointNum >= 2) {
      this.setData({
        jine: jine.toString().split(".")[0] + "." + jine.toString().split(".")[1]
      })
    }
    //空的情况下
    if (jine == null || jine == "" || jine == NaN) {
      this.setData({
        jine: "",
      })
    }
    console.log("当前金额数值：" + this.data.jine);
    console.log("当前金额字符串：" + this.data.jineStr);
  },
  //备注输入框输入
  beizhuInput: function (e) {
    var str = e.detail.value.substring(0, 100);
    this.setData({
      beizhu: str
    })
  },
  //标题输入框输入
  titleInput: function (e) {
    var str = e.detail.value.substring(0, 10);
    this.setData({
      title: str
    })
  },
  // 查找当前用户的记账分类
  queryAccountType: function () {
    var shouzhi = this.data.arrayShouzhi[this.data.indexShouzhi];
    const db = wx.cloud.database()
    db.collection('account_type').where({
      _openid: this.data.openid,
      accountType: shouzhi
    }).get({
      success: res => {
        //如果有数据，那么设置数据
        if (res.data.length > 0) {
          this.setData({
            accountTypeArray: res.data[0],
            multiArray: [res.data[0].level1, res.data[0].level2[0]],
            multiIndex: [0, 0],
            accountType1: res.data[0].level1[0],
            accountType2: res.data[0].level2[0][0],
          })
          console.log('查找当前记账类型成功: ', res)
        }
        //如果没有查出数据，则将初始数据保存进数据库
        if (res.data.length == 0) {
          wx.showToast({
            icon: 'loading',
            title: '初始化记账类型'
          })
          var level1;
          var level2;
          if (shouzhi == "支出") {
            level1 = app.globalData.zhichuLevel1;
            level2 = app.globalData.zhichuLevel2;
          }
          if (shouzhi == "收入") {
            level1 = app.globalData.shouruLevel1;
            level2 = app.globalData.shouruLevel2;
          }
          db.collection('account_type').add({
            data: {
              accountType: shouzhi,
              level1: level1,
              level2: level2
            },
            success: res => {
              wx.showToast({
                title: '初始化成功',
              })
              console.log('初始化记账类型成功，记录 _id: ', res._id);
              this.queryAccountType(shouzhi);
              return;
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '初始化失败'
              })
              console.error('初始化记账类型失败：', err);
              return;
            }
          })
        }
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('查找当前记账类型失败：', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.queryAccountType();
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