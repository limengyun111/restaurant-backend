
const express = require("express")

const app = express.Router()
var cookieParser = require('cookie-parser')
app.use(cookieParser())

// 获取数据库信息
let db
(async function () {
  db = await require("./db")
}())

// 管理者登录后，通过id查出餐厅名称等信息
app.get("/userinfo",async (req,res,next) => {
  debugger
   var bossid = req.cookies.bossid
  
   if(bossid) {
    var user = await db.get('SELECT id,name,title FROM bossInfo WHERE id=?', bossid)
    
    res.json(user) 
   } else {
    res.status(404).json({
      code: -1,
      msg: '不存在此餐厅'
    })
  }
})
// 注册，先看是否存在，如果不存在就存到数据库中
app.route("/register")
   .post(async(req,res,next)=>{
     var regInfo = req.body
     var bossInfo = await db.get("SELECT * FROM bossInfo WHERE name=?",regInfo.name)
   
     if(bossInfo) {
       res.status(401).json({
         code:-1,
         msg:"用户名已被占用"
       })
     } else{
      
       await db.run("INSERT INTO bossInfo (name,email,password,title) VALUES(?,?,?,? )",regInfo.name,regInfo.email,regInfo.password,regInfo.title)

       res.json({
         code:0,
         msg:"注册成功"
       })
     }

   })

  app.post("/login",async(req,res,next)=>{
  
   
    var logInfo = req.body.values
    console.log("req.body",logInfo)
    var boss = await db.get("SELECT * FROM bossInfo WHERE name=? AND password=?",logInfo.username,logInfo.password)

    if(boss){
      console.log(1)
      res.cookie("bossid",boss.id)
      
      res.json(boss)
      
      
    }else{
      res.json({
        code:-1,
        msg:"登陆失败"
      })
    }
  })

  // 退出后使用cookie名清除cookie
 app.get("/logout",(req,res,next)=>{
  
   res.clearCookie("bossid")
   res.json({
     code:0,
     msg:"登出成功"
   })
  
 })


// 导出bossinfo这个中间件
   module.exports = app
