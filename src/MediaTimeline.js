import React, { Component } from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

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
					title: "Test Timeline Title!",
					category: "Friends",
					date: "2012-04-20",
					media: ["https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5816.JPG"],
					comment: "This is a test comment!"
				},
				{					
					title: "Test Timeline Title 2",
					category: "Love",
					date: "2015-04-20",			
					media: ["https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5815.JPG", "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5817.JPG"],					
					comment: "This is another test comment!"					
				},
				{					
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
		menu: this.props.menu		
	};
		
	
  }
	
		
  // called by ReactJS after `render()`
  componentDidMount() {   
	this.getTimeline();					
  }
  
	
  /**
   * Open the menu to allow editing of the clicked item
   */
  editItem (event) {
	console.log( "editing item " + event );
    this.state.menu.openMenu();    
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
  
  
  /**
   * Build and display the timeline
   */
  render() {
	  	
	var timelineContent = this.state.timelineData;
	console.log( "rendering timeline " + timelineContent );
	
	if( !timelineContent ) {
		timelineContent = {};
		timelineContent.content = [];
	}
		 		 
	
	for( var i=0; i<timelineContent.content.length; i++ ) {
		
		if( timelineContent.content[i].category === "Friends" ) {
          timelineContent.content[i].category = <FaceIcon/>;
		}
		else if ( timelineContent.content[i].category === "Love" ) {        
		  timelineContent.content[i].category = <LoveIcon/>;
		}
		else if ( timelineContent.content[i].category === "Work" ) {        
		  timelineContent.content[i].category = <WorkIcon/>;
		}
		else if ( timelineContent.content[i].category === "School" ) {        
		  timelineContent.content[i].category = <SchoolIcon/>;
		}
		else if ( timelineContent.content[i].category === "Family" ) {        
		  timelineContent.content[i].category = <SupervisorAccountIcon/>
		}
		else if ( timelineContent.content[i].category === "Success" ) {        
		  timelineContent.content[i].category = <StarIcon/>;
		}


      
	}
	
		
		
	/*
	      <div className="Timeline">
		<VerticalTimeline>
		  <VerticalTimelineElement
			className="vertical-timeline-element--work"
			date="2011 - present"
			iconOnClick={ this.editItem }
			iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
			icon={<FaceIcon	 />}
		  >
			<h3 className="vertical-timeline-element-title">Creative Director</h3>
			<h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
			<p>
				<img src={caro} className="App-itemimage" align="left" />				
			   Creative Direction, User Experience, Visual Design, Project Management, Team Leading
			</p>
		  </VerticalTimelineElement>
		  <VerticalTimelineElement
			className="vertical-timeline-element--work"
			date="2010 - 2011"
			iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
			icon={<SchoolIcon />}
		  >
			<h3 className="vertical-timeline-element-title">Art Director</h3>
			<h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
			<p>
			  Creative Direction, User Experience, Visual Design, SEO, Online Marketing
			</p>
		  </VerticalTimelineElement>
		  <VerticalTimelineElement
			className="vertical-timeline-element--work"
			date="2008 - 2010"
			iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
			icon={<StarIcon />}
		  >
			<h3 className="vertical-timeline-element-title">Web Designer</h3>
			<h4 className="vertical-timeline-element-subtitle">Los Angeles, CA</h4>
			<p>
			  User Experience, Visual Design
			</p>
		  </VerticalTimelineElement>
		  <VerticalTimelineElement
			className="vertical-timeline-element--work"
			date="2006 - 2008"
			iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
			icon={<WorkIcon />}
		  >
			<h3 className="vertical-timeline-element-title">Web Designer</h3>
			<h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
			<p>
			  User Experience, Visual Design
			</p>
		  </VerticalTimelineElement>
		  <VerticalTimelineElement
			className="vertical-timeline-element--work"
			date="2006 - 2008"
			iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
			icon={<LoveIcon />}
		  >
			<h3 className="vertical-timeline-element-title">Web Designer</h3>
			<h4 className="vertical-timeline-element-subtitle">San Francisco, CA</h4>
			<p>
			  User Experience, Visual Design
			</p>
		  </VerticalTimelineElement>
		</VerticalTimeline>
      </div>
	*/
	
    return (
				<div id='timeline'>
					<VerticalTimeline>
						{timelineContent.content.map(function(contentItem){
							return <VerticalTimelineElement key={contentItem.date} className='vertical-timeline-element--work'
									date={contentItem.date}
									iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
									iconOnClick={() => this.editItem()}			// @TODO need to do something funky here as this is not the object - context is within map
									icon={<StarIcon />} 
									>	
										{(contentItem.media && contentItem.media.length >= 1 ? 										
											( contentItem.media.length >=2 ?
												<div><img src={contentItem.media[0]} className='App-itemimage' align='top' /><img src={contentItem.media[1]} className='App-itemimage' align='top' /></div> : 
												<img src={contentItem.media[0]} className='App-itemimage' align='left' /> ) : "" )}
											
										<h3 className='vertical-timeline-element-title'></h3>										
										<p>{contentItem.category} <i>"{contentItem.comment}"</i></p>
									</VerticalTimelineElement>
						})}
					</VerticalTimeline>
				</div>
	);
  }
  
}

export default MediaTimeline;

