var http = require('http');
var fs= require('fs');
var async =require('asyncjs');
var ip=process.argv[2];

function log1(callback){
http.get("http://"+ip+"/api/1234554321", function(resp){
  resp.on('data', function(chunk){
    fs.writeFile("log_1.txt",chunk);
	callback(null);
  });
});
};

function log2(callback){
var req=http.request({
	hostname:ip,
	port:80,
	path:'/api',
	method:'POST'
	}, function(resp){
  resp.on('data', function(chunk){
    fs.writeFile("log_2.txt",chunk);
	callback(null);
  });
});
req.write('{"username":"1234554321","devicetype":"SmartHome Controller"}');
req.end();
};

function log3(callback){
http.get("http://"+ip+"/api/1234554321", function(resp){
  resp.on('data', function(chunk){
    fs.writeFile("log_3.txt",chunk);
	callback(null);
  });
});
};

function log4(callback){
http.get("http://"+ip+"/api/1234554321/lights", function(resp){
  resp.on('data', function(chunk){
    fs.writeFile("log_4.txt",chunk);
	callback(null);
  });
});
};

function log5(callback){
var req=http.request({
	hostname:ip,
	port:80,
	path:'/api/1234554321/lights',
	method:'POST'
	}, function(resp){
  resp.on('data', function(chunk){
    fs.writeFile("log_5.txt",chunk);
	callback(null);
  });
});
req.write('');
req.end();
};

function log6(callback){
http.get("http://"+ip+"/api/1234554321", function(resp){
  resp.on('data', function(chunk){
    fs.writeFile("log_6.txt",chunk);
	callback(null);
  });
});
};

async.list([log1,log2,log3,log4,log5,log6]).call().end(function(){console.log("thanks");});


