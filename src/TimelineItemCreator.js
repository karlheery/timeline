import React, { Component } from 'react';

import Dropzone from 'react-dropzone'

//import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
//import ReactS3Uploader from 'react-s3-uploader';

import axios from 'axios';

import DatePicker from 'react-datepicker';
import * as moment from 'moment';

import Button from 'react-bootstrap/lib/Button';
import './OptionsMenu.css'

import 'react-datepicker/dist/react-datepicker.css';

import WorkIcon from '@material-ui/icons/Work';
import StarIcon from '@material-ui/icons/Star';
import SchoolIcon from '@material-ui/icons/School';
import FaceIcon from '@material-ui/icons/FaceSharp';
import LoveIcon from '@material-ui/icons/FavoriteSharp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';


  
class TimelineItemCreator extends Component {
    
  
  constructor() {
    super()
	
	console.log( "creating creator" );
	
    this.state = { 
		disabled: true, 
		fileList: [],
		saveStatus: false
	}
	
	
	window.itemComponent = this;

  }

  
  /** 
   * Pull timeline event data from state
   */   
  getTimelineEventData() {	  
		// create the timeline item to save & merge
		return  {
				"title_on_date": this.state.title + "|" + this.state.dateDisplay,
				"time_sortable": this.state.dateAsNumber,
				"timeline_name": "Caroline. Our Glue.",
				"title": this.state.title,
				"category": this.state.category,
				"date": this.state.dateDisplay,		/// pass through the stringified date which allows for "unsure"
				"media": this.state.media,
				"comment": this.state.comment
		};
  }
  
  /**
   * set the staet of menu items so that menu renders in edit mode rather than new
   */   
  setMenuState( item ) {
	// change menu state and clear down the state first so we arent editing a previous item	
	
	var tokens = item.title_on_date.split("|");
	var unsure_of_date = false;
	if( tokens.length > 1 && tokens[1].length < 10 ) {	// full dates are stored as YYYY-MM-DD (10 characters)
		unsure_of_date = true
	}
	
	var cal_date = moment(item.date, "dddd, Do MMM YYYY");
	if( !cal_date ) {
		cal_date = moment(item.date, "MMM YYYY");
	}
	
    this.setState({
		title: item.title,
		old_title: item.title,		// for deletion of old
		dateAsNumber: item.time_sortable,	// this doesnt cnie
		category: item.category,
		dateDisplay: cal_date,
		unsure: unsure_of_date,
		media: item.media,
		comment: item.comment,
		isEdit: ( item.title ? true : false )
	})
  }

  
  /**
   * If we close an edit screen we want it to open fresh
   */
  clearMenuState() {
	  
	  this.setState({
		  title: undefined,
		  dateAsNumber: undefined,
		  category: undefined,
		  dateDisplay: undefined,
		  media: undefined,
		  comment: undefined,
		  isEdit: false
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
				
		axios.post('https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items', {
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
			
		})
		.catch((err) => {
			console.log(err);
		});
	
  }
  
  
  
  
  
  /**
   * Handle merge of timeline item and route user to it on the screen
   */
  addEventToTimeline( timelineItem ) {
	  
	  // @TODO
  }
  
  
  /**
   * Handle changes to form by updating state
   */
  handleChange(object) {	  
	  
	  var name = '';
	  var value = '';
	  
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
	  else {
		  
			 // for everything else we store the raw value
			var name = object.target.name;
			var value = object.target.value;
			this.setState({
				[name]: value
			})
	  }
	  	 
  }

  
  render() {
	  
	var saveStatus = this.state.saveStatus;
	
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
	    
	console.log( "will upload files to " + s3Url );
	
		
		/*
		<div>
		  <DropzoneS3Uploader
			onFinish={this.handleFinishedUpload}
			s3Url={s3Url}	
			//maxSize={1024 * 1024 * 5}		
			upload={uploadOptions}
			/>
					
		*/

		  
    return (
			
		<div>
			<table border="0" cellPadding="1">
			<tbody>
			<tr>
			<td>
				<label htmlFor="title">Event</label>        
				<input type="text" name='title' id='title' value={this.state.title} size="30" className="menu-input" placeholder='Title or tagline (optional)'
					onChange={this.handleChange.bind(this)}/>		

				<form onChange={this.handleChange.bind(this)}>
					<label htmlFor="Friends"><FaceIcon/></label><input type="radio" id="Friends" name="category" value="Friends"/>
					<label htmlFor="Family">&nbsp;&nbsp;<SupervisorAccountIcon/></label><input type="radio" id="Family" name="category" value="Family"/>
					<label htmlFor="Love">&nbsp;&nbsp;<LoveIcon/></label><input type="radio" id="Love" name="category" value="Love"/>
					<br/>
					<label htmlFor="Work"><WorkIcon/></label><input type="radio" id="Work" name="category" value="Work"/>
					<label htmlFor="School">&nbsp;&nbsp;<SchoolIcon/></label><input type="radio" id="School" name="category" value="School"/>
					<label htmlFor="Success">&nbsp;&nbsp;<StarIcon/></label><input type="radio" id="Success" name="category" value="Success"/>
				</form>
				
				<br/>
				<label htmlFor="date">When</label> (ish: <input type="checkbox" name='unsure-date' id='unsure-date' selected={this.state.unsure} onChange={this.handleChange.bind(this)}/>?)

				<DatePicker id="date" dateFormat="YYYY-MM-DD" selected={this.state.date} className="menu-input" size="12" 
					onChange={this.handleChange.bind(this)} /> 
				
				<label htmlFor="comment">Comment</label>        
				<textarea rows='4' columns='40' name='comment' id='comment' value={this.state.comment} className="menu-input" placeholder="Comment (include your initials)..."
					onChange={this.handleChange.bind(this)}/>	
				
				<Button id='save-comment-button' bsStyle='primary' bsClass='options-btn' 
					disabled={saveStatus != 0}
					onClick={saveStatus == 0 ? this.handleSubmit.bind(this) : null}
				>
				
					{(saveStatus == 1 ? 'Saving Event' : (saveStatus == 0 ? 'Click to Save' : 'Enter Title & Date (min.)' ))}
				</Button>				
				<br/>
				<br/>
		 		 
				<section>
				<div className="dropzone">
				
				  <Dropzone 
					size = { 150 }
					onDrop={ this.onDrop.bind(this) } 						
				  >
					<p>Click to upload pic.</p>
				  </Dropzone>
				  
				
				</div>
				
				<aside>
				  <p>{this.state.uploadMessage}</p>
				  <ul>
					{
					  this.state.fileList.map(f => <li key='{f.name}' className='list-item'>{f.name} - {f.size} bytes</li>)
					}
				  </ul>
				</aside>
				</section>
	  
  
			  </td>
			  </tr>
			  </tbody>
			  </table>
			  </div>
	  	  
	
    )
  }

  
  
  /**
   * As the files are dropped, we automatically upload them to S3 using axios
   * and change the state of the fileList as we go
   */  			 
  onDrop(files) {

	var uploaded = [];
	var mediaFiles = []
			
	
	// iterate through files uploading them to S3
	for(var f=0; f < files.length; f++) {			
				
		var file = files[f];
	
		axios.post('https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy', {
		  objectName: 'Caroline/' + file.name,
		  contentType: file.type
		})
		.then(function (result) {
		  var signedUrl = result.data.signed_url;
		  
		  var options = {
			headers: {
			  'Content-Type': file.type
			},			
			crossDomain: true			
		  };

		  console.log( "now putting the file " + file + " with URL " + signedUrl );	  
		  return axios.put(signedUrl, file, options);
		})
		.then((result) => {
		  console.log(result);

			// add files as we go
		  uploaded.push( file );
		  mediaFiles.push( 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/' + file.name );
		  
		  // now update state so we rerender
		  this.setState({
			fileList: uploaded,
			media: mediaFiles,
			uploadMessage: uploaded.length + " files just uploaded"
		  });


		})
		.catch(function (err) {
		  console.log(err);
		});
	}
	

	
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
	  