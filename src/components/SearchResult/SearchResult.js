import React from 'react';
import './SearchResult.css';

class SearchResult extends React.Component{
  constructor(props){
    super(props);
    // this.state = {
    //   addedListInfo: {
    //     song: '',
    //     singer: '',
    //     album: '',
    //     uri: ''
    //   }
    // };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    //console.log("I'm in earchResult: handleClick() method");
    const list = {
      song: this.props.searchResult.song,
      singer: this.props.searchResult.singer,
      album: this.props.searchResult.album,
      uri: this.props.searchResult.uri,
      preview_url: this.props.searchResult.preview_url,
      id: this.props.searchResult.id
    };
     //in this way, the state infomation does not change, because after setState is called and state changed, render will be called immediately, in which this.state info will be updated!!!
    /*this.setState({
      addedListInfo: {
        song: this.props.searchResult.song,
        singer: this.props.searchResult.singer,
        album: this.props.searchResult.singer
      }
    });

    console.log(this.state.addedListInfo.song);
    console.log(this.state.addedListInfo.singer);
    console.log(this.state.addedListInfo.album);

    this.props.addedList(this.state.addedListInfo);
    */
    this.props.addedList(list);
  }
  render(){
    return (
      <div className="Track">
          <div className="Track-information">
            <h3>{this.props.searchResult.song}</h3>
            <p>{this.props.searchResult.singer} | {this.props.searchResult.album}</p>
            {/* show preview if preview_url exists */}
            {this.props.searchResult.preview_url &&
              <p><audio className='Track-audio' controls> <source src={this.props.searchResult.preview_url} type="audio/mpeg" />
                Your browser does not support the <code>audio</code> element.
              </audio></p>
            }
          </div>
          <a className="Track-action" onClick={this.handleClick}>+</a>
      </div>
    );
  }
}

export default SearchResult;
