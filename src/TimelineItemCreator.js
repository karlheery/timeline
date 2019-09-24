import React, { Component } from 'react';

import Dropzone from 'react-dropzone'

//import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
//import ReactS3Uploader from 'react-s3-uploader';

import Resizer from 'react-image-file-resizer';

import axios from 'axios';

import DatePicker from 'react-datepicker';
import * as moment from 'moment';

import Button from 'react-bootstrap/lib/Button';
import './OptionsMenu.css'

import 'react-datepicker/dist/react-datepicker.css';

//ES6
import ToggleButton from 'react-toggle-button'

import WorkIcon from '@material-ui/icons/Work';
import StarIcon from '@material-ui/icons/Star';
import SchoolIcon from '@material-ui/icons/School';
import FaceIcon from '@material-ui/icons/FaceSharp';
import LoveIcon from '@material-ui/icons/FavoriteSharp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';


  
class TimelineItemCreator extends Component {
    
  
  constructor(props) {
    super(props)
			
    this.state = { 
		timeline_name: this.props.timeline_name,
		config: this.props.config,
		disabled: true, 
		isEdit: false,
		category: "Friends",
		fileList: [],
		mediaList: [],
		saveStatus: 0
	}
	
	
	window.itemComponent = this;

  }

  
  /** 
   * Pull timeline event data from state
   */   
  getTimelineEventData() {	  
  				
		// remove any weird dupes
		var uniqueMedia = []
		
		if( this.state.media && Array.isArray(this.state.media) ) {
			uniqueMedia = this.state.media.filter(function(item, pos, self) {
					return self.indexOf(item) == pos;
			})
		}
		
		this.setState({
			media: uniqueMedia
		});
		
		
		// @TODO  we're only derefencing files here rather than actually deleting them
		if( this.state.filesToDelete && this.state.filesToDelete.length > 0 && this.state.media.length > 0 ) {					
		
			console.log( "deleting " + this.state.filesToDelete.length + " files from " + uniqueMedia.length + ": "+ uniqueMedia );
			
			for( var f=0; f<this.state.filesToDelete.length; f++ ) {
				//newMediaList => newMediaList.filter(e => !e.endsWidth(this.state.filesToDelete[f]));

				var newMediaList = [];	
						
				var foundOnce = false;
				for( var m=0; m<uniqueMedia.length; m++ ) {					
				
					// if media file name ends with this file name, its a dupe, or if I am deleting rows and found one already, add rest so we only delete 1
					// and finally avoid adding dupes if its in media alread. This is defensive coding to allow fix up data on past bugs
					//
					if( (!uniqueMedia[m].endsWith(this.state.filesToDelete[f]) || foundOnce) &&
						newMediaList.indexOf(uniqueMedia[m]) < 0 ) {						
						
						newMediaList.push(uniqueMedia[m]);
						console.log( "item " + this.state.title + " will have " + uniqueMedia[m] );
					}
					else {
						console.log( "item " + this.state.title + " dereferencing media " + m + ": " + uniqueMedia[m] );
						foundOnce = true;
					}
				}
				
				console.log( "new media list is :" + newMediaList );
				uniqueMedia = newMediaList;
			}
						
		}
			
		
		this.setState({
			media: uniqueMedia
		});

		// create the timeline item to save & merge
		return  {
				"command" : ( this.state.deleteItem ? "DELETE" : "UPSERT" ),
				"title_on_date": this.state.title + "|" + this.state.dateAsNumber,
				"old_title": this.state.old_title,
				"time_sortable": this.state.dateAsNumber,
				"timeline_name": this.state.timeline_name,
				"title": this.state.title,
				"category": this.state.category,
				"date": this.state.dateDisplay,		/// pass through the stringified date which allows for "unsure"
				"media": uniqueMedia,			// since state is asynch and I was messing with it, return local data
				"comment": this.state.comment
		};
  }
  
  /**
   * set the staet of menu items so that menu renders in edit mode rather than new
   */   
  setMenuState( item ) {
	
	console.log( "editing item " + item.title );
	
	// @TODO trouble parsing https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/Monaco 7:10:161537710565215.jpg
	
	// parse the list of files so we can see them nicer on the screen for deletion
	//
	var fileNames = [];
	for( var f=0; item.media && f<item.media.length; f++ ) {		
		
		// @TODO deliberately disabled the file name parsing as I switch to thumbnails not file names for delete
		//var tokens = item.media[f].split("/");
		var tokens;
		if( tokens && tokens.length > 1  ) {
			fileNames.push(tokens[tokens.length-1]);			
		}
		else if ( tokens && tokens.length == 1 ) {
			fileNames.push(tokens[0]);
		}
		else if( fileNames.indexOf(item.media[f]) < 0 ) {
			fileNames.push(item.media[f]);
		}
	}
	
	var unsure_of_date = false;
	if( item.date && item.date.length < 9 ) {	// full dates are stored as dddd, Do MMM YYYY (18 characters)
		unsure_of_date = true
	}
	
	var cal_date = moment(item.time_sortable);
	/*moment(item.date, "dddd, Do MMM YYYY");
	if( !cal_date ) {
		cal_date = moment(item.date, "MMM YYYY");
	}*/
	
    this.setState({
		title: item.title,
		old_title: item.title_on_date,		// for deletion of old
		dateAsNumber: item.time_sortable,	// this doesnt cnie
		category: item.category,
		date: cal_date,
		dateDisplay: item.date,
		unsure: unsure_of_date,
		media: item.media,		
		fileList: fileNames,
		comment: item.comment,
		uploadMessage: "Delete?:",
		isEdit: true
	})
  }

  
  /**
   * If we close an edit screen we want it to open fresh
   */
  clearMenuState() {
	 
	console.log( "clearing down timeline item");

	this.setState({
		title: undefined,		
		old_title: undefined,
		dateAsNumber: undefined,
		category: "Friends",
		date: undefined,
		dateDisplay: undefined,
		unsure: undefined,
		media: undefined,		
		fileList: undefined,
		comment: undefined,
		uploadMessage: undefined,
		isEdit: false,
		disabled: true, 
		fileList: [],
		mediaList: [],
		saveStatus: 0
	})
	  
  }
  
  
  
  handleFinishedUpload = info => {
    console.log('File uploaded with filename', info.filename)
    console.log('Access it on s3 at', info.fileUrl)
  }


  /**
   * Submit new or change timeline item, updating JSON record in DynamoDB via API Gateway
   */
  handleSubmit (event) {
		console.log('Saving event for date: ' + this.state.dateDisplay);
		event.preventDefault();		// @todo what does this do?
	  
		this.setState({ saveStatus: 1 });
				
		// create the timeline item to save & merge
		var timelineItem = this.getTimelineEventData();

		// @TODO reinstate the setTimeout saveStatus: false ....for bad data entry		
		if( !timelineItem.title || !timelineItem.date ) {
			console.log( "wont save empty event for " + timelineItem ) ;
			
			//setTimeout( this.status.saveStatus = -1, 5000);
		}			
			
			
		// DELETE RECORD
		if( this.state.deleteItem ) {
			
			axios.post( this.state.config.content_api, {
				item: timelineItem,
				contentType: 'application/json'
			})
			.then((result) => {
			
				// merge this event with timeline ...as opposed to re-getting the whole thing
				this.removeEventFromTimeline( timelineItem.old_title );
				
				// get identifier
				var savedEvent = timelineItem.old_title;
		  
				console.log( "successfully deleted item " + savedEvent );	  
				
				// @TODO - nice if we could take user to this timeline item on main page
				//			
				this.setState({
					uploadMessage: "Successfully deleted " + timelineItem.old_title,				
					saveStatus: 0,
					deleteItem: false
				});
				
				window.timelineComponent.deleteItem( timelineItem.old_title );
			})
			.catch((err) => {
				console.log(err);
				
				this.setState({
					uploadMessage: "Doh. Failed to delete.",				
					saveStatus: 0
				});
				
			});			
			
		}
		else {
			
			// NEW/EDIT RECORD
			axios.post( this.state.config.content_api, {
				item: timelineItem,
				contentType: 'application/json'
			})
			.then((result) => {
				
				// merge this event with timeline ...as opposed to re-getting the whole thing
				this.addEventToTimeline( result );
				
				// get identifier
				var savedEvent = result.data.title;
		  
				console.log( "successfully saved event " + savedEvent );	  
				
				// @TODO - nice if we could take user to this timeline item on main page
				//			
				this.setState({
					uploadMessage: "Successfully saved " + savedEvent,				
					saveStatus: 0
				});
				
				window.timelineComponent.updateItem( timelineItem );
			})
			.catch((err) => {
				console.log(err);
				
				this.setState({
					uploadMessage: "Doh. Failed to save.",				
					saveStatus: 0
				});
				
			});						
		}
		
  }
  
  
  
  
  
  /**
   * Handle merge of timeline item and route user to it on the screen
   */
  addEventToTimeline( timelineItem ) {
	  
	  // @TODO
  }
  
  removeEventFromTimeline( itemName ) {
	  
  }
  
  /**
   * Handle changes to form by updating state
   */
  handleChange(object) {	  
	  
	  var name = '';
	  var value = '';
	  
	  console.log( "object changed is " + object );
	  
	  if ( object instanceof moment ) {
		  
		  // @TODO logic if box ticked first...
		  
		  name = 'date';
		  value = object ;//.format("YYYY-MM-DD");   // @TODO display as object.format("dddd, Do MMM YYYY");  		  
		  this.setState({
			  [name]: value,
			  dateDisplay: object.format("dddd, Do MMM YYYY"), 
			  dateAsNumber: object.valueOf()
		  })
	  }
	  else if ( object.target.name == "unsure-date" ) {
		  
		  if( object.target.checked ) {
			  			  
			  // if date is set already, change it to 1st of month
			  if( this.state.date ) {
				  var newDate = this.state.date.startOf('month')
				  this.setState({ 
					date: newDate,
					dateAsNumber: newDate.valueOf()
				  })
				  
				// strip out the day/date from the displayed date
				// note this will (deliberately) inrease likelihood of merge
				//
				this.setState({
					dateDisplay: this.state.date.format("MMM YYYY")  		  
				})		  	  
			  }
			  
		  }
		  else {
			  // if date is set already, change it to 1st of month
			  if( this.state.date ) {
				  dateDisplay: this.state.date.format("dddd, Do MMM YYYY") 
			  }			  			  
		  }
		  
	  }	  	  
	  else if ( object.target.name === "delete-file" ) {
		  
		  var fileName = object.target.id;
		  var deleteFiles = this.state.filesToDelete;
			  
		  // maintain a list of files to delete on save
		  if( object.target.checked ) {			  			  
			  
			  if( !deleteFiles ) {
				  deleteFiles = []
			  }
			  deleteFiles.push( fileName );
			  			  
			  this.setState({
				  filesToDelete: deleteFiles
			  });			  			  
			  
			  
		  } else {
			  // remove item not longer to be deleted
			  deleteFiles = deleteFiles.filter(e => e !== fileName);
		  }
		  
	  }	
	  else if ( object.target.name === "delete-toggle" ) {
		  		    
			this.setState({
				deleteItem: object.target.value
			});			  			  
			  			  		  
	  }	  	  
	  else {
		  
			 // for everything else we store the raw value
			var name = object.target.name;
			var value = object.target.value;
			this.setState({
				[name]: value
			})
	  }
		  
	  this.setState({		
		saveStatus: 2
	  });
  }

  
  
  /**
   * Handle the rendering of the form
   */
  render() {
	  
	var saveStatus = this.state.saveStatus;
		
	
		
		/*

		const s3Url = 'http://khpublicbucket.s3-website-eu-west-1.amazonaws.com'	

		  const uploadOptions = {
			s3Path: '/Caroline/',		
			signingUrl: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
			signingUrlMethod: 'POST',
			//server: '',		// the absence of this is defaulting it to localhost:3000/undefined during PUT which is causing 404. Adding it uses right file name but...
			accept: 'image/*',
			//signingUrlHeaders={{ additional: headers }}
			//signingUrlQueryParams={{ additional: query-params }}
			signingUrlWithCredentials: false,      // in case when need to pass authentication credentials via CORS
			autoUpload: true		// @TODO change once we have a form/button!		
    };
	    

		<div>
		  <DropzoneS3Uploader
			onFinish={this.handleFinishedUpload}
			s3Url={s3Url}	
			//maxSize={1024 * 1024 * 5}		
			upload={uploadOptions}
			/>
					
		*/

		  //<input type="checkbox" name='del-{f.name}' id='del-{f.name}' selected=false onChange={this.handleChange.bind(this)}/>
				
		  
	var titleText = this.state.title;
	var commentText = this.state.comment;

	// @TODO hack - because something is editing my component outside of React (see warning message)
	// the text box isnt changing to blank on NEW item after an EDIT
	// React state looks fine and only happens on text fields so i'll just blank them here
	//
	if( !this.state.isEdit && (!saveStatus || saveStatus == 0) ) {
		titleText = "";
		commentText = "";
	}
				
	// need to rotate and resize image
	// could use this demo which includes dropzone reference:
	// https://www.npmjs.com/package/react-avatar-editor
	// but this more directly seems to solve it...
	// https://www.npmjs.com/package/react-image-file-resizer
	//
    return (
			
		<div align="left">			
				<div className="dropzone">			
				  <Dropzone size={40} onDrop={ this.onDrop.bind(this) }>
						<p className='handwriting'>Drag or click to upload pics.</p>
				  </Dropzone>				  
				</div>
				
				<div className="subscript">Note: we are all editors of this one item...</div>
				{ 
						(this.state.isEdit? 
						<ToggleButton
							inactiveLabel={"SAVE"}
							activeLabel={"DEL"}
							colors={{
								active: {
								  base: 'rgb(255,0,0)'
								}
							}}
							value={this.state.deleteItem}
							onToggle={(value) => {
								this.setState({
									deleteItem: !value,
									saveStatus: 2
							}) }}
						/>
						: <br/>
						)
				}
				
				<label htmlFor="title">Event*</label>        
				<input type="text" name='title' id='title' value={titleText} size="30" className="menu-input" placeholder='Title or tagline'
					onChange={this.handleChange.bind(this)}/>		

				<form onChange={this.handleChange.bind(this)}>
					<label htmlFor="Friends"><FaceIcon/></label><input type="radio" id="Friends" name="category" value="Friends" checked={this.state.category === "Friends"} />
					<label htmlFor="Family">&nbsp;&nbsp;<SupervisorAccountIcon/></label><input type="radio" id="Family" name="category" value="Family" checked={this.state.category === "Family"} />
					<label htmlFor="Love">&nbsp;&nbsp;<LoveIcon/></label><input type="radio" id="Love" name="category" value="Love" checked={this.state.category === "Love"} />
					<br/>
					<label htmlFor="Work"><WorkIcon/></label><input type="radio" id="Work" name="category" value="Work" checked={this.state.category === "Work"}/>
					<label htmlFor="School">&nbsp;&nbsp;<SchoolIcon/></label><input type="radio" id="School" name="category" value="School" checked={this.state.category === "School"}/>
					<label htmlFor="Success">&nbsp;&nbsp;<StarIcon/></label><input type="radio" id="Success" name="category" value="Success" checked={this.state.category === "Success"}/>
				</form>
				
				<br/>
				<label htmlFor="date">When* </label> (ish: <input type="checkbox" name='unsure-date' id='unsure-date' selected={this.state.unsure} onChange={this.handleChange.bind(this)}/>?)
				<div className='subscript'>(YYYY-MM-DD)</div>
				<DatePicker id="date" dateFormat="YYYY-MM-DD" selected={this.state.date} className="menu-input" size="12" placeholder='YYYY-MM-DD'
					onChange={this.handleChange.bind(this)} /> 
				
				
				<label htmlFor="comment">Comment*</label>        
				<textarea rows='4' columns='40' name='comment' id='comment' value={commentText} className="menu-input" placeholder="Comment (remember you are editing everyones, so include your initials)..."
					onChange={this.handleChange.bind(this)}/>	
					
				<Button id='save-item-button' bsStyle='primary' bsClass='options-btn' 
					disabled={ saveStatus != 0 && saveStatus != 2}
					onClick={ (saveStatus == 0 || saveStatus == 2) ? this.handleSubmit.bind(this) : null}
				>
				
					{(saveStatus == 1 ? 'Saving Event' : (saveStatus == 0 ? 'Click to Save' : (saveStatus == 2 ? 'CLICK TO SAVE*' : 'Enter Title & Date (min.)' )))}
				</Button>
				
				
				<aside>
				  <p>{this.state.uploadMessage}</p>
				  <ul>
					{					
							this.state.fileList.map(f => 
								( this.state.isEdit ? <li key={f} className='list-item'><img src={f} width="30"/>? <input type="checkbox" name='delete-file' id={f} onChange={this.handleChange.bind(this)}/></li>
								: <li key={f} className='list-item'>{f}</li> ) )
					}
				  </ul>
				</aside>
  
			</div>
	  	  
	
    )
  }

  
  
  /**
   * As the files are dropped, we automatically upload them to S3 using axios
   * and change the state of the fileList as we go
   */  			 
  onDrop(files) {

	var uploaded = [];
	
	var mediaFiles = this.state.media;		// start with the existing uploads
	
	if( !mediaFiles ) {
		mediaFiles = [];
	}
	
	// make sure there's a placeholder for these entries.
	this.setState({
		fileList: uploaded,
		media: mediaFiles,
	});
	
			
	// now start a recursive call chain (to avoid bug where the file names being stolen during for loop)
	var f = 0;
	
	this.uploadFile(files, f);
	
	this.setState({ saveStatus: 2 });
			
  }
  
  
  
  
  uploadFile(files, f) {
					
		if( f >= files.length ) {
			return;
		}
		
		var file = files[f];
				
		var TARGET_SIZE = 1.5 // MB
		var qualityRatio = file.size / (1024*1024);
		if ( qualityRatio < TARGET_SIZE )
			qualityRatio = 100
		else
			qualityRatio = Math.round( (TARGET_SIZE * 100) / qualityRatio );

		console.log("about to resize file: " + file.name + " of size " + file.size + " to quality ratio " + qualityRatio);
		Resizer.imageFileResizer(
			file,
			800,
			800,
			'PNG',
			qualityRatio,
			0,
			uri => {
				file.data = uri;
				console.log("resized file" + file + " to " + uri);
			},
			'base64'
		);
		
		console.log("preparing to upload...");

		var uploaded = this.state.fileList;
		var mediaFiles = this.state.media;
				
		var tokens = file.name.split(".");	// look for file extension		
		var suffix = tokens.splice(tokens.length-1,1);	// take off suffix
		var uniqueFileName  = tokens.join('');	// join the rest
		uniqueFileName = uniqueFileName + "_" + f + "_" + moment().valueOf();		// add current time
		uniqueFileName = uniqueFileName + "." + suffix;		// add the suffix again		
	
		axios.post( this.state.config.upload_url, {
		  objectName: this.state.config.s3_folder +  '/' + uniqueFileName,
		  contentType: file.type
		})
		.then((result) => {
		  var signedUrl = result.data.signed_url;
		  
		  var options = {
			headers: {
			  'Content-Type': file.type
			},			
			crossDomain: true			
		  };

		  console.log( "now putting the file " + file + " with URL " + signedUrl );	  
		  
		  return axios.put(signedUrl, file, options)		
		  .then((result) => {
			  console.log(result);
			  
				// add files as we go
			  if( uploaded.indexOf( uniqueFileName < 0 ) ) {
				uploaded.push( uniqueFileName );
			  }

			  var s3File = this.state.config.s3_bucket + '/' + this.state.config.s3_folder + '/' + uniqueFileName;
			  if( mediaFiles.indexOf( s3File < 0 ) ) {
				mediaFiles.push( s3File );
			  }
			  
			  // now update state so we rerender
			  this.setState({
				fileList: uploaded,
				media: mediaFiles,
				uploadMessage: uploaded.length + " files just uploaded"
			  });
			  
		
			  // keep calling recursively until all files are up
			  this.uploadFile(files, f+1)			  
		  })

		})
		.catch(function (err) {
		  console.log(err);
		});
	}
	
  
  

  /*
  
  			<DropzoneS3Uploader
					onFinish={this.handleFinishedUpload}
					s3Url={s3Url}	
					//maxSize={1024 * 1024 * 5}		
					upload={uploadOptions}
				/>  
				
  */
  
}

export default TimelineItemCreator;
	  