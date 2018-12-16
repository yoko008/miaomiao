const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    queryResult: [],
    pagenum: 1,
    bottomMessage: "",
    startDate: 0,
    endDate: 9999999999999,
    shouzhi: "全部",
    order: "desc",
    orderby: "datetime",
    dateStyle: ['border', 'border', 'border', '', 'border'],
    shouzhiStyle: ['border', 'border', ''],
    orderStyle: ['border', '', 'border', 'border'],
    delStyle: [],
    delNum: 0,
    noMore: false,
    acc1: "全部",
    acc2: "全部",
    choose:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var datetime = new Date();
    var date = datetime.getFullYear() + "-" + (datetime.getMonth() + 1);
    var endDate = (datetime.getFullYear() + 1) + "-" + (datetime.getMonth() + 1);
    //接收参数
    var shouzhi = options.shouzhi;
    var shouzhiStyle = ['border', 'border', ''];
    if (shouzhi == null || shouzhi == "" || shouzhi == undefined) {
      shouzhi = "全部";
    }
    else{
      if(shouzhi=="支出"){
        shouzhiStyle = ['', 'border', 'border'];
      }
      if (shouzhi == "收入") {
        shouzhiStyle = ['border', '', 'border'];
      }
    }
    
    this.setData({
      currDate: date,
      currEndDate: endDate,
      shouzhi: shouzhi,
      acc1: options.acc1 == undefined || options.acc1 == "" || options.acc1 == null? "全部" : options.acc1,
      acc2: options.acc2 == undefined || options.acc2 == "" || options.acc2 == null? "全部" : options.acc2,
      shouzhiStyle:shouzhiStyle
    })
    if (options.acc1 != undefined) {
      this.queryAccountType();
    }
    this.queryAccountRecord();
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
    if (!this.data.noMore) {
      this.queryAccountRecord();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //点击问号显示帮助
  touchHelp: function (e) {
    wx.showToast({
      icon: "none",
      title: '点击筛选列出筛选条件，左滑可删除。',
      duration: 3000
    })
  },
  //点击筛选
  chooseController:function(e){
    this.setData({
      choose:!this.data.choose
    })
  },
  //点击选择时间
  clickDate: function(e) {
    this.setData({
      pagenum: 1,
      queryResult: [],
      noMore: false,
      delNum: 0
    })
    var date = new Date();
    switch (e.target.dataset.hi) {
      case "本周":
        var weekday = date.getDay() || 7;
        date.setDate(date.getDate() - weekday + 1);
        var startDate = this.getDateTimeMill(date, "00:00:00.0");
        date.setDate(date.getDate() + 6);
        var endDate = this.getDateTimeMill(date, "23:59:59.9");
        this.setData({
          dateStyle: ['', 'border', 'border', 'border', 'border'],
          startDate: startDate,
          endDate: endDate,
        })
        break;
      case "本月":
        date.setDate(1);
        var startDate = this.getDateTimeMill(date, "00:00:00.0");
        var y = date.getFullYear(),
          m = date.getMonth();
        var lastDay = new Date(y, m + 1, 0);
        var endDate = this.getDateTimeMill(lastDay, "23:59:59.9");
        console.log(lastDay);
        this.setData({
          dateStyle: ['border', '', 'border', 'border', 'border'],
          startDate: startDate,
          endDate: endDate
        })
        break;
      case "本年":
        date.setDate(1);
        date.setMonth(0);
        var startDate = this.getDateTimeMill(date, "00:00:00.0");
        date.setDate(31);
        date.setMonth(11);
        var endDate = this.getDateTimeMill(date, "23:59:59.9");
        this.setData({
          dateStyle: ['border', 'border', '', 'border', 'border'],
          startDate: startDate,
          endDate: endDate
        })
        break;
      case "全部":
        this.setData({
          dateStyle: ['border', 'border', 'border', '', 'border'],
          startDate: 0,
          endDate: 9999999999999
        })
        break;
      case "年月":
        break;
      default:
        break;
    }
    this.queryAccountRecord();
  },
  //确认选择日期
  bindDateChange: function(e) {
    var date = new Date(e.detail.value.split("-")[0], e.detail.value.split("-")[1] - 1, 1);
    date.setDate(1);
    var startDate = this.getDateTimeMill(date, "00:00:00.0");
    var y = date.getFullYear(),
      m = date.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    var endDate = this.getDateTimeMill(lastDay, "23:59:59.9");
    this.setData({
      currDate: e.detail.value,
      dateStyle: ['border', 'border', 'border', 'border', ''],
      startDate: startDate,
      endDate: endDate,
      pagenum: 1,
      queryResult: [],
      noMore: false,
      delNum: 0
    })
    this.queryAccountRecord();
  },
  //点击选择收支
  clickShouzhi: function(e) {
    this.setData({
      pagenum: 1,
      queryResult: [],
      noMore: false,
      shouzhi: e.target.dataset.hi,
      delNum: 0,
      acc1: "全部",
      acc2: "全部"
    })
    switch (e.target.dataset.hi) {
      case "全部":
        this.setData({
          shouzhiStyle: ['border', 'border', ''],
        })
        break;
      case "收入":
        this.setData({
          shouzhiStyle: ['border', '', 'border'],
        })
        break;
      case "支出":
        this.setData({
          shouzhiStyle: ['', 'border', 'border'],
        })
        break;
      default:
        break;
    }
    this.queryAccountRecord();
    this.queryAccountType();
  },
  //点击选择排序方式
  clickOrder: function(e) {
    var orderStyle = ['border', 'border', 'border', 'border'];
    orderStyle[e.target.dataset.index] = '';
    this.setData({
      pagenum: 1,
      queryResult: [],
      noMore: false,
      order: e.target.dataset.hi,
      delNum: 0,
      orderby: e.target.dataset.orderby,
      orderStyle: orderStyle
    })
    this.queryAccountRecord();
  },
  //查找最近记录
  queryAccountRecord: function() {
    this.setData({
      bottomMessage: "—— 数据加载中... ——",
      delStyle: []
    })
    const db = wx.cloud.database()
    const _ = db.command;
    var datas = {};
    if (this.data.shouzhi == "全部") {
      datas = {
        _openid: this.data.openid,
        datetime: _.gte(this.data.startDate).and(_.lte(this.data.endDate))
      }
    } else {
      datas = {
        _openid: this.data.openid,
        datetime: _.gte(this.data.startDate).and(_.lte(this.data.endDate)),
        shouzhi: this.data.shouzhi
      }
    }
    if (this.data.acc1 != "" && this.data.acc1 != "全部") {
      datas.accountType1 = this.data.acc1;
    }
    if (this.data.acc2 != "" && this.data.acc2 != "全部") {
      datas.accountType2 = this.data.acc2;
    }
    console.log("查询条件为",datas);
    db.collection('accounts').where(datas)
      .orderBy(this.data.orderby, this.data.order)
      .skip((this.data.pagenum - 1) * 20 - this.data.delNum)
      .get({
        success: res => {
          console.log("查到的条数:" + res.data.length);
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].jineStr == undefined) {
              res.data[i].jineStr = app.numberFormat(res.data[i].jine, 2, ".", ",");
            }
          }
          if (res.data.length < 20) {
            console.log('查找记账记录成功，页数：' + this.data.pagenum, res);
            this.setData({
              queryResult: this.data.queryResult.concat(res.data),
              bottomMessage: "—— 没有更多了 ——",
              noMore: true
            })
          }
          if (res.data.length == 20) {
            console.log('查找记账记录成功，页数：' + this.data.pagenum, res);
            this.setData({
              queryResult: this.data.queryResult.concat(res.data),
              pagenum: this.data.pagenum + 1,
              bottomMessage: "—— 下拉加载更多 ——"
            })
          }
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找记账记录失败：', err)
        }
      })
  },
  //查找收支详情
  queryShouzhiDetail: function(pagenum) {
    const db = wx.cloud.database()
    db.collection('accounts').where({
        _openid: this.data.openid
      })
      .get({
        success: res => {
          this.setData({
            queryResult: this.data.queryResult.push(res.data)
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
  },
  getDateTimeMill: function(date, time) {
    if (!date || typeof(date) === "string") {
      console.log("参数异常，请检查...");

    }
    var y = date.getFullYear(); //年
    var m = date.getMonth() + 1; //月
    var d = date.getDate(); //日
    var datetime = new Date((y + "-" + m + "-" + d + " " + time).replace(/-/g, '/')).getTime();
    return datetime;
  },
  touchM: function(e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      var moveY = e.touches[0].clientY;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var disY = this.data.startY - moveY;
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
      var delStyle = "";
      var delStyleArr = this.data.delStyle;
      if (disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
        delStyle = "width:0px;";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        delStyle = "width:60px;";
        delStyleArr = new Array();
      }
      //获取手指触摸的是哪一项
      if ((disX >= 0 ? disX : disX * -1) > (disY >= 0 ? disY : disY * -1)) {
        var index = e.currentTarget.dataset.index;
        delStyleArr[index] = delStyle;
        this.setData({
          delStyle: delStyleArr
        });
      }
    }
  },
  delItem: function(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    console.log("index：" + index);
    wx.showToast({
      icon: 'loading',
      title: '删除中'
    })
    const db = wx.cloud.database();
    db.collection('accounts').doc(id).remove({}).then(
      res => {
        var queryResult = this.data.queryResult;
        queryResult.splice(index, 1);
        console.log("剩余数组的长度：" + queryResult.length);

        this.setData({
          delStyle: [],
          delNum: this.data.delNum + 1,
          queryResult: queryResult
        });
        wx.showToast({
          icon: 'success',
          title: '删除成功'
        })
      }
    )
  },
  // 查找当前用户的记账分类
  queryAccountType: function() {
    const db = wx.cloud.database()
    var shouzhi = this.data.shouzhi;
    db.collection('account_type').where({
      _openid: this.data.openid,
      accountType: shouzhi
    }).get({
      success: res => {
        //如果有数据，那么设置数据
        if (res.data.length > 0) {

          var multiArray1 = res.data[0].level1;
          multiArray1.unshift("全部");
          
          var multiArray22 = res.data[0].level2;
          for (var i = 0; i < multiArray22.length; i++) {
            multiArray22[i].unshift("全部");
          }
          multiArray22.unshift(["全部"]);
          var multiArray2 = multiArray22[0];

          var multiIndex1 = 0;
          var multiIndex2 = 0;
          for (var i = 0; i < multiArray1.length; i++) {
            if (this.data.acc1==multiArray1[i]){
              multiArray2 = multiArray22[i];
              multiIndex1 = i;
            }
          }

          for (var i = 0; i < multiArray2.length; i++) {
            if (this.data.acc2 ==multiArray2[i]) {
              multiIndex2 = i;
            }
          }
          
          this.setData({
            accountTypeArray: res.data[0],
            multiArray1: multiArray1,
            multiIndex1: multiIndex1,
            multiArray2: multiArray2,
            multiIndex2: multiIndex1,
            
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
  //确认选择收支类型选择器的事件
  bindMultiPickerChange1: function(e) {
    this.setData({
      acc1: this.data.multiArray1[e.detail.value],
      multiArray2: this.data.accountTypeArray.level2[e.detail.value],
      acc2: "全部",
      multiIndex2: 0,
      queryResult: [],
      pagenum: 1,
      noMore: false,
      delNum: 0,
    })
    this.queryAccountRecord();
  },
  bindMultiPickerChange2: function(e) {
    this.setData({
      acc2: this.data.multiArray2[e.detail.value],
      queryResult: [],
      pagenum: 1,
      noMore: false,
      delNum: 0,
    })
    this.queryAccountRecord();
  },
})