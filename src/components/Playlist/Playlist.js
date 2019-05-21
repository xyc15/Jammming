import React from 'react';
import './Playlist.css';
import DynamicList from '../DynamicList/DynamicList.js';

class Playlist extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      valuee: 'New Playlist'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleRemoveList = this.handleRemoveList.bind(this);
  }

  handleChange(e){
    /*add playlist to localStorage, so we can ewtrieve this information when accessToken is refreshed*/
    localStorage.setItem('playlistName',e.target.value);
    this.setState({
      valuee: e.target.value
    });
  }

  handleSave(){
    this.props.saveList(this.state.valuee);
  }

  handleRemoveList(removeList){
    this.props.removeListInfo(removeList);
  }
  render(){
    // console.log("I'm in PlayList: render() method");
    return (
      <div className="Playlist">
        {/* <input value={this.state.valuee} onChange={this.handleChange}/> */}
        <input value={localStorage.getItem('playlistName')} onChange={this.handleChange}/>
        <div className="TrackList">
          {
            this.props.newListInfo.map(list => {
              return <DynamicList info={list} removeList={this.handleRemoveList} key={list.id}/>;
            })
          }
        </div>
        {/* {console.log(this.props.saveProcess)} */}
        {this.props.saveProcess ? <a className="Playlist-save"><i className="fa fa-spinner fa-spin" /> Saving...</a> : <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>}
        {/* <a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a> */}
      </div>
    );
  }
}

export default Playlist
