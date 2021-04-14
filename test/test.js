

function f1({url,method="get",data={},params={}}) {
  console.log(url,method,data,params);
}

f1({url:"this is a url",method:"post"});

let a = "name:zhang", b = 11;
let obj = {a,b,c:"cc"};
console.log(obj);