import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';

import Spotify from '../../util/Spotify.js';

class App extends Component {
  constructor(props){
    super(props);
    const currentPlaylist = JSON.parse(localStorage.getItem('playlist'));
    //const currentPlaylist = localStorage.getItem('playist')? JSON.parse(localStorage.getItem('playist')):[];
    // console.dir( currentPlaylist);
    this.state = {
      searchResults: [],
      // addedListInfo: [],
      addedListInfo: currentPlaylist ? currentPlaylist:[],//restore previous playlist after renewing access token
      loading: false
    };

    this.searchSpotify = this.searchSpotify.bind(this);
    this.saveToSpotify = this.saveToSpotify.bind(this);
    this.handleAddList = this.handleAddList.bind(this);
    this.handleRemoveList = this.handleRemoveList.bind(this);
  }

  searchSpotify(keyWords, type){
      // console.log("Spotify.search(keyWords, type): " + Spotify.search(keyWords, type));
    const returned = Spotify.search(keyWords, type);
    if(returned){
      returned.then(results => {
      // Only display songs not currently present in the playlist in the search results
        let filteredResults = [];
        // let token = results[0].accessToken;
        const playlistIds = this.state.addedListInfo.map(list => list.id)
        results.forEach(result => {
          // delete result.accessToken;
          if(playlistIds.indexOf(result.id) === -1)
            filteredResults.push(result);
        });
        this.setState(
          {
            searchResults: filteredResults
          });
      });
    }
  }

  saveToSpotify(playlistName){
    //add loading screen when saving playlist
    this.setState({loading: true});
    Spotify.save(playlistName, this.state.addedListInfo).then(() => {

      //clear playlist and playlistName after saving to spotify
      localStorage.removeItem('playlist');
      localStorage.setItem('playlistName','New Playlist');
      localStorage.setItem('searchedKeyWords', '');
      this.setState({
        loading: false,
        addedListInfo:[]
      });
    });
  }

  handleAddList(info){
    // console.log("I'm in App.js: handleList() method");
    // State change will cause component re-render
    let states = this.state.addedListInfo;
    states = states.concat([{
      song: info.song,
      singer: info.singer,
      album: info.album,
      uri: info.uri,
      preview_url: info.preview_url,
      id: info.id
    }]);
    /***Add playlist to localstorage, so this infomation won't disappear if accessToken expired***/
    localStorage.setItem('playlist', JSON.stringify(states));
    this.setState({
      addedListInfo: states
    });

  }

  handleRemoveList(info){
    // console.log("I'm in App.js: handleRemoveList() method");

    let states = this.state.addedListInfo;
    //method to remove one object from the object array
    let list = {
      song: info.song,
      singer: info.singer,
      album: info.album,
      uri: info.uri,
      preview_url: info.preview_url,
      id: info.id
    };

    // states = states.filter((e) => e.song !== list.song || e.singer !== list.singer || e.album !== list.album || e.preview_url !== list.preview_url || e.id !== list.id);
    states = states.filter((e) => e.id !== list.id)//id is unique

    /***Add playlist to localstorage, so this infomation won't disappear if accessToken expired***/
    localStorage.setItem('playlist', JSON.stringify(states));

    this.setState({
      addedListInfo: states
    });
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          {/* initialItem={localStorage.getItem('searchedKeyWords')}  */}
          <SearchBar searchItems={this.searchSpotify}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} addedListInfo={this.handleAddList}/>
            <Playlist newListInfo={this.state.addedListInfo} removeListInfo={this.handleRemoveList} saveList={this.saveToSpotify} saveProcess={this.state.loading}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
