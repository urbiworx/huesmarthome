var discovery = require('./discovery');
var ipadress = require('./ipadress');
var http = require ('http');
var network = require ('network');
var fs = require('fs');
discovery.enableDiscovery();
console.log(ipadress.getIpAddress());
var mac;
var gateway;
var netmask;
var ip;
var username=null;
var delay=2;
var debug=false;
network.get_active_interface(function(err, obj) {
	mac=obj.mac_address;
	gateway=obj.gateway_ip;
	netmask=obj.netmask;
	ip=obj.ip_address;
	console.log(mac+" "+gateway+" "+netmask+" "+ip);
});

function createLight(name,on,bri){
		return{
			  "state":
			  {
				"on":on,
				"bri":bri,
				"hue":13234,
				"sat":208,
				"xy":[0.5090,0.4149],
				"ct":459,
				"alert":"none",
				"effect":"none",
				"colormode":"ct",
				"reachable":true
			  },
			  "type": "Extended color light",
			  "name": name,
			  "modelid": "LCT001",
			  "swversion": "66009461",
			  "pointsymbol":
			  {
				"1":"none",
				"2":"none",
				"3":"none",
				"4":"none",
				"5":"none",
				"6":"none",
				"7":"none",
				"8":"none"
			  }
		};
	}

	function handleApi(res){	
		var date=(new Date()).getUTCFullYear()+"-"+pad(((new Date()).getUTCMonth()+1),2)+"-"+pad((new Date()).getUTCDate(),2)+"T"+pad((new Date()).getUTCHours(),2)+":"+pad((new Date()).getUTCMinutes(),2)+":"+pad((new Date()).getUTCSeconds(),2);
		console.log("Handle Api");
		var ret=
		{
		  "lights":
		  {
		  },
		  "groups": {},
		  "config":
		  {
			"name": "Philips hue",
			"mac": mac+"",
			"dhcp": false,
			"ipaddress": ip+"",
			"netmask": netmask+"",
			"gateway": gateway+"",
			"proxyaddress": "",
			"proxyport": 0,
			"UTC": date,
			"whitelist":{},
			"swversion": "01003372",
			"swupdate":
			{
			  "updatestate":0,
			  "url":"",
			  "text":"",
			  "notify": false
			},
			"linkbutton": false,
			"portalservices": false
		  },
		  "schedules": {}
		};
		ret.config.whitelist[username]={
			"last use date": date,
				"create date": "2014-11-01T21:04:48",
				"name": "SmartHome Controller"
			};
		ret.lights["1"]=createLight("Hallo1",true,Math.round(Math.random()*140.0));
		ret.lights["2"]=createLight("Hallo2",true,Math.round(Math.random()*140.0));
		ret.lights["3"]=createLight("Hallo3",true,Math.round(Math.random()*140.0));
		var payload=JSON.stringify(ret);
		res.end(payload,'utf8');	
		console.log(payload);
	}
	function searchLights(res){
		console.log("Search Lights");
		var ret=[ { "success": { "/lights": "Searching for new devices" } } ];
		console.log(JSON.stringify(ret));
		res.end(JSON.stringify(ret),'utf8');
	}
	function handleLights(res){
		console.log("Handle Lights");
		/*res.end('{\n'+
'  "1":\n'+
'  {\n'+
'    "name": "Test\n"'+
'  },\n'+
'  "2":\n'+
'  {\n'+
'    "name": "Test2"\n'+
'  }}n'+
'}\n');*/
		var ret={};
		ret["1"]=createLight("Hallo1",true,Math.round(Math.random()*140.0));
		ret["2"]=createLight("Hallo2",true,Math.round(Math.random()*140.0));
		ret["3"]=createLight("Hallo3",true,Math.round(Math.random()*140.0));
		var payload=JSON.stringify(ret);
		console.log(payload);
		res.end(payload,'utf8');	
	}
	
	
	function sendError(res,adress){	
	console.log("Send error:"+adress);
	res.end (
				'['+
				'  {'+
				'    "error":'+
				'    {'+
				'      "type":1,'+
				'      "address":"'+adress+'",'+
				'      "description":"unauthorized user"'+
				'    }'+
				'  }'+
				']');
	}
	
	function handleLogin(res,body){
		console.log("Handle Login");
			if (delay>0){
				var ret=[{'error':{'type':101,'address':'','description':'lnk button not pressed'}}];
				res.end (JSON.stringify(ret),'utf8');
				/*
				res.end(
				'['+
				' {'+
				'	"error":'+
				'	{'+
				'	  "type":101,'+
				'	  "address":"",'+
				'	  "description":"link button not pressed"'+
				'	}'+
				'  }'+
				']','utf8');*/
				console.log("Deny login");
				delay--;} 
			else {
				var parsedB=JSON.parse(body);
				username=parsedB.username;
				console.log("Login:"+parsedB.username);
				var ret=[{'success':{'username':username}}];
				res.end (JSON.stringify(ret),'utf8');
				/*res.end('['+
				'{'+
				'	"success":'+
				'	{'+
				'	"username":username'+
				'	}'+
				'}'+
				']');*/
			}
	}
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
		
http.createServer(function(req,res){
	console.log(req.method);
	console.log("start:"+req.url);
	res.setHeader('Cache-Control','no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
	res.setHeader('Pragma','no-cache');
	res.setHeader('Expires',(new Date()).toUTCString());
	res.setHeader('Connection', 'close');
	res.setHeader('Access-Control-Max-Age', '0');
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-type', 'application/json');
	res.writeHead(200);
	var body="";
       if(req.method == 'POST'||req.method == 'PUT'){
            req.on('data', function (data)
            {
                body += data;
            });
			req.on('end', function() {
				console.log("POST:"+body);
				if (debug){
					fs.writeFile((new Date()).getTime()+'_POST.log',body+"\n"+req.url);
				}
				if (req.url.indexOf("/api")!=-1){
					if(req.url.indexOf("/lights")!=-1){
						if (username==null){
							sendError(res,"/lights");
						} else {
							searchLights(res);
						}
					} else {
						if (username==null||body.indexOf("username")!=-1){
							handleLogin(res,body);
						} else {
							handleApi(res);
						}
					}
				}
				return;
			});
			return;
        }
		if (req.url.indexOf("/api")!=-1){
			if (debug){
				fs.writeFile((new Date()).getTime()+'_GET.log',req.url);
			}
			if(req.url.indexOf("/lights")!=-1){
				if (username==null){
					sendError(res,"/lights");
				} else {
					handleLights(res);
				}
			} else {
				if (username==null){
					sendError(res,"/");
				} else {
					handleApi(res);
				}
			}
			return;
		}
	/*
	if (req.url.indexOf("description.xml")!=-1){
		console.log("description");
		var readStream = fs.readFileSync("description.xml")+"";
		res.end (readStream.replace("##URLBASE##",ipadress.getIpAddress()));
		return;
	}*/

	console.log("end:"+req.url);
	res.end("");

}).listen(80);