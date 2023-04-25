"use strict";

require("core-js/modules/es6.symbol.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = DetailsFormCreator;
require("core-js/modules/es6.regexp.replace.js");
require("core-js/modules/web.dom.iterable.js");
var _react = _interopRequireWildcard(require("react"));
require("./TimelineDetailsForm.css");
var _Button = _interopRequireDefault(require("@material-ui/core/Button"));
var _TextField = _interopRequireDefault(require("@material-ui/core/TextField"));
var _Dialog = _interopRequireDefault(require("@material-ui/core/Dialog"));
var _DialogActions = _interopRequireDefault(require("@material-ui/core/DialogActions"));
var _DialogContent = _interopRequireDefault(require("@material-ui/core/DialogContent"));
var _DialogContentText = _interopRequireDefault(require("@material-ui/core/DialogContentText"));
var _DialogTitle = _interopRequireDefault(require("@material-ui/core/DialogTitle"));
var _RadioGroup = _interopRequireDefault(require("@material-ui/core/RadioGroup"));
var _Radio = _interopRequireDefault(require("@material-ui/core/Radio"));
var _Switch = _interopRequireDefault(require("@material-ui/core/Switch"));
var _FormControlLabel = _interopRequireDefault(require("@material-ui/core/FormControlLabel"));
var _FormControl = _interopRequireDefault(require("@material-ui/core/FormControl"));
var _FormLabel = _interopRequireDefault(require("@material-ui/core/FormLabel"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _materialUiImage = _interopRequireDefault(require("material-ui-image"));
var _axios = _interopRequireDefault(require("axios"));
var _core = require("@dnd-kit/core");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
// For dragging photos within items and across new chapters we will look at https://docs.dndkit.com/introduction/installation
// in particular https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/?path=/docs/examples-tree-sortable--all-features

// have a look at this for adding items for more chapters: https://dev.to/damcosset/refactor-a-form-with-react-hooks-and-usestate-1lfa

//banner_image : './images/DefaultAlbumIcon.gif',
const initialFValues = {
  command: 'NEW',
  timeline_name: '',
  banner_image: 'https://khpublicbucket.s3-eu-west-1.amazonaws.com/Common/icons/DefaultAlbumIcon.gif',
  viz_style: 'Timeline',
  accessModel: 'PUBLIC',
  description: '',
  music_url: '',
  chapters: [{
    background: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket/Family/backgrounds/DefaultBackground_BlackTable.jpg',
    from_date: '2021-01-01',
    name: '',
    to_date: ''
  }],
  content_api: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/items',
  s3_bucket: 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
  s3_folder: '',
  upload_url: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/proxy',
  url_code: ''
};
function Draggable(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = (0, _core.useDraggable)({
    id: 'draggable'
  });
  const style = transform ? {
    transform: "translate3d(".concat(transform.x, "px, ").concat(transform.y, "px, 0)")
  } : undefined;
  return /*#__PURE__*/_react.default.createElement("button", _extends({
    ref: setNodeRef,
    style: style
  }, listeners, attributes), props.children);
}

/**
 * Inspired by https://material-ui.com/components/dialogs/
 */
class TimelineDetailsForm extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleTextInputChange", e => {
      const {
        name,
        value
      } = e.target;

      // create a short code for URL deeplink and bucket folder ...only if its a new timeline. otherwise it has a short code already
      if (name == "timeline_name" && this.state.is_new) {
        let shortName = value.replace(/\W/g, '');
        this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
          [name]: value,
          ['s3_folder']: shortName,
          ['url_code']: shortName
        }));
      } else {
        this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
          [name]: value
        }));
      }
    });
    _defineProperty(this, "handleSelectionChange", e => {
      const {
        name,
        value
      } = e.target;
      console.log("changed " + name + " to " + value);
      this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
        [name]: value
      }));
    });
    _defineProperty(this, "handleSwitchChange", e => {
      const {
        name,
        checked
      } = e.target;
      console.log("changed " + name + " to " + checked);

      // hanle toggling of public vs private including wiping PIN if needed
      let value = "";
      let newPin = this.props.values.pin;
      if (name === "accessModel") {
        value = "PUBLIC";
        if (checked) {
          value = "PRIVATE";
        } else {
          newPin = '';
        }
        this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
          [name]: value,
          ['accessCode']: newPin
        }));
      }

      // if we toggle the delete button, disable the form and set the command for the lambda call

      if (name == "deleteTimeline") {
        // as it only shows for update, that must be the default
        var command = 'UPDATE';
        if (checked) {
          command = 'DELETE';
        }
        this.setState({
          disableForm: checked
        });
        this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
          [name]: value,
          ['command']: command
        }));
      }
    });
    this.state = {
      closeForm: false,
      backend_uri: props.backend_uri,
      is_new: props.is_new,
      old_timeline_name: props.timeline_name
    };
    if (props.is_new) {
      console.log("creating timeline details form");
    } else {
      console.log("editing timeline " + props.timeline_name);
    }
    window.detailsFormComponent = this;

    // creata refernce for calling methods on timeline creator
    this.child = /*#__PURE__*/_react.default.createRef();
  }
  handleClose() {
    this.setState({
      closeForm: true
    });
  }
  handleSave() {
    // temporarily put in saving mode
    this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
      ['save_status']: 1
    }));
    console.log("saving timeline " + this.props.values.timeline_name + " to backend " + this.state.backend_uri + ":\n" + JSON.stringify(this.props.values));
    var createPromise = _axios.default.put(this.state.backend_uri, this.props.values).then(result => {
      var results = result.data;
      console.log("just upserted timeline: " + results);
      return results;
    }).then(all_timelines => {
      this.props.setValues(_objectSpread(_objectSpread({}, this.props.values), {}, {
        ['save_status']: 2
      }));

      // pass back the name of the pipeline we've just created to pre-select
      this.props.closeDetailsForm(this.props.values.shortName);
    }).catch(function (err) {
      console.log("failed to upsert timeline");
      console.log(err);
      alert("Sorry we cannot save your story right now");
    });
  }
  //style={classes.Image}

  render() {
    const values = this.props.values;
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_Dialog.default, {
      open: this.props.isOpen,
      onClose: this.props.closeDetailsForm,
      "aria-labelledby": "form-dialog-title"
    }, /*#__PURE__*/_react.default.createElement(_DialogTitle.default, {
      id: "form-dialog-title"
    }, "Your Story"), /*#__PURE__*/_react.default.createElement(_DialogContent.default, null, /*#__PURE__*/_react.default.createElement("form", {
      noValidate: true,
      autoComplete: "off"
    }, /*#__PURE__*/_react.default.createElement(_DialogContentText.default, null, this.props.is_new && "Create a new story based on your preferred style for you and your friends & family to enjoy", !this.props.is_new && "Edit your story for you and your friends & family to enjoy"), !this.props.is_new && /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      control: /*#__PURE__*/_react.default.createElement(_Switch.default, {
        checked: values.deleteTimeline,
        onChange: this.handleSwitchChange,
        name: "deleteTimeline"
      }),
      label: "Delete?"
    }), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      autoFocus: true,
      required: true,
      margin: "dense",
      name: "timeline_name",
      id: "timeline_name",
      label: "Story Name",
      type: "text",
      onChange: this.handleTextInputChange,
      value: values.timeline_name,
      variant: "outlined"
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_Box.default, {
      component: "img",
      name: "banner_image",
      sx: {
        maxHeight: {
          xs: 233,
          md: 167
        },
        boxShadow: 10
      },
      src: values.banner_image
    }), /*#__PURE__*/_react.default.createElement(_TextField.default, {
      required: true,
      margin: "dense",
      name: "description",
      id: "description",
      label: "Description",
      type: "text",
      onChange: this.handleTextInputChange,
      value: values.description,
      variant: "outlined",
      fullWidth: true
    }), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_FormControl.default, {
      component: "fieldset"
    }, /*#__PURE__*/_react.default.createElement(_FormLabel.default, {
      component: "legend"
    }, "Choose a style:"), /*#__PURE__*/_react.default.createElement(_RadioGroup.default, {
      row: true,
      "aria-label": "viz_style",
      name: "viz_style",
      value: values.viz_style,
      onChange: this.handleSelectionChange
    }, /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      value: "Scrapbook",
      control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
      label: "Scrapbook"
    }), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      value: "Polaroid",
      control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
      label: "Polaroid Table"
    }), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      value: "Timeline",
      control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
      label: "Timeline"
    }), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      value: "Flipbook",
      control: /*#__PURE__*/_react.default.createElement(_Radio.default, null),
      label: "Flipbook"
    }))), /*#__PURE__*/_react.default.createElement(_FormControlLabel.default, {
      control: /*#__PURE__*/_react.default.createElement(_Switch.default, {
        checked: values.accessModel && values.accessModel !== "PUBLIC",
        onChange: this.handleSwitchChange,
        name: "accessModel"
      }),
      label: "Private?"
    }), values.accessModel == "PRIVATE" && /*#__PURE__*/_react.default.createElement(_TextField.default, {
      required: true,
      margin: "dense",
      name: "accessCode",
      id: "accessCode",
      label: "4-digit Access PIN",
      type: "text",
      onChange: this.handleTextInputChange,
      value: values.accessCode,
      variant: "outlined",
      fullWidth: true
    }))), /*#__PURE__*/_react.default.createElement(_DialogActions.default, null, /*#__PURE__*/_react.default.createElement(_Button.default, {
      onClick: this.props.closeDetailsForm,
      color: "primary"
    }, "Cancel"), /*#__PURE__*/_react.default.createElement(_Button.default, {
      onClick: () => this.handleSave(),
      color: "primary"
    }, "Save"))));
  }
}

// <pre>{JSON.stringify(values, 0, 2)}</pre>

function DetailsFormCreator(props) {
  console.log("calling " + (props.is_new ? "new" : "false") + " DetailsFormCreator");
  if (!props.is_new && props.timeline_props && props.timeline_props.timeline_name != "") {
    console.log("mapping timeline data to edit form for " + props.timeline_props.timeline_name);
    const newValues = {
      command: 'UPDATE',
      old_timeline_name: props.timeline_props.timeline_name,
      timeline_name: props.timeline_props.timeline_name,
      timeline_data: props.timeline_props.timeline_data,
      banner_image: props.timeline_props.config.banner_image,
      viz_style: props.timeline_props.config.viz_style,
      accessModel: props.timeline_props.config.accessModel ? props.timeline_props.config.accessModel : 'PUBLIC',
      description: props.timeline_props.config.description,
      music_url: props.timeline_props.config.music_url,
      chapters: props.timeline_props.chapters,
      content_api: props.timeline_props.config.content_api,
      s3_bucket: props.timeline_props.config.s3_bucket ? props.timeline_props.config.s3_bucket : 'https://s3-eu-west-1.amazonaws.com/khpublicbucket',
      s3_folder: props.timeline_props.config.s3_folder,
      upload_url: props.timeline_props.config.upload_url,
      url_code: props.timeline_props.url_code
    };
    const [values, setValues] = (0, _react.useState)(newValues);
    //setValues({...values, 'timeline_name': props.timeline_props.timeline_name})                    

    return /*#__PURE__*/_react.default.createElement(TimelineDetailsForm, {
      values: values,
      is_new: props.is_new,
      isOpen: props.isOpen,
      setValues: setValues,
      backend_uri: props.backend_uri,
      closeDetailsForm: props.handleDetailsFormClose
    });
  } else {
    const [values, setValues] = (0, _react.useState)(initialFValues);
    return /*#__PURE__*/_react.default.createElement(TimelineDetailsForm, {
      values: values,
      is_new: props.is_new,
      isOpen: props.isOpen,
      setValues: setValues,
      backend_uri: props.backend_uri,
      closeDetailsForm: props.handleDetailsFormClose
    });
  }
}
;