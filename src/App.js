import React, { Component } from 'react';
import banner from './Banner_Image.jpg';
import './App.css';
import './OptionsMenu.css';
import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';

class App extends Component {
	
  	
  constructor(props) {
	  
	super(props);
	
  }
  	
  render() {
	  		
    return (
		<div>
			<div align="right" id="menu" name="menu">
				<OptionsMenu/>
			</div>
		
		    <div className="App">
				<header className="App-header">
					<img src={banner} className="App-banner" alt="banner" align="left" />
					<h1 className="App-title">Caroline. Our Glue.</h1>		  
				</header>					
				<div>
					<MediaTimeline/>											
				</div>
			</div>
	    </div>
    );
  }
}

export default App;
