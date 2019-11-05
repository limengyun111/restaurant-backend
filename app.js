const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const sqlite = require("sqlite")
// 创建socket.io连接
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")
const ioServer = io(server)
global.ioServer = ioServer
// 获取bossInfo文件
const bossInfo = require("./bossInfo")
const restaurant  = require("./restaurant")

const port = 3004

app.use(cors({
  origin:true,
  maxAge:86400,
  credentials:true,
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// 处理静态文件请求的中间件
app.use(express.static(__dirname+"/build"))
app.use(express.static(__dirname+"/static"))
// 处理请求图片的中间件，在upload文件夹下找

app.use("/upload",express.static(__dirname + "/upload/"))
// 处理餐厅管理者相关的请求
app.use("/api",bossInfo)
app.use("/api",restaurant)
 











server.listen(port,()=>{
  console.log("server is listen " + port)
})