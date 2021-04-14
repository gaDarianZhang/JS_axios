let express = require("express");
let app = express();
app.use(express.urlencoded({extended:true}))

app.delete("/testDelete",(req,res)=>{
  console.log(req.query);
  console.log(req.body);
  res.send("200");
})

app.listen(3000,(err)=>{
  if(err){console.log("服务器启动失败"+err);return;}
  console.log("服务器启动成功");
})