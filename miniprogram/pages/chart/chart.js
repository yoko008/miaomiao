var chart = null;
var chartAcc1 = null;
var chartAcc2 = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      lazyLoad: true // 延迟加载组件
    },
    acc1opts: {
      lazyLoad: true // 延迟加载组件
    },
    acc2opts: {
      lazyLoad: true // 延迟加载组件
    },
    message: '点击饼图查看详情',
    acc1Message: '',
    acc2Message: '',
    choose: "month",
    showPie: 0,
    acc1Data: [],
    acc2Data: [],
    startDate: 0,
    endDate: 0
  },
  chooseController: function(e) {
    var choose = e.currentTarget.dataset.hi;

    var datetime = new Date();
    datetime.setDate(1);
    var startDateStr = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-01";
    var minDateStr = (datetime.getFullYear() - 1) + "-" + (datetime.getMonth() + 1) + "-01";
    var startDate = app.getDateTimeMill(datetime, "00:00:00.0");
    var y = datetime.getFullYear(),
      m = datetime.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    var endDateStr = lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var maxDateStr = (lastDay.getFullYear() + 1) + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
    var monthDate = datetime.getFullYear() + "-" + (datetime.getMonth() + 1);

    this.setData({
      startDate: startDate,
      endDate: endDate,
      startDateStr: startDateStr,
      endDateStr: endDateStr,
      minDateStr: minDateStr,
      maxDateStr: maxDateStr,
      monthDate: monthDate,
      message: '点击饼图查看详情',
      acc1Message: '',
      acc2Message: '',
      choose: choose
    })
    this.queryDates();
  },
  initChart: function(canvas, width, height, F2) {
    const self = this;
    self.chartComponent = self.selectComponent('#pieSelectTotal');
    self.chartComponent.init((canvas, width, height, F2) => {
      var data = self.data.totalData;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chart.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chart.legend({
        position: 'bottom',
        clickable: false,
        align: "center",
        itemWidth: null
      });
      chart.tooltip(false);
      chart.coord('polar', {
        transposed: true,
        radius: 0.85,
        innerRadius: 0.618
      });
      chart.axis(false);
      chart
        .interval()
        .position('a*percent')
        .color('name', ['#F4606C', '#19CAAD'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });

      chart.interaction('pie-select', {
        cancelable: false, // 不允许取消选中
        animate: {
          duration: 300,
          easing: 'backOut'
        },
        onEnd(ev) {
          const {
            shape,
            data,
            shapeInfo,
            selected
          } = ev;
          if (shape) {
            if (selected) {
              self.setData({
                message: '[ ' + data.name + ' ]：[ ' + app.numberFormat(data.percent, 2, ".", ",") + " ]：[ 占收支和的" + Math.round(data.percent / (self.data.zhichuTotal + self.data.shouruTotal) * 10000) / 100 + '% ]',
                showPie: 100
              });
              if (data.name == "支出") {
                chartAcc1.changeData(self.data.zhichuData)
              }
              if (data.name == "收入") {
                chartAcc1.changeData(self.data.shouruData)
              }
            }
          }
        }
      });
      chart.render();
      self.chart = chart;
      self.initAcc1Chart();
      return chart;
    });
  },
  initAcc1Chart: function(canvas, width, height, F2) {
    const self = this;
    self.chartComponent = self.selectComponent('#pieSelectAcc1');
    self.chartComponent.init((canvas, width, height, F2) => {
      var data = self.data.acc1Data;
      chartAcc1 = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chartAcc1.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chartAcc1.legend({
        position: 'bottom',
        clickable: false,
        align: "center",
        itemWidth: null
      });
      chartAcc1.tooltip(false);
      chartAcc1.coord('polar', {
        transposed: true,
        radius: 0.85,
        innerRadius: 0.618
      });
      chartAcc1.axis(false);
      chartAcc1
        .interval()
        .position('a*percent')
        .color('name', ['#19CAAD', '#8CC7B5', '#A0EEE1', '#BEE7E9', '#BEEDC7', '#D6D5B7', '#D1BA74', '#E6CEAC', '#ECAD9E', '#F4606C'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });

      chartAcc1.interaction('pie-select', {
        cancelable: false, // 不允许取消选中
        animate: {
          duration: 300,
          easing: 'backOut'
        },
        onEnd(ev) {
          const {
            shape,
            data,
            shapeInfo,
            selected
          } = ev;
          if (shape) {
            if (selected) {
              console.log(data);
              self.setData({
                acc1Data: data,
                acc1Message: '[ ' + data.name + ' ]：[ ' + app.numberFormat(data.percent, 2, ".", ",") + " ]：[ 占" + data.shouzhi + "的" + Math.round(data.percent / (data.shouzhi == "支出" ? self.data.zhichuTotal : self.data.shouruTotal) * 10000) / 100 + '% ]',
                showPie: 200
              });

              if (data.child.length != 0) {

              } else {
                var resArr = new Array();
                var arrLength = 0;
                var res = {
                  result: {
                    data: data.acc2
                  }
                }
                console.log(data.acc2);
                for (var i = 0; i < res.result.data.length; i++) {
                  var itHas = false;
                  for (var j = 0; j < resArr.length; j++) {
                    //如果回显数组里已有此分类1
                    if (resArr[j].name == res.result.data[i].accountType2) {
                      itHas = true;
                      resArr[j].percent += res.result.data[i].jine;
                      break;
                    }
                  }
                  //如果回显数组里没有此分类1
                  if (!itHas) {
                    var obj = {};
                    obj.name = res.result.data[i].accountType2;
                    obj.percent = res.result.data[i].jine;
                    obj.total = data.percent;
                    obj.a = "1";
                    resArr.push(obj);
                  }
                }
                //根据金额排序，冒泡写起来比较简单
                for (var i = 0; i < resArr.length; i++) {
                  for (var j = i + 1; j < resArr.length; j++) {
                    if (resArr[i].percent < resArr[j].percent) {
                      var change = resArr[i];
                      resArr[i] = resArr[j];
                      resArr[j] = change;
                    }
                  }
                }
                chartAcc2.changeData(resArr);
              }
            }
          }
        }
      });
      chartAcc1.render();
      self.chartAcc1 = chartAcc1;
      self.initAcc2Chart();
      return chartAcc1;
    });
  },
  initAcc2Chart: function(canvas, width, height, F2) {
    const self = this;
    self.chartComponent = self.selectComponent('#pieSelectAcc2');
    self.chartComponent.init((canvas, width, height, F2) => {
      var data = self.data.acc2Data;
      chartAcc2 = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chartAcc2.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chartAcc2.legend({
        position: 'bottom',
        clickable: false,
        align: "center",
        itemWidth: null
      });
      chartAcc2.tooltip(false);
      chartAcc2.coord('polar', {
        transposed: true,
        radius: 0.85,
        innerRadius: 0.618
      });
      chartAcc2.axis(false);
      chartAcc2
        .interval()
        .position('a*percent')
        .color('name', ['#19CAAD', '#8CC7B5', '#A0EEE1', '#BEE7E9', '#BEEDC7', '#D6D5B7', '#D1BA74', '#E6CEAC', '#ECAD9E', '#F4606C'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });

      chartAcc2.interaction('pie-select', {
        cancelable: false, // 不允许取消选中
        animate: {
          duration: 300,
          easing: 'backOut'
        },
        onEnd(ev) {
          const {
            shape,
            data,
            shapeInfo,
            selected
          } = ev;
          if (shape) {
            if (selected) {
              self.setData({
                acc2Message: '[ ' + data.name + ' ]：[ ' + app.numberFormat(data.percent, 2, ".", ",") + " ]：[ 占" + self.data.acc1Data.name + "的" + Math.round(data.percent / data.total * 10000) / 100 + '% ]'
              });
            }
          }
        }
      });
      chartAcc2.render();
      self.chartAcc2 = chartAcc2;
      self.queryDates();
      return chartAcc2;
    });
  },
  queryDates: function() {
    const this_ = this;
    var userInfo = app.globalData.userInfo;
    console.log("userInfo是：", userInfo);
    var tableName = "";
    var accountBookId = "";
    if (userInfo.isBasic) {
      tableName = 'accounts';
    } else {
      tableName = 'accounts_love';
      accountBookId = userInfo.accountBookId;
    }
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    })
    console.log("开始查询获取startDate为", this_.data.startDate);
    console.log("开始查询获取startDate转换为字符串为", this_.data.startDate.toString());
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getListByAccounts',
      // 传给云函数的参数
      data: {
        startDate: this_.data.startDate.toString(),
        endDate: this_.data.endDate.toString(),
        tableName:tableName,
        accountBookId:accountBookId
      },
      // 成功回调
      success: function(res) {
        console.log(res.result)
        //设置初始数据
        var resArr = new Array();
        var arrLength = 0;
        var zhichuTotal = 0.001;
        var shouruTotal = 0.001;

        for (var i = 0; i < res.result.data.length; i++) {
          var itHas = false;
          for (var j = 0; j < resArr.length; j++) {
            //如果回显数组里已有此分类1
            if (resArr[j].name == res.result.data[i].accountType1 && resArr[j].shouzhi == res.result.data[i].shouzhi) {
              itHas = true;
              resArr[j].percent += res.result.data[i].jine;
              resArr[j].acc2.push(res.result.data[i]);
              if (res.result.data[i].shouzhi == "支出") {
                zhichuTotal += res.result.data[i].jine;
              } else if (res.result.data[i].shouzhi == "收入") {
                shouruTotal += res.result.data[i].jine;
              }
              break;
            }
          }
          //如果回显数组里没有此分类1
          if (!itHas) {
            var obj = {};
            obj.name = res.result.data[i].accountType1;
            obj.shouzhi = res.result.data[i].shouzhi;
            obj.percent = res.result.data[i].jine;
            obj.acc2 = [res.result.data[i]];
            obj.child = [];
            obj.show = 0;
            obj.a = "1";
            if (res.result.data[i].shouzhi == "支出") {
              zhichuTotal += res.result.data[i].jine;
            } else if (res.result.data[i].shouzhi == "收入") {
              shouruTotal += res.result.data[i].jine;
            }
            resArr.push(obj);
          }
        }
        //根据金额排序，冒泡写起来比较简单
        for (var i = 0; i < resArr.length; i++) {
          for (var j = i + 1; j < resArr.length; j++) {
            if (resArr[i].percent < resArr[j].percent) {
              var change = resArr[i];
              resArr[i] = resArr[j];
              resArr[j] = change;
            }
          }
        }
        //设置金额字符串，计算百分比，分组
        var zhichuData = new Array();
        var shouruData = new Array();
        for (var i = 0; i < resArr.length; i++) {
          resArr[i].jineStr = app.numberFormat(resArr[i].percent, 2, ".", ",");
          if (resArr[i].shouzhi == "支出") {
            zhichuData.push(resArr[i]);
          }
          if (resArr[i].shouzhi == "收入") {
            shouruData.push(resArr[i]);
          }
        }
        var totalData = new Array();
        if (resArr.length != 0) {
          totalData[0] = {
            name: "支出",
            percent: zhichuTotal,
            a: "1"
          }
          totalData[1] = {
            name: "收入",
            percent: shouruTotal,
            a: "1"
          }
          this_.setData({
            noData: "N",

          })
        }
        if (resArr.length == 0) {
          this_.setData({
            noData: "Y"
          })
        }
        this_.setData({
          data: resArr,
          totalData: totalData,
          zhichuData: zhichuData,
          shouruData: shouruData,
          zhichuTotalStr: "- " + app.numberFormat(zhichuTotal, 2, ".", ","),
          shouruTotalStr: "+ " + app.numberFormat(shouruTotal, 2, ".", ","),
          zhichuTotal: zhichuTotal,
          shouruTotal: shouruTotal,
          showPie: 0,
          message: '点击饼图查看详情',
          acc1Message: '',
          acc2Message: '',
        })

        console.log("转换后的数组：");
        console.log(resArr);

        chart.changeData(totalData);
        wx.hideToast({})
      },
      complete: console.log
    })
  },
  //选择年月
  bindMonthDateChange: function(e) {
    var date = e.detail.value;
    var lastDay = new Date(date.split("-")[0], date.split("-")[1], 0);
    var endDateStr = lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var maxDateStr = (lastDay.getFullYear() + 1) + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
    var datetime = lastDay;
    datetime.setDate(1);
    var startDateStr = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-01";
    var minDateStr = (datetime.getFullYear() - 1) + "-" + (datetime.getMonth() + 1) + "-01";
    var startDate = app.getDateTimeMill(datetime, "00:00:00.0");
    this.setData({
      monthDate: e.detail.value,
      startDate: startDate,
      endDate: endDate,
      startDateStr: startDateStr,
      endDateStr: endDateStr,
      minDateStr: minDateStr,
      maxDateStr: maxDateStr
    })
    this.queryDates();
  },
  moveMonthDateChange: function(e) {
    var date = this.data.monthDate;
    var y = parseInt(date.split("-")[0]);
    var m = parseInt(date.split("-")[1]);
    if (e.currentTarget.dataset.hi == "add") {
      var lastDay = new Date(y, m + 1, 0);
    }
    if (e.currentTarget.dataset.hi == "cut") {
      var lastDay = new Date(y, m - 1, 0);
    }
    var endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
    var datetime = lastDay;
    datetime.setDate(1);
    var startDate = app.getDateTimeMill(datetime, "00:00:00.0");
    var monthDate = datetime.getFullYear() + "-" + (datetime.getMonth() + 1);
    this.setData({
      monthDate: monthDate,
      startDate: startDate,
      endDate: endDate
    })
    this.queryDates();
  },
  bindStartDateChange: function(e) {
    var date = e.detail.value;
    var datetime = new Date(date.split("-")[0], parseInt(date.split("-")[1]) - 1, date.split("-")[2])
    var startDateStr = e.detail.value;
    var startDate = app.getDateTimeMill(datetime, "00:00:00.0");
    this.setData({
      startDate: startDate,
      startDateStr: startDateStr,
    })
    this.queryDates();
  },
  bindEndDateChange: function(e) {
    var date = e.detail.value;
    var datetime = new Date(date.split("-")[0], parseInt(date.split("-")[1]) - 1, date.split("-")[2])
    var endDateStr = e.detail.value;
    var endDate = app.getDateTimeMill(datetime, "00:00:00.0");
    this.setData({
      endDate: endDate,
      endDateStr: endDateStr,
    })
    this.queryDates();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = app.globalData.userInfo;
    console.log("userInfo是：", userInfo);
    this.setData({
      accountBookName: userInfo.accountBookName
    })
    var datetime = new Date();
    datetime.setDate(1);
    var startDateStr = datetime.getFullYear() + "-" + (datetime.getMonth() + 1) + "-01";
    var minDateStr = (datetime.getFullYear() - 1) + "-" + (datetime.getMonth() + 1) + "-01";
    var startDate = app.getDateTimeMill(datetime, "00:00:00.0");
    var y = datetime.getFullYear(),
      m = datetime.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    var endDateStr = lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var maxDateStr = (lastDay.getFullYear() + 1) + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
    var monthDate = datetime.getFullYear() + "-" + (datetime.getMonth() + 1);
    console.log("进入页面获取的startDate时间",startDate);
    this.setData({
      startDate: startDate,
      endDate: endDate,
      startDateStr: startDateStr,
      endDateStr: endDateStr,
      minDateStr: minDateStr,
      maxDateStr: maxDateStr,
      monthDate: monthDate
    })
    this.initChart();
    // this.initAcc1Chart();
    // this.initAcc2Chart();
    // this.queryDates();

  },
  touchChartBack: function() {
    this.setData({
      showPie: this.data.showPie - 100
    })
    if (this.data.showPie == 100) {
      this.setData({
        acc2Message: ""
      })
    }
    if (this.data.showPie == 0) {
      this.setData({
        acc1Message: "",
        acc2Message: ""
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

  },
  touchHelp: function() {

    chartZhichu.changeData(this.data.data);
  }

})