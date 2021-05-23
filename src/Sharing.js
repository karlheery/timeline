import React, { Component } from 'react';

import {
    EmailIcon,
    FacebookIcon,    
    LinkedinIcon,    
    TwitterIcon,    
    WhatsappIcon
  } from "react-share";
  
  
import {
	EmailShareButton,
	FacebookShareButton,
	LinkedinShareButton,
	TwitterShareButton,
	WhatsappShareButton
  } from "react-share";



  /**
   * Display our sharing bar
   */
class Sharing extends Component {
	
  
    constructor(props) {
        
      super(props);
      
      this.state = {
          sharing_url: props.sharing_url
      }
      
      
    }



  /**   
   */
   componentDidMount() {

   }
      



  /**
   * Render the top banner and the main timeline page
   */	 
   render() {	  		   	  			
	
	//ref={(tl) => { this.detailsMenu = tl; }}

	// sharing link should produce: { window.location.href + "?scrapbookName=" + this.state.timeline_code}
	// passcode using https://reactjsexample.com/otp-input-component-for-react/

        var full_url = window.location.href
        if( this.state.config && this.state.config.url_code ) {
            full_url = full_url + this.state.config.url_code
        }


        return (
            <div align="center">
                <WhatsappShareButton url={this.state.sharing_url}>
                    <WhatsappIcon round={true} size={42}/>
                </WhatsappShareButton>

                <EmailShareButton url={this.state.sharing_url}>
                    <EmailIcon round={true} size={42}/>
                </EmailShareButton>

                <FacebookShareButton url={this.state.sharing_url}>
                    <FacebookIcon round={true} size={42}/>
                </FacebookShareButton>

                <LinkedinShareButton url={this.state.sharing_url}>
                    <LinkedinIcon round={true} size={42}/>
                </LinkedinShareButton>

                <TwitterShareButton url={this.state.sharing_url}>
                    <TwitterIcon round={true} size={42}/>
                </TwitterShareButton>
            </div>
        );
    }

}
      
export default Sharing;
