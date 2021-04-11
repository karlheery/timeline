import React, { Component } from 'react';
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


  
/**
 * Inspired by https://material-ui.com/components/dialogs/
 */
class TimelineDetailsForm extends React.Component {
 
    constructor (props) {
        super(props)
        this.state = {
          formOpen: false
        }
        
        console.log( "creating timeline details form" );
            
        window.detailsFormComponent = this;
        
        // creata refernce for calling methods on timeline creator
        this.child = React.createRef();
        
    }
        

    handleClickOpen() {
     
        this.setState({
            formOpen: true
        });

    }

    handleClose() {
     
        this.setState({
            formOpen: false
        });
        
    }

    handleSave() {
     
        this.setState({
            formOpen: false
        });
        
    }

    /**
     * TODO
     */
    handleChange() {
             

    }



    render() {
        
        console.log( "Displaying TimelineDetailsForm...");
        
        return ( <div>                
                <Dialog open={this.state.formOpen} onClose={() => this.handleClose()} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New Story</DialogTitle>
                    <DialogContent>
                    <form noValidate autoComplete="off">

                        <DialogContentText>
                            Create a new story based on your preferred style for you and your closest friends & family to enjoy.
                        </DialogContentText>
                        <TextField autoFocus required margin="dense" id="timeline_name"  label="Story Name" type="text" variant="outlined"/>                    
                        "banner_image": payload.banner_image,
                        
                        <TextField margin="dense" id="description"  label="Description" type="text" variant="outlined" fullWidth/>

                        <FormControl component="fieldset">
                        <FormLabel component="legend">Choose a style:</FormLabel>
                        <RadioGroup aria-label="viz_style" name="viz_style" value={this.state.viz_style} onChange={() => this.handleChange()}>
                            <FormControlLabel value="flipbook" control={<Radio />} label="Flipbook" />
                            <FormControlLabel value="scrapbook" control={<Radio />} label="Scrapbook" />
                            <FormControlLabel value="polaroid" control={<Radio />} label="Polaroid Table" />
                            <FormControlLabel value="timeline" control={<Radio />} label="Timeline" />
                        </RadioGroup>
                        </FormControl>
                                            
                        <FormControlLabel control={<Switch checked={this.state.isPrivate} onChange={() => this.handleChange()} name="checkedA" />} label="Private?"/>

                    </form>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.handleClose()} color="primary">
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

    /*
                            //"created_date": payload.created_date,
                        //"url_code": payload.url_code,
                        //"music_url": payload.music_url,                        
                                                
                        //"upload_url": payload.upload_url,
                        //"s3_bucket": payload.s3_bucket,
                        //"s3_folder": payload.s3_folder,
                        //"content_api": payload.content_api,
                        //"chapters": payload.chapters, 
*/
}

export default TimelineDetailsForm;
