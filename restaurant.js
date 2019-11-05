const express = require("express")
const app = express.Router()
const cookieParser = require("cookie-parser")
const multer = require("multer")
const path = require("path")

// 根据桌号映射到菜单
var deskCartMap = new Map()
ioServer.on("connection",socket => {
  
  socket.on("join desk",desk => {
    
    socket.join(desk)

    var carFood = deskCartMap.get(desk)

    // 为每张桌子创建菜单
    if(!carFood) {
      deskCartMap.set(desk,[])
      
    }
    socket.emit("cart food",carFood || [])
      
  })
  socket.on("new food",info => {
    var foodAry = deskCartMap.get(info.desk)
    
    var idx = foodAry.findIndex(it => it.food.id === info.food.id)
	if(idx >= 0) {
		if(info.amount === 0) {
		  foodAry.splice(idx,1)
		} else {
			 foodAry[idx].amount = info.amount
   }
	} else {
	     foodAry.push({
         food: info.food,
         amount: info.amount,
       })
	 
  }
 


 

    ioServer.in(info.desk).emit("new food",info)
  })
})

var storage = multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null,"./upload/")
    
  },
  filename:function(req,file,cb) {
    cb(null,Date.now()+path.extname(file.originalname))
  }

})
const uploader = multer({storage:storage})

let db
(async function () {
  db = await require("./db")
}())

// 发送post请求时允许带cookie


app.use(cookieParser("secert"))
// 获取并返回将会在loading页面展示的信息，如餐厅名称，桌面名称
// localhost:3004/deskinfo?rid=1&did=2，发送过来的请求格式
app.get("/deskinfo",async (req,res,next) => {
 
  // 返回的形式是{"did":1,"uid":1,"name":"A01","title":"私房菜"}
  var desk = await db.get(`
  SELECT
    desks.id as did,
    bossInfo.id as uid,
    desks.name,
    bossInfo.title
    FROM desks JOIN bossInfo ON desks.rid=bossInfo.id
    WHERE desks.id=?
  `,req.query.did)
   console.log(desk)
   res.json(desk)
})

// 获取某个餐厅的菜单,
app.get("/menu/restaurant/:rid",async(req,res,next)=>{
   var menu = await db.all(`
     SELECT * FROM foods WHERE rid =? AND status="on" ` ,
     req.params.rid)
    console.log(menu)
     res.json(menu)
})

// 餐厅管理者菜品管理，获取和增加餐厅菜品
app.route("/restaurant/:rid/food")
 .get(async (req,res,next) => {
   var menu = await db.all(`
   SELECT * FROM foods WHERE rid =?`,
   req.params.rid)
   res.json(menu)
   
})
// {/* <input type="file" name="img"/> */}
.post(uploader.single("img"),async (req,res,next) => {
  console.log("req.file",req.file)
  
  // 增加菜品,发送过来的内容应该具有这些字段{name,img,price,category,status},rid从cookie中读取
  await db.run(`
    INSERT INTO foods (rid,name,img,price,category,status)
    VALUES (?,?,?,?,?,?)
  `,req.cookies.bossid, req.body.name,req.file.filename,req.body.price,req.body.category,req.body.status)
 
  var food = await db.get("SELECT * FROM foods ORDER BY id DESC LIMIT 1")
  res.json(food)
  
})

// 餐厅管理者菜品管理，删除和改变餐厅菜品
app.route("/restaurant/:rid/food/:fid")
  .delete(async (req,res,next) => {
    var food = await db.get(`
    SELECT * FROM foods WHERE id=? AND rid=?`, 
    req.params.fid,req.cookies.bossid
    )
    console.log(req.params.fid,req.cookies.bossid)
    if(food) {
      await db.run(
        `DELETE FROM foods WHERE id=? AND rid=?`,
        req.params.fid,req.cookies.bossid
      )
      delete food.id
      res.end("hello")
    }else{
      res.status(401).json({
        code:-1,
        msg:"不存在此菜品或者没有权限删除"
      })
    }
    
    

  })
  
  .put(uploader.single("img"), async (req,res,next) => {
   
     var food = await db.get(`
     SELECT * FROM foods WHERE id=? AND rid=?`, 
     req.params.fid,req.cookies.bossid
     )
     
     var newFoodInfo = {
       name: req.body.name ? req.body.name : food.name,
       price: req.body.price ? req.body.price : food.price,
       status: req.body.status ? req.body.status : food.status,
       desc: req.body.desc ? req.body.desc : food.desc,
       category: req.body.category ? req.body.category : food.category,
       img: req.file ? req.file.filename : food.img,
     }

     if(food) {

      await db.run(
         `UPDATE foods SET name=?,img=?,price=?,category=?,status=?,desc=? WHERE id=? AND rid=?
         `,
         newFoodInfo.name,newFoodInfo.img,newFoodInfo.price,newFoodInfo.category,newFoodInfo.status,newFoodInfo.desc,req.params.fid,req.cookies.bossid
       )
       var food = await db.get(`
       SELECT * FROM foods WHERE id=? AND rid=?`, 
       req.params.fid,req.cookies.bossid
       )
       
       res.json(food)
     }else{
       res.status(401).json({
         code:-1,
         msg:"不存在此菜品或者没有权限删除"
       })
     }
  })

// 餐厅管理者管理桌面，获取和增加桌子
app.route("/restaurant/:rid/desk")
 .get(async (req,res,next) => {

  var desk = await db.all(`
    SELECT * FROM desks WHERE rid=?`,
    req.cookies.bossid)
  
  res.json(desk)

})
.post(async (req,res,next) => {
  // 增加桌子
  await db.run(`
  INSERT INTO desks (rid,name,capacity) VALUES (?,?,?)`,
  req.cookies.bossid,req.body.name,req.body.capacity
  )

  var desk = await db.get("SELECT * FROM desks ORDER BY id DESC LIMIT 1")
  res.json(desk)
})

// 餐厅管理者桌子管理，删除和改变餐厅桌子
app.route("/restaurant/:rid/desk/:did")
  .delete(async (req,res,next) => {
    var desk = await db.get(`SELECT * FROM desks WHERE id=?AND rid=?`,req.params.did,req.cookies.bossid)

     if(desk) {
       await db.run(`DELETE FROM desks WHERE id =? AND rid=?`,req.params.did,req.cookies.bossid)
       delete desk.id
       res.json(desk)
     }else{
       res.status(401).json({
         code:-1,
         msg:"不存在此桌面或者没有权限删除"
       })
     }
  })
  .put(async (req,res,next) => {
    var did = req.params.did
    var bossid = req.cookies.bossid
    var desk = await db.get(`SELECT * FROM desks WHERE id=? AND rid=?`,did,bossid)
    if(desk) {

      await db.run(`UPDATE desks SET name=?,capacity=?
       WHERE id=? AND rid=?`,
       req.body.name,req.body.capacity,did,bossid
       )
       var desk = await db.get(`SELECT * FROM desks WHERE id=? AND rid=?`,did,bossid)
       res.json(desk)
    }else{
      res.status(401).json({
        code:-1,
        msg:"不存在此桌面或者没有权限删除"
      })
    }

  
  })


  // 订单管理
  app.route("/restaurant/:rid/desk/:did/order")
  // 发送过来的内容{rid,did,customCount,deskName,menuDetails status timestamp}
   
    .post(async(req,res,next) => {
    
      var rid = req.params.rid
      var did = req.params.did
      var customCount = req.body.count
      var deskName = req.body.deskName
      var menuDetails = JSON.stringify(req.body.foods)
      var status= "pending" //condirmed/completed
      var totalPrice = req.body.totalPrice
      var timestamp = new Date().toISOString()

      await db.run(`
        INSERT INTO orders  (rid,did,customCount,deskName, menuDetails,status,totalPrice,timestamp)
        VALUES (?,?,?,?,?,?,?,?)`,
        rid,did,customCount,deskName,menuDetails,status,totalPrice,timestamp)

        var order = await db.get(`SELECT * FROM orders ORDER BY id DESC LIMIT 1`)
       
        res.json(order)
        
        var desk = "desk:" + did

        // 新订单来的时候实时发送回去,并把当前桌面的订单清空
        deskCartMap.set("desk:" + did,[])
        ioServer.in(desk).emit("order success",order)
        ioServer.emit("new order",order)
    })
 
    // 餐厅管理者获取订单详情
    app.get("/restaurant/:rid/order",async(req,res,next)=>{
       var orders = await db.all(`SELECT * FROM orders WHERE rid=? ORDER BY timestamp DESC`,req.cookies.bossid)
       orders.forEach(order => {
         order.menuDetails = JSON.parse(order.menuDetails)
       })
       res.json(orders)
    })
    
 
    app.route("/restaurant/:rid/order/:oid")
      .delete(async(req,res,next) => {
        
         var order = await db.run(`SELECT * FROM orders WHERE 
         rid =? AND id =?
         `,req.cookies.bossid,req.params.oid)

         if(order) {
          await db.run(`DELETE FROM orders WHERE 
          rid =? AND id =?
          `,req.cookies.bossid,req.params.oid)
          delete order.id
          res.json({order})
    
         }else {
           res.status(401).json({
            code:-1,
            msg:"没有此订单或您无权限操作"
           })
         }
      })

      







module.exports = app




