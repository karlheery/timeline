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
import Box from '@mui/material/Box';
import Image from 'material-ui-image';
import axios from 'axios';

import { SortableTree } from 'dnd-kit-sortable-tree';
import { TreeItems } from 'dnd-kit-sortable-tree';

// For dragging photos within items and across new chapters we will look at https://docs.dndkit.com/introduction/installation
// Not this is different than https://react-dnd.github.io/react-dnd/about
// in particular https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/docs/examples-tree-sortable--all-features
// with synched code here... https://codesandbox.io/s/dnd-kit-tree-9xe9cr?file=/src/utilities.ts

// have a look at this for adding items for more chapters: https://dev.to/damcosset/refactor-a-form-with-react-hooks-and-usestate-1lfa

//banner_image : './images/DefaultAlbumIcon.gif',
const initialFValues = {
    command : 'NEW',
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
            closeForm: false,
            backend_uri: props.backend_uri,
            is_new: props.is_new,
            old_timeline_name: props.timeline_name
        }
        
        if( props.is_new ) {
            console.log( "creating timeline details form" );
        }
        else {
            console.log( "editing timeline " + props.timeline_name );
        }
        
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
 
        console.log( "saving timeline " + this.props.values.timeline_name + " to backend " + this.state.backend_uri + ":\n" + JSON.stringify(this.props.values) )

    	var createPromise = axios.put( this.state.backend_uri, this.props.values )
        .then((result) => {
            
            var results = result.data;
            console.log( "just upserted timeline: " + results );
            
            return results;

        })
        .then((all_timelines) => {
            
            this.props.setValues({...this.props.values, ['save_status']: 2})            

            // pass back the name of the pipeline we've just created to pre-select
            this.props.closeDetailsForm( this.props.values.shortName )

        })
        .catch(function (err) {
            console.log("failed to upsert timeline");
            console.log(err);
            alert( "Sorry we cannot save your story right now");
        });
        
    }

    

    
    handleTextInputChange = e => {
        const {name, value} = e.target
        
        // create a short code for URL deeplink and bucket folder ...only if its a new timeline. otherwise it has a short code already
        if( name == "timeline_name" && this.state.is_new ) {
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

            this.props.setValues({...this.props.values, [name]: value, ['accessCode']: newPin})
        }

        // if we toggle the delete button, disable the form and set the command for the lambda call
        
        if ( name == "deleteTimeline" ) {
            // as it only shows for update, that must be the default
            var command = 'UPDATE'
            if( checked ) {
                command = 'DELETE'
            }

            this.setState({
                disableForm: checked
            });

            this.props.setValues({...this.props.values, [name]: value, ['command']: command})
        }
        

    }
    

//style={classes.Image}

    render() {

        const values = this.props.values;
        
        return ( <div>                
                <Dialog open={this.props.isOpen} onClose={this.props.closeDetailsForm} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Your Story</DialogTitle>
                    <DialogContent>
                    <form noValidate autoComplete="off">

                        <DialogContentText>
                            {this.props.is_new && ("Create a new story based on your preferred style for you and your friends & family to enjoy")}
                            {!this.props.is_new && ("Edit your story for you and your friends & family to enjoy")}
                        </DialogContentText>

                        {!this.props.is_new && <FormControlLabel control={<Switch checked={values.deleteTimeline} onChange={this.handleSwitchChange} name="deleteTimeline" />} label="Delete?"/>}
                        
                        <TextField autoFocus required margin="dense" 
                            name="timeline_name" 
                            id="timeline_name" 
                            label="Story Name" 
                            type="text" 
                            onChange={this.handleTextInputChange}
                            value={values.timeline_name}
                            variant="outlined" />
                    
                        <br/>
                        
                        <Box component="img" 
                            name="banner_image"
                            sx={{
                                maxHeight: { xs: 233, md: 167 },
                                boxShadow: 10
                            }}
                            src={values.banner_image} 
                        />
                        
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
                                            
                        <FormControlLabel control={<Switch checked={(values.accessModel && values.accessModel !== "PUBLIC")} onChange={this.handleSwitchChange} name="accessModel" />} label="Private?"/>
                        {values.accessModel == "PRIVATE" && <TextField required margin="dense" 
                            name="accessCode" 
                            id="accessCode"  
                            label="4-digit Access PIN" 
                            type="text" 
                            onChange={this.handleTextInputChange}
                            value={values.accessCode}
                            variant="outlined" 
                            fullWidth/>
                        }
                        

                        <SortableTree
                            items={items}
                            onItemsChanged={setItems}
                            TreeItemComponent={MediaTreeItemComponent}
                        />
                        
                    </form>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={this.props.closeDetailsForm} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.handleSave()} color="primary">
                        Save
                    </Button>
                    </DialogActions>

                    
                </Dialog>
                </div>  
        );

    }

}

// <pre>{JSON.stringify(values, 0, 2)}</pre>

type MediaTreeItemData = {
    value: string;
};


export default function DetailsFormCreator(props) {

    console.log( "calling " + (props.is_new ? "new" : "false") + " DetailsFormCreator")
    
    if( !props.is_new && props.timeline_props && props.timeline_props.timeline_name != "" ) {
        console.log( "mapping timeline data to edit form for " + props.timeline_props.timeline_name  )

        const newValues = {
            command : 'UPDATE',
            old_timeline_name : props.timeline_props.timeline_name,    
            timeline_name : props.timeline_props.timeline_name,    
            timeline_data : props.timeline_props.timeline_data,    
            banner_image : props.timeline_props.config.banner_image,    
            viz_style : props.timeline_props.config.viz_style,
            accessModel : ( props.timeline_props.config.accessModel ? props.timeline_props.config.accessModel : 'PUBLIC' ),
            description: props.timeline_props.config.description,
            music_url: props.timeline_props.config.music_url,        
            chapters: props.timeline_props.chapters,
            content_api: props.timeline_props.config.content_api,
            s3_bucket: ( props.timeline_props.config.s3_bucket ? props.timeline_props.config.s3_bucket : 'https://s3-eu-west-1.amazonaws.com/khpublicbucket' ),
            s3_folder: props.timeline_props.config.s3_folder,
            upload_url: props.timeline_props.config.upload_url,
            url_code: props.timeline_props.url_code            
        }


        const mediaTreeData: TreeItems<MediaTreeItemData> = [
            {
              id: '1',
              value: 'Jane',
              children: [
                { id: '4', value: 'John' },
                { id: '5', value: 'Sally' },
              ],
            },
            { id: '2', value: 'Fred', children: [{ id: '6', value: 'Eugene' }] },
            { id: '3', value: 'Helen', canHaveChildren: false },
        ];


        const [values, setValues]  = useState(newValues);      
        
        const [items, setItems] = useState(mediaTreeData);

        //setValues({...values, 'timeline_name': props.timeline_props.timeline_name})                    

        return (
            <TimelineDetailsForm values={values} is_new={props.is_new} isOpen={props.isOpen} setValues={setValues} backend_uri={props.backend_uri} closeDetailsForm={props.handleDetailsFormClose} />
        )
    
    
    }
    else {
        
        const [values, setValues]  = useState(initialFValues);         

        return (
            <TimelineDetailsForm values={values} is_new={props.is_new} isOpen={props.isOpen} setValues={setValues} backend_uri={props.backend_uri} closeDetailsForm={props.handleDetailsFormClose} />
        )
        
    }


};

