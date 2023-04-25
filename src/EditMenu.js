import React, { Component } from 'react';
import DetailsFormCreator from './TimelineDetailsForm';
import './OptionsMenu.css'

  
class EditMenu extends Component {
	  

  constructor(props) {
    super(props)
			
    this.state = { 
		timeline_name: this.props.timeline_name,
		timeline_data: this.props.timeline_data,
		config: this.props.config,
		saveStatus: 0,
		vizStyle: this.props.vizStyle,
        all_timelines_uri: props.backend_uri
	}
	
	this.optionsMenu = props.menu;

	window.itemComponent = this;

  }



  componentDidMount() {

	window.timelineCreator = this;	

  }




  /**
   * Change style in line with Timeline or Scrapbook
   * @param {*} vStyle 
   */
  setMenuStyle( vStyle ) {	  
    this.setState({
		vizStyle: vStyle
	})

  }


  clearAndExit() {
	this.clearMenuState();
	this.optionsMenu.closeMenu();
  }


  /**
   * set the staet of menu items so that menu renders in edit mode rather than new
   */   
  setMenuState( item ) {
	
	console.log( "editing item " + item.title );
	this.clearMenuState();
	
		
	var unsure_of_date = false;
	if( item.date && item.date.length < 9 ) {	// full dates are stored as dddd, Do MMM YYYY (18 characters)
		unsure_of_date = true
	}
	
    this.setState({
		title: item.title,
		media: item.timeline_data,
		old_title: item.title_on_date,		// for deletion of old
		dateAsNumber: item.time_sortable,	// this doesnt cnie
		category: item.category,
		dateDisplay: item.date,
		unsure: unsure_of_date,
		media: item.media,				
		comment: item.comment,
		uploadMessage: "",
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
		media: undefined,
		dateAsNumber: undefined,
		category: "Friends",
		date: undefined,
		dateDisplay: undefined,
		unsure: undefined,
		media: undefined,
		comment: undefined,
		uploadMessage: undefined,
		isEdit: false,
		disabled: true, 		
		filesToUpload: [],
		rotations: [],
		saveStatus: 0,
		filePreloadComplete: false	
	})
	  
  }
  
  

  /**
   * Show a modal to capture data and create a new timeline
   * @param {*} codeInput 
   */
    editStory() {    
        this.setState({
            formOpen: true
        });
    }
  


    /**
	* Handle the call from child component to close the timeline creation screen

	* @param {*} shortCode 
	*/
   closeEdit = (shortCode) =>  {		
    console.log("closing details form")
    this.setState({
        formOpen: false
    });
    
}


  /**
   * Handle the rendering of the form
   */
  render() {
	  
	var saveStatus = this.state.saveStatus;
				
		  	
    return (
			
		<div align="left">			
                <DetailsFormCreator isOpen={this.state.formOpen} handleDetailsFormClose={this.closeEdit} backend_uri={this.state.all_timelines_uri} is_new={false} timeline_props={this.props}/>
				<div className="editmenu">			                    
                    <p>
                        <a className="menu-a" href="#" onClick={() => this.editStory()}>Edit Story</a>                    
                    </p>
                    <p>
                        <a className="menu-a" href="#">More Options...</a>                                        
                    </p>                        
                            
				</div>
				
			
				<aside>
				  <p>{this.state.uploadMessage}</p>
				</aside>
  
		</div>	  	  
	
    )
  }

}

export default EditMenu;
