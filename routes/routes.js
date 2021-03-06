//Dependenices
var express = require('express');
var router = express.Router();
var spotify = require('../backendJS/spotify.js');
var translator = require('../backendJS/translate.js');

router.get('/', function(req, res, next) {
  res.render('login');
});

router.get('/translate', function(req, res, next) {
  translator.translateText(req, res);
});

//Spotify Authentication Login & Redirect to main page (router.get'/spotify')
router.get('/spotify/login', function(req, res, next) {
  spotify.spotifyLogin(res);

});

//Callback after Spotify Authentication (Redirected to main page)
router.get('/spotify/callback', function(req, res, next) {
  spotify.loginCallback(req, res);
});

//Main page (/spotify)
router.get('/spotify/', function(req, res, next) {
  res.render('main');
});

//Searches for a song on Spotify given the user's search terms
router.get('/spotify/search', function(req, res, next) {
  spotify.searchTrack(req, res);
});

router.get('/spotify/addTrackToPlaylist', function(req, res, next) {
  spotify.addTrackToPlaylist(req, res);
});

//Webplayer API
router.get('/spotify/webplayer', function(req, res, next) {
  res.render('webplayer');
});

//Activity
router.get('/spotify/activity', function(req, res, next) {
  res.render('activity');
});

router.get('/spotify/addTopTracks', function(req, res, next) {
  spotify.addTopSongs(req, res);
});


module.exports = router;
