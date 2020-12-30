import React, { Component } from 'react';
import { PropTypes } from 'react'
import EXIF from 'exif-js'

import MediaItem  from './MediaItem';


class PolaroidDisplay extends Component {


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
            config: this.props.config,
            canvasArea: this.props.canvasArea,
            index: -1, 
            playOrPauseAction: "Pause",
            shuffleOrUnshuffleAction: "Shuffle",
            quadrant: 1
        };

        window.mediaCanvas = this;

    }


    // called by ReactJS after `render()`
    componentDidMount() {   

        // set interval for the timer between showing photos
        this.timer = setInterval(() => this.showMedia(this), 4000 );        	
    }


    componentWillUnmount(){
        this.pauseShow();        
    }


    shouldComponentUpdate() {
        return true;
    }



    render() {
	  	
        var timelineContent = this.state.timelineData;
        
        if( !timelineContent ) {
            timelineContent = {};
            timelineContent.content = [];
        }

        return (
            <div>
                
            </div>
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



    
    /** 
     * Recursive loop through the array of medialist items, displaying each 
     */
    showMedia(self) {
        console.log( "showing next media..." );

        var canvas = document.getElementById( this.state.canvasArea );
        var context = canvas.getContext('2d');


        var indexArray = self.state.indexArray

        // if we're at the end of the media list, do nothing
        // might I get a race condition here if animation id hasnt been saved in state yet above
        //if( this.state.index >= this.props.medialist.length ) {
        if( !indexArray || indexArray.length <= 0 ) {
            // create an array of indexes of 0...N which we'll iterate through (or perhaps shuffle) to 
            //  choose what media to display
            console.log( "created indexArray of " + self.state.medialist.length + " items" );
            indexArray = Array.apply(null, {length: self.state.medialist.length}).map(Number.call, Number)
            self.setState({ indexArray: indexArray });
    
            // shuffle or unshuffle according to (or indeed to flip from and therefore implement) initial state
            window.mediaCanvas.toggleShuffle(); // refactor shuffle from toggle
    
        }
    
    
        // pop the first value from the array
        var index = indexArray.shift();
    
        // otherwise show the next image...
        var mediafile =  self.state.medialist[index];
        console.log( "showing image " + index + " of " + self.state.medialist.length + ": " + mediafile + " (" + indexArray.length + " left) in quadrant " +  self.state.quadrant );
    

        // break screen into 4 quadrants so not completely random placement
        //
        var maxX = Math.floor( canvas.width * 0.1 );;
        var maxY = Math.floor( canvas.height * 0.1 );

        var xpos = 0;
        var ypos = 0;

        if( self.state.quadrant == 1 ) {
            xpos = Math.floor((Math.random() * maxX) + 1); 
            ypos = 50 + Math.floor((Math.random() * maxY) + 1);
        }
        else if( self.state.quadrant == 2 ) {
            xpos = canvas.width * 0.5 + Math.floor((Math.random() * maxX) + 1); 
            ypos = 50 + Math.floor((Math.random() * maxY) + 1);
        }
        else if( self.state.quadrant == 3 ) {
            xpos = Math.floor((Math.random() * maxX) + 1); 
            ypos = canvas.height * 0.5 + Math.floor((Math.random() * maxY) + 1);
        }
        else {
            xpos = canvas.width * 0.5 + Math.floor((Math.random() * maxX) + 1); 
            ypos = canvas.height * 0.5 + Math.floor((Math.random() * maxY) + 1);
            self.setState({quadrant: 0});    
        }

        self.setState({quadrant: self.state.quadrant + 1});    

        // we'll rotate up to 5 deg max, and flip it half the time to negative
        var rotationAngle = Math.floor((Math.random() * 5) + 0) * Math.PI / 180;
        if( Math.floor((Math.random() * 2) + 1) == 2 )
            rotationAngle = rotationAngle * -1;


        // font setting for writing on photos
        context.font = "italic 10px Calibri";
        context.textBaseline = "top";            
/*
        // Getting image data
        //
        var http = new XMLHttpRequest();
        http.open("GET", mediafile, true);
        http.responseType = "blob";
        http.onload = function(e) {

            // assuming we load the media file URL ok
            //
            if (self.status === 200) {
        
            var image = new Image();
            image.src = mediafile;
			
            //image.src = "http://localhost:8080/PhotoShow/test_images/media/Hugo.mp4";
            var scaledWidth = 600;
            var scaledHeight = 400;
            
            // might have issues later from having commented this callback approach out, but was losing reference
            // to "this" which was stopping me call requestAnimationFrame again from within.
            // I should be using interval anyway not animation right - so use this instead and reinstate onload?
            // http://jsfiddle.net/martinaglv/3fZT2/

            // this callback causes the page crash, as saves/restores build up!
            // make images smaller and/or widen interval to solve?
            // Only way I can do sve & restores outside of onload is if I dont care about dimensions of photo??
            //
        
            image.onload = function(){
*/

        var scaledWidth = 600;
        var scaledHeight = 400;

        this.fetchFile(mediafile).then(function(result) {
                var imageFile = result;
                
                var image = new Image()
                const reader = new FileReader();
                reader.addEventListener("load", function () {
                    // convert image file to base64 string
                    image.src = reader.result;
                }, false);
                
                
                reader.readAsDataURL(imageFile);


                var orientation;
                var dateTaken;
				var comment;
								
                EXIF.getData(imageFile, function() {
                    var orientation = EXIF.getTag(this, "Orientation");                   
                    var dateTaken = EXIF.getTag(this, "DateTimeOriginal");
                    if( !(dateTaken === undefined || dateTaken == null || dateTaken.length <= 0) ) {
                        // TODO
						//console.log( dateTaken );
                        // NOT WORKING?!?!?!
                        //var d1 = Date.parseExact(dateTaken, 'yyyy:MM:dd hh:mm:ss' );
                        //console.log( d1 );
                        //dateTaken = d1.toString('MMMM d, yyyy');
                    }
                    else{
                        dateTaken = "";
                    }
                    
                    var rotatedPhoto = false;
                    
                    // scale the image down if we have to, to X% of the canvas real estate.        
                    var scale = 0.4;     
                    scaledWidth = canvas.width * scale;
                    //scaledHeight = image.height / image.width * scaledWidth;
                    scaledHeight = image.height / image.width * scaledWidth;
                                
                    // Bug:rotating the angle can sometimes cause a page crash because image load is long and call is asynchronously
                    // I think this is causing next image to catch up and 2 x save/translate/rotations to clash, hitting a memory error?
                    // Tip: keep images small or implement a MutEx Semaphore?
                    context.save();  
				
					// find a comment (if there is one) for the image
					//
					comment = "test comment ...til i fix window.mediaCanvas.getCommentForImage( mediafile );"

					// save position and shape (roughly! i.e. pre-rotation) to help click detection for actions
					var finalXPos = xpos+(scaledWidth/2); 
					var finalYPos = ypos+0.5*(scaledHeight/2);
									
					// save details on image for sidebar matching
					//					
					window.mediaCanvas.saveImagePosition( mediafile, finalXPos, finalYPos, scaledWidth, scaledHeight, comment );
					
                    context.translate(finalXPos, finalYPos);

                    switch(orientation){
                    case 1:
                        // i'm fine - leave me as is
                    break;
                    case 3:
                        // 180° rotate right
                        context.rotate(Math.PI);
                    break;
                    case 6:
                        // 90° rotate right
                        context.rotate(0.5 * Math.PI);
                        rotatedPhoto= true;
                        //ctx.translate(0, -canvas.height);
                    break;
                    default:
                        console.log( "failed to handle orientation " + orientation + " - how do i look?");
                        break;
                    }   

                    context.rotate(rotationAngle);

                    

                    // draw the photo outline
                    window.mediaCanvas.shadowOn( true );
                    
                    // if photo got rotated, padding for text should go on height axis instead
                    if( !rotatedPhoto ) {
                        context.fillStyle = "#EEEEEE";
                        context.fillRect( -(scaledWidth/2)-7, -(scaledHeight/2)-7, scaledWidth+14, scaledHeight+30);

                        window.mediaCanvas.shadowOn( false );
						
						// write the comment slightly in from bottom left of polaroid, in dark dark grey
						context.fillStyle = "#222222";                                                                                
                        context.fillText( comment, scaledWidth/2*-1+0, scaledHeight/2-0 );
						
						// write the time taken slightly in absolute bottom right of polaroid, in lighter grey
                        context.fillStyle = "#888888";                                                                                
                        context.fillText( dateTaken, scaledWidth/2-85, scaledHeight/2+2 );

                    }
                    else {   
                        context.fillStyle = "#EEEEEE";
                        context.fillRect( -(scaledWidth/2)-7, -(scaledHeight/2)-7, scaledWidth+30, scaledHeight+14);

                        window.mediaCanvas.shadowOn( false );
                        context.fillStyle = "#888888";
                        // looks sideways!... context.fillText( dateTaken, scaledWidth/2-3, scaledHeight/2-70 );
                    }


                    window.mediaCanvas.shadowOn( false );
                    
            
                    // now draw the photo itself            
                    context.drawImage(image, 0, 0, image.width, image.height, -(scaledWidth/2), -(scaledHeight/2), scaledWidth, scaledHeight );

                    // src="http://localhost:8080/PhotoShow/test_images/media/Hugo.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'/>
                    //context.drawImage("hugo", 0, 0, image.width, image.height, -(scaledWidth/2), -(scaledHeight/2), scaledWidth, scaledHeight );

                    
                    context.restore();
                    
                });
                
                //requestAnimationFrame( this.showMedia );

            });
        
    }



    togglePlayPause() {
        
        if( this.state.playOrPauseAction == "Play" ) {
            this.timer = setInterval(this.showMedia, 4000);
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
    


    /**
     * Shuffle the indexes to the media list array, or resort them if we want to move back to unshuffled mode
     */
    toggleShuffle() {

        if( this.state.indexArray ) {
            if( this.state.shuffleOrUnshuffleAction == "Shuffle" ) {            
                console.log( "shuffling media")

                var j, x, i;
                for (i = this.state.indexArray.length; i; i--) {
                    j = Math.floor(Math.random() * i);
                    x = this.state.indexArray[i - 1];
                    this.state.indexArray[i - 1] = this.state.indexArray[j];
                    this.state.indexArray[j] = x;
                }

                this.setState({shuffleOrUnshuffleAction: "Unshuffle"});

            } else {                         
                // whatever indexes are still remaining, we sort them again           
                console.log( "unshuffling media")
                this.state.indexArray.sort(function (a, b) {  return a - b;  });

                this.setState({shuffleOrUnshuffleAction: "Shuffle"});
            }
        }

    }


    shadowOn( on ) {
        var canvas = document.getElementById( this.state.canvasArea );
        var context = canvas.getContext('2d');

        if( on ) {
            context.shadowOffsetX = 2;  
            context.shadowOffsetY = 4;
            context.shadowColor = 'black';
            context.shadowBlur = 8;            
        }
        else {
            context.shadowOffsetX = 0;  
            context.shadowOffsetY = 0;
            context.shadowColor = 'black';
            context.shadowBlur = 0;
        }

    }


    /** 
	 * As an image is displayed save the image file and location details for later retrieval on a user event (e.g. mouse click)
     * 
	 */    
	saveImagePosition( mediaFile, finalXPos, finalYPos, scaledWidth, scaledHeight, cmt ) {
					
        // if we havent started tracking images yet, start doing so now 
        if( !this.state.imageLocations || this.state.imageLocations.length <= 0 ) {
            console.log( "creating image location cache"  );
            
            var imageLocations = new Array();
            this.setState({ imageLocations: imageLocations });
		}
		
		// if we exceed 4 items in cache, we'll prune the oldest before adding the next
		// @TODO: this only works because we've hardcoded showing images in 4 sections. 
		// So there is bad coupling here!
		if( this.state.imageLocations.length >= 4 ) {
			this.state.imageLocations.shift();
		}
					
		// create and add the image details to the array		
		this.state.imageLocations.push( { imageDisplayed:mediaFile, X:finalXPos, Y:finalYPos, width:scaledWidth, height:scaledHeight, comment:cmt } );
		
		
	}
	
	
	/** 
	 * get an image corresponding to given location
	 */
	getImageAtPosition( X, Y ) {		 		 	
		
		for(var i=0; i < this.state.imageLocations.length; i++) {
			
			var canvasImage = this.state.imageLocations[i];
			console.log('checking ' + canvasImage.X + ', ' + canvasImage.Y + ' width:' + canvasImage.width + ' height:' + canvasImage.height );	
						
			// this is crude but given limited rotation and the fact we dont allow clicking of media hiding behind other media, is good enough...?
			// note final canvasImage.X & canvasImage.Y are the centre not the top-left
			//
			if( (canvasImage.X - canvasImage.width/2) < X && (canvasImage.X + canvasImage.width/2) > X &&
				(canvasImage.Y - canvasImage.height/2) < Y && (canvasImage.Y + canvasImage.height/2) > Y ) {
			
				console.log( 'User hit: (' + X + ', ' + Y + ') which is on ' + canvasImage.imageDisplayed );			
						
                return canvasImage;
			}
			
			// or return silently - nothing clicked			
        }

	}
	

}

export default PolaroidDisplay;
