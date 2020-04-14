var express = require('express');
var router = express.Router();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

//test purposes only

var client_id = '648d57bb4a724393b2bafbb05b3c73d3'; // Your client id
var client_secret = 'c7e90286a3d34adbbfea4487e01544b7'; // Your secret
var redirect_uri = 'https://spade-274202.ts.r.appspot.com/spotify'; // Your redirect uri
    //Uncomment this to test locally!
//redirect_uri = 'http://localhost:8080/spotify';

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

router.get('/', function(req, res, next) {
      res.render('test', { message: 'Sussessful Login' });
});

router.get('/searchSong', function(req, res, next) {
    
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
