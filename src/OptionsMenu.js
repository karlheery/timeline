import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import './OptionsMenu.css';
import TimelineItemCreator  from './TimelineItemCreator';


class OptionsMenu extends React.Component {
	
  constructor (props) {
    super(props)
    this.state = {
      timeline_name: props.timeline_name,
      vizStyle: props.vizStyle,
      config: props.config,
      menuOpen: false
    }
	
	console.log( "creating options menu" );
		
	window.menuComponent = this;
	
	// creata refernce for calling methods on timeline creator
	this.child = React.createRef();
	
  }
  
  
  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange (state) {

    console.log( "menu state changing with " + state.isOpen );

    var newMenuOpenState = state.isOpen;
    this.setState({menuOpen: newMenuOpenState})  
	
	  if( !newMenuOpenState ) {
  		this.child.current.clearMenuState();
  	}
  }
  
  
  /**
   * This can be used to open the menu, e.g. when a user clicks a timeline item
   */
  openMenu () {	
  // change menu state and clear down the state first so we arent editing a previous item	
    this.child.current.clearMenuState();    
    this.setState({menuOpen: true})
	
  }
  
  
  // This can be used to open the menu, e.g. when a user clicks a timeline item
  openMenuToEdit ( item ) {  	
    this.child.current.setMenuState(item);    
    this.setState({menuOpen: true})
  }


  setMenuStyle ( vstyle ) {
    this.state.vizStyle = vstyle
    this.child.current.setMenuStyle(vstyle);        

  }

  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu () {
    this.setState({menuOpen: false})
	  this.child.current.clearMenuState();
  }

  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu () {

    var newMenuOpenState = !this.state.menuOpen;
    this.setState({menuOpen: newMenuOpenState})
	
	  if( !newMenuOpenState ) {
  		this.child.current.clearMenuState();
  	}
  }
  
  
  showSettings (event) {
    event.preventDefault();    
  }
  

  render () {
	  	
    return (
	
	  <Menu 
      right          
          isOpen={this.state.menuOpen}
          onStateChange={(state) => this.handleStateChange(state)}
        >
		  <TimelineItemCreator timeline_name={this.state.timeline_name} config={this.state.config} vizStyle={this.state.vizStyle} ref={this.child} menu={this}/>		          
    </Menu>
		      
    );
  }
}

export default OptionsMenu;