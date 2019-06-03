import React, { Component } from 'react';
import banner from './Banner_Image.jpg';
import './App.css';
import './OptionsMenu.css';
import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';

import Sound from 'react-sound';

import { Button, PlayerIcon } from 'react-player-controls'



class App extends Component {
	
  
  constructor(props) {
	  
	super(props);
	

	// @TODO hardcoding for now - some replace based on choice of timeline
	var cloud_config = {				
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Caroline',		// based on choice
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Tom Baxter - Better.mp3'
	}

	this.state = {
		timeline_name: "Caroline. Our Glue.",		//@TODO hardcoded for now, should be based on choice
		config: cloud_config,
		play: false
	}
	
	//this.togglePlay = this.togglePlay.bind(this);
  }
  
  
  
  /**
   * switch on and off music
   */
  togglePlay() {
		
		// cache it as changing it is asynch and want to stop/start scrolling
		var newPlayState = !this.state.play

		console.log( "toggling play to " + newPlayState );
		
		this.setState({
			play: newPlayState
		});
		
		if( newPlayState ) {
			this.timeline.startScrolling();
		}
		else{
			this.timeline.stopScrolling();
		}
	
  }
	
	
  
  /**
   * Render the top banner and the main timeline page
   */	 
  render() {	  		   	  			
	
		
    return (
		<div className="main-area">
			<div id="main-bg" className="main-bg"></div>
						
			<Sound
			  url={this.state.config.music_url}
			  playStatus={ (this.state.play ? Sound.status.PLAYING : Sound.status.PAUSED) }
			  playFromPosition={300 /* in milliseconds */}
			  //onLoading={this.handleSongLoading}
			  //onPlaying={this.handleSongPlaying}
			  //onFinishedPlaying={this.handleSongFinishedPlaying}
			/>
			
			<div className="App-right-menu" id="menu" name="menu">
				<OptionsMenu timeline_name={this.state.timeline_name} config={this.state.config}/>
			</div>										
		
			<div className="App-right-menu">
						<Button className="App-button"
							onClick={this.togglePlay.bind(this)}
						>								
							{ (!this.state.play ? 
								<div> <PlayerIcon.Play width={32} height={32} style={{ marginRight: 25 }}/>  </div>
								: 
								<div> <PlayerIcon.Pause width={32} height={32} style={{ marginRight: 25 }}/> </div>)							
							}
						</Button>
			</div>

			
		    <div className="App">
				<header className="App-header">
					<img src={banner} className="App-banner" alt="banner" align="left" />
					<h1 className="App-title">{this.state.timeline_name}</h1>		  
							
							
				</header>					
				<div>
    				<MediaTimeline timeline_name={this.state.timeline_name} config={this.state.config} ref={(tl) => { this.timeline = tl; }}/>											
				</div>

			</div>
	    </div>
    );
  }
}

export default App;
