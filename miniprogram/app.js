//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
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
      ],
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
    var z = 0;
    for (var i = numberArr[0].length - 1; i >= 0; i--) {
      if (z != 0 && z % 3 == 0) {
        intnum = thousands_sep + intnum;
      }
      intnum = numberArr[0].substring(i, i + 1) + intnum;
      z++;
    }
    if (length == 1) {
      intnum = intnum + dec_point + "00";
    }
    if (length > 1) {
      if (numberArr[1].length == 1) {
        intnum = intnum + dec_point + numberArr[1] + "0";
      }
      if (numberArr[1].length == 2) {
        intnum = intnum + dec_point + numberArr[1];
      }
      if (numberArr[1].length > 2) {
        var n = Math.round(parseFloat(numberArr[1].substring(0, decimals) + "." + numberArr[1].substring(decimals, decimals + 2)))
        n = n < 10 ? "0" + n : n;
        intnum = intnum + dec_point + n;
      }
    }

    return intnum;
  },
  //获取日期时间戳
  getDateTimeMill: function(date, time) {
    console.log("公共函数getDateTimeMill获取的date为", date);
    console.log("公共函数getDateTimeMill获取的time为", time);
    if (!date || typeof(date) === "string") {
      console.log("参数异常，请检查...");
    }
    var y = date.getFullYear(); //年
    var m = date.getMonth(); //月
    var d = date.getDate(); //日
    var times = time.split(":");
    var hh = times[0];
    var mm = times[1];
    var ss = times[2];
    var datetime = new Date(y, m, d, hh, mm, ss).getTime();
    console.log("公共函数getDateTimeMill返回的时间戳为", datetime);
    return datetime;
  }
})