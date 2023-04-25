"use strict";

require("core-js/modules/web.dom.iterable.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("core-js/modules/es6.regexp.search.js");
require("core-js/modules/es6.symbol.js");
var _react = _interopRequireWildcard(require("react"));
require("./App.css");
require("./OptionsMenu.css");
require("./TimelineDetailsForm.css");
require("./InputDialog.css");
var _axios = _interopRequireDefault(require("axios"));
var _MediaTimeline = _interopRequireDefault(require("./MediaTimeline"));
var _OptionsMenu2 = _interopRequireDefault(require("./OptionsMenu"));
var _TimelineDetailsForm2 = _interopRequireDefault(require("./TimelineDetailsForm"));
var _Sharing = _interopRequireDefault(require("./Sharing"));
var _reactSound = _interopRequireDefault(require("react-sound"));
var _reactSnowfall = _interopRequireDefault(require("react-snowfall"));
var _reactPlayerControls = require("react-player-controls");
var _reactOtpInput = _interopRequireDefault(require("react-otp-input"));
var _AddToPhotos = _interopRequireDefault(require("@material-ui/icons/AddToPhotos"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
class App extends _react.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "closeNew", shortCode => {
      console.log("closing details form");
      this.setState({
        formOpen: false
      });
      if (shortCode) {
        console.log("created new timeline with short code: " + shortCode);
        this.preloadTimelines(shortCode);
      }
    });
    _defineProperty(this, "handleCodeInput", codeInput => {
      this.setState({
        codeInput
      });
      this.checkAccessCode(codeInput);
    });
    this.state = {
      all_timelines_uri: 'https://8capod29t2.execute-api.eu-west-1.amazonaws.com/Prod/timelines',
      timelineChosen: false,
      single_timeline: null,
      play: false,
      playPosition: 0,
      codeInput: ""
    };

    //this.togglePlay = this.togglePlay.bind(this);
  }

  /**
   * switch on and off music
   */
  togglePlay() {
    // cache it as changing it is asynch and want to stop/start scrolling
    var newPlayState = !this.state.play;
    console.log("toggling play to " + newPlayState);
    if (newPlayState) {
      console.log("playing " + this.state.config.music_url);
    }
    this.setState({
      play: newPlayState
    });
    if (newPlayState) {
      this.timeline.startScrolling();
    } else {
      this.timeline.stopScrolling();
    }
  }

  /**
   * Handle deep link in URL as page loads
   */
  componentDidMount() {
    var linkParams = new URLSearchParams(window.location.search);
    var choice = linkParams.get("scrapbookName");
    var all_timelines = this.preloadTimelines(choice);
  }

  /** 
   *  Lookup the timelines from our backend
   */
  preloadTimelines(choice) {
    var uploadPromise = _axios.default.get(this.state.all_timelines_uri).then(result => {
      var results = result.data;
      console.log("just retrieved ALL TIMELINES: " + results);
      this.setState({
        all_timelines: results
      });
      return results;
    }).then(all_timelines => {
      if (choice) {
        this.handlePreChoice(choice, all_timelines);
      }
      return all_timelines;
    }).catch(function (err) {
      console.log("failed to retreive all timelines");
      console.log(err);
    });
  }

  /**
   * Handle pre-choice of a timeline via a URL parameter by hiding the rest
   */
  handlePreChoice(code, all_timelines) {
    var single_timeline = null;
    for (var i = 0; all_timelines && i < all_timelines.length; i++) {
      if (code === all_timelines[i].url_code) {
        single_timeline = all_timelines[i];
      }
    }
    if (!single_timeline) {
      console.error("failed to map code " + code + " to a name in " + all_timelines);
    } else {
      this.setState({
        urlParam: window.location.search,
        timelineChosen: false,
        timeline_code: code,
        single_timeline: single_timeline,
        timeline_name: single_timeline.timeline_name,
        play: false,
        isIntroFinished: false
      });

      // if it was deep-linked in we need to clear that now
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  /**
   * Handle choice of timeline on main page by rendering MediaTimeilne it
   */
  handleChoice(timeline_config) {
    // default to access only if its public
    var enableAccess = !timeline_config.accessModel || timeline_config.accessModel == "PUBLIC" ? true : false;
    if (!enableAccess) console.log("will prompt for access code for access model: " + timeline_config.accessModel);

    // handle the API call to pull timeline data
    var tData = this.retrieveTimeline(timeline_config);
    this.setState({
      timelineChosen: true,
      timeline_code: timeline_config.accessCode,
      timeline_data: tData,
      timeline_name: timeline_config.timeline_name,
      vizStyle: this.timeline ? this.timeline.vizStyle : "",
      config: timeline_config,
      accessEnabled: enableAccess,
      play: false,
      isIntroFinished: false
    });
  }

  /**
  * Call API to retrieve timeline from AWS, or default to example timeline as a last resort
  */
  retrieveTimeline(param_timeline_config) {
    var queryParams = {
      timeline_name: param_timeline_config.timeline_name
    };
    console.log("querying timeline with params " + queryParams);
    _axios.default.get(param_timeline_config.content_api, {
      params: queryParams
    }).then(result => {
      // these arrows are used so we can call other methods and setState (indirectly) from within

      console.log("successfully retrieved timeline data " + JSON.stringify(result.data));
      console.log("timeline content item count " + (result.data.content ? result.data.content.length : 0));

      // asynch block this setting happens later than expected!
      this.setState({
        timeline_data: result.data
      });
      if (this.timeline) {
        this.timeline.setTimeline(result.data);
      }
      return result.data;
    }).catch(err => {
      console.error(err);
      alert("Cant show timeline right now - sorry! Check your internet connection?", err);
    });
  }

  /**
   * Show a modal to capture data and create a new timeline
   * @param {*} codeInput 
   */
  createNew() {
    //this.detailsMenu.handleClickOpen(true);
    this.setState({
      formOpen: true
    });
  }

  /**
  * Handle the call from child component to close the timeline creation screen
  * @param {*} shortCode 
  */

  /**
   * Check OTP input against configured access code
   * 
   */
  checkAccessCode(code) {
    if (code && code.length == 4) {
      console.log("checking entered code: " + code + " against config " + this.state.config);
      if (code == this.state.config.accessCode) {
        this.setState({
          accessEnabled: true,
          errorMessage: ""
        });
      } else {
        this.setState({
          errorMessage: "Incorrect code - please try again",
          codeInput: ""
        });
      }
    }
  }

  /**
   * Handle click on display (e.g. Flipbook changing page)
   */
  handleDisplayClick(e) {
    var newPos = 8;
    this.setState({
      play: true
      //, 		playPosition: newPos
    });
  }

  finishedIntro() {
    this.setState({
      isIntroFinished: true
    });
  }
  handleSoundEvent(errorCode, description) {
    console.error("Error on sound event with " + errorCode + ": " + description);
  }

  /**
   * Render the top banner and the main timeline page
   */
  render() {
    //ref={(tl) => { this.detailsMenu = tl; }}

    // sharing link should produce: { window.location.href + "?scrapbookName=" + this.state.timeline_code}
    // passcode using https://reactjsexample.com/otp-input-component-for-react/

    var full_url = window.location.href;
    if (this.state.config && this.state.config.url_code) {
      full_url = full_url + "?scrapbookName=" + this.state.config.url_code;
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "main-area"
    }, /*#__PURE__*/_react.default.createElement("div", {
      id: "main-bg",
      className: "main-bg"
    }), this.state.timelineChosen && this.state.config.music_intro_url && !this.state.isIntroFinished && /*#__PURE__*/_react.default.createElement(_reactSound.default, {
      url: this.state.config.music_intro_url,
      autoLoad: true,
      playStatus: _reactSound.default.status.PLAYING,
      onError: this.handleSoundEvent.bind(this),
      onFinishedPlaying: this.finishedIntro.bind(this)
    }), this.state.timelineChosen && (this.state.isIntroFinished || !this.state.config.music_intro_url) && /*#__PURE__*/_react.default.createElement(_reactSound.default, {
      url: this.state.config.music_url,
      playStatus: this.state.play ? _reactSound.default.status.PLAYING : _reactSound.default.status.PAUSED
      //playFromPosition={this.state.playPosition}
      //onLoading={this.handleSongLoading}
      //onPlaying={this.handleSongPlaying}
      //onFinishedPlaying={this.handleSongFinishedPlaying}
    }), this.state.timelineChosen && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "App-right-menu",
      id: "menu",
      name: "menu"
    }, /*#__PURE__*/_react.default.createElement(_OptionsMenu2.default, {
      timeline_name: this.state.timeline_name,
      timeline_data: this.state.timeline_data,
      vizStyle: this.state.vizStyle,
      config: this.state.config,
      backend_uri: this.state.all_timelines_uri,
      ref: tl => {
        this.optionsMenu = tl;
      }
    })), /*#__PURE__*/_react.default.createElement("div", {
      className: "App-right-menu"
    }, /*#__PURE__*/_react.default.createElement(_reactPlayerControls.Button, {
      className: "App-button",
      onClick: this.togglePlay.bind(this)
    }, !this.state.play ? /*#__PURE__*/_react.default.createElement("div", null, " ", /*#__PURE__*/_react.default.createElement(_reactPlayerControls.PlayerIcon.Play, {
      width: 32,
      height: 32,
      style: {
        marginRight: 25
      }
    }), "  ") : /*#__PURE__*/_react.default.createElement("div", null, " ", /*#__PURE__*/_react.default.createElement(_reactPlayerControls.PlayerIcon.Pause, {
      width: 32,
      height: 32,
      style: {
        marginRight: 25
      }
    }), " "))), /*#__PURE__*/_react.default.createElement("div", {
      className: "App"
    }, /*#__PURE__*/_react.default.createElement("header", {
      className: "App-header"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: this.state.config.banner_image,
      className: "App-banner",
      alt: "banner",
      align: "left"
    }), /*#__PURE__*/_react.default.createElement("h1", {
      className: "App-title"
    }, this.state.timeline_name)), /*#__PURE__*/_react.default.createElement("div", null, this.state.accessEnabled && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_MediaTimeline.default, {
      timeline_name: this.state.timeline_name,
      timeline_data: this.state.timeline_data,
      config: this.state.config,
      ref: tl => {
        this.timeline = tl;
      },
      onDisplayClick: this.handleDisplayClick.bind(this)
    }), /*#__PURE__*/_react.default.createElement("div", {
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_Sharing.default, {
      sharing_url: full_url
    }))), !this.state.accessEnabled && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h1", null, "Enter code:"), /*#__PURE__*/_react.default.createElement(_reactOtpInput.default, {
      value: this.state.codeInput,
      onChange: this.handleCodeInput,
      shoshouldAutoFocus: true,
      isInputNum: true,
      numInputs: 4,
      separator: /*#__PURE__*/_react.default.createElement("span", null, "-"),
      containerStyle: "input-container",
      inputStyle: "inputStyle"
    }), /*#__PURE__*/_react.default.createElement("br", null), this.state.errorMessage))), this.state.config.effect == "snow" && /*#__PURE__*/_react.default.createElement(_reactSnowfall.default, {
      className: "in-front",
      color: "white",
      snowflakeCount: 200
    })), !this.state.timelineChosen && /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "App-right-menu",
      id: "menu",
      name: "menu"
    }, /*#__PURE__*/_react.default.createElement(_TimelineDetailsForm2.default, {
      isOpen: this.state.formOpen,
      handleDetailsFormClose: this.closeNew,
      backend_uri: this.state.all_timelines_uri,
      is_new: true
    })), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
      className: "header"
    }, /*#__PURE__*/_react.default.createElement("h1", null, "Our Stories")), /*#__PURE__*/_react.default.createElement("ul", null, this.state.single_timeline && /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "App-card"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: this.state.single_timeline.banner_image,
      className: "App-card-thumbnail"
    }), /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("button", {
      className: "App-card-button",
      onClick: () => this.handleChoice(this.state.single_timeline)
    }, this.state.single_timeline.timeline_name))), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null)), !this.state.single_timeline && this.state.all_timelines && this.state.all_timelines.map(f => /*#__PURE__*/_react.default.createElement("li", null, /*#__PURE__*/_react.default.createElement("div", {
      className: "App-card"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: f.banner_image,
      className: "App-card-thumbnail"
    }), /*#__PURE__*/_react.default.createElement("p", null, /*#__PURE__*/_react.default.createElement("button", {
      className: "App-card-button",
      onClick: () => this.handleChoice(f)
    }, f.timeline_name))), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null))), !this.state.timelineChosen && (!this.state.timeline_name || this.state.timeline_name && this.state.timeline_name === "New Timeline") && /*#__PURE__*/_react.default.createElement("div", {
      className: "column"
    }, /*#__PURE__*/_react.default.createElement("div", {
      className: "App-newcard",
      onClick: () => this.createNew()
    }, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement(_AddToPhotos.default, {
      fontSize: "large"
    }), /*#__PURE__*/_react.default.createElement("br", null), "Add your story", /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null)))), /*#__PURE__*/_react.default.createElement("div", {
      className: "row"
    }, /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("div", {
      className: "column",
      align: "center"
    }, /*#__PURE__*/_react.default.createElement(_Sharing.default, {
      sharing_url: full_url
    })), /*#__PURE__*/_react.default.createElement("br", null), /*#__PURE__*/_react.default.createElement("br", null))));
  }
}
var _default = App;
exports.default = _default;