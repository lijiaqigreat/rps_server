var http= require("http");
var base64= require("base-64");
var AWS = require("aws-sdk");
AWS.config.apiVersion="2014-11-11";
AWS.config.region="us-west-2";
var dynamodb = new AWS.DynamoDB();
var tmp={};
module.exports=tmp;
http.createServer(function (req, res) {
  var data="";
  req.on('data',function(_data){
    data+=_data;
  });
  req.on('end',function(){
    console.log(data);
    tmp.data=data;
    function p(a){return JSON.parse('{"' + decodeURI(a.replace(/&/g, "\",\"").replace(/=/g,"\":\"")) + '"}');}
    data=p(data);
    console.log(data);
    var param={
      Item:{
        hash:{
          S:data.hash
        },
        time:{
          N:Date.now()+""
        },
        name:{
          S:unescape(data.name)
        },
        hist:{
          B:new Buffer(base64.decode(unescape(data.hist)))
        }
      },
      TableName:"games",
      ReturnConsumedCapacity: "INDEXES",
      ReturnItemCollectionMetrics: "SIZE"
    }
    var test=dynamodb.putItem(param,function(err,data){
      if(err) console.log(err);
      else    console.log(data);
    });
  });
  tmp.req=req;
  var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  console.log(ip);
  res.writeHead(200, {'Content-Type': 'text/plain','Access-Control-Allow-Origin':'*'});
  
  res.end(req+"");
}).listen(80);


