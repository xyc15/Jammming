import React from 'react';
class DynamicList extends React.Component{
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(){
    const list = {
      song: this.props.info.song,
      singer: this.props.info.singer,
      album: this.props.info.album,
      uri: this.props.info.uri,
      preview_url: this.props.info.preview_url,
      id: this.props.info.id
    };
    this.props.removeList(list);
  }
  render(){
    // console.log("I'm in DynamicList: render() method");
    //console.log(this.props.info.song);
    //console.log(this.props.info.singer);
    //console.log(this.props.info.album);
    return (
      <div className="Track">
          <div className="Track-information">
            <h3>{this.props.info.song}</h3>
            <p>{this.props.info.singer} | {this.props.info.album}</p>
            {this.props.info.preview_url &&
              <audio className='Track-audio' controls> <source src={this.props.info.preview_url} type="audio/mpeg" />
                Your browser does not support the <code>audio</code> element.
              </audio>
            }
          </div>
          <a className="Track-action" onClick={this.handleClick}>-</a>
      </div>
    );
  }
}

export default DynamicList;
