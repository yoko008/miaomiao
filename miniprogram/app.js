//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
    
  },
  numberFormat: function (number, decimals, dec_point, thousands_sep) {
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
  }

})
