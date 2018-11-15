Page({
  data: {
    multiArray: [['吃喝', '玩乐'], ['早餐', '午餐']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '吃喝'
        },
        {
          id: 1,
          name: '玩乐'
        }
      ], [
        {
          id: 0,
          name: '早餐'
        },
        {
          id: 1,
          name: '午餐'
        }
      ]
    ],
    multiIndex: [0, 0],
    date: '2018-11-15',
    time: '12:01'
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['早餐', '午餐'];
            break;
          case 1:
            data.multiArray[1] = ['电影', '运动'];
            break;
        }
    this.setData(data);
  }
})