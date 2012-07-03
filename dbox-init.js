var dbox  = require("dbox"),
    stdin = process.stdin,
    stdout = process.stdout;

ask('App key', /^\S+$/, function(app_key) {
  ask('App secret', /^\S+$/, function(app_secret) {
    var app = dbox.app({ 'app_key': app_key, 'app_secret': app_secret });
    app.request_token(function(status, request_token){
      if(request_token){
        console.log('Please visit ', request_token.authorize_url, ' to authorize your app.');
        ask('Is this done? (yes)', /^yes$/, function(answer) {
          app.access_token(request_token, function(status, access_token){
            console.log('app_key: ' + app_key);
            console.log('app_secret: ' + app_secret);
            console.log('oauth_token: ' + access_token.oauth_token);
            console.log('oauth_token_secret: ' + access_token.oauth_token_secret);
            console.log('uid: ' + access_token.uid);
            process.exit();
          });
        });
      }
    });
  });
});

function ask(question, format, callback) {
 stdin.resume();
 stdout.write(question + ": ");

 stdin.once('data', function(data) {
   data = data.toString().trim();

   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });
}