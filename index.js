var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var twitter = require('twitter');

var twitterClient = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

twitterClient.stream('statuses/filter', {track: 'ibes'}, function(stream){

 stream.on('data', function(tweet) {
   console.log('[NT] ' + tweet.user.name + ': ' + tweet.text);
   io.emit('new tweet', tweet);
 })

});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/pages/display.html');
});
app.get('/moderate', function(req, res){
  res.sendFile(__dirname + '/pages/moderation.html');
});

io.on('connection', function(socket){
  
  socket.on('approve tweet', function(tweet) {
    io.emit('display tweet', tweet);
    console.log('[AT] ' + tweet.user.name + ': ' + tweet.text);
  })
  
  socket.on('disconnect', function(){
    
  });
});

http.listen(process.env.PORT, function(){
  console.log('listening on *:' + process.env.PORT);
});