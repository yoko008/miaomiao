let chart = null;

function initChart(canvas, width, height, F2) { // 使用 F2 绘制图表
  const data = [
    { year: '1月', sales: 38 },
    { year: '2月', sales: 52 },
    { year: '3月', sales: 61 },
    { year: '4月', sales: 145 },
    { year: '5月', sales: 48 },
    { year: '6月', sales: 38 },
    { year: '7月', sales: 38 },
    { year: '8月', sales: 52 },
    { year: '9月', sales: 61 },
    { year: '10月', sales: 145 },
    { year: '11月', sales: 48 },
    { year: '12月', sales: 38 }
  ];
  chart = new F2.Chart({
    el: canvas,
    width,
    height
  });

  chart.source(data, {
    sales: {
      tickCount: 5
    }
  });
  chart.tooltip({
    showItemMarker: false,
    onShow(ev) {
      const { items } = ev;
      items[0].name = null;
      items[0].name = items[0].title;
      items[0].value = '¥ ' + items[0].value;
    }
  });
  chart.interval().position('year*sales');
  chart.render();
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})