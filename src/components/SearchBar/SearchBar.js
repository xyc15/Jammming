import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      keyWords: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleEnterKey = this.handleEnterKey.bind(this);
  }

  handleChange(e){
    this.setState({keyWords: e.target.value});
    localStorage.setItem('searchedKeyWords', e.target.value);//remove searchedKeyWords after obtaining the accessToken here so the value of input will change in the future
  }

  //search button trigger search
  handleSearch(){
    //add this condition, so the search keyWords will still be set after authentication
      this.props.searchItems(localStorage.getItem('searchedKeyWords'),'track');
      this.setState({keyWords: ''});

  }

  //"Enter" key trigger search
  handleEnterKey(e){
    var code = e.keyCode || e.which;//Some browsers use keyCode, others use which
    // console.log("key code is: " + code);
    if(code === 13){//13 is the enter key code
    //add this condition, so the search keyWords will still be set after authentication
        this.props.searchItems(localStorage.getItem('searchedKeyWords'),'track');
    }
  }
  render(){
    return (
      <div className="SearchBar">
        <input id="searchedKeyWords" value={this.state.keyWords} onKeyPress={this.handleEnterKey} onChange={this.handleChange} placeholder="Enter A Song, Album or Artist" />
        <a onClick={this.handleSearch}>SEARCH</a>
      </div>
    );
  }
}
export default SearchBar;
