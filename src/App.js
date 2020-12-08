import React, { Component } from 'react';
import './App.css';
import './OptionsMenu.css';
import './InputDialog.css';
import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';

import Sound from 'react-sound';

import { Button, PlayerIcon } from 'react-player-controls'
//import ExifOrientationImg from 'react-exif-orientation-img'

import OtpInput from 'react-otp-input';



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
		music_url: './music/Tom Baxter - Better.mp3',
		accessModel: 'PUBLIC'
	}

	var cloud_config2 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Family',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Family/backgrounds/HeeryFamilyIcon.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Ed Sheeran - Photograph.mp3',
		accessModel: 'PUBLIC'
	}
	

	var cloud_config3 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Covid',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Covid/backgrounds/StayAtHome.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Gavin James - Always.mp3',
		accessModel: 'PUBLIC'
	}

	var cloud_config4 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'TaraGlen',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/TaraGlen/backgrounds/TaraGlenBackground.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Pitbull - Timber ft Kesha.mp3',
		accessModel: 'PRIVATE',
		accessCode: "2020"
	}


	var cloud_config5 = {
		s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
		s3_folder: 'Christmas',		// based on choice
		banner_image: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Christmas/backgrounds/Snowflake.jpg',
		upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
		content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
		music_url: './music/Michael Buble - Have Yourself A Merry Little Christmas.mp3',
		accessModel: 'PUBLIC'
	}


	this.state = {
		timelineChosen: false,
		play: false,
		urlCodes: {
			"CarolineOurGlue": "Caroline. Our Glue.",
			"FamilyLife": "Family = Life",
			"HeerysScrapbookCovidTimes": "Heery's Scrapbook - Covid Times",
			"TaraGlenGang": "Tara Glen Gang",
			"Christmas": "Christmas"
		},
		timelines: {
			"Caroline. Our Glue.": cloud_config1,
			"Family = Life": cloud_config2,
			"Heery's Scrapbook - Covid Times": cloud_config3,
			"Tara Glen Gang": cloud_config4,
			"Christmas": cloud_config5
		},
		codeInput: ""
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

	if( choice && this.state.urlCodes && this.state.urlCodes[choice] ) {

		this.setState({
			urlParam: window.location.search
		});
		
		this.handleChoice( choice );
	}

	// if it was deep-linked in we need to clear that now
	window.history.replaceState(null, null, window.location.pathname);

  }
  


  /**
   * Handle choice of timeline on main page by rendering MediaTimeilne it
   */
  handleChoice( code ) {

	var name = this.state.urlCodes[code];
	if( !name ) console.error( "failed to map code " + code + " to a name in " + this.state.urlCodes )

	// default to access only if its public
	var enableAccess = ( this.state.timelines[name].accessModel == "PUBLIC" ? true : false )
	if( !enableAccess ) console.log( "will prompt for access code for access model: "  + this.state.timelines[name].accessModel )

	this.setState({
		timelineChosen: true,
		timeline_code: code,
		timeline_name: name,
		vizStyle: ( this.timeline ? this.timeline.vizStyle : "" ),
		config: this.state.timelines[name],
		accessEnabled: enableAccess,
		play: false
	});		
		
  }
	


  /**
   * handle inputting of access code, character by character
   * @param {*} codeInput 
   */
  handleCodeInput = codeInput => {
	  this.setState({ codeInput });
	  this.checkAccessCode( codeInput )
  }



  /**
   * Check OTP input against configured access code
   * 
   */
  checkAccessCode( code ) {
	
	if( code && code.length == 4 ) {

		console.log( "checking entered code: " + code + " against config " + this.state.config );

		if( code == this.state.config.accessCode ) {
			this.setState({		
				accessEnabled: true,
				errorMessage: ""
			});		
		}
		else {
			this.setState({		
				errorMessage: "Incorrect code - please try again",
				codeInput: ""
			});		
		}
	
	}

  }


  
  /**
   * Render the top banner and the main timeline page
   */	 
  render() {	  		   	  			
	
	// sharing link should produce: { window.location.href + "?scrapbookName=" + this.state.timeline_code}
	// passcode using https://reactjsexample.com/otp-input-component-for-react/

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
					{this.state.accessEnabled &&
    					<MediaTimeline timeline_name={this.state.timeline_name} config={this.state.config} ref={(tl) => { this.timeline = tl; }}/>											
					}

					{!this.state.accessEnabled &&
						<div>
							<h1>Enter code:</h1>
							<OtpInput
								value={this.state.codeInput}
								onChange={this.handleCodeInput}
								shoshouldAutoFocus={true}
								isInputNum={true}
								numInputs={4}
								separator={<span>-</span>}
								containerStyle={"input-container"}
								inputStyle={"inputStyle"}
							/>					  
							<br/>
							{this.state.errorMessage}
						</div>
					}
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
						<img src={this.state.timelines["Tara Glen Gang"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("TaraGlenGang")}>Tara Glen Gang</button></p>
					</div>	
				</div>

  				<div className="column">
    				<div className="App-card">
						<img src={this.state.timelines["Heery's Scrapbook - Covid Times"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("	")}>Heery's Scrapbook - Covid Times</button></p>
					</div>
				</div>
				
				</div>

				<br/>
				<br/>

				<div className="row">
				<div className="column">
    				<div className="App-card">						
						<img src={this.state.timelines["Family = Life"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("FamilyLife")}>Family = Life</button></p>
					</div>	
				</div>
				
				<div className="column">
    				<div className="App-card">						
						<img src={this.state.timelines["Caroline. Our Glue."].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("CarolineOurGlue")}>Caroline. Our Glue.</button></p>
					</div>
				</div>

				</div>								

				<br/>
				<br/>

				<div className="row">
				<div className="column">
    				<div className="App-card">						
						<img src={this.state.timelines["Family = Life"].banner_image} className="App-card-thumbnail"/>
						<p><button className="App-card-button" onClick={() => this.handleChoice("Christmas")}>Christmas</button></p>
					</div>	
				</div>
				
				<div className="column">
				
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
