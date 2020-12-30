    import React, { Component } from 'react';
import { PropTypes } from 'react'
import EXIF from 'exif-js'

import MediaItem  from './MediaItem';

import HTMLFlipBook from "react-pageflip";

/**
 * Uses open source: https://nodlik.github.io/react-pageflip/   - main page
 *                  https://github.com/Nodlik/react-pageflip    - react source code
 *                  https://github.com/Nodlik/StPageFlip        - base JS version
 * 
 */
class FlipbookDisplay extends Component {


    constructor(props) {

        super(props);
        
        
        // build a flat list of media ....while I decide if we are going to break up chapters
        this.medialist = []
        for( var i=0; i<this.props.timelineContent.content.length; i++ ) {
            if( this.props.timelineContent.content[i]['media'].length > 0 ) {
                this.medialist = this.medialist.concat(this.props.timelineContent.content[i]['media'])
            }
        }
       
        // set initial state
        this.state = {
            timeline_name: this.props.timeline_name,
            timelineContent: this.props.timelineContent,
            medialist: this.medialist,
            cover: this.props.cover,
            index: -1, 
            playOrPauseAction: "Pause",
            shuffleOrUnshuffleAction: "Shuffle",
            page: 0,
            totalPage: ( this.medialist.length ),
        };

    }


    // called by ReactJS after `render()`
    componentDidMount() {   

        this.setState({
            totalPage: this.flipBook.getPageFlip().getPageCount(),
        });
  
        // set interval for the timer between showing photos
        this.timer = setInterval(() => this.nextButtonClick(this), 10000 );        	
        
    }


    componentWillUnmount(){
        this.pauseShow();        
    }


    shouldComponentUpdate() {
        return true;
    }


    nextButtonClick = () => {
        this.flipBook.getPageFlip().flipNext();
    };
    

    prevButtonClick = () => {
        this.flipBook.getPageFlip().flipPrev();
    };



    onPage = (e) => {
        this.setState({
          page: e.data,
        });
    };


    /**
     * Render the HTMLFlipBook
     */
    render() {
	  	
        var timelineContent = this.state.timelineContent;
        
        if( !timelineContent ) {
            timelineContent = {};
            timelineContent.content = [];
        }

        console.log( "Displaying flipbook: " + timelineContent.description )

        return (
            <React.Fragment>	
            <div>
                <HTMLFlipBook 
                     width={550}
                     height={550}
                     size="stretch"
                     minWidth={315}
                     maxWidth={1000}
                     minHeight={315}
                     maxHeight={1000}
                     maxShadowOpacity={0.5}
                     showCover={true}
                     mobileScrollSupport={true}
                     onFlip={this.onPage}
                     onChangeOrientation={this.onChangeOrientation}
                     onChangeState={this.onChangeState}
                     className="flip-book"
                     ref={(el) => (this.flipBook = el)} >
                
                    <PageCover picture={this.state.cover}>{timelineContent.description}</PageCover>  
                    {					
						this.state.medialist.map(f => ( <Page chapter={timelineContent.description} number={1} picture={f} key={f}></Page> ))						
					}
                    <PageCover>THE END</PageCover>

                </HTMLFlipBook>
                
            </div>
            </React.Fragment>	

        )

    }


    async fetchImage( fileRef ) {

		// it's either a URL to S3 or an actual File object already
		if( fileRef && typeof fileRef === 'string' && fileRef.startsWith("http")) {

			console.log( "retrieving file from URL " + fileRef )
			var self = this;

			// no-cache and origin is essential to avoiding non-deterministic CORS issues
			// read: https://stackoverflow.com/questions/44800431/caching-effect-on-cors-no-access-control-allow-origin-header-is-present-on-th
			let r = await fetch(fileRef, {method: 'GET', mode: 'cors', cache: 'no-cache', referrerPolicy: 'origin'});
			let b = await r.blob();
			var objectURL = URL.createObjectURL(b);

			var myImage = new Image()
			myImage.src = objectURL;
			return myImage
			
		}
		else {
			return fileRef
		}
	}



    async fetchFile( fileRef ) {

		// it's either a URL to S3 or an actual File object already
		if( fileRef && typeof fileRef === 'string' && fileRef.startsWith("http")) {

			console.log( "retrieving file from URL " + fileRef )
			var self = this;

			// no-cache and origin is essential to avoiding non-deterministic CORS issues
			// read: https://stackoverflow.com/questions/44800431/caching-effect-on-cors-no-access-control-allow-origin-header-is-present-on-th
			let r = await fetch(fileRef, {method: 'GET', mode: 'cors', cache: 'no-cache', referrerPolicy: 'origin'});
			let b = await r.blob();
			var fname = self.parseFilenameFromURL( fileRef )
			var f = new File([b], fname, {type: "image/jpeg"})
			return f;

			  /*
			  // paste into dev tool to test
			  // fetch("https://s3-eu-west-1.amazonaws.com/khpublicbucket/TaraGlen/761E7CAD-7E80-462D-8EDA-582720A130B1_0_1597709364999.jpeg", { "method": "GET",  "mode": "cors" });

	
					method: 'GET', // *GET, POST, PUT, DELETE, etc.
					mode: 'cors', // no-cors, *cors, same-origin
					cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
					credentials: 'same-origin', // include, *same-origin, omit
					headers: {
							'Content-Type': 'application/json'
						 'Content-Type': 'application/x-www-form-urlencoded',
					},			
				*/
		}
		else {
			return fileRef
		}
	}


    /**
     * used for keys in HTML elements etc
     * 
     * @param {*} file 
     */
    parseFilenameFromURL(file) {

        var name = ( file.name ? file.name : ( typeof file === 'string' ? file : "unknown" ) );

        // if we were editing a server side file we need the short name again
        // parse the list of files so we can see have simple short names for reuploading existing S3 images after edit
        // @TODO check trouble parsing https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/Monaco 7:10:161537710565215.jpg
        //

        if( name.indexOf("/") < 0 ) {
            return name;
        }
        
        var tokens = name.split("/");
        if( tokens && tokens.length > 1  ) {
            return tokens[tokens.length-1];			
        }
        else if ( tokens && tokens.length == 1 ) {
            return tokens[0];
        }
        else {
            console.error( "could not cleanup file name " + name );
            return name
        }
        return name

    }	


    togglePlayPause() {
        
        if( this.state.playOrPauseAction == "Play" ) {
            this.timer = setInterval(this.nextButtonClick, 10000);
            this.setState({playOrPauseAction: "Pause"});
            console.log( "(re)starting photo show");
        } else {
            window.mediaCanvas.pauseShow();
        }

    }

	
	pauseShow() {
		//clearInterval(this.timer);
        this.setState({playOrPauseAction: "Play"});
        console.log( "stopping show")
    }
    
    
	

}

export default FlipbookDisplay;




const PageCover = React.forwardRef((props, ref) => {
    return (
      <div className="page page-cover" ref={ref} data-density="hard">
        <div className="page-content">
          <div className="page-image"><img src={props.picture} className="page-image"/></div>
          <h2>{props.children}</h2>
        </div>
      </div>
    );
  });

  
const Page = React.forwardRef((props, ref) => {

    // if we have text to show we'll split the page
    if( props.children && props.children.length>0 ) {
        return (
        <div className="page" ref={ref}>
            <div className="page-content">
            <h2 className="page-header">{props.chapter}</h2>
            <div className="page-image"><img src={props.picture} className="page-image"/></div>
            <div className="page-text">{props.children}</div>
            <div className="page-footer">{props.number + 1}</div>
            </div>
        </div>
        );
    } else {
        return (
            <div className="page" ref={ref}>
                <div className="page-content">
                <h2 className="page-header">{props.chapter}</h2>
                <div className="page-image"><img src={props.picture} className="page-image"/></div>
                <div className="page-footer">{props.number + 1}</div>
                </div>
            </div>
        );
    }
});
