// miniprogram/pages/list/list.js
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
    dateStyle: ['border', 'border', 'border', '', 'border'],
    shouzhiStyle: ['border', 'border', ''],
    delStyle: [],
    delNum: 0,
    noMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var datetime = new Date();
    var date = datetime.getFullYear() + "-" + (datetime.getMonth() + 1);
    var endDate = (datetime.getFullYear() + 1) + "-" + (datetime.getMonth() + 1);
    this.setData({
      currDate: date,
      currEndDate: endDate
    })
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
  clickShouzhi: function(e) {
    this.setData({
      pagenum: 1,
      queryResult: [],
      noMore: false,
      shouzhi: e.target.dataset.hi,
      delNum: 0
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
  },
  //查找最近记录
  queryAccountRecord: function() {
    this.setData({
      bottomMessage: "—— 数据加载中... ——"
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
    db.collection('accounts').where(datas)
      .orderBy('datetime', 'desc')
      .skip((this.data.pagenum - 1) * 20 - this.data.delNum)
      .get({
        success: res => {
          console.log("查到的条数:" + res.data.length);
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
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
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
      var index = e.currentTarget.dataset.index;
      delStyleArr[index] = delStyle;
      this.setData({
        delStyle: delStyleArr
      });

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
  }
})