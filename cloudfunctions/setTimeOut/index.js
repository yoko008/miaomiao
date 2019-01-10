// 云函数入口文件
const cloud = require('wx-server-sdk')
const data = {
  array: ['每天', '每周', '每月', '每年'],
  arrayWeek: ['周一', '周二', '周三', '周四', '周五', '周六', '周日', '周一至周五', '周末'],
  arrayMonth: ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号', '最后一天'],
  arrayYear: [
    ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    ['1号', '2号', '3号', '4号', '5号', '6号', '7号', '8号', '9号', '10号', '11号', '12号', '13号', '14号', '15号', '16号', '17号', '18号', '19号', '20号', '21号', '22号', '23号', '24号', '25号', '26号', '27号', '28号', '29号', '30号', '31号']
  ]
};
cloud.init()
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100;
// 云函数入口函数
exports.main = async(event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('set_time_out').where({
    state: 1
  }).count()
  const total = countResult.total
  console.log("总共需要取出的条数：" + total);
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  console.log("总共需要取出的页数：" + batchTimes);
  // 承载所有读操作的 promise 的数组
  const task = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('set_time_out').where({
      state: 1
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    task.push(promise)
  }
  // 等待所有
  var tasks = (await Promise.all(task)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  }, {
    data: [],
    errMsg: "云函数查询成功"
  })
  tasks = tasks.data;
  console.log("成功取出数据 [" + tasks.length + "] 条");
  //获取时间戳
  var date = new Date();
  var timestamp = date.getTime();
  date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var hh = date.getHours() + 8;
  var mm = date.getMinutes();
  var ww = date.getDay();
  var dateStr = y + "-" + m + "-" + d;
  var time = hh + ":" + mm;
  console.log("当前时间：" + dateStr + " " + time + " 星期" + ww);
  console.log("当前时间戳：" + timestamp);

  var count = 0;
  for (let i = 0; i < tasks.length; i++) {
    console.log("开始处理第 [" + (i + 1) + "] 条数据：");
    var tf = false;
    if (tasks[i].zhouqi == "每天") {
      tf = true;
      console.log("第 [" + (i + 1) + "] 条数据[每天]存储；");
    }
    if (tasks[i].zhouqi == "每周") {
      console.log("第 [" + (i + 1) + "] 条数据[每周][" + data.arrayWeek[tasks[i].indexWeek] + "]存储；");
      if (tasks[i].indexWeek == ww - 1 || (tasks[i].indexWeek == 6 && ww == 0) || (tasks[i].indexWeek == 7 && ww >= 1 && ww <= 5) || (tasks[i].indexWeek == 8 && (ww == 6 || ww == 0))) {
        tf = true;
      }
    }
    var day = new Date(y, m, 0);
    if (tasks[i].zhouqi == "每月") {
      console.log("第 [" + (i + 1) + "] 条数据[每月][" + data.arrayMonth[tasks[i].indexMonth] + "]存储，；");
      if (tasks[i].indexMonth == d - 1 || (tasks[i].indexMonth == 31 && d == day.getDate)) {
        tf = true;
      }
    }
    if (tasks[i].zhouqi == "每年") {
      console.log("第 [" + (i + 1) + "] 条数据[每年][" + data.arrayYear[0][tasks[i].indexYear[0]] + "][" + data.arrayYear[1][tasks[i].indexYear[1]] + "]存储；");
      if (tasks[i].indexYear[0] + 1 == m && tasks[i].indexYear[1] + 1 == d) {
        tf = true;
      }
    }
    if (tf) {
      console.log("开始添加数据。。。。。。");
      var datas = {
        shouzhi: tasks[i].shouzhi,
        jine: tasks[i].jine,
        beizhu: "[定时任务]"+tasks[i].beizhu,
        accountType1: tasks[i].accountType1,
        accountType2: tasks[i].accountType2,
        date: dateStr,
        time: time,
        datetime: timestamp,
        creatTime: new Date().getTime(),
        updateTime: new Date().getTime(),
        isSetTimeOut: 1,
        setTimeOutId: tasks[i]._id,
        _openid: tasks[i]._openid
      }
      await db.collection('accounts').add({
        data: datas
      }).then(res => {
        count++;
        console.log('添加第 [' + count + '] 条记录成功: ', res._id);
      })
    }
    console.log("--------------------------------------");
  }
  console.log("数据处理完毕,处理数据 [" + tasks.length + " ]条，成功添加 [" + count + "] 条");
}