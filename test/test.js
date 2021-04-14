

function f1({url,method="get",data={},params={}}) {
  console.log(url,method,data,params);
}

f1({url:"this is a url",method:"post"});