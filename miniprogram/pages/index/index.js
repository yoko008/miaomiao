Page({
  data: {
    accountTypeArray:null,
    multiArray: null,
    multiIndex: [0, 0],
    date: '2018-11-15',
    time: '12:01',
     step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: [],
  },
  //加载页面时触发
  onLoad: function () {

    const db = wx.cloud.database()
    // 加载当前用户的记账类型
    db.collection('account_type').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          accountTypeArray: res.data[0],
          multiArray: [res.data[0].level1, res.data[0].level2[0]]
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  onReady: function () {
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column==0)
    data.multiArray[1] = this.data.accountTypeArray.level2[e.detail.value];
    this.setData(data);
  },


  

  onAdd: function () {
    const db = wx.cloud.database()
    db.collection('accounts').add({
      data: {
        shouzhi:1,
        jine: 1,
        beizhu:"买菜的",
        accountType1:"吃喝",
        accountType2: "早餐",
        date:"2018-11-15",
        time:"12:01",
        creatTime:new Date(),
        updateTime:new Date()
      },
      success: res => {
        // 在返回结果中会包含新创建的记录的 _id
        this.setData({
          counterId: res._id,
          count: 1
        })
        wx.showToast({
          title: '保存成功',
        })
        console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  onQuery: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('account_type').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          accountTypeArray: res.data[0],
          multiArray: [res.data[0].level1, res.data[0].level2[0]]
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
})