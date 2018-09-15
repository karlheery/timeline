import React, { Component } from 'react';
import { slide as Menu } from 'react-burger-menu'
import './OptionsMenu.css';
import TimelineItemCreator  from './TimelineItemCreator';


//import banner from './Banner_Image.jpg';
//	  <img src={banner} alt="banner" align="right" />



class OptionsMenu extends React.Component {
	
  constructor (props) {
    super(props)
    this.state = {
      menuOpen: false
    }
  }
  
  
  // This keeps your state in sync with the opening/closing of the menu
  // via the default means, e.g. clicking the X, pressing the ESC key etc.
  handleStateChange (state) {
    this.setState({menuOpen: state.isOpen})  
  }
  
  
  // This can be used to open the menu, e.g. when a user clicks a timeline item
  openMenu () {
    this.setState({menuOpen: true})
  }
  
  // This can be used to close the menu, e.g. when a user clicks a menu item
  closeMenu () {
    this.setState({menuOpen: false})
  }

  // This can be used to toggle the menu, e.g. when using a custom icon
  // Tip: You probably want to hide either/both default icons if using a custom icon
  // See https://github.com/negomi/react-burger-menu#custom-icons
  toggleMenu () {
    this.setState({menuOpen: !this.state.menuOpen})
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

		<TimelineItemCreator/>		  
        
      </Menu>
		      
    );
  }
}

export default OptionsMenu;