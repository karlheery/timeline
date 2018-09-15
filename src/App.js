import React, { Component } from 'react';
import banner from './Banner_Image.jpg';
import './App.css';
import './OptionsMenu.css';
import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';

class App extends Component {
	
		
  render() {
    return (
		<div>
			<div align="right" id="menu">
				<OptionsMenu/>
			</div>
		
		    <div className="App">
				<header className="App-header">
					<img src={banner} className="App-banner" alt="banner" align="left" />
					<h1 className="App-title">Caroline. Our Glue.</h1>		  
				</header>					
				<div>
					<MediaTimeline background={this.props.data} handleItemSelect={this.props.children}/>											
				</div>
			</div>
	    </div>
    );
  }
}

export default App;
