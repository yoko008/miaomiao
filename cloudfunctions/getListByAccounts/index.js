const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async(event, context) => {
  let { OPENID, APPID } = cloud.getWXContext()
  var accountType1 = event.accountType1;
  var shouzhi = event.shouzhi;
  var data ={};
  data._openid = OPENID;
  if( accountType1!=null && accountType1!=undefined &&accountType1!=""){
data.accountType1=accountType1;
  }
  if (shouzhi != null && shouzhi != undefined && shouzhi != "") {
    data.shouzhi = shouzhi;
  }
  // 先取出集合记录总数
  
  const countResult = await db.collection('accounts').where(data).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('accounts').where(data).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })
}