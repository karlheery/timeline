import React, { Component } from 'react';

import './scrapbook-style.css';
import MediaItem  from '../MediaItem';
import EditIcon from '@material-ui/icons/Edit';


class ScrapbookDisplay extends Component {

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
            timelineData: this.props.timelineContent,
            medialist: this.medialist,            
            playOrPauseAction: "Pause"
        };
                

    }


    // called by ReactJS after `render()`
    componentDidMount() {   
        
    }


    componentWillUnmount(){

    }



    render() {
	  	
        var timelineContent = this.state.timelineData;
        
        		//used to say style="--aspect-ratio: 4/3;"   ...or 4/3 for middle one
		let imgStyle = {
			aspect_ratio: 3/5
		};
		let vidStyle = {
			aspect_ratio: 4/3
		};

		let gridStyle = this.getGridTemplateStyle()

		let imgPos = [ "1/span 7", "span 7/-1" ]		// bit of randomness on -1 vs. -2 or 5/6/7 ...depending on size
		let pPos = [ "span 4/-1", "2/span 4" ]  // bit of randomness
				
		  
		console.log( timelineContent.content.length + " items to show")

		return (	<React.Fragment>
					<div className='scrap-grid' style={{gridTemplateRows: gridStyle}}>
						
						{timelineContent.description && <header>
							<h2 className='scrap-h2'>{timelineContent.description}</h2>
						</header>}

						{timelineContent.content.map((contentItem) => {
							return <React.Fragment>
										<figure className="scrap-fig" key={contentItem.title_on_date} 
											style={{gridColumn: imgPos[this.getItemRowIndex(timelineContent, contentItem)%2], gridRow: 'fig'+this.getItemRowIndex(timelineContent, contentItem)}} key={contentItem.title_on_date} id={contentItem.title_on_date}
											onClick={() => window.menuComponent.closeMenu()}
										>												
												<MediaItem className="scrap-img" contentItem={contentItem} show_details={false}													
													vizStyle={this.props.vizStyle}
												/>									
										</figure>
										<p className="scrap-p" style={{gridColumn: pPos[this.getItemRowIndex(timelineContent, contentItem)%2], gridRow: 'p'+this.getItemRowIndex(timelineContent, contentItem), transform:'rotate(-0.8deg)', WebkitTransform: 'rotate(-0.8deg)'}}>
											{contentItem.comment} 
											<br/>
											<EditIcon className="hoverable-img" onClick={() => window.timelineComponent.editItem(contentItem)}/>
										</p>										
									</React.Fragment>
						})}
											
					</div>

					<div>
						
						<section className="end" ref={(section) => { this.EndOfTimeline = section; }}></section>		
					</div>
					</React.Fragment>		
		);


    }


	//removed this from MediaItem until we figure out whole ref forwarding from child to parent
	// think its needed to help move item into view after edit and ref={(item) => { this.saveRef( contentItem.title_on_date, item ); }}


	/**
	 * generate the grid-area for grid-template-rows
	 */
	 getGridTemplateStyle() {

		let tc = this.state.timelineData
	
		let style = "[header-start] auto ";		
	
		for( var i=0; i<tc.content.length; i++ ) {
	
			if( i == 0 ) {
				style += "[fig1-start] 3rem [header-end] minmax(var(--verticalPadding), auto) [p1-start] minmax(0, auto) [p1-end] minmax(var(--verticalPadding), auto) "
			}
			else {
				//  [fig2-start] var(--overlap) [fig1-end] minmax(var(--verticalPadding), auto) [p2-start] minmax(0, auto) [p2-end] minmax(var(--verticalPadding), auto) [fig3-start] var(--overlap) [fig2-end] minmax(var(--verticalPadding), auto) [p3-start] minmax(0, auto) [p3-end] minmax(var(--verticalPadding), auto) [fig4-start] var(--overlap) [fig3-end] minmax(var(--verticalPadding), auto) [p4-start] minmax(0, auto) [p4-end] minmax(var(--verticalPadding), auto) [fig4-end];
				style += "[fig" + (i+1) + "-start] var(--overlap) [fig" + i + "-end] minmax(var(--verticalPadding), auto) [p" + (i+1) + "-start] minmax(0, auto) [p" + (i+1) + "-end] minmax(var(--verticalPadding), auto) "
			}
	
		}
	
		console.debug( "generated grid style " + style )
		return style	   
	
	  }
	
	


    /**
	 * Need function to generate random-ish positioning but increment grid-row
	 */   
	getItemRowIndex( tc, item ) {

		for( var i=0; i<tc.content.length; i++ ) {
					
			if( tc.content[i].title_on_date === item.title_on_date ) {
				//console.log( "item is at index " + (i+1) )
				return i+1;
			}
		}
		
		return 100;	
	}




}

export default ScrapbookDisplay;
