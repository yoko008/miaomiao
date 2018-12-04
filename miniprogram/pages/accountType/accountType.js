Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    addType: "",
    shouzhi:"",
    type:"",
    index:0,
    currIndex:0,
    accountType:[],
    txtStyle:[],
    delStyle:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      shouzhi: options.shouzhi,
      type: options.type,
    })
    if (options.type == '2') {
      this.setData({
        index: options.index
      })
    }
    this.queryAccountType();
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
  //新增字段修改
  typeChange:function(e){
    this.setData({
      addType:e.detail.value.substring(0,16)
    })
  },
  touchM: function (e) {
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
      var txtStyle = "";
      var delStyle = "";
      var txtStyleArr = this.data.txtStyle;
      var delStyleArr = this.data.delStyle;
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "left:0px";
        delStyle = "right:-80px;";
      } else if (disX > 2) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-80px";
        delStyle = "right:0px;";
        txtStyleArr = new Array();
        delStyleArr = new Array();
      }
      //获取手指触摸的是哪一项
      if ((disX >= 0 ? disX : disX * -1) > (disY >= 0 ? disY : disY * -1)) {
      var index = e.currentTarget.dataset.index;
      txtStyleArr[index] = txtStyle;
      delStyleArr[index] = delStyle;
      this.setData({
        txtStyle: txtStyleArr,
        delStyle: delStyleArr
      });
      }
    }
  },
  delItem:function(e){
    var index = e.currentTarget.dataset.index;
    wx.showToast({
      icon: 'loading',
      title: '删除中'
    })
    if (this.data.type == '1') {
      const db = wx.cloud.database();
      var datas = this.data.accountTypeTotal;
      var level1 = this.data.accountTypeTotal.level1;
      var level2 = this.data.accountTypeTotal.level2;
      level1.splice(index, 1);
      level2.splice(index, 1);
      if (level1.length == 0) {
        wx.showToast({
          icon:"none",
          title: '至少要保留一项'
        });
        return;
      }
      db.collection('account_type').doc(this.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          level1: level1,
          level2: level2
        }
      }).then(
        res => {
          wx.showToast({
            icon: 'success',
            title: '删除成功'
          });
          this.setData({
            txtStyle: [],
            delStyle: []
          });
          console.log(this.data);
          this.queryAccountType();
        }
      )
    }

    if (this.data.type == '2') {
      const db = wx.cloud.database();
      var datas = this.data.accountTypeTotal;
      var level2 = this.data.accountTypeTotal.level2;
      level2[this.data.index].splice(index, 1);
      if (level2[this.data.index].length==0){
        wx.showToast({
          icon: "none",
          title: '至少要保留一项'
        });
        return;
      }
      db.collection('account_type').doc(this.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          level2: level2
        }
      }).then(
        res => {
          wx.showToast({
            icon: 'success',
            title: '删除成功'
          });
          this.setData({
            txtStyle: [],
            delStyle: []
          });
          console.log(this.data);
          this.queryAccountType();
        }
      )
    }
  },
  //点击新增一条
  addOneType:function(){
    if (this.data.addType == '' || this.data.addType == null){
      wx.showToast({
        icon: 'none',
        title: '类型不能为空'
      })
      return;
    }
    wx.showToast({
      icon: 'loading',
      title: '保存中'
    })
    if(this.data.type=='1'){
      const db = wx.cloud.database();
      const _ = db.command;
      db.collection('account_type').doc(this.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          level1: _.push(this.data.addType),
          level2: _.push([["其他"]])
        }
      }).then(
        res => {
            wx.showToast({
              icon: 'success',
              title: '保存成功'
            });
            console.log(this.data);
            this.setData({
              addType: ""
            });
            this.queryAccountType();
        }
      )
    }
    if (this.data.type == '2') {
      const db = wx.cloud.database();
      const _ = db.command;
      var datas = this.data.accountTypeTotal;
      datas.level2[this.data.index].push(this.data.addType);
      db.collection('account_type').doc(this.data.id).update({
        // data 传入需要局部更新的数据
        data: {
          level2: datas.level2
        }
      }).then(
        res => {
          wx.showToast({
            icon: 'success',
            title: '保存成功'
          });
          console.log(this.data);
          this.setData({
            addType: ""
          });
          this.queryAccountType();
        }
      )
    }
  },
  // 查找当前用户的记账分类
  queryAccountType: function() {
    wx.showToast({
      icon: 'loading',
      title: '加载数据中',
      duration:10000
    })
    const db = wx.cloud.database()
    db.collection('account_type').where({
      _openid: this.data.openid,
      accountType: this.data.shouzhi
    }).get({
      success: res => {
        if (res.data.length == 0) {
          wx.showToast({
            icon: 'loading',
            title: '初始化记账类型'
          })
          var level1;
          var level2;
          if (this.data.shouzhi == "支出") {
            level1 = this.data.zhichuLevel1;
            level2 = this.data.zhichuLevel2;
          }
          if (this.data.shouzhi == "收入") {
            level1 = this.data.shouruLevel1;
            level2 = this.data.shouruLevel2;
          }
          db.collection('account_type').add({
            data: {
              accountType: this.data.shouzhi,
              level1: level1,
              level2: level2
            },
            success: res => {
              wx.showToast({
                title: '初始化成功',
              })
              console.log('初始化记账类型成功，记录 _id: ', res._id);
              this.queryAccountType();
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '初始化失败'
              })
              console.error('初始化记账类型失败：', err)
            }
          })
        }
        else{
          wx.hideToast();
          this.setData({
            id: res.data[0]._id
          });
          if (this.data.type == '1') {
            this.setData({
              accountTypeTotal: res.data[0],
              accountType: res.data[0].level1,
              accountTypeLength: res.data[0].level1.length
            })
          }
          if (this.data.type == '2') {
            this.setData({
              accountTypeTotal: res.data[0],
              accountType: res.data[0].level2[this.data.index],
              accountTypeLength: res.data[0].level2[this.data.index].length
            })
          }
          console.log('查找当前记账类型成功: ', res)
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
})