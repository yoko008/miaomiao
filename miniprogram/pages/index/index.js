const app = getApp();
const {
  $Message
} = require('../../dist/base/index');
Page({
  data: {
    accountTypeArray: null, //记账分类数组，包含一级分类和二级分类
    multiArray: null, //当前滚动选择器显示的记账分类数据
    multiIndex: [0, 0], //每一项的值表示选择了 range 对应项中的第几个（下标从 0 开始）
    counterId: '', //新增一条记账后返回的id，用于显示new的标识
    openid: '', //用户id
    queryResult: [], //最近的记录列表
    startDate: '', //日期选择器开始时间
    endDate: '', //日期选择器结束时间
    /*以下是保存操作时需要发送的数据*/
    shouzhi: "支出", //收支类型
    jine: null, //金额数值
    jineStr: "0.00", //金额字符串
    beizhu: "", //备注
    accountType1: "", //一级分类
    accountType2: "", //二级分类
    date: '', //日期
    time: '', //时间
    delStyle: [] //控制删除按钮显示用
  },
  //加载页面时触发
  onLoad: function(options) {},
  onReady: function() {
    //设置当前时间和可选择的时间范围
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var day = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var date = year + "-" + month + "-" + day;
    var time = hour + ":" + minute;
    var startDate = (datetime.getFullYear() - 10) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    var endDate = (datetime.getFullYear() + 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    console.log("当前加载的日期：" + date);
    console.log("当前加载的时间：" + time);
    //设置初始数据
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
  onShow: function(options) {
    //查找记账分类
    //放在onshow里是因为有可能在设置里编辑了记账分类，返回记账页的时候就得重新从数据库读取
    this.queryAccountType(this.data.shouzhi);
  },
  //点击收入或支出按钮时触发，改变按钮颜色和收支类型
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
    var str = e.detail.value.substring(0, 100);
    this.setData({
      beizhu: str
    })
  },
  //重置数据
  onReset: function() {
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var day = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var date = year + "-" + month + "-" + day;
    var time = hour + ":" + minute;
    var startDate = (datetime.getFullYear() - 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    var endDate = (datetime.getFullYear() + 1) + "-" + (datetime.getMonth() + 1) + "-" + datetime.getDate();
    console.log("当前加载的日期：" + date);
    console.log("当前加载的时间：" + time);
    this.setData({
      jine: "",
      jineStr: "0.00",
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
    if (this.data.jine > 1000000000) {
      //var messageArray = ['o(=•ェ•=)m不好意思，这么多钱我这存不下', '≡ω≡这么多钱还需要自己记账？']
      wx.showToast({
        icon: "none",
        title: 'o(=•ェ•=)m不好意思，这么多钱我这存不下',
        duration: 2000
      })
      return;
    }
    //获取时间戳
    var date = this.data.date + " " + this.data.time + ":00";
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    wx.showToast({
      title: '保存中',
      icon: 'loading'
    })
    const this_ = this;
    const db = wx.cloud.database()
    var datas = {
      shouzhi: this.data.shouzhi,
      jine: this.data.jine,
      jineStr: app.numberFormat(this.data.jine, 2, ".", ","),
      //jineStr: this.data.jineStr.replace(/\d{ 1, 3}(?= (\d{ 3 }) + (\.\d *)?$) /g, '$&,'),
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
        const _ = db.command
        //计算本条是否触发预算警戒和目标达成
        db.collection('budget').where(
            // _.or([
            //   {//始终提醒的
            //     _openid: this.data.openid,
            //     shouzhi: datas.shouzhi == "支出" ? "支出预算" : "收入目标",
            //     accountType1: _.in([datas.accountType1, "全部"]),
            //     accountType2: _.in([datas.accountType2, "全部"]),
            //     indexWarn: 0
            //   },
            //   {//周期内只提醒一次而且没提醒过的
            //     _openid: this.data.openid,
            //     shouzhi: datas.shouzhi == "支出" ? "支出预算" : "收入目标",
            //     accountType1: _.in([datas.accountType1, "全部"]),
            //     accountType2: _.in([datas.accountType2, "全部"]),
            //     indexWarn: 1,
            //     warned:0
            //   }
            // ])
            {
              _openid: this.data.openid,
              shouzhi: datas.shouzhi == "支出" ? "支出预算" : "收入目标",
              accountType1: _.in([datas.accountType1, "全部"]),
              accountType2: _.in([datas.accountType2, "全部"]),
              warned: 0
            }
          )
          .get({
            success: res => {
              console.log("lai", res.data);
              //先处理一下数据，找到有没有年度预算
              var queryResult = [];
              var dateSize = "月度";
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].jineStr == undefined) {
                  res.data[i].jineStr = app.numberFormat(res.data[i].jine, 2, ".", ",");
                }
                if (res.data[i].zhouqi == "年度") {
                  dateSize = "年度";
                }
                queryResult.push(res.data[i]);
              }
              //根据有没有年度预算来判断查询起止日期，减少数据量
              var date = new Date();
              var startDate;
              var endDate;
              switch (dateSize) {
                case "月度":
                  date.setDate(1);
                  startDate = app.getDateTimeMill(date, "00:00:00.0");
                  var y = date.getFullYear(),
                    m = date.getMonth();
                  var lastDay = new Date(y, m + 1, 0);
                  endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
                  break;
                case "年度":
                  date.setDate(1);
                  date.setMonth(0);
                  startDate = app.getDateTimeMill(date, "00:00:00.0");
                  date.setDate(31);
                  date.setMonth(11);
                  endDate = app.getDateTimeMill(date, "23:59:59.9");
                  break;
                default:
                  break;
              }
              //开始查询需要的记账数据
              wx.cloud.callFunction({
                // 需调用的云函数名
                name: 'getListByAccounts',
                // 传给云函数的参数
                data: {
                  startDate: startDate.toString(),
                  endDate: endDate.toString()
                },
                // 成功回调
                success: function(res) {
                  console.log("查询到的记账的数据", res.result)
                  var accounts = res.result.data;
                  var setTime = 0;
                  var message = [];
                  var messageType = [];
                  var warnObjs = [];
                  for (var j = 0; j < queryResult.length; j++) {
                    queryResult[j].currJine = 0;
                    var startDate;
                    var endDate;
                    //判断需要累加的起止时间
                    var date = new Date();
                    switch (queryResult[j].zhouqi) {
                      case "月度":
                        date.setDate(1);
                        startDate = app.getDateTimeMill(date, "00:00:00.0");
                        var y = date.getFullYear(),
                          m = date.getMonth();
                        var lastDay = new Date(y, m + 1, 0);
                        endDate = app.getDateTimeMill(lastDay, "23:59:59.9");
                        break;
                      case "年度":
                        date.setDate(1);
                        date.setMonth(0);
                        startDate = app.getDateTimeMill(date, "00:00:00.0");
                        date.setDate(31);
                        date.setMonth(11);
                        endDate = app.getDateTimeMill(date, "23:59:59.9");
                        break;
                      default:
                        break;
                    }
                    //开始累加金额
                    console.log(queryResult[j].zhouqi);
                    for (var i = 0; i < accounts.length; i++) {
                      if (startDate > accounts[i].datetime || endDate < accounts[i].datetime) {
                        continue;
                      }
                      if (accounts[i].shouzhi == queryResult[j].shouzhi.slice(0, 2)) {
                        if (queryResult[j].accountType1 == "全部" || (accounts[i].accountType1 == queryResult[j].accountType1 && queryResult[j].accountType2 == "全部") || (accounts[i].accountType1 == queryResult[j].accountType1 && queryResult[j].accountType2 == accounts[i].accountType2)) {
                          queryResult[j].currJine += accounts[i].jine;
                        }
                      }
                    }
                    queryResult[j].currJineStr = app.numberFormat(queryResult[j].currJine, 2, ".", ",");
                    queryResult[j].currPercent = Math.floor(queryResult[j].currJine / queryResult[j].jine * 100);

                    if (queryResult[j].shouzhi == "支出预算") {
                      if (queryResult[j].currPercent >= 100) {
                        message.push("[" + queryResult[j].accountType1 + "]" + (queryResult[j].accountType2 == "全部" ? "" : "[" + queryResult[j].accountType2 + "]") + queryResult[j].zhouqi + queryResult[j].shouzhi + "已经超过了o( =•ω•= )m");
                        messageType.push("error");
                        warnObjs.push(queryResult[j]);
                      } else if (queryResult[j].currPercent >= queryResult[j].yujing) {
                        message.push("[" + queryResult[j].accountType1 + "]" + (queryResult[j].accountType2 == "全部" ? "" : "[" + queryResult[j].accountType2 + "]") + queryResult[j].zhouqi + queryResult[j].shouzhi + "已经到达警戒值了o( =•ω•= )m");
                        messageType.push("warning");
                        warnObjs.push(queryResult[j]);
                      }
                    }
                    if (queryResult[j].shouzhi == "收入目标") {
                      if (queryResult[j].currPercent >= 100) {
                        message.push("[" + queryResult[j].accountType1 + "]" + (queryResult[j].accountType2 == "全部" ? "" : "[" + queryResult[j].accountType2 + "]") + queryResult[j].zhouqi + queryResult[j].shouzhi + "已经完成了，666o( =•ω•= )m");
                        messageType.push("success");
                        warnObjs.push(queryResult[j]);
                      } else if (queryResult[j].currPercent >= queryResult[j].yujing) {
                        message.push("[" + queryResult[j].accountType1 + "]" + (queryResult[j].accountType2 == "全部" ? "" : "[" + queryResult[j].accountType2 + "]") + queryResult[j].zhouqi + queryResult[j].shouzhi + "已经到达提醒值了，加油哟o( =•ω•= )m");
                        messageType.push("default");
                        warnObjs.push(queryResult[j]);
                      }
                    }
                  }
                  var ii = 0;
                  for (var i = 0; i < message.length; i++) {
                    setTimeout(function() {
                      this_.showMessage(message[ii], messageType[ii], 2)
                      if (warnObjs[ii].indexWarn == 1) {
                        db.collection('budget').doc(warnObjs[ii]._id).update({
                          // data 传入需要局部更新的数据
                          data: {
                            // 表示将 done 字段置为 true
                            warned: 1
                          },
                          success(res) {
                            console.log("将字段设置为已提醒成功", res.data)
                          }
                        })
                      }
                      ii++;
                    }, i * 2100);
                  }
                }
              })

            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '查询记录失败'
              })
              console.error('查找记录失败：', err)
            }
          })

        console.log(datas);
        // 在返回结果中会包含新创建的记录的 _id,并重置金额和备注
        this.setData({
          counterId: res._id,
          jine: "",
          jineStr: "0.00",
          beizhu: ''
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
  //点击最近记录旁边的问号显示帮助
  touchHelp: function(e) {
    wx.showToast({
      icon: "none",
      title: '展示最近五条记录，左滑可删除。',
      duration: 3000
    })
  },
  //滑动屏幕事件
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
      console.log("x轴偏移量:" + disX);
      console.log("y轴偏移量:" + disY);
      if (disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
        delStyle = "width:0px;";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        delStyle = "width:60px;";
        delStyleArr = new Array();
      }
      //只有当x移动距离大于y移动距离才触发
      if ((disX >= 0 ? disX : disX * -1) > (disY >= 0 ? disY : disY * -1)) {
        var index = e.currentTarget.dataset.index;
        delStyleArr[index] = delStyle;
        this.setData({
          delStyle: delStyleArr
        });
      }
    }
  },
  //删除一条记录
  delItem: function(e) {
    var id = e.currentTarget.dataset.id;
    wx.showToast({
      icon: 'loading',
      title: '删除中'
    })
    const db = wx.cloud.database();
    db.collection('accounts').doc(id).remove({}).then(
      res => {
        this.queryAccountRecord();
        this.setData({
          delStyle: []
        });
        wx.showToast({
          icon: 'success',
          title: '删除成功'
        })
      }
    )
  },
  // 查找当前用户的记账分类
  queryAccountType: function(shouzhi) {
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
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].jineStr == undefined) {
              res.data[i].jineStr = app.numberFormat(res.data[i].jine, 2, ".", ",");
            }
          }
          this.setData({
            queryResult: res.data
          })
          console.log('查找最近的记账记录成功: ', res);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('查找最近的记账记录失败：', err)
        }
      })
  },
  showMessage(message, type, duration) {
    $Message({
      content: message,
      type: type,
      duration: duration
    });
  },
})