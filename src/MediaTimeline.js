import React, { Component } from 'react';
import { PropTypes } from 'react'

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import MediaItem  from './MediaItem';

import axios from 'axios';

import caro from './Banner_Image.jpg';

import WorkIcon from '@material-ui/icons/Work';
import StarIcon from '@material-ui/icons/Star';
import SchoolIcon from '@material-ui/icons/School';
import FaceIcon from '@material-ui/icons/FaceSharp';
import LoveIcon from '@material-ui/icons/FavoriteSharp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';


class MediaTimeline extends Component {
	
  constructor(props) {
	  
	super(props);
	
	/** These are defaults for testing. Real list is queried from Dynamo DB through API Gateway & Lambda */
	this.exampleTimeline = {
        name: "Caroline's Timeline",
            background: "http://localhost:8080/TimelineShow/test_images/test_background.jpg",
            description: "A beautiful life...",
            bucket_url: "http://localhost:8080/TimelineShow/test_images/media/",
            basedir: "",
            name_contains: "",
			chapters: [
				{
					from_date: "1979-02-07",
					to_date: "1997-06-30",
					name: "The Wonder Years",
					background: "http://localhost:8080/TimelineShow/test_images/test_background.jpg"					
				},
				{
					from_date: "1997-07-31",
					to_date: "2018-08-07",
					name: "The Good Years",
					background: "http://localhost:8080/TimelineShow/test_images/Malahide_Background_v1.jpg"					
				}				
			],
            content: [ 
				{					
					title_on_date: "Test Timeline Title!|1000",
					time_sortable: 1000,
					title: "Test Timeline Title!",
					category: "Friends",
					date: "2012-04-20",
					media: ["https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5816.JPG"],
					comment: "This is a test comment!"
				},
				{					
					title_on_date: "Test Timeline Title 2|1001",
					time_sortable: 1001,				
					title: "Test Timeline Title 2",
					category: "Love",
					date: "2015-04-20",			
					media: ["https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/95E9EFBD-4FC3-4524-A06C-5F4A3035E345_0_1538256967385.jpeg", "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5817.JPG"],					
					comment: "This is another test comment!"					
				},
				{					
					title_on_date: "Test Timeline Title 3!|1002",
					time_sortable: 1002,				
					title: "Test Timeline Title 3!",
					category: "Friends",
					date: "2016-12",					
					media: [],
					comment: "This is yet another test comment!"					
				},				
			]
    };
	
	// set initial state
	this.state = {
		menuController: this.props.app,
		chapterIndex: 0
	};
	
	this.editItem = this.editItem.bind(this);
	
	window.timelineComponent = this;
	
  }
	
		
  // called by ReactJS after `render()`
  componentDidMount() {   
	this.getTimeline();	

	this.timerID = setInterval(() => this.changeBackground(), 5000 );
  }
  
	
  /**
   * Open the menu to allow editing of the clicked item
   */
  editItem (item) {
	console.log( "editing item " + item );	
		
	if( !item || !item.title ) {
		console.error( "couldnt find item to edit: " + item );
	}
	
	// now open the menu with this item as its state
	window.menuComponent.openMenuToEdit( item );	
  }
  
  
  /**
   * Update an item following a save
   */
   updateItem( item ) {
	   
	   var timelineContent = this.state.timelineData;
	   
	   for( var i=0; i<timelineContent.content.length; i++ ) {
		   
		   // replace the item
			if( timelineContent.content[i].title_on_date === item.title_on_date ) {
				timelineContent.content[i] = item;
			}
	   }
	   
  	   // reset state
	   this.setTimeline( timelineContent );

	   try {
			// now try scroll it into view
			var elmnt = document.getElementById( item.title_on_date );
			elmnt.scrollIntoView();
	   }
	   catch(err) {
		   // swallow it
	   }
	   	   
   }
   
   
   deleteItem( itemName ) {
	   
	   var timelineContent = this.state.timelineData;

	   var prev_title = "";
	   
	   for( var i=0; i<timelineContent.content.length; i++ ) {

			// replace the item
			if( timelineContent.content[i].title_on_date === itemName ) {
				timelineContent.splice(i,1);
			}
			
			prev_title = timelineContent.content[i].title_on_date;
	   }
	   
  	   // reset state
	   this.setTimeline( timelineContent );

	   try {
			// now try scroll previous one  into view
			var elmnt = document.getElementById( prev_title );
			elmnt.scrollIntoView();
	   }
	   catch(err) {
		   // swallow it
	   }

	   
   }
   
   
  
  
  
  /**
   * Call API to retrieve timeline from AWS, or default to example timeline as a last resort
   */
  getTimeline() {
	  				
		var queryParams = {
				timeline_name: "Caroline. Our Glue."
		};
		
		console.log( "querying timeline with params " + queryParams );
				
	  	axios.get('https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items', {
			 params: queryParams
		})
		.then((result) => {			// these arrows are used so we can call other methods and setState (indirectly) from within
			
			console.log( "successfully retrieved timeline data " + JSON.stringify(result.data) );	  
			
			/**
				{
				  "chapters": [
					{
					  "name": "The Wonder Years",
					  "from_date": "1979-02-07",
					  "to_date": "1991-06-30",
					  "background": "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/Backgrounds/WonderYears.jpg"
					},
					{
					  "name": "Young Fun",
					  "from_date": "1991-07-01",
					  "to_date": "1997-06-30",
					  "background": "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/Backgrounds/TakeThat.jpg"
					},
					{
					  "name": "Girl About Town",
					  "from_date": "1997-07-01",
					  "to_date": "2018-09-01",
					  "background": "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/Backgrounds/Malahide_Background_v1.jpg"
					}
				  ],
				  "description": "The beautiful life of Caroline McConkey",
				  "name": "Caroline. Our Glue.",
				  "content": [
					{
					  "category": "Love",
					  "comment": "This is just a test",
					  "timeline_name": "Caroline. Our Glue.",
					  "date": "Jan-2015",
					  "media": [
						"https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5815.JPG",
						"https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5815.JPG"
					  ],
					  "title": "Test Item"
					}
				  ]
				}
			*/
			
			this.setTimeline( result.data );			

		})
		.catch((err) => {
			console.error( err );
			alert("Cant show timeline right now - sorry! Check back later", err);
			this.setTimeline( this.exampleTimeline );
		});
		
		

  }
  
  
  /**
   * Save some newly source timeline data, eg from API call
   */
  setTimeline( tData ) {	  
	  this.setState({				
			timelineData: tData
	  });
	  console.log( "timeline data saved: " + this.state.timelineData );
  }
  
  
  shouldComponentUpdate() {
	  return true;
  }
  
  
  
  openModal(file) {
	console.log("open image here" );	// @TODO	
  }
  
  
  /** 
   * Rotate to next background image. @TODO - change it based on period in timeline
   */
  changeBackground() {
	  
	  var i = 0
	  console.log( "chapterIndex " + this.state.chapterIndex );
	  
	  if( this.state.chapterIndex ) {
		  i = this.state.chapterIndex;
	  }
	  
	  i = i+1;
	  
	  if( this.state.timelineData.chapters && i >= this.state.timelineData.chapters.length ) {
		  i = 0;
	  }
	  
	  console.log( "changing to backgound " + i )
	  	  
	  
	  var imgName = this.state.timelineData.chapters[i].background;
	  console.log( "new background image is " + imgName )
	  	  	  
	  document.body.style.backgroundImage = "url('" + imgName + "')";
	  
	  this.setState( {
		  chapterIndex: i
	  });
	  
  }
  
  
  
  
  /**
   * Build and display the timeline
   */
  render() {
	  	
	var timelineContent = this.state.timelineData;
	
	if( !timelineContent ) {
		timelineContent = {};
		timelineContent.content = [];
	}
	
	//console.log( "rendering timeline with " + timelineContent.content.length + " items" );	
	
	for( var i=0; i<timelineContent.content.length; i++ ) {
		
		//console.log( " item: " + timelineContent.content[i].title_on_date );
		
		if( timelineContent.content[i].category === "Friends" ) {
          timelineContent.content[i].category_icon = <FaceIcon/>;
		}
		else if ( timelineContent.content[i].category === "Love" ) {        
		  timelineContent.content[i].category_icon = <LoveIcon/>;
		}
		else if ( timelineContent.content[i].category === "Work" ) {        
		  timelineContent.content[i].category_icon = <WorkIcon/>;
		}
		else if ( timelineContent.content[i].category === "School" ) {        
		  timelineContent.content[i].category_icon = <SchoolIcon/>;
		}
		else if ( timelineContent.content[i].category === "Family" ) {        
		  timelineContent.content[i].category_icon = <SupervisorAccountIcon/>
		}
		else if ( timelineContent.content[i].category === "Success" ) {        
		  timelineContent.content[i].category_icon = <StarIcon/>;
		}

      
	}
	
		
	/* FOR TESTING
	var mockItem = { 	
					title_on_date: "Test Timeline Title 2|1001",
					time_sortable: 1001,				
						title: "Test Timeline Title 2",
					category: "Love",
					date: "2015-04-20",			
					media: ["https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/95E9EFBD-4FC3-4524-A06C-5F4A3035E345_0_1538256967385.jpeg", "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/95E9EFBD-4FC3-4524-A06C-5F4A3035E345_0_1538256967385.jpeg"],					
					comment: "This is another test comment!"					
				};

	
	    return (
				<div id='timeline'>
				
					<MediaItem contentItem={mockItem}/>
				
				</div>
	);
	*/

				
    return (
				<div id='timeline'>
								
					<VerticalTimeline>
						{timelineContent.content.map((contentItem) => {
							return <VerticalTimelineElement key={contentItem.title_on_date} id={contentItem.title_on_date} 
									className='vertical-timeline-element--work'
									date={contentItem.date}
									iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
									iconOnClick={() => this.editItem(contentItem)}			// @TODO need to do something funky here as this is not the object - context is within map
									icon={contentItem.category_icon} 
									>	
										<MediaItem contentItem={contentItem}/>										
									</VerticalTimelineElement>
						})}
					</VerticalTimeline>
				</div>
	);
  }
  
}

export default MediaTimeline;

