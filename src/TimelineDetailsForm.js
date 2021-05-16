import React, { Component, useState, useEffect } from 'react';
import './TimelineDetailsForm.css';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Image from 'material-ui-image';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';


const useStyles = makeStyles => ({
    Image: {
      height: '25%',
      width: '25%',
      objectFit: 'cover'
    },
});




// have a look at this for adding items for more chapters: https://dev.to/damcosset/refactor-a-form-with-react-hooks-and-usestate-1lfa
const initialFValues = {
    timeline_name : '',    
    banner_image : 'https://khpublicbucket.s3-eu-west-1.amazonaws.com/Common/icons/DefaultAlbumIcon.gif',
    viz_style : 'Timeline',
    accessModel : 'PUBLIC',
    description: '',
    music_url: '',

    chapters: [
        {
          background: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Family/backgrounds/DefaultBackground_BlackTable.jpg',
          from_date: '2021-01-01',
          name: '',
          to_date: ''
        }
      ],
    content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',    
    s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
    s3_folder: '',
    upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
    url_code: ''    
}


/**
 * Inspired by https://material-ui.com/components/dialogs/
 */
class TimelineDetailsForm extends React.Component {
    
    constructor (props) {
        super(props)
        this.state = {
            closeForm: false
        }
        
        console.log( "creating timeline details form" );
        
        window.detailsFormComponent = this;
        
        // creata refernce for calling methods on timeline creator
        this.child = React.createRef();
        
    }
        

    handleClose() {
        this.setState({
            closeForm: true
        });
    }


    handleSave() {
     
        // temporarily put in saving mode
        this.props.setValues({...this.props.values, ['save_status']: 1})            
        

    	var createPromise = axios.put( this.state.all_timelines_uri )
        .then((result) => {
            
            var results = result.data;
            console.log( "just created new timeline: " + results );
            
            return results;

        })
        .then((all_timelines) => {
            
            this.props.setValues({...this.props.values, ['save_status']: 2})            

        })
        .catch(function (err) {
            console.log("failed to create new timeline");
            console.log(err);
            alert( "Sorry we cannot create your new story right now");
        });
        
    }

    

    
    handleTextInputChange = e => {
        const {name, value} = e.target
        
        // create a short code for URL deeplink and bucket folder
        if( name == "timeline_name") {
            let shortName = value.replace(/\W/g, '')
            this.props.setValues({...this.props.values, [name]: value, ['s3_folder']: shortName, ['url_code']: shortName})            
        }
        else {
            this.props.setValues({...this.props.values, [name]: value})
        }

    }
    

    handleSelectionChange = e => {        
        const {name, value} = e.target        
        console.log( "changed " + name + " to " + value)

        this.props.setValues({...this.props.values, [name]: value})
    }
    

    handleSwitchChange = e => {
        const {name, checked} = e.target      
        console.log( "changed " + name + " to " + checked)
                
        // hanle toggling of public vs private including wiping PIN if needed
        let value = ""
        let newPin = this.props.values.pin
        if ( name === "accessModel" ) {
            value = "PUBLIC"
            if ( checked ) {
                value = "PRIVATE"
            }
            else {
                newPin = ''
            }
        }
        
        this.props.setValues({...this.props.values, [name]: value, ['pin']: newPin})

    }
    



    render() {

        if( this.props.isOpen ) {
            console.log( "Displaying TimelineDetailsForm..." );
        }

        const classes = useStyles();                      
        const values = this.props.values;
        
        return ( <div>                
                <Dialog open={this.props.isOpen} onClose={this.props.closeDetailsForm} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Story</DialogTitle>
                    <DialogContent>
                    <form noValidate autoComplete="off">

                        <DialogContentText>
                            Create a new story based on your preferred style for you and your closest friends & family to enjoy.
                        </DialogContentText>
                        <TextField autoFocus required margin="dense" 
                            name="timeline_name" 
                            id="timeline_name" 
                            label="Story Name" 
                            type="text" 
                            onChange={this.handleTextInputChange}
                            value={values.timeline_name}
                            variant="outlined" />
                    
                        <br/>
                        <img name="banner_image" src={values.banner_image} imagestyle={classes.Image}/>
                        
                        <TextField required margin="dense" 
                            name="description" 
                            id="description"  
                            label="Description" 
                            type="text" 
                            onChange={this.handleTextInputChange}
                            value={values.description}
                            variant="outlined" 
                            fullWidth/>

                        <br/>
                        <FormControl component="fieldset">                            
                        <FormLabel component="legend">Choose a style:</FormLabel>
                        <RadioGroup row aria-label="viz_style" name="viz_style" value={values.viz_style} onChange={this.handleSelectionChange}>
                            <FormControlLabel value="Scrapbook" control={<Radio />} label="Scrapbook" />
                            <FormControlLabel value="Polaroid" control={<Radio />} label="Polaroid Table" />
                            <FormControlLabel value="Timeline" control={<Radio />} label="Timeline" />
                            <FormControlLabel value="Flipbook" control={<Radio />} label="Flipbook" />                            
                        </RadioGroup>
                        </FormControl>
                                            
                        <FormControlLabel control={<Switch checked={(values.accessModel !== "PUBLIC")} onChange={this.handleSwitchChange} name="accessModel" />} label="Private?"/>
                        {values.accessModel == "PRIVATE" && <TextField required margin="dense" 
                            name="pin" 
                            id="pin"  
                            label="4-digit Access PIN" 
                            type="text" 
                            onChange={this.handleTextInputChange}
                            value={values.pin}
                            variant="outlined" 
                            fullWidth/>
                        }
                        
                    </form>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.props.closeDetailsForm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.handleSave()} color="primary">
                        Create
                    </Button>
                    </DialogActions>

                    
                </Dialog>
                </div>  
        );

    }

}

// <pre>{JSON.stringify(values, 0, 2)}</pre>


export default function DetailsFormCreator(props) {
    console.log( "showing new timeline details form")

    const [values, setValues]  = useState(initialFValues);    

    return (
        <TimelineDetailsForm values={values} isOpen={props.isOpen} values={values} setValues={setValues} closeDetailsForm={props.handleDetailsFormClose} />
    )
};






