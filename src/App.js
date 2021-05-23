import React, { Component } from 'react';
import './App.css';
import './OptionsMenu.css';
import './TimelineDetailsForm.css';
import './InputDialog.css';

import axios from 'axios';

import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';
import DetailsFormCreator from './TimelineDetailsForm';
import Sound from 'react-sound';
import Snowfall from 'react-snowfall'

import { Button, PlayerIcon } from 'react-player-controls'
//import ExifOrientationImg from 'react-exif-orientation-img'

import OtpInput from 'react-otp-input';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import Axios from 'axios';




class App extends Component {
	
  
  constructor(props) {
	  
	super(props);
	
	this.state = {
		all_timelines_uri: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/timelines',
		timelineChosen: false,
		single_timeline: null,
		play: false,
		playPosition: 0,		
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

		if( newPlayState ) {
			console.log( "playing " + this.state.config.music_url )
		}
		
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

	var all_timelines = this.preloadTimelines( choice )
	
  }
  

  /** 
   *  Lookup the timelines from our backend
   */
  preloadTimelines( choice ) {

	var uploadPromise = axios.get( this.state.all_timelines_uri )
	.then((result) => {
		
		var results = result.data;
		console.log( "just retrieved ALL TIMELINES: " + results );

		this.setState({			  
			all_timelines: results
		});			
			
		return results;

	})
	.then((all_timelines) => {
		
		if( choice ) {
			this.handlePreChoice( choice, all_timelines );
		}
		return all_timelines;

	})
	.catch(function (err) {
		console.log("failed to retreive all timelines");
		console.log(err);
	});

  }






  /**
   * Handle pre-choice of a timeline via a URL parameter by hiding the rest
   */
  handlePreChoice( code, all_timelines ) {

	var single_timeline = null

	for( var i=0; all_timelines && i<all_timelines.length; i++ ) {
		if( code === all_timelines[i].url_code ) {
			single_timeline = all_timelines[i]
		}
	}
	
	if( !single_timeline ) {
		console.error( "failed to map code " + code + " to a name in " + all_timelines )
	}
	else {

		this.setState({
			urlParam: window.location.search,			
			timelineChosen: false,
			timeline_code: code,
			single_timeline: single_timeline,
			timeline_name: single_timeline.timeline_name,
			play: false,
			isIntroFinished: false
		});		

		// if it was deep-linked in we need to clear that now
		window.history.replaceState(null, null, window.location.pathname);	
	}

  }

	

  /**
   * Handle choice of timeline on main page by rendering MediaTimeilne it
   */
  handleChoice( timeline_config ) {

	// default to access only if its public
	var enableAccess = ( timeline_config.accessModel == "PUBLIC" ? true : false )
	if( !enableAccess ) console.log( "will prompt for access code for access model: "  + timeline_config.accessModel )
	
	this.setState({		
		timelineChosen: true,
		timeline_code: timeline_config.accessCode,
		timeline_name: timeline_config.timeline_name,
		vizStyle: ( this.timeline ? this.timeline.vizStyle : "" ),		
		config: timeline_config,
		accessEnabled: enableAccess,
		play: false,
		isIntroFinished: false
	});		
		
  }
	

  /**
   * Show a modal to capture data and create a new timeline
   * @param {*} codeInput 
   */
   createNew() {
		//this.detailsMenu.handleClickOpen(true);
		this.setState({
            formOpen: true
        });
   }

   
   /**
	* Handle the call from child component to close the timeline creation screen

	* @param {*} shortCode 
	*/
   closeNew = (shortCode) =>  {		
		console.log("closing details form")
		this.setState({
			formOpen: false
		});

		if( shortCode ) {
			console.log("created new timeline with short code: " + shortCode )				
			this.preloadTimelines( shortCode )
		}
		
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
   * Handle click on display (e.g. Flipbook changing page)
   */
  handleDisplayClick( e ) {
	
	var newPos = 8
	
	this.setState({		
		play: true
		//, 		playPosition: newPos
	});	
	
	
  }


  finishedIntro() {
	this.setState({		
		isIntroFinished: true
	});	
	
  }


  handleSoundEvent( errorCode, description ) {
	console.error( "Error on sound event with " + errorCode + ": " + description )
  }

  
  /**
   * Render the top banner and the main timeline page
   */	 
  render() {	  		   	  			
	
	//ref={(tl) => { this.detailsMenu = tl; }}

	// sharing link should produce: { window.location.href + "?scrapbookName=" + this.state.timeline_code}
	// passcode using https://reactjsexample.com/otp-input-component-for-react/

    return (
		<div className="main-area">
			<div id="main-bg" className="main-bg"></div>
			
			{this.state.timelineChosen && this.state.config.music_intro_url && !this.state.isIntroFinished &&
				<Sound url={this.state.config.music_intro_url} 
					autoLoad={true} 
					playStatus={Sound.status.PLAYING} 
					onError={this.handleSoundEvent.bind(this)}
					onFinishedPlaying={this.finishedIntro.bind(this)}
				/>
			}

			{this.state.timelineChosen && ( this.state.isIntroFinished || !this.state.config.music_intro_url  ) &&
				<Sound
				url={this.state.config.music_url}
				playStatus={ (this.state.play ? Sound.status.PLAYING : Sound.status.PAUSED) }
				//playFromPosition={this.state.playPosition}
				//onLoading={this.handleSongLoading}
				//onPlaying={this.handleSongPlaying}
				//onFinishedPlaying={this.handleSongFinishedPlaying}
				/>
			}

			{this.state.timelineChosen && 
			<div>
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
						<div>
    					<MediaTimeline timeline_name={this.state.timeline_name} config={this.state.config} ref={(tl) => { this.timeline = tl; }} onDisplayClick={this.handleDisplayClick.bind(this)} />
						{this.state.config && this.state.config.url_code && <p className="App-subtitle">{window.location.href}?scrapbookName={this.state.config.url_code}</p>}
						</div>
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

			{this.state.config.effect == "snow" &&  <Snowfall  			
				className="in-front"
  				color="white"
  				snowflakeCount={200}
				/>
			}

			</div>
			}

			{!this.state.timelineChosen && 
				<div>
				<div className="App-right-menu" id="menu" name="menu">
					<DetailsFormCreator isOpen={this.state.formOpen} handleDetailsFormClose={this.closeNew} backend_uri={this.state.all_timelines_uri}/>
				</div>

				<br/>				
				<br/>

				<div className="header">
					<h1>Our Stories</h1>
				</div>
				<div className="row">

				{ this.state.single_timeline &&
					<div className="column">
    					<div className="App-card">						
							<img src={this.state.single_timeline.banner_image} className="App-card-thumbnail"/>
							<p><button className="App-card-button" onClick={() => this.handleChoice(this.state.single_timeline)}>{this.state.single_timeline.timeline_name}</button></p>
						</div>	
						<br/><br/></div> 
  				}

				{ !this.state.single_timeline && this.state.all_timelines &&
				this.state.all_timelines.map(f => ( <div className="column">
    					<div className="App-card">						
							<img src={f.banner_image} className="App-card-thumbnail"/>
							<p><button className="App-card-button" onClick={() => this.handleChoice(f)}>{f.timeline_name}</button></p>
						</div>	
						<br/><br/></div> 
				)) 
				}

				</div>								

				<br/>
				<br/>

				<div className="row">
				
				{!this.state.timelineChosen && (!this.state.timeline_name || (this.state.timeline_name && this.state.timeline_name === "New Timeline")) && 
				<div className="column">
    				<div className="App-newcard" onClick={() => this.createNew()}>						
						<br/>
						<br/>		
						<br/>						
						<AddToPhotosIcon fontSize="large"/>						
						<br/>		
						Add your story
						<br/>
						<br/>		
						<br/>
					</div>
				</div>
  				}
				</div>					

				<br/>
				<br/>

				<br/>
				<br/>
				
									

			</div>}

	    </div>
    );
  }
}

export default App;
