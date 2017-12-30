var express = require('express');
var app = express();
var request = require('request');

app.use(express.static(__dirname + "/public")); // required to get stylesheets in header.ejs to work
app.set('view engine', 'ejs');

app.get('/', function(req, res){
    request('https://api.coinmarketcap.com/v1/ticker/?limit=10', function(error, response, body){
        if(!error && response.statusCode == 200) {
            var data = JSON.parse(body)
            res.render('showcoins', {data: data});
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function(){
    console.log('Server started.');
})