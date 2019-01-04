// 云函数入口文件
const cloud = require('wx-server-sdk')

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
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const task = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('set_time_out').where({
      state: 1
    }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    task.push(promise)
  }
  //获取时间戳
  var date = new Date();
  var timestamp = date.getTime();
  date = new Date(timestamp);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  var d = date.getDate();
  var hh = date.getHours();
  var mm = date.getMinutes();
  
  var dateStr = y + "-" + m + "-" + d;
  var time = hh + ":" + mm;
  // 等待所有
  var tasks = (await Promise.all(task)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  }, { data: [], errMsg: "云函数gitListByAccounts查询成功" })
  tasks = tasks.data;
  console.log("task="+tasks);
  for (let i = 0; i < tasks.length; i++) {
    if(tasks.zhouqi=="每周"){

    }
    var datas = {
      shouzhi: tasks[i].shouzhi,
      jine: tasks[i].jine,
      beizhu: tasks[i].beizhu,
      accountType1: tasks[i].accountType1,
      accountType2: tasks[i].accountType2,
      date: dateStr,
      time: time,
      datetime: timestamp,
      creatTime: new Date().getTime(),
      updateTime: new Date().getTime(),
      isSetTimeOut: 1,
      _openid: tasks[i]._openid
    }
    db.collection('accounts').add({
      data: datas
    })

  }
}