import React, { Component } from 'react';
import banner from './Banner_Image.jpg';
import './App.css';
import './OptionsMenu.css';
import MediaTimeline from './MediaTimeline';
import OptionsMenu from './OptionsMenu';

import scrollToComponent from 'react-scroll-to-component';


import Sound from 'react-sound';

import { Button, PlayerIcon } from 'react-player-controls'



class App extends Component {
	
  
  constructor(props) {
	  
	super(props);
	
	this.state = {
		sound: true
	}
	
	//this.togglePlay = this.togglePlay.bind(this);
  }
  
  
  
  /**
   * switch on and off music
   */
  togglePlay() {
		console.log( "toggling sound to " + !this.state.sound );
		
		this.setState({
			sound: !this.state.sound
		});
		
		if( this.state.sound ) {
			this.startScrolling();
		}
	
  }
	
	
	
  /**
   * Start scrolling to end of timeline
   * 
   * @TODO pause and wait for end of carousel
   */
  startScrolling() {
		scrollToComponent(this.EndOfTimeline, { offset: 0, align: 'top', duration: 10000000})
	}
	
		

  
  
  /**
   * Render the top banner and the main timeline page
   */	 
  render() {	  		   	  			
	
		
    return (
		<div className="main-area">
			<div id="main-bg" className="main-bg"></div>
						
			<Sound
			  url="./music/Tom Baxter - Better.mp3"
			  playStatus={ (this.state.sound ? Sound.status.PAUSED : Sound.status.PLAYING) }
			  playFromPosition={300 /* in milliseconds */}
			  //onLoading={this.handleSongLoading}
			  //onPlaying={this.handleSongPlaying}
			  //onFinishedPlaying={this.handleSongFinishedPlaying}
			/>
			
			<div className="App-right-menu" id="menu" name="menu">
				<OptionsMenu/>
			</div>										
		
			<div className="App-right-menu">
						<Button className="App-button"
							onClick={this.togglePlay.bind(this)}
						>								
							{ (this.state.sound ? 
								<div> <PlayerIcon.Play width={32} height={32} style={{ marginRight: 25 }}/>  </div>
								: 
								<div> <PlayerIcon.Pause width={32} height={32} style={{ marginRight: 25 }}/> </div>)							
							}
						</Button>
			</div>

			
		    <div className="App">
				<header className="App-header">
					<img src={banner} className="App-banner" alt="banner" align="left" />
					<h1 className="App-title">Caroline. Our Glue.</h1>		  
							
							
				</header>					
				<div>
    				<MediaTimeline/>											
				</div>

				<section className="end" ref={(section) => { this.EndOfTimeline = section; }}></section>	
       
			</div>
	    </div>
    );
  }
}

export default App;
