var express = require('express'),
    app = express.createServer(express.logger()),
    fs = require('fs'), 
    dropbox  = require("dbox").app({"app_key": process.env['dbox_app_key'], "app_secret": process.env['dbox_app_secret'] }),
    client = dropbox.createClient({oauth_token_secret: process.env['dbox_oauth_token_secret'], oauth_token: process.env['dbox_oauth_token'], uid: process.env['dbox_uid']});

app.use(express.static(__dirname+'/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('view options', { layout: false });
app.use(express.bodyParser());

app.get('/', function(req, res) {
    client.metadata(".", function(status, reply) {
        res.render('index', {
            content : reply
        });
    });
});

app.get('/:path', function(req, res) {
    var path = req.params.path;
    client.get(path, function(status, reply, metadata){
      res.send(reply);
    }); 
});

app.post('/', function(req, res) {
    var fileMeta = req.files['file-input'];
    if (fileMeta) {
        fs.readFile(fileMeta.path, function(err, data) {
            if (err) throw err;
            
            client.put(fileMeta.name, data, function(status, reply) {
                res.redirect('/');
            });
        });
    } else {
        res.redirect('/');
    }
});

var port = process.env['app_port'] || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
