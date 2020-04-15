var express = require('express');
var router = express.Router();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');

//test purposes only

var client_id = '648d57bb4a724393b2bafbb05b3c73d3'; // Your client id
var client_secret = 'c7e90286a3d34adbbfea4487e01544b7'; // Your secret
var redirect_uri = 'https://spade-274202.ts.r.appspot.com/spotify/callback'; // Your redirect uri
    //Uncomment this to test locally!
redirect_uri = 'http://localhost:8080/spotify/callback';

var stateKey = 'spotify_auth_state';


//Spotify Authentication Login & Redirect to main page (router.get'/')
router.get('/login', function(req, res, next) {
//  res.render('test', { message: generateRandomString(16) });
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    
    var scope = 'user-read-private user-read-email playlist-read-private';
        
    res.redirect('https://accounts.spotify.com/authorize?' + 
                querystring.stringify({
      client_id: client_id,
      response_type: 'code',
      redirect_uri: redirect_uri,
      scope: scope,
      state: state
    }));
    
});

router.get('/callback', function(req, res, next) {
    
    
  var code = req.query.code || null;
  var state = req.query.state || null;
  var cookieState = req.cookies ? req.cookies[stateKey] : null;
    
      if (state === null || state !== cookieState) {
          res.render('error', { message: 'State Mismatch!' });
          //successful callback
  } else {
      res.clearCookie(stateKey);
      
      var authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          form: {
              code: code,
              redirect_uri: redirect_uri,
              grant_type: 'authorization_code'
          },
          headers: {
              'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
          },
          json: true
    };
      
    //Request access tokens
      request.post(authOptions, function(error, response, body) {
          //No Request Error
          if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        //Use token to access user data through Spotify API
        request.get(options, function(error, response, body) {
          console.log('LOGGING:' ,body);
        });

        res.redirect('/spotify/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/main' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
    
}
});

router.get('/', function(req, res, next) {
    res.render('main');
});





router.get('/search', function(req, res, next) {
    console.log(req.query);
    
    var url = 'https://api.spotify.com/v1/search?';
    url+= querystring.stringify({
        q: req.query.song_name, 
        type: 'track', 
        limit: '1'
    });
    
    console.log('URL: ', url);
    
       var options = {
          url: url,
          headers: { 'Authorization': 'Bearer ' + req.query.access_token },
          json: true
        };

        //Use token to access user data through Spotify API
        request.get(options, function(error, response, body) {
          console.log('LOGGING:' ,body);
            res.send(body);
        });
});





var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


module.exports = router;
