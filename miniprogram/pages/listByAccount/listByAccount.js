
Page({

  /**
   * 页面的初始数据
   */
  data: {
    res: [], //结果集
    zhichuTotal: 0,
    shouruTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
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
      data: {},
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
            if (resArr[j].acc1 == res.result.data[i].accountType1 && resArr[j].shouzhi == res.result.data[i].shouzhi) {
              itHas = true;
              resArr[j].jine += res.result.data[i].jine;
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
            obj.acc1 = res.result.data[i].accountType1;
            obj.shouzhi = res.result.data[i].shouzhi;
            obj.jine = res.result.data[i].jine;
            obj.acc2 = [res.result.data[i]];
            obj.child = [];
            obj.show = 0;
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
            if (resArr[i].jine < resArr[j].jine) {
              var change = resArr[i];
              resArr[i] = resArr[j];
              resArr[j] = change;
            }
          }
        }
        //设置金额字符串，计算百分比
        for (var i = 0; i < resArr.length; i++) {
          console.log(resArr[i].jine);
          resArr[i].jineStr = this_.numberFormat(resArr[i].jine, 2, ".", ",");
          console.log(resArr[i].jineStr);
          if (resArr[i].shouzhi == "支出") {
            resArr[i].width = this_.numberFormat(resArr[i].jine / zhichuTotal * 100, 4, ".", "");
          } else if (resArr[i].shouzhi == "收入") {
            resArr[i].width = this_.numberFormat(resArr[i].jine / shouruTotal * 100, 4, ".", "");
          }
        }

        console.log("转换后的数组：");
        console.log(resArr);
        this_.setData({
          res: resArr,
          zhichuTotalStr: "总支出  - " + this_.numberFormat(zhichuTotal, 2, ".", ","),
          shouruTotalStr: "总收入  + " + this_.numberFormat(shouruTotal, 2, ".", ","),
          zhichuTotal: zhichuTotal,
          shouruTotal: shouruTotal
        })
        wx.showToast({
          title: '数据加载成功',
          icon: 'success'
        })
      },
      complete: console.log
    })
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
  showDetail: function(e) {
    const this_ = this;
    var index = e.currentTarget.dataset.index;
    var data = this.data.res;
    var acc2 = data[index].acc2;
    var child = data[index].child;
    data[index].show = 1 - data[index].show;
    if (child.length == 0) {

      for (var i = 0; i < acc2.length; i++) {
        var itHas = false;
        for (var j = 0; j < child.length; j++) {
          //如果回显数组里已有此分类2
          if (child[j].acc2 == acc2[i].accountType2) {
            itHas = true;
            child[j].jine += acc2[i].jine;
            break;
          }
        }
        if (!itHas) {
          var obj = {};
          obj.acc2 = acc2[i].accountType2;
          obj.jine = acc2[i].jine;
          child.push(obj);
        }
      }
      //根据金额排序，冒泡写起来比较简单
      for (var i = 0; i < child.length; i++) {
        for (var j = i + 1; j < child.length; j++) {
          if (child[i].jine < child[j].jine) {
            var change = child[i];
            child[i] = child[j];
            child[j] = change;
          }
        }
      }
      //设置金额字符串，计算百分比
      for (var i = 0; i < child.length; i++) {
        child[i].jineStr = this.numberFormat(child[i].jine, 2, ".", ",");
        child[i].width = this.numberFormat(child[i].jine / data[index].jine * 100, 4, ".", ",");
        if (data[index].shouzhi == "支出") {
          child[i].totalWidth = this.numberFormat(child[i].jine / this.data.zhichuTotal * 100, 4, ".", "");
        } else if (data[index].shouzhi == "收入") {
          child[i].totalWidth = this.numberFormat(child[i].jine / this.data.shouruTotal * 100, 4, ".", "");
        }
      }
      console.log(data);
      this.setData({
        res: data
      })
    }

  },
  numberFormat: function(number, decimals, dec_point, thousands_sep) {
    /*
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     * */
     number = number.toString();
     var numberArr = number.split(".");
     var length = numberArr.length;
     var intnum = "";
     var z=0;
    for (var i = numberArr[0].length-1;i>=0;i--){
      if (z != 0 && z % 3 == 0) {
        intnum = ","+intnum;
      }
       intnum = numberArr[0].indexOf(i,1)+intnum;
     }
    
    return intnum;
  }

})