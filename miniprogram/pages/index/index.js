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
    time: '',
    zhichuLevel1: ["吃喝", "娱乐", "购物", "交通", "居家", "运动", "通信", "医药", "其他"],
    zhichuLevel2: [
      ["早餐", "中餐", "晚餐", "充饭卡", "买水果", "零食", "买菜", "其他"],
      ["电影", "唱歌", "门票", "其他"],
      ["衣物", "工具", "电子数码", "生活用品", "礼物", "其他"],
      ["地铁", "公交", "打车", "火车票", "机票", "共享单车", "其他"],
      ["房租", "电费", "水费", "燃气费", "其他"],
      ["健身", "打球", "跑步", "其他"],
      ["话费", "网费", "其他"],
      ["看病", "买药", "其他"],
      ["其他"]
    ],
    shouruLevel1: ["工作", "人情", "其他"],
    shouruLevel2: [
      ["工资", "奖金", "利润", "兼职", "其他"],
      ["红包", "中奖", "捡的", "其他"],
      ["其他"]
    ]
  },
  //加载页面时触发
  onLoad: function(options) {
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
      zhichuStyle: "info",
      shouruStyle: "ghost"
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
        zhichuStyle: "info",
        shouruStyle: "ghost"
      })
    }
    if (e.target.dataset.hi == "收入") {
      this.setData({
        shouruStyle: "info",
        zhichuStyle: "ghost"
      })
    }
    this.queryAccountType(e.target.dataset.hi);
  },
  //金额输入框四舍五入保留两位小数
  jineInput: function(e) {
    this.setData({
      jine: e.detail.value
    })
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
    if (e.detail.column == 0){
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
    this.setData({
      beizhu: e.detail.value
    })
    if (e.detail.value.length > 100) {
      this.setData({
        beizhu: e.detail.value.substring(0, 100)
      })
    }
  },
  //重置数据
  onReset: function() {
    var datetime = new Date();
    var date = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    var time = datetime.getHours() + ":" + datetime.getMinutes();
    var startDate = (datetime.getFullYear() - 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    var endDate = (datetime.getFullYear() + 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    console.log("当前加载的日期：" + date);
    console.log("当前加载的时间：" + time);
    this.setData({
      jine: null,
      beizhu: '',
      date: date,
      startDate: startDate,
      endDate: endDate,
      time: time,
    })
  },
  //保存数据
  onAdd: function() {
    this.setData({
      jine: this.data.jine * 1
    })
    if (this.data.jine.toString().split(".").length == 2) {
      if (this.data.jine.toString().split(".")[1].length == 0) {
        this.setData({
          jine: Math.floor(this.data.jine * 100) / 100
        })
      }
    }
    var date = this.data.date + " " + this.data.time + ":00";
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    })
    const db = wx.cloud.database()
    var datas = {
      shouzhi: this.data.shouzhi,
      jine: this.data.jine,
      beizhu: this.data.beizhu,
      accountType1: this.data.accountType1,
      accountType2: this.data.accountType2,
      date: this.data.date,
      time: this.data.time,
      datetime: timestamp,
      creatTime: new Date().getTime(),
      updateTime: new Date().getTime()
    }
    db.collection('accounts').add({
      data: datas,
      success: res => {
        console.log(datas);
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1,
          jine:null,
          beizhu:''
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
  // 查找当前用户的记账分类
  queryAccountType: function(shouzhi) {
    const db = wx.cloud.database()
    db.collection('account_type').where({
      _openid: this.data.openid,
      accountType: shouzhi
    }).get({
      success: res => {
        if (res.data.length == 0) {
          wx.showToast({
            icon: 'loading',
            title: '初始化记账类型'
          })
          var level1;
          var level2;
          if (shouzhi == "支出") {
            level1 = this.data.zhichuLevel1;
            level2 = this.data.zhichuLevel2;
          }
          if (shouzhi == "收入") {
            level1 = this.data.shouruLevel1;
            level2 = this.data.shouruLevel2;
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
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '初始化失败'
              })
              console.error('初始化记账类型失败：', err)
            }
          })
        }
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
  //查找最近5条记录
  queryAccountRecord: function() {
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