Page({
  data: {
    accountTypeArray: null,
    multiArray: null,
    multiIndex: [0, 0],
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: [],
    //需要发送的数据
    shouzhi: "支出",
    jine: null,
    beizhu: "",
    accountType1: "",
    accountType2: "",
    date: '',
    startDate: '',
    time: '12:01',
  },
  //加载页面时触发
  onLoad: function() {
    this.queryAccountType("支出");
  },
  onReady: function() {
    var datetime = new Date();
    var date = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    var time = datetime.getHours() + ":" + datetime.getMinutes();
    var startDate = (datetime.getFullYear() - 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    var endDate = (datetime.getFullYear() + 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    console.log("当前加载的日期：" + date);
    console.log("当前加载的时间：" + time);
    this.setData({
      date: date,
      startDate: startDate,
      endDate: endDate,
      time: time,
      shouzhi: "支出",
      zhichuStyle: "background: #ADD8E6;color:#ffffff;",
      shouruStyle: "background: #ffffff;color:#ADD8E6;"
    })
    //查找最近的记账记录
    this.queryAccountRecord();
  },
  //点击收入或支出时触发，改变按钮颜色和收支类型
  clickShouZhi: function(e) {
    this.setData({
      shouzhi: e.target.dataset.hi
    });
    console.log("收支数据已改变，当前值为:[" + this.data.shouzhi + "]");
    if (e.target.dataset.hi == "支出") {
      this.setData({
        zhichuStyle: "background: #ADD8E6;color:#ffffff;",
        shouruStyle: "background: #ffffff;color:#ADD8E6;"
      })
    }
    if (e.target.dataset.hi == "收入") {
      this.setData({
        shouruStyle: "background: #ADD8E6;color:#ffffff;",
        zhichuStyle: "background: #ffffff;color:#ADD8E6;"
      })
    }
    this.queryAccountType(e.target.dataset.hi);
  },
  //金额输入框四舍五入保留两位小数
  jineInput: function(e) {
    if (e.detail.value.toString().split(".").length == 2) {
      if (e.detail.value.toString().split(".")[1].length > 2) {
        this.setData({
          jine: Math.floor(e.detail.value * 100) / 100
        })
      }
    }
    if (e.detail.value.toString().split(".").length > 2) {
      this.setData({
        jine: parseFloat(e.detail.value.toString().split(".")[0] + "." + e.detail.value.toString().split(".")[1])
      })
    }
  },
  jineBlur: function(e) {
    this.setData({
      jine: e.detail.value * 1
    })
    if (e.detail.value.toString().split(".").length == 2) {
      if (e.detail.value.toString().split(".")[1].length == 0) {
        this.setData({
          jine: Math.floor(e.detail.value * 100) / 100
        })
      }
    }
  },
  //转动收支类型选择器的事件
  bindMultiPickerColumnChange: function(e) {
    console.log('现在选中的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0)
      data.multiArray[1] = this.data.accountTypeArray.level2[e.detail.value];
    this.setData(data);
  },
  //确认选择收支类型选择器的事件
  bindMultiPickerChange: function(e) {
    this.setData({
      accountType1: this.data.accountTypeArray.level1[this.data.multiIndex[0]],
      accountType2: this.data.accountTypeArray.level2[this.data.multiIndex[0]][this.data.multiIndex[1]],
    })
  },
  //确认选择日期
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //确认选择时间
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  //备注输入框输入
  beizhuInput: function(e) {
    if (e.detail.value.length > 100) {
      this.setData({
        beizhu: e.detail.value.substring(0, 100)
      })
    }
  },
  beizhuBlur: function(e) {
    this.setData({
      beizhu: e.detail.value
    })
  },
  //保存数据
  onAdd: function() {
    const db = wx.cloud.database()
    var datas = {
      shouzhi: this.data.shouzhi,
      jine: this.data.jine,
      beizhu: this.data.beizhu,
      accountType1: this.data.accountType1,
      accountType2: this.data.accountType2,
      date: this.data.date,
      time: this.data.time,
      creatTime: new Date(),
      updateTime: new Date()
    }
    db.collection('accounts').add({
      data: datas,
      success: res => {
        console.log(datas);
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '保存成功',
        })
        console.log('新增一条记账成功，记录 _id: ', res._id);
        this.queryAccountRecord();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('新增一条记账失败：', err)
      }
    })
  },
  queryAccountType: function(shouzhi) {
    const db = wx.cloud.database()
    // 加载当前用户的记账类型
    db.collection('account_type').where({
      _openid: this.data.openid,
      accountType: shouzhi
    }).get({
      success: res => {
        this.setData({
          accountTypeArray: res.data[0],
          multiArray: [res.data[0].level1, res.data[0].level2[0]],
          accountType1: res.data[0].level1[0],
          accountType2: res.data[0].level2[0][0],
        })
        console.log('查找当前记账类型成功: ', res)
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
  queryAccountRecord:function(){
    const db = wx.cloud.database()
    db.collection('accounts').where({
      _openid: this.data.openid
    })
      .orderBy('creatTime', 'desc')
      .limit(5)
      .get({
        success: res => {
          this.setData({
            queryResult: res.data
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