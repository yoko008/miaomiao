// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  console.log("传入的event为", event);
  const wxContext = cloud.getWXContext()
  var id = event.id;
  var users = event.users;
  var nickName = event.nickName;
  users.push({
    nickName: nickName,
    openid: wxContext.OPENID
  })
  db.collection('account_book').where({
    _id: id
  }).get({
    success: res => {
      console.log("当前账本信息：", res.data[0])
      if (res.data[0].users.length < 5) {
        for (var i = 0; i < res.data[0].users.length;i++){
          if (wxContext.OPENID == res.data[0].users[i].openid){
            return "你已经是该账本成员";
          }
        }
        db.collection('account_book').doc(id).update({
          // data 传入需要局部更新的数据
          data: {
            // 表示将 done 字段置为 true
            users: users
          },
          success(res) {
            console.log(res.data)
            return users;
          }
        })
      }
      else{
        return "成员已满";
      }
    },
    fail: err => {
      console.error('获取账本信息失败', err)
      return "获取账本信息失败";
    }
  })
  
}