// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  console.log("传入的event为", event);
  let {
    OPENID,
    APPID
  } = cloud.getWXContext()
  var id = event.id;
  var users = event.users;
  try {
    if (users.length > 0) {
      return await db.collection('account_book').doc(id).update({
        // data 传入需要局部更新的数据
        data: {
          users: users
        }
      })
    } else {
      return await db.collection('account_book').doc(id).remove()
    }
  } catch (e) {
    console.error(e)
  }
}