import React, { Component } from 'react';

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app
 
import EditIcon from '@material-ui/icons/Edit';


class MediaItem extends Component {
	
  constructor(props) {
	  
		super(props);
			
		// set initial state
		this.state = {
			item: this.props.contentItem,
			show_details: this.props.show_details,
			vizStyle: this.props.vizStyle
		};
		
		this.expandItem = this.expandItem.bind(this);
		
  }
	

  getId() {
	  return this.state.item.title_on_date;
  }
		
  // called by ReactJS after `render()`
  componentDidMount() {   
			//this.timerID = setInterval(() => this.doSOmething(), 1000 );
  }
	
	
	/**
	 * update the item, perhaps as a result of an edit, so we can show changes in real-time	 
	 */
	updateItem ( changedItem ) {
			this.setState({
				item: changedItem
			})
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
		
		console.log("open image here " + file );	// @TODO	

		var contentItem = this.state.item;
		var index = contentItem.media.findIndex(obj => obj==file);
		console.log("at index " + index  );	

		this.setState({
			lightboxOpen: true,			
			lightboxFileIndex: index
		});	
			
  }
  

	/*
	 * Return number of content items within this MediaItem, perhaps to helps set delay on scroll
	 */
	getNumberContentItems() {
	
		var contentItem = this.state.item;

		if( !contentItem.media || !Array.isArray(contentItem.media) ) {
			return 1;
		}

		return contentItem.media.length;
	
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
	

	var imgStyle = ( ("Scrapbook" == this.state.vizStyle) ? "scrap-img-for-slider" : "App-itemimage" )
	
	if( !contentItem.media || !Array.isArray(contentItem.media) ) {
		contentItem.media = [];
	}	
					
	// now i have react avatar for user rotating, i dont need to do any best effort using ExifOrientationImg...so removed this... contentItem.media.map(f => ( <div key={f}><ExifOrientationImg src={f} className={imgStyle} onClick={()=>this.openModal(f)}/></div> ))						
    return (
			<div name="media">		
				
				{this.state.show_details && (		
				<p className='handwriting'><i>{contentItem.date}</i></p>				
				)}

				{contentItem.media && (contentItem.media.length > 1 || (contentItem.media.length == 1 && !contentItem.media[0].toLowerCase().endsWith(('.mp4', '.avi', '.mov')))) && (
					<Slider {...settings}>				
					{					
						contentItem.media.map(f => ( <div key={f}><img src={f} className={imgStyle} onClick={()=>this.openModal(f)}/></div> ))						
					}
					</Slider>
				)}
				
				{contentItem.media && contentItem.media.length == 1 && contentItem.media[0].toLowerCase().endsWith(('.mp4', '.avi', '.mov')) && (
					<video controls>
						<source src={contentItem.media[0]} className='App-itemmovie' onClick={()=>this.openModal(contentItem.media[0])}/>
						Your browser does not support the video tag.
					</video>		  						
					
				)}


				{this.state.lightboxOpen && (
				<Lightbox
					mainSrc={contentItem.media[this.state.lightboxFileIndex]}
					imageTitle={contentItem.title}
					imageCaption={contentItem.comment}
					nextSrc={contentItem.media[(this.state.lightboxFileIndex + 1) % contentItem.media.length]}
					prevSrc={contentItem.media[(this.state.lightboxFileIndex + contentItem.media.length - 1) % contentItem.media.length]}
					onCloseRequest={() => this.setState({ lightboxOpen: false })}
					onMovePrevRequest={() =>
					this.setState({
						lightboxFileIndex: (this.state.lightboxFileIndex + contentItem.media.length - 1) % contentItem.media.length,
					})
					}
					onMoveNextRequest={() =>
					this.setState({
						lightboxFileIndex: (this.state.lightboxFileIndex + 1) % contentItem.media.length,
					})
					}
				/>		  
				)}

				{this.state.show_details && (						
					<React.Fragment>
					<h3 className='handwriting'>{contentItem.title}</h3>										
					<p className='handwriting'>{contentItem.comment}</p>
					</React.Fragment>
				)}

				
				
			</div>						
	);
  }

  /**
   * Moved Edit button to text box in MediaTimeline up a level
    				<div align="right" valign="top">
					<EditIcon className="hoverable-img" onClick={() => window.timelineComponent.editItem(this.state.item)}/>
				</div>

   */
}

export default MediaItem;

