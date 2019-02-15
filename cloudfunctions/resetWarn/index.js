// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async(event, context) => {
  try {
    await db.collection('budget').where({
      zhouqi: "月度"
    })
      .update({
        data: {
          warned: 0
        },
      }).then(res => {
        console.error("更新成功", res);
      })
  } catch (e) {
    console.error(e)
  }
}