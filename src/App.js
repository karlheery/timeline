import React, { Component } from 'react';
import './App.css';
import './OptionsMenu.css';
import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';

import Sound from 'react-sound';

import { Button, PlayerIcon } from 'react-player-controls'
import ExifOrientationImg from 'react-exif-orientation-img'



class App extends Component {
	
  
  constructor(props) {
	  
	super(props);
	

	// @TODO hardcoding for now - some replace based on choice of timeline
	var cloud_config1 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Caroline',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/backgrounds/BannerIcon.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Tom Baxter - Better.mp3'
	}

	var cloud_config2 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Family',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Family/backgrounds/HeeryFamilyIcon.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Ed Sheeran - Photograph.mp3'
	}
	

	var cloud_config3 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Covid',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Common/backgrounds/Scrapbook.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Gavin James - Always.mp3'
	}


	this.state = {
		timelineChosen: false,
		play: false,
		timelines: {
			"Caroline. Our Glue.": cloud_config1,
			"Family = Life": cloud_config2,
			"Heery's Scrapbook - Covid Times": cloud_config3
		}
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
   * Handle choice of timeline on main page by rendering MediaTimeilne it
   */
  handleChoice( name ) {

	this.setState({
		timelineChosen: true,
		timeline_name: name,
		vizStyle: ( this.timeline ? this.timeline.vizStyle : "" ),
		config: this.state.timelines[name],
		play: false
	});
	
  }
	
	
  
  /**
   * Render the top banner and the main timeline page
   */	 
  render() {	  		   	  			
		
    return (
		<div className="main-area">
			<div id="main-bg" className="main-bg"></div>


			{this.state.timelineChosen	&&
			<div>
			<Sound
			  url={this.state.config.music_url}
			  playStatus={ (this.state.play ? Sound.status.PLAYING : Sound.status.PAUSED) }
			  playFromPosition={300 /* in milliseconds */}
			  //onLoading={this.handleSongLoading}
			  //onPlaying={this.handleSongPlaying}
			  //onFinishedPlaying={this.handleSongFinishedPlaying}
			/>
			
			<div className="App-right-menu" id="menu" name="menu">
				<OptionsMenu timeline_name={this.state.timeline_name} vizStyle={this.state.vizStyle} config={this.state.config} ref={(tl) => { this.optionsMenu = tl; }}/>
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
					<ExifOrientationImg src={this.state.config.banner_image} className="App-banner" alt="banner" align="left" />
					<h1 className="App-title">{this.state.timeline_name}</h1>		  
							
							
				</header>					
				<div>
    				<MediaTimeline timeline_name={this.state.timeline_name} config={this.state.config} ref={(tl) => { this.timeline = tl; }}/>											
				</div>

			</div>
			</div>
			}

			{!this.state.timelineChosen && 
				<div>

				<br/>
				<br/>

				<div className="row">
  				<div className="column">
    				<div className="App-card">
						<ExifOrientationImg src={this.state.timelines["Heery's Scrapbook - Covid Times"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("Heery's Scrapbook - Covid Times")}>Heery's Scrapbook - Covid Times</button></p>
					</div>
				</div>


				<div className="column">
    				<div className="App-card">						
						<ExifOrientationImg src={this.state.timelines["Caroline. Our Glue."].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("Caroline. Our Glue.")}>Caroline. Our Glue.</button></p>
					</div>
				</div>

				<div className="column">
    				<div className="App-card">						
						<ExifOrientationImg src={this.state.timelines["Family = Life"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("Family = Life")}>Family = Life</button></p>
					</div>	
				</div>
				</div>								

				<br/>
				<br/>

			</div>}

	    </div>
    );
  }
}

export default App;
