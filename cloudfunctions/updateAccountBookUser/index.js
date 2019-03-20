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
    return await db.collection('account_book').doc(id).update({
      // data 传入需要局部更新的数据
      data: {
        users: users
      }
    })
  } catch (e) {
    console.error(e)
  }
  //const res = db.collection('account_book').doc(id).get();
  //console.log("res:",res);
  //console.log("当前账本信息：", res.data[0])
  //db.collection('account_book').doc(id).get().then(res => {
    // res.data 包含该记录的数据
    //console.log("当前账本信息：", res.data[0])
    //if (res.data[0].users.length < 5) {
      // for (var i = 0; i < res.data[0].users.length; i++) {
      //   if (OPENID == res.data[0].users[i].openid) {
      //     return "你已经是该账本成员";
      //   }
      // }
      //db.collection('account_book').doc(id).update({
        // data 传入需要局部更新的数据
      //  data: {
          // 表示将 done 字段置为 true
       //   users: users
       // }
    //  });
  //   } else {
  //     return "成员已满";
  //   }
  // })

}