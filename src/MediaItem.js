import React, { Component } from 'react';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";


class MediaItem extends Component {
	
  constructor(props) {
	  
	super(props);
		
	// set initial state
	this.state = {
		item: this.props.contentItem
	};
	
	this.expandItem = this.expandItem.bind(this);
	
  }
	
		
  // called by ReactJS after `render()`
  componentDidMount() {   
	
	//this.timerID = setInterval(() => this.doSOmething(), 1000 );
  }
  
	
  /**
   * Open the menu to allow editing of the clicked item
   */
  expandItem (item) {
	console.log( "expanding item " + item );	
		
	if( !item || !item.title ) {
		console.error( "couldnt find item to edit: " + item );
	}
	
	// now open the menu with this item as its state
	//window.menuComponent.openMenuToEdit( item );	
  }
    
  
  openModal(file) {
	console.log("open image here" );	// @TODO	
  }
  
  
  /**
   * Build and display the timeline
   */
  render() {
	  
	  
	  			
	var contentItem = this.state.item;
		
	//console.log( "rendering item with " + contentItem.media.length + " media") ;

    const settings = {
		className: "slider variable-width",
		variableWidth: true,
		adaptiveHeight: true,
		dots: true,		
		infinite: true,
		speed: 8000,
		autoplay: true,
		autoplaySpeed: 200,
		slidesToShow: 1,
		slidesToScroll: 1
	};
	
	
	if( !contentItem.media || !Array.isArray(contentItem.media) ) {
		contentItem.media = [];
	}
				
				
    return (
			<div name="media">
				<p className='handwriting'><i>{contentItem.date}</i></p>
				
				<Slider {...settings}>
				
				{					
						contentItem.media.map(f => ( <div key={f}><img src={f} className='App-itemimage' onClick={()=>this.openModal(f)}/></div> ))						
				}
				
				</Slider>
				
											
				<h3 className='handwriting'>{contentItem.title}</h3>										
				<p className='handwriting'>{contentItem.comment}</p>
				
			</div>						
	);
  }
  
}

export default MediaItem;

