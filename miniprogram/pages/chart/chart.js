var chartZhichu;
var chartShouru;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zhichuopts: {
      lazyLoad: true // 延迟加载组件
    },
    zhichuMessage: '点击饼图查看详情',
    shouruMessage: '点击饼图查看详情',
    choose:"month"
  },
  chooseController:function(e){
    var choose = e.currentTarget.dataset.hi;
    if(choose=="date"){
      
    }
    if(choose=="month"){

    }
    this.setData({
      choose:choose
    })
  },
  initZhichuChart: function(canvas, width, height, F2) {
    const self = this;
    self.chartComponent = self.selectComponent('#pieSelect');
    self.chartComponent.init((canvas, width, height, F2) => {
      var data = self.data.zhichuData;
      chartZhichu = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chartZhichu.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chartZhichu.legend({
        position: 'right'
      });
      chartZhichu.tooltip(false);
      chartZhichu.coord('polar', {
        transposed: true,
        radius: 0.85,
        innerRadius: 0.618
      });
      chartZhichu.axis(false);
      chartZhichu
        .interval()
        .position('a*percent')
        .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });

      chartZhichu.interaction('pie-select', {
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
                zhichuMessage: data.name + '：[' + app.numberFormat(data.percent,2,".",",")+"]：" + Math.round(data.percent / self.data.zhichuTotal * 10000)/100 + '%'
              });
            }
          }
        }
      });
      chartZhichu.render();
      self.chartZhichu = chartZhichu;
      return chartZhichu;
    });
  },
  initShouruChart: function (canvas, width, height, F2) {
    const self = this;
    self.chartComponent = self.selectComponent('#pieSelect2');
    self.chartComponent.init((canvas, width, height, F2) => {
      var data = self.data.shouruData;
      chartShouru = new F2.Chart({
        el: canvas,
        width,
        height
      });
      chartShouru.source(data, {
        percent: {
          formatter: function formatter(val) {
            return val * 100 + '%';
          }
        }
      });
      chartShouru.legend({
        position: 'right'
      });
      chartShouru.tooltip(false);
      chartShouru.coord('polar', {
        transposed: true,
        radius: 0.85,
        innerRadius: 0.618
      });
      chartShouru.axis(false);
      chartShouru
        .interval()
        .position('a*percent')
        .color('name', ['#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0'])
        .adjust('stack')
        .style({
          lineWidth: 1,
          stroke: '#fff',
          lineJoin: 'round',
          lineCap: 'round'
        });

      chartShouru.interaction('pie-select', {
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
                shouruMessage: data.name + '：[' + app.numberFormat(data.percent, 2, ".", ",") + "]：" + Math.round(data.percent / self.data.shouruTotal * 10000) / 100 + '%'
              });
            }
          }
        }
      });
      chartShouru.render();
      self.chartShouru = chartShouru;
      return chartShouru;
    });
  },
  queryDates:function(){
    const this_ = this;
    wx.showToast({
      title: '数据加载中',
      icon: 'loading',
      duration: 20000
    })
    wx.cloud.callFunction({
      // 需调用的云函数名
      name: 'getListByAccounts',
      // 传给云函数的参数
      data: {
        startDate:this_.data.startDate,
        endDate:this_.data.endDate
      },
      // 成功回调
      success: function (res) {
        console.log(res.result)
        //设置初始数据
        var resArr = new Array();
        var arrLength = 0;
        var zhichuTotal = 0;
        var shouruTotal = 0;

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
            obj.a="1";
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
          if(resArr[i].shouzhi=="支出"){
            zhichuData.push(resArr[i]);
          }
          if (resArr[i].shouzhi == "收入") {
            shouruData.push(resArr[i]);
          }
        }
        this_.setData({
          data: resArr,
          zhichuData:zhichuData,
          shouruData:shouruData,
          zhichuTotalStr: app.numberFormat(zhichuTotal, 2, ".", ","),
          shouruTotalStr: app.numberFormat(shouruTotal, 2, ".", ","),
          zhichuTotal: zhichuTotal,
          shouruTotal: shouruTotal
        })
       
        console.log("转换后的数组：");
        console.log(resArr);
        if (resArr.length == 0) {
          this_.setData({
            noData: "Y"
          })
        }
        this_.initZhichuChart();
        this_.initShouruChart();
        wx.hideToast({})
      },
      complete: console.log
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var datetime = new Date();
    datetime.setDate(1);
    var startDateStr = datetime.getFullYear() + "-" + (datetime.getMonth() + 1)+"-01";
    var minDateStr = (datetime.getFullYear()-1) + "-" + (datetime.getMonth() + 1) + "-01";
    var startDate = app.getDateTimeMill(datetime, "00:00:00.0");
    var y = datetime.getFullYear(),
      m = datetime.getMonth();
    var lastDay = new Date(y, m + 1, 0);
    var endDateStr = lastDay.getFullYear() + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var maxDateStr = (lastDay.getFullYear()+1) + "-" + (lastDay.getMonth() + 1) + "-" + lastDay.getDate();
    var endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
    var monthDate = datetime.getFullYear() + "-" + (datetime.getMonth() + 1);

    this.setData({
      startDate: startDate,
      endDate: endDate,
      startDateStr: startDateStr,
      endDateStr: endDateStr,
      minDateStr:minDateStr,
      maxDateStr:maxDateStr,
      monthDate:monthDate
    })

    this.queryDates();
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