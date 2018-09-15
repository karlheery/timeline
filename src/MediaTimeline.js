import React, { Component } from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import caro from './Banner_Image.jpg';

import WorkIcon from '@material-ui/icons/Work';
import StarIcon from '@material-ui/icons/Star';
import SchoolIcon from '@material-ui/icons/School';
import FaceIcon from '@material-ui/icons/FaceSharp';
import LoveIcon from '@material-ui/icons/FavoriteSharp';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

class MediaTimeline extends Component {
	
  constructor() {
	  
	super();
	
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
					title: "Friends stick together!",
					category: "Friends",
					date: "2012-04-20",
					media: "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5816.JPG",
					comment: "Ah look!"
				},
				{					
					title: "Budding romance",
					category: "Love",
					date: "2015-04-20",			
					media: "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5815.JPG",					
					comment: "Budding romance"					
				},
				{					
					title: "Christmas to remember",
					category: "Friends",
					date: "2016-12",					
					media: "https://s3-eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5787.PNG",
					comment: "One of many. Thank you for the great times Caro!"					
				},				
			]
    };
  }
	
		
  // called by ReactJS after `render()`
  componentDidMount() {   
    // pass referemce to this timeline on to menu
	// @TODO on click of item, change the clicked entru
	//this.menu.setTimeline(this);
	this.setState({menu: this.props.menu });
	
  }
	
  /**
   * Open the menu to allow editing of the clicked item
   */
  editItem (event) {
	console.log( "editing item " + event );
    this.state.menu.openMenu();    
  }
  
  
  
  /**
   * @TODO Should call API
   */
  getTimeline() {
	  return this.exampleTimeline;
  }
  
  
  
  /**
   * Build and display the timeline
   */
  render() {
	  
	var timelineContent = this.getTimeline();
	
	
	for( var i=0; i<timelineContent.content.length; i++ ) {
		
		if( timelineContent.content[i].category == "Friends" ) {
          timelineContent.content[i].category = <FaceIcon/>;
		}
		else if ( timelineContent.content[i].category == "Love" ) {        
		  timelineContent.content[i].category = <LoveIcon/>;
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
										<img src='https://s3.eu-west-1.amazonaws.com/khpublicbucket/Caroline/IMG_5787.PNG' className='App-itemimage' align='left' />	
										<h3 className='vertical-timeline-element-title'>{contentItem.category}</h3>										
										<p><i>"{contentItem.comment}"</i> - {contentItem.author}</p>
									</VerticalTimelineElement>
						})}
					</VerticalTimeline>
				</div>
	);
  }
  
}

export default MediaTimeline;

