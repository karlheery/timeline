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
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Covid/backgrounds/StayAtHome.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Gavin James - Always.mp3'
	}

	var cloud_config4 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'TaraGlen',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/TaraGlen/backgrounds/TaraGlenBackground.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Pitbull - Timber ft Kesha.mp3'
	}


	this.state = {
		timelineChosen: false,
		play: false,
		timelines: {
			"CarolineOurGlue": cloud_config1,
			"FamilyLife": cloud_config2,
			"HeerysScrapbookCovidTimes": cloud_config3,
			"TaraGlenGang": cloud_config4
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
   * Handle deep link in URL as page loads
   */
  componentDidMount() {

	var linkParams = new URLSearchParams( window.location.search )
	var choice = linkParams.get("scrapbookName")

	if( choice && this.state.timelines && this.state.timelines[choice] ) {

		this.setState({
			urlParam: window.location.search
		});
		
		this.handleChoice( choice );
	}

	// if it was deep-linked in we need to clear that now
	//window.history.replaceState(null, null, window.location.pathname);

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
					<img src={this.state.config.banner_image} className="App-banner" alt="banner" align="left" />
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

				<div className="header">
					<h1>Our Scrapbooks</h1>
				</div>
				<div className="row">

				<div className="column">
    				<div className="App-card">						
						<img src={this.state.timelines["TaraGlenGang"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("TaraGlenGang")}>Tara Glen Gang</button></p>
					</div>	
				</div>

  				<div className="column">
    				<div className="App-card">
						<img src={this.state.timelines["HeerysScrapbookCovidTimes"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("HeerysScrapbookCovidTimes")}>Heery's Scrapbook - Covid Times</button></p>
					</div>
				</div>
				
				</div>

				<br/>
				<br/>

				<div className="row">
				<div className="column">
    				<div className="App-card">						
						<img src={this.state.timelines["FamilyLife"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("FamilyLife")}>Family = Life</button></p>
					</div>	
				</div>
				
				<div className="column">
    				<div className="App-card">						
						<img src={this.state.timelines["CarolineOurGlue"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("CarolineOurGlue")}>Caroline. Our Glue.</button></p>
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
