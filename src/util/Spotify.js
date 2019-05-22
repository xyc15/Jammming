/*
note1:
Throughout the rest of this project, we will use the fetch() browser API to make our requests.

Since fetch() is a browser API, older browsers may not support it. To increase the accessibilty of Jammming to a wider audience of users, we'll need to add a fetch() polyfill to support older browsers.

Within the Jammming directory in your terminal, run npm install whatwg-fetch --save to install the whatwg-fetch polyfill and add it to your package.json file.

note2: Your fetch() will currently not function correctly due to CORS restrictions.

We can bypass this restriction with an API called CORS Anywhere. CORS Anywhere will take requests sent to its API endpoint, make them for the requesting app with the proper CORS permissions, and then return the response back to the requesting app.

Prepend the URL path you passed to the first argument in fetch() with the following:

https://cors-anywhere.herokuapp.com

important!!!!
after this step, to enable npm run
it requires to: If node_modules exists, remove it with rm -rf node_modules and then run npm install
*/

const clientId = process.env.REACT_APP_CLIENT_ID;//unique identifier of your application
const redirectUri = process.env.REACT_APP_REDIRECT_URL;
console.log("redirectUri: " + redirectUri);
const searchScope = 'playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative';//To be able to create private playlists, the user must have granted the  playlist-modify-private scope.
//Private playlists are only retrievable for the current user and requires the playlist-read-private scope to have been authorized by the user.
let accessToken = '';
//const userId = '21tuagbobm5tmdxlobbd3uzfa';
let userId = '';
let playListId = '';

const Spotify = {
  getAccessToken(keyWords){
    if(accessToken === ''){//the accessToken has not been set
      //accessToken and expire time are already on the url
      if(window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/)){
        //wipe the access token and URL parameters
        accessToken = decodeURIComponent(window.location.href.match(/access_token=([^&]*)/)).substring(13);//the match() method searches a string for a match against a regular expression, and returns  the matches, as an Array Object

        let expireTime = decodeURIComponent(window.location.href.match(/expires_in=([^&]*)/)).substring(11);
        expireTime = expireTime.substring(0, expireTime.indexOf(','));
        //  expireTime = expireTime/60; //for test purpose only
        //console.log("expireTime: " + expireTime);
        // window.setTimeout(() => {
        //   accessToken = '';
        //   console.log("access token expired!");
        // }, expireTime * 1000);//Set the access token to expire at the value for expiration time
        window.history.pushState('Access Token', null, '/');//Clear the parameters from the URL, so the app doesn't try grabbing the access token after it has expired
        /*The goal is to: update the access token logic to expire at exactly the right time,
        instead of setting expiration from when the user initiates their next search*/
        /*************newly added: store accessToken in localStorage**************/
        var now = Date.now();//millisecs since epoch time
        var schedule = now + expireTime * 1000;
        localStorage.setItem('token', accessToken);
        localStorage.setItem('token'+'_expiresIn', schedule);
        /**************************/

        return accessToken;
      }
      else{//the accessToken is empty and is not in the url
        const requestUrl = `https://accounts.spotify.com/authorize/?client_id=${encodeURIComponent(clientId)}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(searchScope)}`;
        //const requestUrl = `https://accounts.spotify.com/authorize/?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${searchScope}`;
        /***After user redirect on login, restoring the search term from before the redirect***/
        localStorage.setItem('searchedKeyWords', keyWords);//clear this key in SearchBar.js file
        window.location = requestUrl;
        return accessToken;
      }
    }
    else{ //the accessToken has been set
      return accessToken;
    }
  },

  search(keyWords, type){
    /********check if there exists token in localStorage, and if it still validate*********/
    //case 1: no accessToken yet
    if(localStorage.getItem('token') === null){
      accessToken = this.getAccessToken(keyWords);
    }
    else{
      var now = Date.now();
      var expiresIn = localStorage.getItem('token_expiresIn');
      if(expiresIn === undefined || expiresIn === null){
        expiresIn = 0;
        accessToken = localStorage.getItem('token');
      }
      if(expiresIn < now){//expired
        //remove storage key
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiresIn');
        accessToken = '';
        accessToken = this.getAccessToken(keyWords);
      } else{
        // if(localStorage.getItem('searchedKeyWords') !== null)
        accessToken = localStorage.getItem('token');
      }
    }
    /**************************************/
    if(accessToken !== ''){
    const searchUrl = `https://api.spotify.com/v1/search?q=${keyWords}&type=${type}`;
    return fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse.tracks.items){
        return jsonResponse.tracks.items.map(item => (
          {
            'song': item.name,
            'singer': item.artists[0].name,
            'album': item.album.name,
            'uri': item.uri,//e.g. "spotify:track:1OsyDLVXvzuoc4EEDVaO3E"
            'preview_url': item.preview_url,
            'id': item.id,
            'accessToken': accessToken
          }
        ));
      }
      else return null;
    });
  }
  else return null;
},

  getUserId(){
    const fetchUrl = `https://api.spotify.com/v1/me`;
    return fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json()).then(jsonResponse => {
      return jsonResponse.id;
    });
  },

  getPlaylistId(){
    //Note that this scope alone will not return collaborative playlists, even though they are always private.
//Private playlists are only retrievable for the current user and requires the playlist-read-private scope to have been authorized by the user.
//Collaborative playlists are only retrievable for the current user and requires the playlist-read-collaborative scope to have been authorized by the user.
    const getPlaylistUrl = `https://api.spotify.com/v1/me/playlists`;
    return fetch(getPlaylistUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => response.json()).then(jsonResponse => {
      //console.dir(jsonResponse);
      return jsonResponse.items;
    });
  },

  save(playlistName, playlist){
      //step1: get userId
       return this.getUserId().then(id => { //add "return" here to return results to App.js
        //To be able to create private playlists, the user must have granted the  playlist-modify-private scope.
        //step2: create new playlist
        userId = id;
        const postUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
        //console.log("I'm here, postUrl is: " + postUrl);
        return fetch(postUrl, { //add "return" here to return results to App.js
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-type': "application/json"
          },
          body: JSON.stringify({
            'name': playlistName,
            'public': false
          })
        }).then(response => {
          if(response.ok){
            return response.json();
          }
        }).then(jsonResponse => {
          //step3: get current playist id
          //console.log(jsonResponse.id);
          return jsonResponse.id;
        });
      }
    ).then(id => {
      //step4: add tracks to this playlist
      playListId = id;
      const postTracksId = `https://api.spotify.com/v1/users/${userId}/playlists/${playListId}/tracks`;
      const trackUris = playlist.map(e => e.uri);
      return fetch(postTracksId, {  //add "return" here to return results to App.js
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-type': "application/json"
        },
        body: JSON.stringify({//this method converts a JavaScript value to a JSON string
          'uris': trackUris
        })
      }).then(response => {
          return response.ok;  ////add "return" here to return results to App.js
      });
    });
  }
};

export default Spotify;
