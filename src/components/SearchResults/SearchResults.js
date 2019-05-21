import React from 'react';
import './SearchResults.css';
import SearchResult from '../SearchResult/SearchResult.js';

class SearchResults extends React.Component{
  constructor(props){
    super(props);
    this.handleAddedList = this.handleAddedList.bind(this);
  }
  handleAddedList(newList){
    //console.log("I'm in SearchResults: handleAddedList() method")
    this.props.addedListInfo(newList);
  }
  render(){
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <div className="TrackList">
          {
            this.props.searchResults.map(track =>{
              return <SearchResult searchResult={track} addedList={this.handleAddedList} key={track.id} />
            })
          }
        </div>
      </div>
    );
  }
}

export default SearchResults;
