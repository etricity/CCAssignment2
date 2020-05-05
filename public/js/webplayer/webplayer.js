//Setting up Spotify Web Player

var vol = 0.5;
//Variable to acccess the player outside of the intialisation
var p;

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = params.access_token;
  const player = new Spotify.Player({
    name: 'S.P.A.D.E Web Player',
    volume: vol,
    getOAuthToken: cb => {
      cb(token);
    }
  });

  // Error handling
  player.addListener('initialization_error', ({
    message
  }) => {
    console.error(message);
    firebase.analytics().logEvent('initialization_error');
  });
  player.addListener('authentication_error', ({
    message
  }) => {
    console.error(message);
    firebase.analytics().logEvent('authentication_error');
  });
  player.addListener('account_error', ({
    message
  }) => {
    console.error(message);
    firebase.analytics().logEvent('account_error');
  });
  player.addListener('playback_error', ({
    message
  }) => {
    console.error(message);
    firebase.analytics().logEvent('playback_error');
  });

  // Playback status updates
  player.addListener('player_state_changed', state => {
    console.log('Player state changed. State: ', state)

    var message = 'playing';
    if(state.paused) {
      message = 'paused';
    }
    console.log(message);
    firebase.analytics().logEvent('webplayer_state_change', {state: message});
  });

  //
  player.addListener('ready', ({
    device_id
  }) => {
    console.log('Ready with Device ID: ', device_id);
    document.getElementById("status").innerText = 'Ready to play!'
    firebase.analytics().logEvent('player ready');

  });

  // Not Ready
  player.addListener('not_ready', ({
    device_id
  }) => {
    console.log('Offline with Device ID: ', device_id);
    document.getElementById("status").innerText = 'Device Offline!'
  });

  // Connect to the player!
  player.connect();
  p = player;
};



//Player Interaction Functions
function playPause() {
  p.togglePlay().then(() => {
    console.log('Playback Toggled.');
  });
}

function volUp() {
  if (vol < 0.9) {
    vol += 0.1;
    p.setVolume(vol).then(() => {
      console.log('Volume Increased.');
    });
  }

}

function volDown() {
  if (vol > 0.1) {
    vol -= 0.1;
    p.setVolume(vol).then(() => {
      console.log('Volume Increased.');
    });
  }
}
