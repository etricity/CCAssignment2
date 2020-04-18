//Dependenices
var express = require('express');
var router = express.Router();
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var request = require('request');
var async = require('async');
var firebase = require('./firebase');

//Spotify authentication variables
var client_id = '648d57bb4a724393b2bafbb05b3c73d3';
var client_secret = 'c7e90286a3d34adbbfea4487e01544b7';
var redirect_uri = 'https://spade-274202.ts.r.appspot.com/spotify/callback';
var stateKey = 'spotify_auth_state';

//Comment out line below for GCP : Uncomment line to test locally (localhost 8080)
redirect_uri = 'http://localhost:8080/spotify/callback';



//Spotify Authentication Login & Redirect to main page (router.get'/spotify')
router.get('/login', function(req, res, next) {
  var state = generateRandomString(16);
  var scope = 'user-read-private user-read-email playlist-read-private streaming';
  res.cookie(stateKey, state);

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      client_id: client_id,
      response_type: 'code',
      redirect_uri: redirect_uri,
      scope: scope,
      state: state
    }));

});

//Callback after Spotify Authentication (Redirected to main page)
router.get('/callback', function(req, res, next) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var cookieState = req.cookies ? req.cookies[stateKey] : null;

  //Reached this page witout correct authentication
  if (state === null || state !== cookieState) {
    res.render('error', {
      message: 'State Mismatch!'
    });
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
      //IF no Request Error
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        //Use token to access user data through Spotify API
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          json: true
        };
        request.get(options, function(error, response, body) {
          //Log user data
          if (!error && response.statusCode == 200) {
            console.log('User Data: ', body);
            firebase.logUser(body);
          }
        });

        //Success --> redirected to main page
        res.redirect('/spotify/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
        //Fail-->
      } else {
        res.redirect('/spotify/login');
      }
    });
  }
});

//Main page (/spotify)
router.get('/', function(req, res, next) {
  res.render('main');
});

router.get('/search', function(req, res, next) {

  var data = [];

  //Waterfall runs array of functions asynchronously
  async.waterfall([

    //Get track data W1
    function(callback) {
      var url = 'https://api.spotify.com/v1/search?';
      url += querystring.stringify({
        q: req.query.song_name,
        type: 'track',
        limit: '1'
      });

      //Use token to access Spotify API
      var options = {
        url: url,
        headers: {
          'Authorization': 'Bearer ' + req.query.access_token
        },
        json: true
      };
      request.get(options, function(error, response, trackData) {
            if (!error && response.statusCode == 200) {
        console.log('Track Data:', trackData);
        data.push(trackData);
        //Passes trackData to W2
        callback(null, trackData);
      }
      });

      //Get artist & album data
      //W2
    },
    function(trackData, callback) {

      //Parallel runs array of functions synchronously
      async.parallel([

        //Get artist data P1
        function(paraCB) {
          var url = 'https://api.spotify.com/v1/search?';
          url += querystring.stringify({
            q: trackData.tracks.items[0].artists[0].name,
            type: 'artist',
            limit: '1'
          });

          var options = {
            url: url,
            headers: {
              'Authorization': 'Bearer ' + req.query.access_token
            },
            json: true
          };
          request.get(options, function(error, response, artistData) {
              if (!error && response.statusCode == 200) {
            console.log('Artist Data:', artistData);
            //Adds artistData to parallel result
            paraCB(null, artistData);
          }
          });
        },

        //Get Album data P2
        function(paraCB) {
          var url = 'https://api.spotify.com/v1/search?';
          url += querystring.stringify({
            q: trackData.tracks.items[0].album.name,
            type: 'album',
            limit: '1'
          });

          var options = {
            url: url,
            headers: {
              'Authorization': 'Bearer ' + req.query.access_token
            },
            json: true
          };
          request.get(options, function(error, response, albumData) {
              if (!error && response.statusCode == 200) {
            console.log('Album Data:', albumData);
            //Adds albumData to parallel result
            paraCB(null, albumData);
          }
          });
        }
        //Callback method for Parallel
      ], function paraCB(error, results) {
        //Fuses W1 & W2 data together
        data.push.apply(data, results);
        //Passes data to Waterfall callback
        callback(null, data);
      });
    }
  ], function callback(err, result) {
      if (!err) {
        //Sends data to the client as an array of JSON Objects {trackData, artistData, albumData}
        firebase.saveSearch(result[0]);
          res.send(result);
      }
  });
});

//Webplayer API
router.get('/webplayer', function(req, res, next) {
  res.render('webplayer');
});


//Utility methods

//Helps autenticate user
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


module.exports = router;
