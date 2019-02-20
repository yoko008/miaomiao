const cloud = require('wx-server-sdk')
cloud.init();
const db = cloud.database();
const _ = db.command;
const MAX_LIMIT = 100
exports.main = async(event, context) => {
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()

  console.log("传入的event为", event);
  var accountType1 = event.accountType1;
  var shouzhi = event.shouzhi;
  console.log("传入的startDate为", event.startDate);
  var startDate = event.startDate == undefined ? undefined : parseInt(event.startDate.toString());
  console.log("处理后的的startDate为", startDate);
  console.log("传入的endDate为", event.endDate);
  var endDate = event.endDate == undefined ? undefined : parseInt(event.endDate.toString());
  console.log("处理后的的endDate为", endDate);
  var data = {};
  data._openid = OPENID;
  console.log("当前的openid为", OPENID);

  if (accountType1 != null && accountType1 != undefined && accountType1 != "") {
    data.accountType1 = accountType1;
  }
  if (shouzhi != null && shouzhi != undefined && shouzhi != "") {
    data.shouzhi = shouzhi;
  }
  if (startDate != null && startDate != undefined && startDate != "" && endDate != null && endDate != undefined && endDate != "") {
    data.datetime = _.gte(startDate).and(_.lte(endDate))
  } else {
    if (startDate != null && startDate != undefined && startDate != "") {
      data.datetime = _.gte(startDate)
    }
    if (endDate != null && endDate != undefined && endDate != "") {
      data.datetime = _.lte(endDate)
    }
  }
  console.log("最后处理后的data为", data);
  // 先取出集合记录总数

  const countResult = await db.collection('accounts').where(data).count()
  const total = countResult.total
  console.log("查询到的总数为", total);
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('accounts').where(data).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  console.log("打印一下tasks", tasks);
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  }, {
    data: [],
    errMsg: "云函数gitListByAccounts查询成功"
  })
}