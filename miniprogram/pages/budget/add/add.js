// miniprogram/pages/setTimeOut/add/add.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageTitle: "1",
    array: ['月度', '年度'],
    arrayPoint: ['月度目标', '年度目标'],
    index: 0,
    arrayShouzhi: ['支出预算', '收入目标'],
    indexShouzhi: 0,
    arrayWarn: ['始终提醒', '每个周期只提醒一次'],
    indexWarn: 0,
    title: "",
    yujing: 80,
    jine: "",
    warned: 0
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
  //改变收支
  bindPickerShouzhiChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexShouzhi: e.detail.value
    })
    this.queryAccountType(true);
  },
  //改变提醒设置
  bindPickerWarnChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      indexWarn: e.detail.value
    })
    if (e.detail.value==0){
      this.setData({
        warned: 0
      })
    }
  },
  //转动收支类型选择器的事件
  bindMultiPickerColumnChange: function(e) {
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
  bindMultiPickerChange: function(e) {
    this.setData({
      accountType1: this.data.accountTypeArray.level1[this.data.multiIndex[0]],
      accountType2: this.data.accountTypeArray.level2[this.data.multiIndex[0]][this.data.multiIndex[1]],
    })
  },
  //金额输入框四舍五入保留两位小数
  jineInput: function(e) {
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
  },
  //预警输入框输入
  yujingInput: function(e) {
    var str = e.detail.value * 1;
    if (str.toString() != e.detail.value.toString()) {
      wx.showToast({
        icon: "none",
        title: '(=^x^=)要输入整数哦',
        duration: 2000
      })
    }
    if (str > 100) {
      str = 100;
      wx.showToast({
        icon: "none",
        title: 'o( =•ω•= )m预警提醒值不能大于100%哦',
        duration: 2000
      })
    }
    this.setData({
      yujing: str
    })
  },
  // 查找当前用户的记账分类
  queryAccountType: function(setAccountType) {
    var shouzhi = this.data.arrayShouzhi[this.data.indexShouzhi] == "支出预算" ? "支出" : "收入";
    const db = wx.cloud.database()
    db.collection('account_type').where({
      _openid: this.data.openid,
      accountType: shouzhi
    }).get({
      success: res => {
        //如果有数据，那么设置数据
        if (res.data.length > 0) {
          //添加全部数据
          res.data[0].level1.unshift("全部");
          res.data[0].level2.unshift([]);
          for (var i = 0; i < res.data[0].level2.length; i++) {
            res.data[0].level2[i].unshift("全部");
          }
          this.setData({
            accountTypeArray: res.data[0],
            multiArray: [res.data[0].level1, res.data[0].level2[0]],
            multiIndex: [0, 0]
          })
          if (setAccountType) {
            this.setData({
              accountType1: res.data[0].level1[0],
              accountType2: res.data[0].level2[0][0],
            })
          }
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
              this.queryAccountType(true);
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
  addOne: function(e) {
    this.setData({
      jine: this.data.jine * 1
    })
    //获取时间戳
    var date = this.data.date + " " + this.data.time + ":00";
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    })

    const db = wx.cloud.database()
    var datas = {
      jine: this.data.jine,
      zhouqi: this.data.array[this.data.index],
      index: this.data.index,
      shouzhi: this.data.arrayShouzhi[this.data.indexShouzhi],
      indexShouzhi: this.data.indexShouzhi,
      warn: this.data.arrayWarn[this.data.indexWarn],
      warned: this.data.warned,
      indexWarn: this.data.indexWarn,
      jineStr: app.numberFormat(this.data.jine, 2, ".", ","),
      yujing: this.data.yujing,
      accountType1: this.data.accountType1,
      accountType2: this.data.accountType2,
      creatTime: this.data.createTime,
      updateTime: new Date().getTime()
    }
    if (this.data.pageTitle == 1) {
      datas.creatTime = new Date().getTime();
      db.collection('budget').add({
        data: datas,
        success: res => {
          wx.navigateBack({
            delta: 1,
          })
          console.log('新增成功，记录 _id: ', res._id);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('新增一条记账失败：', err)
        }
      })
    }
    if (this.data.pageTitle == 2) {
      db.collection('budget').doc(this.data.id).set({
        data: datas,
        success: res => {
          wx.navigateBack({
            delta: 1,
          })
          console.log('更新成功，记录 _id: ', res._id);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
          console.error('新增一条记账失败：', err)
        }
      })
    }
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
      db.collection('budget').where({
        _id: id
      }).get({
        success: res => {
          var obj = res.data[0];
          this.setData({
            jine: obj.jine,
            zhouqi: obj.zhouqi,
            shouzhi: obj.shouzhi,
            index: obj.index,
            indexShouzhi: obj.indexShouzhi,
            indexWarn: obj.indexWarn,
            warned: obj.warned,
            accountType1: obj.accountType1,
            accountType2: obj.accountType2,
            yujing: obj.yujing,
            createTime: obj.creatTime,
          })
          this.queryAccountType(false);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找记录失败：', err)
        }
      })
    } else {
      this.queryAccountType(true);
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