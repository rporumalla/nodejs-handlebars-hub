var express = require('express');
var handlebars = require('express-handlebars');
var bodyparser = require('body-parser');
var session = require('express-session');
var net = require('net');

var app = express();
app.use(express.static(__dirname + "/public"));

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));

app.use(session({secret: "secret",  resave : true,  saveUninitialized : false}));

var routes = require('./routes/routes.js');

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({defaultLayout:'layout'}));

app.get('/', routes.loginHandler);
app.get('/logout', routes.logoutHandler);
app.get('/toLanding', routes.landingHandler);
app.post('/toCity', routes.cityHandler);


app.use("*", function(req, res) {
     res.status(404);
     res.render('404.handlebars', {});
});

app.use(function(error, req, res, next) {
     console.log('Error : 500::' + error);
     res.status(500);
     res.render('500.handlebars', {err:error});  // good for knowledge but don't do it
});


var port = process.env.PORT || 3000;

console.log("Checking the availability of port %d", port);
var netServer = net.createServer();
netServer.once('error', function(err) {
  if (err.code === 'EADDRINUSE') {
    console.log("port %d is currently in use", port);
  }
});

netServer.listen(port, function(){
	console.log('Net server is able to listen on port: ' + port);
	netServer.close();
	console.log('Closing Net server on port: ' + port);

	app.listen(port, function(){
		console.log('port %d is available. Hence starting the HTTP server on it.', port);
	});
});

